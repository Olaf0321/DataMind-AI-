from pydantic import BaseModel, EmailStr
from fastapi import UploadFile
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    名前: str
    メールアドレス: EmailStr

class UserResponse(UserBase):
    id: int
    名前: str
    メールアドレス: EmailStr
    アバター: Optional[str] = None
    権限: str

    class Config:
        from_attributes = True 