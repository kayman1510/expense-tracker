from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

# ── Config ────────────────────────────────────────────────────────────

SECRET_KEY = "change-this-before-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# ── OAuth2 scheme ─────────────────────────────────────────────────────

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ── Password helpers ──────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))

# ── JWT helpers ───────────────────────────────────────────────────────

def create_access_token(data: dict) -> str:
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload["exp"] = expire
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

# ── Current user dependency ───────────────────────────────────────────

def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_error = HTTPException(status_code=401, detail="Could not validate credentials")

    try:
        payload = decode_access_token(token)
        sub = payload.get("sub")
        if sub is None:
            raise credentials_error
        user_id = int(sub)
    except (JWTError, ValueError):
        raise credentials_error

    from app.services.auth_service import get_user_by_id
    user = get_user_by_id(user_id)
    if user is None:
        raise credentials_error

    return user
