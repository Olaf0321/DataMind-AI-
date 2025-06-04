from pydantic import BaseModel, EmailStr
from fastapi import UploadFile
from typing import Optional, List, Dict, Any
from datetime import datetime

class Status(BaseModel):
    status: str
    
class StatusAndResponse(BaseModel):
    status: str
    response: str

class Prompt(BaseModel):
    taskId: int
    data: List[Dict[str, Any]]
    prompt: str
    output: str

class ArtifactPrompt(BaseModel):
    id: int
    タスク名: str
    ユーザー: str
    プロンプト: str
    AI応答: str
    結果リンク: str
    出力形式: str
    作成日: datetime

class ArtifactPromptListResponse(BaseModel):
    artifactPrompts: List[ArtifactPrompt]