from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional
from pydantic import BaseModel, EmailStr

from database import get_db, engine, create_initial_admin
from models import Base, ユーザー
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# データベースの作成
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DataMind-AI API")

# ユーザー作成のためのPydanticモデル
class ユーザー作成(BaseModel):
    名前: str
    メールアドレス: EmailStr
    パスワード: str

class トークン(BaseModel):
    access_token: str
    token_type: str

class ユーザー情報(BaseModel):
    名前: str
    メールアドレス: EmailStr
    権限: str

    class Config:
        orm_mode = True

@app.post("/token", response_model=トークン)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(ユーザー).filter(ユーザー.メールアドレス == form_data.username).first()
    if not user or not verify_password(form_data.password, user.パスワード):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが間違っています",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.メールアドレス}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/ユーザー登録", response_model=ユーザー情報)
async def create_user(user: ユーザー作成, db: Session = Depends(get_db)):
    # メールアドレスの重複チェック
    db_user = db.query(ユーザー).filter(ユーザー.メールアドレス == user.メールアドレス).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このメールアドレスは既に登録されています"
        )
    
    # 新規ユーザーの作成
    hashed_password = get_password_hash(user.パスワード)
    db_user = ユーザー(
        名前=user.名前,
        メールアドレス=user.メールアドレス,
        パスワード=hashed_password,
        権限="一般"  # デフォルトは一般ユーザー
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/ユーザー/me", response_model=ユーザー情報)
async def read_users_me(current_user: ユーザー = Depends(get_current_active_user)):
    return current_user

# アプリケーション起動時に初期管理者ユーザーを作成
@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    create_initial_admin(db) 