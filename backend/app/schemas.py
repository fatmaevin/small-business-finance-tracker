from pydantic import BaseModel

class RegisterUser(BaseModel):
    name:str
    email:str
    password:str

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
    amount: int
    description: str
    type: str
