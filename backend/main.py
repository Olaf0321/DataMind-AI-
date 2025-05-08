from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth
from database import engine, Base
import os
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles

# Load environment variables from .env
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="DataMind-AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])

# Serve the uploads/avatars directory at /avatars
app.mount("/avatars", StaticFiles(directory="uploads/avatars"), name="avatars")

@app.get("/")
async def root():
    return {"message": "Welcome to DataMind-AI API"} 