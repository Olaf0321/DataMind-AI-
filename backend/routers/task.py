from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session
from models import タスク
from schemas.task import Status, TaskListResponse
from config import settings
from database.init_db import get_db

router = APIRouter()

# JWT token configuration
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

@router.post("/", response_model=Status)
async def add_user(
    タスク名: str = Form(...),
    タスクの説明: str = Form(...),
    ユーザーID: int = Form(...),
    db: Session = Depends(get_db)
):
    db_task = タスク(
        タスク名=タスク名,
        タスクの説明=タスクの説明,
        最終的に採用されたSelect文='作成中',
        ユーザーID=ユーザーID,
    )
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    return {"status": "タスクが正常に作成されました"}

@router.get("/", response_model=TaskListResponse)
async def read_users(db: Session = Depends(get_db)):
    # Fetch all users from the database
    tasks = db.query(タスク).all()
    reTasks = []
    for task in tasks:
        reTask = {
            "id": task.id,
            "タスク名": task.タスク名,
            "タスクの説明": task.タスクの説明,
            "最終的に採用されたSelect文": task.最終的に採用されたSelect文,
            "作成者": task.ユーザーID,
            "作成日": task.作成日時.strftime("%Y-%m-%d %H:%M:%S"),
        }
        reTasks.append(reTask)
    return {"tasks": reTasks}

@router.delete("/{task_id}", response_model=Status)
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    db.query(タスク).filter(タスク.id == task_id).delete()
    db.commit()
    return {"status": "タスクが正常に削除されました"}