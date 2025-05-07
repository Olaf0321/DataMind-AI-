from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# データベースファイルのパスを設定
DATABASE_URL = os.getenv("DATABASE_URL")

# SQLiteエンジンの作成
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# セッションの作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ベースクラスの作成
Base = declarative_base()

# データベースセッションの依存性
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 初期管理者ユーザーの作成
def create_initial_admin(db):
    from models.user import ユーザー
    from passlib.context import CryptContext
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    # 管理者ユーザーが存在するか確認
    admin = db.query(ユーザー).filter(ユーザー.メールアドレス == os.getenv("ADMIN_EMAIL")).first()
    if not admin:
        admin_user = ユーザー(
            名前="管理者",
            メールアドレス=os.getenv("ADMIN_EMAIL"),
            パスワード=pwd_context.hash(os.getenv("ADMIN_PASSWORD")),  # 初期パスワード
            権限="管理者"
        )
        db.add(admin_user)
        db.commit() 