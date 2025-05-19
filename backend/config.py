from pydantic_settings import BaseSettings
from pydantic import Field
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
    AZURE_OPENAI_ENDPOINT: str = os.getenv("AZURE_OPENAI_ENDPOINT")
    AZURE_OPENAI_API_KEY: str = os.getenv("AZURE_OPENAI_API_KEY")
    AZURE_OPENAI_DEPLOYMENT_NAME: str = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
    AZURE_OPENAI_API_VERSION: str = "2023-05-15"
    AZURE_OPENAI_MODEL: str = "gpt-4o-mini"

    class Config:
        extra = "ignore"
        env_file = ".env"

settings = Settings()