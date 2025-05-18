from sqlalchemy.orm import Session
from models.database import 外部データベース情報
from schemas.database import 外部DB作成, 外部DB更新

def create_db_info(db: Session, data: 外部DB作成):
    db_obj = 外部データベース情報(**data.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_all_db_info(db: Session):
    return db.query(外部データベース情報).all()

def get_all_by_user(db: Session, user_id: int):
    return db.query(外部データベース情報).filter(外部データベース情報.ユーザーID == user_id).all()

def get_db_info(db: Session, db_id: int):
    return db.query(外部データベース情報).filter(外部データベース情報.id == db_id).first()

def update_db_info(db: Session, db_id: int, update_data: 外部DB更新):
    db_obj = get_db_info(db, db_id)
    if db_obj:
        for key, value in update_data.dict(exclude_unset=True).items():
            setattr(db_obj, key, value)
        db.commit()
        db.refresh(db_obj)
    return db_obj

def delete_db_info(db: Session, db_id: int):
    db_obj = get_db_info(db, db_id)
    if db_obj:
        db.delete(db_obj)
        db.commit()
    return db_obj
