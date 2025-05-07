from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    名前: str
    メールアドレス: EmailStr

class UserCreate(UserBase):
    パスワード: str

class UserResponse(UserBase):
    アバター: Optional[str] = None
    権限: str

    class Config:
        from_attributes = True 