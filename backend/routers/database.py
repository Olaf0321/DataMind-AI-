from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from database.init_db import get_db
import crud.database as crud
import schemas.database as schemas
from routers.connectDB import connect_to_database
from routers.getSchema import get_schema_information
from routers.sendSchemaToAI import send_to_openai
import os

router = APIRouter()

@router.post("/", response_model=schemas.外部DB表示)
async def create_db_info(data: schemas.外部DB作成, db: Session = Depends(get_db)):
    return crud.create_db_info(db, data)

@router.post("/init")
async def study_schema(data: schemas.TaskBase, db: Session = Depends(get_db)):
    # DB接続情報を取得
    databaseInfo = crud.get_db_info(db, data.databaseId)
    
    db_type = databaseInfo.タイプ.lower()
    host = databaseInfo.ホスト
    port = databaseInfo.ポート
    db_name = databaseInfo.データベース名
    username = databaseInfo.接続ID
    password = databaseInfo.パスワード
    file_path = databaseInfo.ファイルパス
    user_id = databaseInfo.ユーザーID
    
    print("DB接続情報:", db_type, host, port, db_name, username, password)
    
    engine = connect_to_database(db_type, host, port, db_name, username, password)
    
    if not engine:
        raise HTTPException(status_code=500, detail="Failed to connect to the database. Check credentials or DB status.")
    
    schema_info = get_schema_information(engine)
    
    # Azure OpenAIの設定
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION")
    
    # スキーマ情報をAzure OpenAIに送信
    response = send_to_openai(
        schema_info,
        azure_endpoint,
        api_key,
        deployment_name,
        api_version
    )
    
    print("AIからの応答:", response)

    return {"message": "DB接続とスキーマ情報取得が成功しました"}

@router.get("/", response_model=list[schemas.外部DB表示])
def get_all(db: Session = Depends(get_db)):
    return crud.get_all_db_info(db)

@router.get("/list/{user_id}", response_model=list[schemas.外部DB表示])
def get_all_by_user(user_id: int, db: Session = Depends(get_db)):
    return crud.get_all_by_user(db, user_id)

@router.get("/{db_id}", response_model=schemas.外部DB表示)
def get_detail(db_id: int, db: Session = Depends(get_db)):
    db_obj = crud.get_db_info(db, db_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="情報が見つかりません")
    return db_obj

@router.put("/{db_id}", response_model=schemas.外部DB表示)
def update(db_id: int, update_data: schemas.外部DB更新, db: Session = Depends(get_db)):
    db_obj = crud.update_db_info(db, db_id, update_data)
    if not db_obj:
        raise HTTPException(status_code=404, detail="情報が見つかりません")
    return db_obj

@router.delete("/{db_id}", response_model=schemas.外部DB表示)
def delete(db_id: int, db: Session = Depends(get_db)):
    db_obj = crud.delete_db_info(db, db_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="情報が見つかりません")
    return db_obj
