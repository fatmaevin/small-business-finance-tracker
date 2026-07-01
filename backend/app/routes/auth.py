import os
import secrets
from datetime import datetime, timedelta

import resend
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import User
from app.schemas import RegisterUser, LoginUser

load_dotenv()

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

resend.api_key = os.getenv("RESEND_API_KEY")

FRONTEND_URL = os.getenv("FRONTEND_URL")
FROM_EMAIL = os.getenv("FROM_EMAIL")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def send_verification_email(email: str, token: str):
    verification_link = f"{FRONTEND_URL}/verify-email?token={token}"

    resend.Emails.send(
        {
            "from": FROM_EMAIL,
            "to": email,
            "subject": "Verify your DailyBooks account",
            "html": f"""
                <h2>Welcome to DailyBooks</h2>
                <p>Please verify your email address to activate your account.</p>
                <p>
                    <a href="{verification_link}">
                        Verify my email
                    </a>
                </p>
                <p>If you did not create this account, you can ignore this email.</p>
            """,
        }
    )


@router.post("/register")
def register_user(user: RegisterUser, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    verification_token = secrets.token_urlsafe(32)

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        is_verified=False,
        verification_token=verification_token,
    )

    db.add(new_user)
    db.commit()

    send_verification_email(user.email, verification_token)

    return {
        "message": "User created successfully. Please check your email to verify your account."
    }


@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid verification token")

    user.is_verified = True
    user.verification_token = None

    db.commit()

    return {"message": "Email verified successfully. You can now login."}


@router.post("/login")
def login_user(user: LoginUser, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not db_user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in.",
        )

    token = create_access_token({"user_id": db_user.id})

    return {"access_token": token, "token_type": "bearer"}


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
    }
