from pydantic import BaseModel, EmailStr
from fastapi import UploadFile
from typing import Optional, List
from datetime import datetime

class Status(BaseModel):
    status: str
    
class Result(BaseModel):
    id: int
    タスク名: str
    タスクの説明: str

class StatusAndResult(BaseModel):
    status: str
    task: Result

class TaskCreate(BaseModel):
    taskName: str
    taskDescription: str
    userId: int

class Task(BaseModel):
    id: int
    タスク名: str
    タスクの説明: str
    最終的に採用されたSelect文: str
    作成者: int
    作成日: datetime

class TaskListResponse(BaseModel):
    tasks: List[Task]