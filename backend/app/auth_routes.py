from fastapi import APIRouter, HTTPException, Depends

from app.models import UserRegister, UserLogin, UserResponse, TokenResponse
from app.services.auth_service import create_user, authenticate_user
from app.auth import create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse)
def register(payload: UserRegister):
    try:
        user = create_user(email=payload.email, password=payload.password)
    except ValueError:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    return {
        "id": user["id"],
        "email": user["email"],
        "full_name": None,
        "created_at": user["created_at"],
    }


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin):
    user = authenticate_user(email=payload.email, password=payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token({"sub": str(user["id"]), "email": user["email"]})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "full_name": None,
        "created_at": current_user["created_at"],
    }
