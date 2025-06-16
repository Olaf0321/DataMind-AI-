from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from database.init_db import Base
from datetime import datetime
from sqlalchemy.orm import relationship

class タスク(Base):
    __tablename__ = "タスク"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    タスク名 = Column(String, nullable=False)
    タスクの説明 = Column(String, nullable=False)
    最終的に採用されたSelect文 = Column(String, nullable=True)
    ユーザーID = Column(Integer, ForeignKey("ユーザー.id"), nullable=False)
    データベースID = Column(Integer, ForeignKey("外部データベース情報.id"), nullable=False)
    状態 = Column(String, nullable=False)
    作成日時 = Column(DateTime, default=datetime.utcnow)
    更新日時 = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    SELECT文プロンプト一覧 = relationship("SELECT文プロンプト", back_populates="タスク")
    ユーザー = relationship("ユーザー", back_populates="タスク一覧")
