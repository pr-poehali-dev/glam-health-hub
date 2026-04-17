"""
API товаров AURA.
GET  /         — публичный список одобренных товаров
POST /         — добавить товар (только brand)
GET  /my       — мои товары (только brand)
POST /moderate — одобрить/отклонить товар (только admin)
"""
import json
import os
import base64
import uuid
import jwt
import psycopg2
import boto3

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p21218644_glam_health_hub')
JWT_SECRET = os.environ.get('JWT_SECRET', 'fallback-secret')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_s3():
    return boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )


def json_response(data, status=200):
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False, default=str),
    }


def get_user(event):
    auth = event.get('headers', {}).get('X-Authorization', '')
    token = auth.replace('Bearer ', '').strip()
    if not token:
        return None
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.InvalidTokenError:
        return None


def upload_photo(b64_data: str, filename: str) -> str:
    s3 = get_s3()
    data = base64.b64decode(b64_data)
    key = f'products/{filename}'
    s3.put_object(Bucket='files', Key=key, Body=data, ContentType='image/jpeg')
    access_key = os.environ['AWS_ACCESS_KEY_ID']
    return f'https://cdn.poehali.dev/projects/{access_key}/files/{key}'


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    path = event.get('path', '/')
    method = event.get('httpMethod', 'GET')
    body = json.loads(event.get('body') or '{}')
    user = get_user(event)

    # --- GET публичный список ---
    if method == 'GET' and not path.endswith('/my') and not path.endswith('/moderate'):
        category = (event.get('queryStringParameters') or {}).get('category', '')
        conn = get_conn()
        cur = conn.cursor()
        if category:
            cur.execute(
                f"""SELECT p.id, p.sku, p.name, p.description, p.price, p.category,
                           p.photo_url, p.stock, b.brand_name
                    FROM {SCHEMA}.products p
                    JOIN {SCHEMA}.brands b ON b.id = p.brand_id
                    WHERE p.status='approved' AND p.category=%s
                    ORDER BY p.created_at DESC""",
                (category,)
            )
        else:
            cur.execute(
                f"""SELECT p.id, p.sku, p.name, p.description, p.price, p.category,
                           p.photo_url, p.stock, b.brand_name
                    FROM {SCHEMA}.products p
                    JOIN {SCHEMA}.brands b ON b.id = p.brand_id
                    WHERE p.status='approved'
                    ORDER BY p.created_at DESC"""
            )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        products = [
            {'id': r[0], 'sku': r[1], 'name': r[2], 'description': r[3],
             'price': float(r[4]), 'category': r[5], 'photo_url': r[6],
             'stock': r[7], 'brand_name': r[8]}
            for r in rows
        ]
        return json_response({'products': products})

    # --- GET /my — товары бренда ---
    if method == 'GET' and path.endswith('/my'):
        if not user or user['role'] != 'brand':
            return json_response({'error': 'Доступ запрещён'}, 403)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.brands WHERE user_id=%s", (user['user_id'],))
        brand_row = cur.fetchone()
        if not brand_row:
            cur.close(); conn.close()
            return json_response({'error': 'Профиль бренда не найден'}, 404)
        cur.execute(
            f"""SELECT id, sku, name, description, price, category, photo_url, stock, status, rejection_reason, created_at
                FROM {SCHEMA}.products WHERE brand_id=%s ORDER BY created_at DESC""",
            (brand_row[0],)
        )
        rows = cur.fetchall()
        cur.close(); conn.close()
        products = [
            {'id': r[0], 'sku': r[1], 'name': r[2], 'description': r[3],
             'price': float(r[4]), 'category': r[5], 'photo_url': r[6],
             'stock': r[7], 'status': r[8], 'rejection_reason': r[9],
             'created_at': str(r[10])}
            for r in rows
        ]
        return json_response({'products': products})

    # --- POST / — добавить товар ---
    if method == 'POST' and not path.endswith('/moderate'):
        if not user or user['role'] != 'brand':
            return json_response({'error': 'Только бренды могут добавлять товары'}, 403)

        sku = body.get('sku', '').strip()
        name = body.get('name', '').strip()
        description = body.get('description', '')
        price = body.get('price')
        category = body.get('category', '')
        stock = body.get('stock', 0)
        photo_b64 = body.get('photo_b64', '')

        if not sku or not name or not price:
            return json_response({'error': 'SKU, название и цена обязательны'}, 400)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.brands WHERE user_id=%s", (user['user_id'],))
        brand_row = cur.fetchone()
        if not brand_row:
            cur.close(); conn.close()
            return json_response({'error': 'Профиль бренда не найден'}, 404)
        brand_id = brand_row[0]

        photo_url = None
        if photo_b64:
            filename = f'{uuid.uuid4()}.jpg'
            photo_url = upload_photo(photo_b64, filename)

        cur.execute(
            f"""INSERT INTO {SCHEMA}.products
                (brand_id, sku, name, description, price, category, photo_url, stock, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'pending') RETURNING id""",
            (brand_id, sku, name, description, float(price), category, photo_url, int(stock))
        )
        product_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()

        return json_response({'id': product_id, 'status': 'pending',
                              'message': 'Товар отправлен на модерацию'})

    # --- POST /moderate — модерация (admin) ---
    if method == 'POST' and path.endswith('/moderate'):
        if not user or user['role'] != 'admin':
            return json_response({'error': 'Только администратор'}, 403)
        product_id = body.get('product_id')
        action = body.get('action')  # 'approve' | 'reject'
        reason = body.get('reason', '')
        if not product_id or action not in ('approve', 'reject'):
            return json_response({'error': 'product_id и action (approve/reject) обязательны'}, 400)
        new_status = 'approved' if action == 'approve' else 'rejected'
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.products SET status=%s, rejection_reason=%s, updated_at=NOW() WHERE id=%s",
            (new_status, reason, product_id)
        )
        conn.commit()
        cur.close(); conn.close()
        return json_response({'status': new_status})

    return json_response({'error': 'Маршрут не найден'}, 404)
