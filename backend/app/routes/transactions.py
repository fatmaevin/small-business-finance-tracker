from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.models import Transaction, User
from app.routes.auth import get_current_user


router = APIRouter()


# -----------------------
# DB SESSION
# -----------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------
# CREATE TRANSACTION
# -----------------------
@router.post("/transactions")
def create_transaction(
    amount: int,
    description: str,
    type: str,  # income / expense
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    new_txn = Transaction(
        amount=amount, description=description, type=type, user_id=current_user.id
    )

    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)

    return {
        "message": "Transaction created",
        "transaction": {
            "id": new_txn.id,
            "amount": new_txn.amount,
            "type": new_txn.type,
        },
    }


# -----------------------
# GET USER TRANSACTIONS
# -----------------------
@router.get("/transactions")
def get_transactions(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):

    transactions = (
        db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    )

    return transactions


@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):

    # Income transactions
    income_transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id, Transaction.type == "income")
        .all()
    )

    # Expense transactions
    expense_transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id, Transaction.type == "expense")
        .all()
    )

    # Sum calculations
    total_income = sum(t.amount for t in income_transactions)
    total_expense = sum(t.amount for t in expense_transactions)

    balance = total_income - total_expense

    return {
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
        },
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "transaction_count": len(income_transactions) + len(expense_transactions),
    }
