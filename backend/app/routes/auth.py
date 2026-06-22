from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas import RegisterUser, LoginUser

from app.models import User
from app.database import SessionLocal

from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# endpointleri gruplamak icin
router = APIRouter()

# her request icin db baglantisi acilir


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# PASSWORD HASH

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# jwt settings

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# REGISTER
@router.post("/register")
def register_user(user: RegisterUser, db: Session = Depends(get_db)):
    new_user = User(name=name, email=email, password=hash_password(password))
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}


# LOGIN
@router.post("/login")
def login_user(user: LoginUser, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"error": "Invalid credentials"}

    if not verify_password(password, user.password):
        return {"error": "Invalid credentials"}

    token = create_access_token({"user_id": user.id})

    return {"access_token": token, "token_type": "bearer"}


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
    }
