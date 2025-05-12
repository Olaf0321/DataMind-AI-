from sqlalchemy import Column, String, DateTime
from database.init_db import Base
from datetime import datetime

class ユーザー(Base):
    __tablename__ = "ユーザー"

    名前 = Column(String, nullable=False)
    メールアドレス = Column(String, unique=True, nullable=False, primary_key=True)
    パスワード = Column(String, nullable=False)
    アバター = Column(String, nullable=True)
    権限 = Column(String, nullable=False, default="ユーザー") 
    作成日時 = Column(DateTime, default=datetime.utcnow)
    更新日時 = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)