from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from database.init_db import get_db
import crud.database as crud
import schemas.database as schemas

router = APIRouter()

@router.post("/", response_model=schemas.外部DB表示)
async def create_db_info(data: schemas.外部DB作成, db: Session = Depends(get_db)):
    return crud.create_db_info(db, data)

@router.get("/", response_model=list[schemas.外部DB表示])
def get_all(db: Session = Depends(get_db)):
    return crud.get_all_db_info(db)

@router.get("/一覧/{user_id}", response_model=list[schemas.外部DB表示])
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
