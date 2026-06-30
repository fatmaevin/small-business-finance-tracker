from fastapi import FastAPI
from app.database import Base, engine

from app.routes import auth
from app.routes import transactions
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes bağlama
app.include_router(auth.router)
app.include_router(transactions.router)

# tablo oluştur (ilk run için)
Base.metadata.create_all(bind=engine)
