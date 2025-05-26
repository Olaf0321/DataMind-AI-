from sqlalchemy import Column, String, DateTime
from database.init_db import Base
from datetime import datetime
from sqlalchemy import Integer
from sqlalchemy.orm import relationship

class ユーザー(Base):
    __tablename__ = "ユーザー"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    名前 = Column(String, nullable=False)
    メールアドレス = Column(String, unique=True, nullable=False)
    パスワード = Column(String, nullable=False)
    アバター = Column(String, nullable=True)
    権限 = Column(String, nullable=False, default="ユーザー") 
    作成日時 = Column(DateTime, default=datetime.utcnow)
    更新日時 = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    SELECT文プロンプト一覧 = relationship("SELECT文プロンプト", back_populates="ユーザー")
    タスク一覧 = relationship("タスク", back_populates="ユーザー")