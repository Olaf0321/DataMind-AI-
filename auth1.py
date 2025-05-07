from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from pathlib import Path

from database import get_db
from models.user import ユーザー
from schemas.auth import Token, UserCreate, UserResponse
from config import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# JWT token configuration
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="認証に失敗しました",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.JWTError:
        raise credentials_exception
    
    user = db.query(ユーザー).filter(ユーザー.メールアドレス == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/signup", response_model=UserResponse)
async def signup(
    form_data: UserCreate = Depends(),
    db: Session = Depends(get_db)
):
    # Check if user already exists
    db_user = db.query(ユーザー).filter(ユーザー.メールアドレス == form_data.メールアドレス).first()
    if db_user:
        raise HTTPException(status_code=400, detail="このメールアドレスは既に登録されています")

    # Handle avatar upload
    avatar_path = None
    if form_data.アバター:
        # Create uploads directory if it doesn't exist
        upload_dir = Path("uploads/avatars")
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        # Save avatar file
        file_extension = os.path.splitext(form_data.アバター.filename)[1]
        avatar_path = f"uploads/avatars/{form_data.メールアドレス}{file_extension}"
        with open(avatar_path, "wb") as buffer:
            content = await form_data.アバター.read()
            buffer.write(content)

    # Create new user
    hashed_password = get_password_hash(form_data.パスワード)
    db_user = ユーザー(
        名前=form_data.名前,
        メールアドレス=form_data.メールアドレス,
        パスワード=hashed_password,
        アバター=avatar_path,
        権限="ユーザー"  # Default to regular user
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(ユーザー).filter(ユーザー.メールアドレス == form_data.username).first()
    if not user or not verify_password(form_data.password, user.パスワード):
        raise HTTPException(
            status_code=401,
            detail="メールアドレスまたはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.メールアドレス}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: ユーザー = Depends(get_current_user)):
    return current_user 