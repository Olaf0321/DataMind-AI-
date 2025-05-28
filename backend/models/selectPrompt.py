from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from database.init_db import Base
from datetime import datetime
from sqlalchemy.orm import relationship

class SELECT文プロンプト(Base):
    __tablename__ = "SELECT文プロンプト"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    タスクID = Column(Integer, ForeignKey("タスク.id"), nullable=False)
    ユーザーID = Column(Integer, ForeignKey("ユーザー.id"), nullable=False)
    プロンプト = Column(String, nullable=False)
    SELECT文 = Column(String, nullable=False)
    抽出データ数 = Column(Integer, nullable=False)
    作成日時 = Column(DateTime, default=datetime.utcnow)
    更新日時 = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    タスク = relationship("タスク", back_populates="SELECT文プロンプト一覧")
    ユーザー = relationship("ユーザー", back_populates="SELECT文プロンプト一覧")
