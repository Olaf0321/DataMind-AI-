from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from pathlib import Path
from models import ユーザー
from schemas.user import Status, UserListResponse
from config import settings
from database.init_db import get_db

router = APIRouter()

# JWT token configuration
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user")

@router.post("/", response_model=Status)
async def add_user(
    名前: str = Form(...),
    メールアドレス: str = Form(...),
    パスワード: str = Form(...),
    パスワード確認: str = Form(...),
    db: Session = Depends(get_db)
):
    # Check if passwords match
    if パスワード != パスワード確認:
        raise HTTPException(status_code=400, detail="パスワードが一致しません")

    # Check if user already exists
    db_user = db.query(ユーザー).filter(ユーザー.メールアドレス == メールアドレス).first()
    if db_user:
        raise HTTPException(status_code=400, detail="このメールアドレスは既に登録されています")

    avatar_path = f"avatars/default.png"

    # Create new user
    hashed_password = get_password_hash(パスワード)
    db_user = ユーザー(
        名前=名前,
        メールアドレス=メールアドレス,
        パスワード=hashed_password,
        アバター=avatar_path,
        権限="ユーザー"  # Default to regular user
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"status": "ユーザーが正常に作成されました"}

@router.get("/", response_model=UserListResponse)
async def read_users(db: Session = Depends(get_db)):
    # Fetch all users from the database
    users = db.query(ユーザー).all()
    reUsers = []
    for user in users:
        reUser = {
            "id": user.id,
            "名前": user.名前,
            "メールアドレス": user.メールアドレス,
            "作成日時": user.作成日時,
            "更新日時": user.更新日時
        }
        reUsers.append(reUser)
    return {"users": reUsers}

@router.delete("/{user_id}", response_model=Status)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    db.query(ユーザー).filter(ユーザー.id == user_id).delete()
    db.commit()
    return {"status": "ユーザーが正常に削除されました"}