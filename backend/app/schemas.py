from pydantic import BaseModel ,EmailStr,Field
from datetime import datetime
from decimal import Decimal


class RegisterUser(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=8)


class LoginUser(BaseModel):
    email:str
    password:str


class UserResponse(BaseModel):
    id:int
    name:str
    email:str
    class Config:
        from_attributes=True    


class TransactionCreate(BaseModel):
    amount: Decimal
    description: str
    type: str
    transaction_date: datetime
    payment_method: str
    category: str | None = None
    paid_from_till: bool = False


class TransactionUpdate(BaseModel):
    amount: Decimal
    description: str
    type: str
    transaction_date: datetime
    payment_method: str
    category: str | None = None 
    paid_from_till: bool = False
