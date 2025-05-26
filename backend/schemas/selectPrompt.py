from pydantic import BaseModel, EmailStr
from fastapi import UploadFile
from typing import Optional, List
from datetime import datetime

class Status(BaseModel):
    status: str

class SelectPromptCreate(BaseModel):
    taskId: int
    userId: int
    prompt: str
    dataNumber: int

class SelectPrompt(BaseModel):
    id: int
    タスク名: str
    ユーザー: str
    プロンプト: str
    抽出データ数: int
    作成日: datetime

class SelectPromptListResponse(BaseModel):
    selectPrompts: List[SelectPrompt]