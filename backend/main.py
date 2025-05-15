from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, user
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from database.init_db import init_db  # ← renamed for clarity
import os

# Load environment variables from .env
load_dotenv()

app = FastAPI(title="DataMind-AI API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event: init DB and create admin user
@app.on_event("startup")
def on_startup():
    init_db()

# API routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(user.router, prefix="/user", tags=["user"])

# Serve static avatar files
app.mount("/avatars", StaticFiles(directory="uploads/avatars"), name="avatars")

@app.get("/")
async def root():
    return {"message": "Welcome to DataMind-AI API"}
