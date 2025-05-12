# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from routers import auth
# from database import engine, Base
# import os
# from dotenv import load_dotenv
# from fastapi.staticfiles import StaticFiles
# from database.init_db import init_database

# # Load environment variables from .env
# load_dotenv()
# # @app.on_event("startup")
# # async def startup_event():
# #     # Initialize database
# #     db_exists = init_database()
# #     if not db_exists:
# #         print("Database created successfully!")
# #     else:
# #         print("Database already exists.")

# # Create database tables
# Base.metadata.create_all(bind=engine)

# app = FastAPI(title="DataMind-AI API")

# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, replace with specific origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # Include routers
# app.include_router(auth.router, prefix="/auth", tags=["auth"])

# # Serve the uploads/avatars directory at /avatars
# app.mount("/avatars", StaticFiles(directory="uploads/avatars"), name="avatars")

# @app.get("/")
# async def root():
#     return {"message": "Welcome to DataMind-AI API"} 

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth
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

# Serve static avatar files
app.mount("/avatars", StaticFiles(directory="uploads/avatars"), name="avatars")

@app.get("/")
async def root():
    return {"message": "Welcome to DataMind-AI API"}
