from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

class Settings(BaseSettings):
    SECRET_KEY: str = os.getenv("SECRET_KEY") 
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL")
    ALGORITHM: str = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")

    class Config:
        env_file = ".env"

settings = Settings()