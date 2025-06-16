from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session
from models import タスク, SELECT文プロンプト, 成果物プロンプト
from schemas.task import Status, TaskListResponse, TaskCreate, StatusAndResult, SelectUpdate, FinalUpdate
from config import settings
from database.init_db import get_db

router = APIRouter()

# JWT token configuration
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

@router.post("/", response_model=StatusAndResult)
async def add_user(data:TaskCreate, db: Session = Depends(get_db)):
    db_task = タスク(
        タスク名=data.taskName,
        タスクの説明=data.taskDescription,
        最終的に採用されたSelect文='作成中',
        データベースID=data.databaseId,
        ユーザーID=data.userId,
        状態="進行中"
    )
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    newTask = db.query(タスク).filter(タスク.id == db_task.id).first()
    
    resTask = {
        "id": newTask.id,
        "タスク名": newTask.タスク名,
        "タスクの説明": newTask.タスクの説明,
    }
    
    print(f"タスクが正常に作成されました: {resTask}")
    
    return {"status": "タスクが正常に作成されました", "task": resTask}

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
            "状態": task.状態
        }
        reTasks.append(reTask)
    return {"tasks": reTasks}

@router.put("/{task_id}/select", response_model=Status)
async def update_task_select(
    task_id: int,
    select_update: SelectUpdate,  # ここでBodyとして受け取る
    db: Session = Depends(get_db)
):
    task = db.query(タスク).filter(タスク.id == task_id).first()
    if not task:
        return {"status": "タスクが見つかりません"}
    task.最終的に採用されたSelect文 = select_update.select  # ボディの値を使う
    db.commit()
    db.refresh(task)
    return {"status": "タスクのselectステートメントが更新されました。"}

@router.put("/{task_id}/final", response_model=Status)
async def update_task_final(
    task_id: int,
    final_update: FinalUpdate,  # ここでBodyとして受け取る
    db: Session = Depends(get_db)
):
    task = db.query(タスク).filter(タスク.id == task_id).first()
    if not task:
        return {"status": "タスクが見つかりません"}
    task.状態 = final_update.final  # ボディの値を使う
    db.commit()
    db.refresh(task)
    return {"status": "タスクのselectステートメントが更新されました。"}

@router.delete("/{task_id}", response_model=Status)
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    db.query(タスク).filter(タスク.id == task_id).delete()
    db.query(SELECT文プロンプト).filter(SELECT文プロンプト.タスクID == task_id).delete()
    db.query(成果物プロンプト).filter(成果物プロンプト.タスクID == task_id).delete()
    db.commit()
    return {"status": "タスクが正常に削除されました"}