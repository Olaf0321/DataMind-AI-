from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import SELECT文プロンプト, タスク, ユーザー
from schemas.selectPrompt import Status, SelectPromptListResponse, SelectPromptCreate
from database.init_db import get_db

router = APIRouter()

@router.post("/", response_model=Status)
async def add_user(data:SelectPromptCreate, db: Session = Depends(get_db)):
    db_task = SELECT文プロンプト(
        タスクID=data.taskId,
        ユーザーID=data.userId,
        プロンプト=data.prompt,
        抽出データ数=data.dataNumber,
    )
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    return {"status": "SELECT文プロンプトが正常に作成されました"}

@router.get("/", response_model=SelectPromptListResponse)
async def read_users(db: Session = Depends(get_db)):
    # Fetch all users from the database
    selectPrompts = db.query(SELECT文プロンプト).all()
    reSelectPrompts = []
    for selectPrompt in selectPrompts:
        reSelectPrompt = {
            "id": selectPrompt.id,
            "タスク名": db.query(タスク).filter(タスク.id == selectPrompt.タスクID).first().タスク名,
            "ユーザー": db.query(ユーザー).filter(ユーザー.id == selectPrompt.ユーザーID).first().名前,
            "プロンプト": selectPrompt.プロンプト,
            "抽出データ数": selectPrompt.抽出データ数,
            "作成日": selectPrompt.作成日時.strftime("%Y-%m-%d %H:%M:%S"),
        }
        reSelectPrompts.append(reSelectPrompt)
    return {"selectPrompts": reSelectPrompts}

@router.delete("/{selectPrompt_id}", response_model=Status)
async def delete_task(selectPrompt_id: int, db: Session = Depends(get_db)):
    db.query(SELECT文プロンプト).filter(SELECT文プロンプト.id == selectPrompt_id).delete()
    db.commit()
    return {"status": "SELECT文プロンプトが正常に削除されました"}