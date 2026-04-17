"""
API бронирований AURA.
POST / — создать бронь (товар / программа / консультация)
GET  / — мои брони (авторизованный пользователь)
"""
import json
import os
import jwt
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p21218644_glam_health_hub')
JWT_SECRET = os.environ.get('JWT_SECRET', 'fallback-secret')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


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


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    body = json.loads(event.get('body') or '{}')
    user = get_user(event)

    # --- POST — создать бронь ---
    if method == 'POST':
        booking_type = body.get('booking_type', '')
        contact_name = body.get('contact_name', '').strip()
        contact_phone = body.get('contact_phone', '').strip()
        contact_email = body.get('contact_email', '').strip()
        notes = body.get('notes', '')
        product_id = body.get('product_id')
        program_id = body.get('program_id')

        if not booking_type or not contact_name or not contact_phone:
            return json_response({'error': 'Тип брони, имя и телефон обязательны'}, 400)
        if booking_type not in ('product', 'program', 'consultation'):
            return json_response({'error': 'Недопустимый тип брони'}, 400)

        user_id = user['user_id'] if user else None

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""INSERT INTO {SCHEMA}.bookings
                (user_id, product_id, program_id, booking_type, contact_name, contact_phone, contact_email, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
            (user_id, product_id, program_id, booking_type,
             contact_name, contact_phone, contact_email, notes)
        )
        booking_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()

        return json_response({'id': booking_id, 'status': 'new',
                              'message': 'Бронь принята! Мы свяжемся с вами в ближайшее время.'})

    # --- GET — мои брони ---
    if method == 'GET':
        if not user:
            return json_response({'error': 'Требуется авторизация'}, 401)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT b.id, b.booking_type, b.status, b.notes,
                       b.contact_name, b.contact_phone, b.created_at,
                       p.name as product_name, pr.title as program_title
                FROM {SCHEMA}.bookings b
                LEFT JOIN {SCHEMA}.products p ON p.id = b.product_id
                LEFT JOIN {SCHEMA}.programs pr ON pr.id = b.program_id
                WHERE b.user_id=%s ORDER BY b.created_at DESC""",
            (user['user_id'],)
        )
        rows = cur.fetchall()
        cur.close(); conn.close()
        bookings = [
            {'id': r[0], 'booking_type': r[1], 'status': r[2], 'notes': r[3],
             'contact_name': r[4], 'contact_phone': r[5], 'created_at': str(r[6]),
             'product_name': r[7], 'program_title': r[8]}
            for r in rows
        ]
        return json_response({'bookings': bookings})

    return json_response({'error': 'Маршрут не найден'}, 404)
