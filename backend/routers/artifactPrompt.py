from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import 成果物プロンプト, タスク, ユーザー
from schemas.artifactPrompt import Status, StatusAndResponse, ArtifactPromptListResponse, Prompt
from database.init_db import get_db
from datetime import datetime
from routers.sendToAI import send_artifact_prompt_to_openai
import os
from routers.extractResultUrl import extract_result_url

router = APIRouter()

@router.post("/sendToAIAndexecute", response_model=StatusAndResponse)
async def send_AI(data:Prompt, db: Session = Depends(get_db)):
    # Check if the task exists
    task = db.query(タスク).filter(タスク.id == data.taskId).first()
    if not task:
        raise HTTPException(status_code=404, detail="タスクが見つかりません")
    print("タスク情報:", task.タスク名, task.データベースID)
    
    # 現在までselect文生成プロンプトを呼び出す
    artifactPrompts = db.query(成果物プロンプト).filter(成果物プロンプト.タスクID == data.taskId).all()
    
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    
    print('result', data);
    
    response = send_artifact_prompt_to_openai(artifactPrompts, data.data, data.prompt, api_key)
    
    print('response', response)
    
    # return {"status": "AIへのプロンプト送信が成功しました", "response": 'response'}
    
    if not response:
        raise HTTPException(status_code=500, detail="AIへのプロンプト送信に失敗しました")
    
    result_url = ''
    # result_url = extract_result_url(response)
    
    # print("result-url:", result_url)
    
    # AIからの応答をデータベースに保存
    
    user_id = task.ユーザーID
    
    db_artifact = 成果物プロンプト(
        タスクID=data.taskId,
        ユーザーID=user_id,
        プロンプト=data.prompt,
        AI応答=response,
        結果リンク=result_url
    )
    
    db.add(db_artifact)
    db.commit()
    db.refresh(db_artifact)
    print("成果物プロンプトが正常に作成されました")
    
    # print("AIからの応答:", response)
    
    return {"status": "AIへのプロンプト送信が成功しました", "response": response}

@router.get("/", response_model=ArtifactPromptListResponse)
async def read_users(db: Session = Depends(get_db)):
    # Fetch all users from the database
    artifactPrompts = db.query(成果物プロンプト).all()
    reArtifactPrompts = []
    for artifactPrompt in artifactPrompts:
        reArtifactPrompt = {
            "id": artifactPrompt.id,
            "タスク名": db.query(タスク).filter(タスク.id == artifactPrompt.タスクID).first().タスク名,
            "ユーザー": db.query(ユーザー).filter(ユーザー.id == artifactPrompt.ユーザーID).first().名前,
            "プロンプト": artifactPrompt.プロンプト,
            "結果リンク": artifactPrompt.結果リンク,
            "作成日": artifactPrompt.作成日時.strftime("%Y-%m-%d %H:%M:%S")
        }
        reArtifactPrompts.append(reArtifactPrompt)
    return {"artifactPrompts": reArtifactPrompts}

@router.get("/{task_id}", response_model=ArtifactPromptListResponse)
async def read_users(task_id: int, db: Session = Depends(get_db)):
    # Fetch all users from the database
    artifactPrompts = db.query(成果物プロンプト).filter(成果物プロンプト.タスクID == task_id)
    reArtifactPrompts = []
    for artifactPrompt in artifactPrompts:
        reArtifactPrompt = {
            "id": artifactPrompt.id,
            "タスク名": db.query(タスク).filter(タスク.id == artifactPrompt.タスクID).first().タスク名,
            "ユーザー": db.query(ユーザー).filter(ユーザー.id == artifactPrompt.ユーザーID).first().名前,
            "プロンプト": artifactPrompt.プロンプト,
            "SELECT文": artifactPrompt.SELECT文,
            "抽出データ数": artifactPrompt.抽出データ数,
            "作成日": artifactPrompt.作成日時.strftime("%Y-%m-%d %H:%M:%S"),
        }
        reArtifactPrompts.append(reArtifactPrompt)
        
    reArtifactPrompts.sort(
        key=lambda x: datetime.strptime(x["作成日"], "%Y-%m-%d %H:%M:%S"),
        reverse=True
    )
    return {"artifactPrompts": reArtifactPrompts}

@router.delete("/{artifactPrompt_id}", response_model=Status)
async def delete_task(artifactPrompt_id: int, db: Session = Depends(get_db)):
    db.query(成果物プロンプト).filter(成果物プロンプト.id == artifactPrompt_id).delete()
    db.commit()
    return {"status": "成果物プロンプトが正常に削除されました"}