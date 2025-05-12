# import sqlite3
# import os
# from pathlib import Path

# def init_database():
#     # Get the directory where the script is located
#     current_dir = Path(__file__).parent.parent
#     db_path = current_dir / 'datamind.db'

#     # Check if database exists
#     db_exists = os.path.exists(db_path)

#     # Connect to database (this will create it if it doesn't exist)
#     conn = sqlite3.connect(db_path)
#     cursor = conn.cursor()

#     # Create users table if it doesn't exist
#     cursor.execute('''
#     CREATE TABLE IF NOT EXISTS ユーザー (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         name TEXT NOT NULL,
#         email TEXT UNIQUE NOT NULL,
#         password TEXT NOT NULL,
#         role TEXT NOT NULL,
#         avatar TEXT
#     )
#     ''')

#     # # Create tasks table if it doesn't exist
#     # cursor.execute('''
#     # CREATE TABLE IF NOT EXISTS tasks (
#     #     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     #     name TEXT NOT NULL,
#     #     description TEXT,
#     #     select_query TEXT,
#     #     created_by INTEGER,
#     #     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#     #     select_prompt TEXT,
#     #     artifact_prompt TEXT,
#     #     FOREIGN KEY (created_by) REFERENCES users (id)
#     # )
#     # ''')

#     # # Create artifacts table if it doesn't exist
#     # cursor.execute('''
#     # CREATE TABLE IF NOT EXISTS artifacts (
#     #     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     #     task_id INTEGER,
#     #     content TEXT,
#     #     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#     #     FOREIGN KEY (task_id) REFERENCES tasks (id)
#     # )
#     # ''')

#     # Commit the changes and close the connection
#     conn.commit()
#     conn.close()

#     return db_exists

# if __name__ == "__main__":
#     init_database() 

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
