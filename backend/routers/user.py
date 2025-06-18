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
from schemas.user import Status, UserListResponse, Token
from config import settings
from database.init_db import get_db
from datetime import datetime

router = APIRouter()

# JWT token configuration
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user")

@router.post("/", response_model=Status)
async def add_user(
    名前: str = Form(...),
    メールアドレス: str = Form(...),
    パスワード: str = Form(...),
    db: Session = Depends(get_db)
):
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
    
    print(f"Creating user: {db_user.名前}, {db_user.メールアドレス}, {db_user.パスワード}, {db_user.アバター}, {db_user.権限}")
    
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
        # Skip admin users
        if user.権限 == "管理者":
            continue
        reUser = {
            "id": user.id,
            "名前": user.名前,
            "メールアドレス": user.メールアドレス,
            "作成日時": user.作成日時,
            "更新日時": user.更新日時
        }
        reUsers.append(reUser)
    return {"users": reUsers}

@router.post("/update", response_model=Token)
async def updateUserInfo(
    id: str = Form(...),
    名前: str = Form(...),
    メールアドレス: str = Form(...),
    avatar: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    numberId = int(id)

    # Get current user info
    current_user = db.query(ユーザー).filter(ユーザー.id == numberId).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="ユーザーが見つかりません")

    # Check if the email is being updated to another user's email
    if current_user.メールアドレス != メールアドレス:
        existing_user = db.query(ユーザー).filter(ユーザー.メールアドレス == メールアドレス).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="このメールアドレスは既に登録されています")

    # Handle avatar upload
    if avatar:
        upload_dir = Path("uploads/avatars")
        upload_dir.mkdir(parents=True, exist_ok=True)

        file_extension = os.path.splitext(avatar.filename)[1]

        # Generate a timestamp like "20250618_153045"
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Create the full filename
        filename = f"{メールアドレス}_{timestamp}{file_extension}"

        # File system path to save the file
        saved_path = f"uploads/avatars/{filename}"

        with open(saved_path, "wb") as buffer:
            content = await avatar.read()
            buffer.write(content)

        current_user.アバター = f"avatars/{filename}"

    # Update user fields
    current_user.名前 = 名前
    current_user.メールアドレス = メールアドレス
    # current_user.パスワード = current_user.パスワード  # unchanged
    # current_user.権限 = current_user.権限  # unchanged

    db.commit()
    db.refresh(current_user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.メールアドレス}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.delete("/{user_id}", response_model=Status)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    db.query(ユーザー).filter(ユーザー.id == user_id).delete()
    db.commit()
    return {"status": "ユーザーが正常に削除されました"}