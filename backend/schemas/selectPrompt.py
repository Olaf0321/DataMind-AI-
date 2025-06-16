from pydantic import BaseModel, EmailStr
from fastapi import UploadFile
from typing import Optional, List, Dict, Any
from datetime import datetime

class Status(BaseModel):
    status: str
    
class StatusAndResponse(BaseModel):
    status: str
    response: List[Dict[str, Any]]

class Prompt(BaseModel):
    taskId: int
    prompt: str

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
    SELECT文: str
    抽出データ数: int
    作成日: datetime

class SelectPromptListResponse(BaseModel):
    selectPrompts: List[SelectPrompt]
    
class SelectPromptResponse(BaseModel):
    selectPrompt: SelectPrompt