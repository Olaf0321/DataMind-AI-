from pydantic import BaseModel, EmailStr
from fastapi import UploadFile
from typing import Optional, List
from datetime import datetime

class Status(BaseModel):
    status: str
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    名前: str
    メールアドレス: EmailStr

class User(BaseModel):
    id: int
    名前: str
    メールアドレス: EmailStr
    作成日時: datetime
    更新日時: datetime

class UserListResponse(BaseModel):
    users: List[User]

class Config:
    from_attributes = True 
    
class UserUpdateInfo(BaseModel):
    id: int
    名前: str
    メールアドレス: EmailStr
    アバター: str
    権限: str