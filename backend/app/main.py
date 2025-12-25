from fastapi import FastAPI
from app.api import upload, recognize
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Face Recognition System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(upload.router, prefix="/api")
app.include_router(recognize.router, prefix="/api")
app.mount(
    "/images",
    StaticFiles(directory="/app/data/images"),
    name="images"
)

@app.get("/health")
def health_check():
    return {"status": "ok"}