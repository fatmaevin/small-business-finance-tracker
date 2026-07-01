from fastapi import FastAPI
from app.database import Base, engine

from app.routes import auth
from app.routes import transactions
from fastapi.middleware.cors import CORSMiddleware
from app.routes import reports

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://dailybooks-app.netlify.app",
        "https://weeklybook.org",
        "https://www.weeklybook.org",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes bağlama
app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(reports.router)

# tablo oluştur (ilk run için)
Base.metadata.create_all(bind=engine)
