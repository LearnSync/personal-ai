from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat


# FastAPI app
app = FastAPI(
    title="LS Personal AI",
    version="0.0.1",
    description="LS AI Assistant | Local AI Server",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can restrict this to specific domains if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Routes
app.include_router(generate.router)
