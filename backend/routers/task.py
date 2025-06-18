from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import タスク, SELECT文プロンプト, 成果物プロンプト, ユーザー, 成果物プロンプト
from schemas.task import Status, Task, TaskListResponse, TaskCreate, StatusAndResult, SelectUpdate, TaskCopy
from config import settings
from database.init_db import get_db
import crud.database as crud
from routers.connectDB import connect_to_database
from sqlalchemy import text
from sqlalchemy import desc
from datetime import datetime
from routers.extractResultUrl import extract_result_url
import os
from routers.sendToAI import send_artifact_prompt_to_openai

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
            "作成者": db.query(ユーザー).filter(ユーザー.id == task.ユーザーID).first().名前,
            "作成日": task.作成日時.strftime("%Y-%m-%d %H:%M:%S"),
            "状態": task.状態
        }
        reTasks.append(reTask)
    return {"tasks": reTasks}

@router.get("/{task_id}", response_model=Task)
async def read_users(task_id: int, db: Session = Depends(get_db)):
    # Fetch all users from the database
    task = db.query(タスク).filter(タスク.id == task_id).first()
    reTask = {
        "id": task.id,
        "タスク名": task.タスク名,
        "タスクの説明": task.タスクの説明,
        "最終的に採用されたSelect文": task.最終的に採用されたSelect文,
        "作成者": db.query(ユーザー).filter(ユーザー.id == task.ユーザーID).first().名前,
        "作成日": task.作成日時.strftime("%Y-%m-%d %H:%M:%S"),
        "状態": task.状態
    }
    return reTask

@router.get("/re/{task_id}", response_model=Status)
async def read_users(task_id: int, db: Session = Depends(get_db)):
    # Fetch all users from the database
    task = db.query(タスク).filter(タスク.id == task_id).first()
    if not task:
        return {"status": "タスクが見つかりません"}
    # 外部データベースとの接続
    databaseInfo = crud.get_db_info(db, task.データベースID)
    
    db_type = databaseInfo.タイプ.lower()
    host = databaseInfo.ホスト
    port = databaseInfo.ポート
    db_name = databaseInfo.データベース名
    username = databaseInfo.接続ID
    password = databaseInfo.パスワード
    file_path = databaseInfo.ファイルパス
    user_id = databaseInfo.ユーザーID
    
    engine = connect_to_database(db_type, host, port, db_name, username, password)
    sql_query = task.最終的に採用されたSelect文
    
    data_list = []
    
    # SQLクエリを実行
    try:
        with engine.connect() as connection:
            result = connection.execute(text(sql_query))
            print("SQLクエリの実行結果:", result)
            # データを取得
            data_rows = result.fetchall()
            column_names = result.keys()
            print("取得したデータ:", data_rows)
            print("カラム名:", column_names)
            # データを辞書形式に変換
            data_list = [dict(zip(column_names, row)) for row in data_rows]
            print("辞書形式のデータ:", data_list)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SQLクエリの実行に失敗しました: {str(e)}")
    
    artifactPrompts = db.query(成果物プロンプト).filter(成果物プロンプト.タスクID == task_id).all()
    
    latest_artifact_prompt = (
        db.query(成果物プロンプト)
        .filter(成果物プロンプト.タスクID == task_id)
        .order_by(desc(成果物プロンプト.作成日時))
        .first()
    )
    
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    response = send_artifact_prompt_to_openai(artifactPrompts, data_list, latest_artifact_prompt.プロンプト, latest_artifact_prompt.出力形式, api_key)
    
    if not response:
        raise HTTPException(status_code=500, detail="AIへのプロンプト送信に失敗しました")
    
    result_url = ''
    
    result_url = extract_result_url(response, latest_artifact_prompt.出力形式)
    result_url = f"{settings.SERVER_URL}/{result_url}" if latest_artifact_prompt.出力形式 != 'JSON' else result_url
    
    user_id = task.ユーザーID
    
    # Generate filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    db_task = タスク(
        タスク名=f'{task.タスク名}-再実行({timestamp})',
        タスクの説明=task.タスクの説明,
        最終的に採用されたSelect文=sql_query,
        データベースID=task.データベースID,
        ユーザーID=task.ユーザーID,
        状態="完了"
    )
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    latest_select_prompt = (
        db.query(SELECT文プロンプト)
        .filter(SELECT文プロンプト.タスクID == task_id)
        .order_by(desc(SELECT文プロンプト.作成日時))
        .first()
    )
    
    db_select = SELECT文プロンプト(
        タスクID=db_task.id,
        ユーザーID=user_id,
        プロンプト=latest_select_prompt.プロンプト,
        抽出データ数=len(data_list),
        SELECT文=sql_query,
    )
    
    db.add(db_select)
    db.commit()
    db.refresh(db_select)
    
    db_artifact = 成果物プロンプト(
        タスクID=db_task.id,
        ユーザーID=user_id,
        プロンプト=latest_artifact_prompt.プロンプト,
        AI応答=response,
        結果リンク=result_url,
        出力形式=latest_artifact_prompt.出力形式
    )
    
    db.add(db_artifact)
    db.commit()
    db.refresh(db_artifact)
    
    return {"status": "Correctly reRUN"}

@router.post("/copy/{task_id}", response_model=Status)
async def copy_run(task_id: int, data: TaskCopy,  db: Session = Depends(get_db)):
    # Fetch all users from the database
    task = db.query(タスク).filter(タスク.id == task_id).first()
    if not task:
        return {"status": "タスクが見つかりません"}
    # 外部データベースとの接続
    databaseInfo = crud.get_db_info(db, task.データベースID)
    
    db_type = databaseInfo.タイプ.lower()
    host = databaseInfo.ホスト
    port = databaseInfo.ポート
    db_name = databaseInfo.データベース名
    username = databaseInfo.接続ID
    password = databaseInfo.パスワード
    file_path = databaseInfo.ファイルパス
    user_id = databaseInfo.ユーザーID
    
    engine = connect_to_database(db_type, host, port, db_name, username, password)
    sql_query = data.select
    
    data_list = []
    
    # SQLクエリを実行
    try:
        with engine.connect() as connection:
            result = connection.execute(text(sql_query))
            print("SQLクエリの実行結果:", result)
            # データを取得
            data_rows = result.fetchall()
            column_names = result.keys()
            print("取得したデータ:", data_rows)
            print("カラム名:", column_names)
            # データを辞書形式に変換
            data_list = [dict(zip(column_names, row)) for row in data_rows]
            print("辞書形式のデータ:", data_list)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SQLクエリの実行に失敗しました: {str(e)}")
    
    artifactPrompts = db.query(成果物プロンプト).filter(成果物プロンプト.タスクID == task_id).all()
    
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    response = send_artifact_prompt_to_openai(artifactPrompts, data_list, data.artifactPrompt, data.output, api_key)
    
    if not response:
        raise HTTPException(status_code=500, detail="AIへのプロンプト送信に失敗しました")
    
    result_url = ''
    
    result_url = extract_result_url(response, data.output)
    result_url = f"{settings.SERVER_URL}/{result_url}" if data.output != 'JSON' else result_url
    
    user_id = task.ユーザーID
    
    # Generate filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    db_task = タスク(
        タスク名=f'{task.タスク名}-コピー({timestamp})',
        タスクの説明=task.タスクの説明,
        最終的に採用されたSelect文=sql_query,
        データベースID=task.データベースID,
        ユーザーID=task.ユーザーID,
        状態="完了"
    )
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    latest_select_prompt = (
        db.query(SELECT文プロンプト)
        .filter(SELECT文プロンプト.タスクID == task_id)
        .order_by(desc(SELECT文プロンプト.作成日時))
        .first()
    )
    
    db_select = SELECT文プロンプト(
        タスクID=db_task.id,
        ユーザーID=user_id,
        プロンプト=f'{latest_select_prompt.プロンプト}-コピー({timestamp})',
        抽出データ数=len(data_list),
        SELECT文=sql_query,
    )
    
    db.add(db_select)
    db.commit()
    db.refresh(db_select)
    
    db_artifact = 成果物プロンプト(
        タスクID=db_task.id,
        ユーザーID=user_id,
        プロンプト=data.artifactPrompt,
        AI応答=response,
        結果リンク=result_url,
        出力形式=data.output
    )
    
    db.add(db_artifact)
    db.commit()
    db.refresh(db_artifact)
    
    return {"status": "Correctly CopyRun"}

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
    db: Session = Depends(get_db)
):
    task = db.query(タスク).filter(タスク.id == task_id).first()
    if not task:
        return {"status": "タスクが見つかりません"}
    task.状態 = '完了'
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