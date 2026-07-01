from sqlalchemy import Column, Integer, String, DateTime, ForeignKey,Numeric,Boolean
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True)
    name=Column(String (100))
    email=Column(String (100), unique=True,index=True)
    password=Column(String(255))
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    amount = Column(Numeric(10,2), nullable=False)
    description = Column(String)
    type = Column(String, nullable=False)
    transaction_date = Column(DateTime, nullable=False)
    payment_method = Column(String, nullable=False)
    category = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    paid_from_till=Column(Boolean ,default=False)
