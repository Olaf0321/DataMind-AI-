from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class ユーザー(Base):
    __tablename__ = "ユーザー"
    
    id = Column(Integer, primary_key=True, index=True)
    名前 = Column(String(100), nullable=False)
    メールアドレス = Column(String(100), unique=True, nullable=False)
    パスワード = Column(String(100), nullable=False)
    アバター = Column(String(255))
    権限 = Column(String(20), nullable=False)
    作成日時 = Column(DateTime, default=datetime.utcnow)
    更新日時 = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class データベース接続(Base):
    __tablename__ = "データベース接続"
    
    id = Column(Integer, primary_key=True, index=True)
    ユーザーID = Column(Integer, ForeignKey("ユーザー.id"), nullable=False)
    ホスト = Column(String(255), nullable=False)
    ポート = Column(Integer, nullable=False)
    ユーザー名 = Column(String(100), nullable=False)
    暗号化パスワード = Column(String(255), nullable=False)
    データベース名 = Column(String(100), nullable=False)
    SSL使用 = Column(Boolean, default=False)
    SSL_CAパス = Column(String(255))
    SSL_証明書パス = Column(String(255))
    SSL_鍵パス = Column(String(255))
    作成日時 = Column(DateTime, default=datetime.utcnow)
    更新日時 = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class タスク管理(Base):
    __tablename__ = "タスク管理"
    
    id = Column(Integer, primary_key=True, index=True)
    タスク名 = Column(String(100), nullable=False)
    タスク説明 = Column(Text)
    採用SQL文 = Column(Text)
    作成者ID = Column(Integer, ForeignKey("ユーザー.id"), nullable=False)
    作成日時 = Column(DateTime, default=datetime.utcnow)
    更新日時 = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class 成果物(Base):
    __tablename__ = "成果物"
    
    id = Column(Integer, primary_key=True, index=True)
    タスクID = Column(Integer, ForeignKey("タスク管理.id"), nullable=False)
    成果物パス = Column(String(255), nullable=False)
    作成日時 = Column(DateTime, default=datetime.utcnow)
    作成者ID = Column(Integer, ForeignKey("ユーザー.id"), nullable=False)

class SQL文作成履歴(Base):
    __tablename__ = "SQL文作成履歴"
    
    id = Column(Integer, primary_key=True, index=True)
    タスクID = Column(Integer, ForeignKey("タスク管理.id"), nullable=False)
    プロンプト = Column(Text, nullable=False)
    作成日時 = Column(DateTime, default=datetime.utcnow)

class 成果物作成履歴(Base):
    __tablename__ = "成果物作成履歴"
    
    id = Column(Integer, primary_key=True, index=True)
    タスクID = Column(Integer, ForeignKey("タスク管理.id"), nullable=False)
    プロンプト = Column(Text, nullable=False)
    作成日時 = Column(DateTime, default=datetime.utcnow) 