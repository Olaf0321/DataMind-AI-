from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables from .env
load_dotenv()

# Get full DATABASE_URL, should be in format: sqlite:///db.sqlite3
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env")

# Setup SQLAlchemy engine
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declare Base
Base = declarative_base()

# Dependency for DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Automatically create tables
def init_db():
    from models.user import ユーザー
    Base.metadata.create_all(bind=engine)

    # Create avatar directory if it doesn't exist
    Path("uploads/avatars").mkdir(parents=True, exist_ok=True)

    # Create admin user
    create_initial_admin(SessionLocal())

# Create initial admin user
def create_initial_admin(db):
    from models.user import ユーザー
    from passlib.context import CryptContext
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_email or not admin_password:
        print("ADMIN_EMAIL or ADMIN_PASSWORD not set.")
        return

    # Check if admin user exists
    admin = db.query(ユーザー).filter(ユーザー.メールアドレス == admin_email).first()
    if not admin:
        admin_user = ユーザー(
            名前="管理者",
            メールアドレス=admin_email,
            パスワード=pwd_context.hash(admin_password),
            権限="管理者",
            アバター="avatars/default.png"
        )
        db.add(admin_user)
        db.commit()
        print("Initial admin created.")
    else:
        print("Admin user already exists.")
