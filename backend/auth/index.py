"""
Авторизация и регистрация пользователей AURA.
POST /register — регистрация (user / brand / salon)
POST /login — вход, возвращает JWT
GET /me — профиль текущего пользователя
"""
import json
import os
import bcrypt
import jwt
import psycopg2
from datetime import datetime, timedelta

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p21218644_glam_health_hub')
JWT_SECRET = os.environ.get('JWT_SECRET', 'fallback-secret')
JWT_EXP_DAYS = 30

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def make_token(user_id: int, role: str) -> str:
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=JWT_EXP_DAYS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')


def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])


def json_response(data: dict, status: int = 200) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False, default=str),
    }


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    path = event.get('path', '/')
    method = event.get('httpMethod', 'GET')
    body = json.loads(event.get('body') or '{}')
    # action передаётся в теле или определяется по пути
    action = body.get('action') or (
        'register' if 'register' in path else
        'login' if 'login' in path else
        'me' if 'me' in path else ''
    )

    # --- REGISTER ---
    if action == 'register' and method == 'POST':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password', '')
        role = body.get('role', 'user')
        first_name = body.get('first_name', '')
        last_name = body.get('last_name', '')
        phone = body.get('phone', '')
        city = body.get('city', '')

        if not email or not password:
            return json_response({'error': 'Email и пароль обязательны'}, 400)
        if role not in ('user', 'brand', 'salon'):
            return json_response({'error': 'Недопустимая роль'}, 400)
        if len(password) < 6:
            return json_response({'error': 'Пароль минимум 6 символов'}, 400)

        pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

        conn = get_conn()
        cur = conn.cursor()
        try:
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (email, password_hash, role, first_name, last_name, phone, city) "
                f"VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
                (email, pw_hash, role, first_name, last_name, phone, city)
            )
            user_id = cur.fetchone()[0]

            # Создаём профиль бренда или салона
            if role == 'brand':
                brand_name = body.get('brand_name', first_name or email)
                cur.execute(
                    f"INSERT INTO {SCHEMA}.brands (user_id, brand_name) VALUES (%s, %s)",
                    (user_id, brand_name)
                )
            elif role == 'salon':
                salon_name = body.get('salon_name', first_name or email)
                cur.execute(
                    f"INSERT INTO {SCHEMA}.salons (user_id, salon_name, city) VALUES (%s, %s, %s)",
                    (user_id, salon_name, city)
                )

            conn.commit()
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            return json_response({'error': 'Пользователь с таким email уже существует'}, 409)
        finally:
            cur.close()
            conn.close()

        token = make_token(user_id, role)
        return json_response({'token': token, 'user_id': user_id, 'role': role})

    # --- LOGIN ---
    if action == 'login' and method == 'POST':
        email = (body.get('email') or '').strip().lower()
        password = body.get('password', '')

        if not email or not password:
            return json_response({'error': 'Email и пароль обязательны'}, 400)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, password_hash, role, first_name, last_name, is_active FROM {SCHEMA}.users WHERE email=%s",
            (email,)
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return json_response({'error': 'Неверный email или пароль'}, 401)

        user_id, pw_hash, role, first_name, last_name, is_active = row

        if not is_active:
            return json_response({'error': 'Аккаунт заблокирован'}, 403)

        if not bcrypt.checkpw(password.encode(), pw_hash.encode()):
            return json_response({'error': 'Неверный email или пароль'}, 401)

        token = make_token(user_id, role)
        return json_response({
            'token': token,
            'user_id': user_id,
            'role': role,
            'first_name': first_name,
            'last_name': last_name,
        })

    # --- ME ---
    if (action == 'me' or 'me' in path) and method == 'GET':
        auth = event.get('headers', {}).get('X-Authorization', '')
        token = auth.replace('Bearer ', '').strip()
        if not token:
            return json_response({'error': 'Требуется авторизация'}, 401)

        try:
            payload = decode_token(token)
        except jwt.ExpiredSignatureError:
            return json_response({'error': 'Токен истёк'}, 401)
        except jwt.InvalidTokenError:
            return json_response({'error': 'Неверный токен'}, 401)

        user_id = payload['user_id']
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, email, role, first_name, last_name, phone, city, created_at FROM {SCHEMA}.users WHERE id=%s",
            (user_id,)
        )
        row = cur.fetchone()

        profile = {}
        if payload['role'] == 'brand':
            cur.execute(f"SELECT id, brand_name, description, logo_url, is_verified FROM {SCHEMA}.brands WHERE user_id=%s", (user_id,))
            b = cur.fetchone()
            if b:
                profile = {'brand_id': b[0], 'brand_name': b[1], 'description': b[2], 'logo_url': b[3], 'is_verified': b[4]}
        elif payload['role'] == 'salon':
            cur.execute(f"SELECT id, salon_name, description, logo_url, is_verified, address, city FROM {SCHEMA}.salons WHERE user_id=%s", (user_id,))
            s = cur.fetchone()
            if s:
                profile = {'salon_id': s[0], 'salon_name': s[1], 'description': s[2], 'logo_url': s[3], 'is_verified': s[4], 'address': s[5], 'city': s[6]}

        cur.close()
        conn.close()

        if not row:
            return json_response({'error': 'Пользователь не найден'}, 404)

        return json_response({
            'id': row[0], 'email': row[1], 'role': row[2],
            'first_name': row[3], 'last_name': row[4],
            'phone': row[5], 'city': row[6],
            'created_at': str(row[7]),
            **profile,
        })

    return json_response({'error': 'Маршрут не найден'}, 404)