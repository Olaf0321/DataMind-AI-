from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from database.init_db import Base
from datetime import datetime

class タスク(Base):
    __tablename__ = "タスク"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    タスク名 = Column(String, nullable=True)
    タスクの説明 = Column(String, nullable=True)
    最終的に採用されたSelect文 = Column(String, nullable=True)
    ユーザーID = Column(Integer, ForeignKey("ユーザー.id"), nullable=False)
    作成日時 = Column(DateTime, default=datetime.utcnow)
    更新日時 = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
