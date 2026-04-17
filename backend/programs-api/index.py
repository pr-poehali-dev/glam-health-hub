"""
API программ AURA.
GET  /         — публичный список одобренных программ
POST /         — добавить программу (только salon)
GET  /my       — мои программы (только salon)
POST /moderate — одобрить/отклонить программу (только admin)
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
    key = f'programs/{filename}'
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
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT p.id, p.title, p.description, p.duration, p.price,
                       p.category, p.photo_url, s.salon_name, s.city
                FROM {SCHEMA}.programs p
                JOIN {SCHEMA}.salons s ON s.id = p.salon_id
                WHERE p.status='approved'
                ORDER BY p.created_at DESC"""
        )
        rows = cur.fetchall()
        cur.close(); conn.close()
        programs = [
            {'id': r[0], 'title': r[1], 'description': r[2], 'duration': r[3],
             'price': float(r[4]) if r[4] else None, 'category': r[5],
             'photo_url': r[6], 'salon_name': r[7], 'city': r[8]}
            for r in rows
        ]
        return json_response({'programs': programs})

    # --- GET /my — программы салона ---
    if method == 'GET' and path.endswith('/my'):
        if not user or user['role'] != 'salon':
            return json_response({'error': 'Доступ запрещён'}, 403)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.salons WHERE user_id=%s", (user['user_id'],))
        salon_row = cur.fetchone()
        if not salon_row:
            cur.close(); conn.close()
            return json_response({'error': 'Профиль салона не найден'}, 404)
        cur.execute(
            f"""SELECT id, title, description, duration, price, category,
                       photo_url, status, rejection_reason, created_at
                FROM {SCHEMA}.programs WHERE salon_id=%s ORDER BY created_at DESC""",
            (salon_row[0],)
        )
        rows = cur.fetchall()
        cur.close(); conn.close()
        programs = [
            {'id': r[0], 'title': r[1], 'description': r[2], 'duration': r[3],
             'price': float(r[4]) if r[4] else None, 'category': r[5],
             'photo_url': r[6], 'status': r[7], 'rejection_reason': r[8],
             'created_at': str(r[9])}
            for r in rows
        ]
        return json_response({'programs': programs})

    # --- POST / — добавить программу ---
    if method == 'POST' and not path.endswith('/moderate'):
        if not user or user['role'] != 'salon':
            return json_response({'error': 'Только салоны могут добавлять программы'}, 403)

        title = body.get('title', '').strip()
        description = body.get('description', '')
        duration = body.get('duration', '')
        price = body.get('price')
        category = body.get('category', '')
        photo_b64 = body.get('photo_b64', '')

        if not title:
            return json_response({'error': 'Название программы обязательно'}, 400)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.salons WHERE user_id=%s", (user['user_id'],))
        salon_row = cur.fetchone()
        if not salon_row:
            cur.close(); conn.close()
            return json_response({'error': 'Профиль салона не найден'}, 404)
        salon_id = salon_row[0]

        photo_url = None
        if photo_b64:
            filename = f'{uuid.uuid4()}.jpg'
            photo_url = upload_photo(photo_b64, filename)

        cur.execute(
            f"""INSERT INTO {SCHEMA}.programs
                (salon_id, title, description, duration, price, category, photo_url, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, 'pending') RETURNING id""",
            (salon_id, title, description, duration,
             float(price) if price else None, category, photo_url)
        )
        program_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()

        return json_response({'id': program_id, 'status': 'pending',
                              'message': 'Программа отправлена на модерацию'})

    # --- POST /moderate — модерация (admin) ---
    if method == 'POST' and path.endswith('/moderate'):
        if not user or user['role'] != 'admin':
            return json_response({'error': 'Только администратор'}, 403)
        program_id = body.get('program_id')
        action = body.get('action')
        reason = body.get('reason', '')
        if not program_id or action not in ('approve', 'reject'):
            return json_response({'error': 'program_id и action (approve/reject) обязательны'}, 400)
        new_status = 'approved' if action == 'approve' else 'rejected'
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.programs SET status=%s, rejection_reason=%s, updated_at=NOW() WHERE id=%s",
            (new_status, reason, program_id)
        )
        conn.commit()
        cur.close(); conn.close()
        return json_response({'status': new_status})

    return json_response({'error': 'Маршрут не найден'}, 404)
