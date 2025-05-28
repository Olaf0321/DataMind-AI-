from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import SELECT文プロンプト, タスク, ユーザー
from schemas.selectPrompt import Status, StatusAndResponse, SelectPromptListResponse, SelectPromptCreate, Prompt
from database.init_db import get_db
from datetime import datetime
from routers.sendToAI import send_select_prompt_to_openai
import os
import crud.database as crud
from routers.connectDB import connect_to_database
from routers.getSchema import get_schema_information
from routers.extractSelectQuery import extract_select_query
from sqlalchemy import text

router = APIRouter()

@router.post("/sendToAIAndexecute", response_model=StatusAndResponse)
async def send_AI(data:Prompt, db: Session = Depends(get_db)):
    # Check if the task exists
    task = db.query(タスク).filter(タスク.id == data.taskId).first()
    if not task:
        raise HTTPException(status_code=404, detail="タスクが見つかりません")
    print("タスク情報:", task.タスク名, task.データベースID)
    
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
    
    if not engine:
        raise HTTPException(status_code=500, detail="Failed to connect to the database. Check credentials or DB status.")
    
    schema_info = get_schema_information(engine)
    
    # 現在までselect文生成プロンプトを呼び出す
    selectPrompts = db.query(SELECT文プロンプト).filter(SELECT文プロンプト.タスクID == data.taskId).all()
    
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    
    response = send_select_prompt_to_openai(schema_info, selectPrompts, data.prompt, api_key)
    
    if not response:
        raise HTTPException(status_code=500, detail="AIへのプロンプト送信に失敗しました")
    
    sql_query = extract_select_query(response)
    
    print("sql-query:", sql_query)
    
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
    
    print("データリスト:", len(data_list))
    # AIからの応答をデータベースに保存
    
    db_task = SELECT文プロンプト(
        タスクID=data.taskId,
        ユーザーID=user_id,
        プロンプト=data.prompt,
        抽出データ数=len(data_list),
        SELECT文=sql_query,
    )
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    print("SELECT文プロンプトが正常に作成されました")
    
    # print("AIからの応答:", response)
    
    return {"status": "AIへのプロンプト送信が成功しました", "response": data_list}

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
            "SELECT文": selectPrompt.SELECT文,
            "抽出データ数": selectPrompt.抽出データ数,
            "作成日": selectPrompt.作成日時.strftime("%Y-%m-%d %H:%M:%S"),
        }
        reSelectPrompts.append(reSelectPrompt)
    return {"selectPrompts": reSelectPrompts}

@router.get("/{task_id}", response_model=SelectPromptListResponse)
async def read_users(task_id: int, db: Session = Depends(get_db)):
    # Fetch all users from the database
    selectPrompts = db.query(SELECT文プロンプト).filter(SELECT文プロンプト.タスクID == task_id)
    reSelectPrompts = []
    for selectPrompt in selectPrompts:
        reSelectPrompt = {
            "id": selectPrompt.id,
            "タスク名": db.query(タスク).filter(タスク.id == selectPrompt.タスクID).first().タスク名,
            "ユーザー": db.query(ユーザー).filter(ユーザー.id == selectPrompt.ユーザーID).first().名前,
            "プロンプト": selectPrompt.プロンプト,
            "SELECT文": selectPrompt.SELECT文,
            "抽出データ数": selectPrompt.抽出データ数,
            "作成日": selectPrompt.作成日時.strftime("%Y-%m-%d %H:%M:%S"),
        }
        reSelectPrompts.append(reSelectPrompt)
        
    reSelectPrompts.sort(
        key=lambda x: datetime.strptime(x["作成日"], "%Y-%m-%d %H:%M:%S"),
        reverse=True
    )
    return {"selectPrompts": reSelectPrompts}

@router.delete("/{selectPrompt_id}", response_model=Status)
async def delete_task(selectPrompt_id: int, db: Session = Depends(get_db)):
    db.query(SELECT文プロンプト).filter(SELECT文プロンプト.id == selectPrompt_id).delete()
    db.commit()
    return {"status": "SELECT文プロンプトが正常に削除されました"}