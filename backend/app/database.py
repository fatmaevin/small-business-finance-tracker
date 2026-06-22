from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os 
from dotenv import load_dotenv

# .env dosyasini oku 

load_dotenv()
#database url al 

DATABASE_URL=os.getenv("DATABASE_URL")

#engine(postgress baglanti motoru )

engine=create_engine(DATABASE_URL)

# session (db ile konusma katmani )
SessionLocal=sessionmaker(autocommit=False ,autoflush=False ,bind=engine)

# base (model sistemi icin temel sinif)
Base=declarative_base()
