from app.database import get_db_connection
from app.auth import hash_password, verify_password


def get_user_by_email(email: str):
    email = email.strip().lower()
    conn = get_db_connection()
    try:
        user = conn.execute(
            "SELECT * FROM users WHERE email = ?", (email,)
        ).fetchone()
        return user
    finally:
        conn.close()


def get_user_by_id(user_id: int):
    conn = get_db_connection()
    try:
        user = conn.execute(
            "SELECT * FROM users WHERE id = ?", (user_id,)
        ).fetchone()
        return user
    finally:
        conn.close()


def create_user(email: str, password: str, full_name: str | None = None):
    email = email.strip().lower()

    if get_user_by_email(email):
        raise ValueError("A user with this email already exists.")

    hashed = hash_password(password)
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            "INSERT INTO users (email, hashed_password) VALUES (?, ?)",
            (email, hashed),
        )
        conn.commit()
        user = conn.execute(
            "SELECT * FROM users WHERE id = ?", (cursor.lastrowid,)
        ).fetchone()
        return user
    finally:
        conn.close()


def authenticate_user(email: str, password: str):
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user
