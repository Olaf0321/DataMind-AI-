from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from database.init_db import Base
from datetime import datetime

class 外部データベース情報(Base):
    __tablename__ = "外部データベース情報"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    タイプ = Column(String, nullable=False)          # 例: postgresql, mysqlなど
    ホスト = Column(String, nullable=True)          # 例: 127.0.0.1
    ポート = Column(String, nullable=True)          # 例: 5432
    データベース名 = Column(String, nullable=True)  # 例: sample_db
    接続ID = Column(String, nullable=True)          # 接続用のユーザー名など
    パスワード = Column(String, nullable=True)      # 接続用パスワード
    ファイルパス = Column(String, nullable=True)     # SQLiteなどで使う
    
    ユーザーID = Column(Integer, ForeignKey("ユーザー.id"), nullable=False)


    作成日時 = Column(DateTime, default=datetime.utcnow)
    更新日時 = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
