from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import SessionLocal
from app.models import Transaction, User
from app.routes.auth import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/reports")
def get_accounting_report(
    start_date: str,
    end_date: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)

    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == current_user.id,
            Transaction.transaction_date >= start,
            Transaction.transaction_date <= end,
        )
        .all()
    )

    cash_income = sum(
        t.amount
        for t in transactions
        if t.type == "income" and t.payment_method == "cash"
    ) + sum(
        t.amount
        for t in transactions
        if t.type == "expense" and t.payment_method == "cash" and t.paid_from_till
    )

    bank_income = sum(
        t.amount
        for t in transactions
        if t.type == "income" and t.payment_method == "bank"
    )

    cash_expense = sum(
        t.amount
        for t in transactions
        if t.type == "expense" and t.payment_method == "cash"
    )

    bank_expense = sum(
        t.amount
        for t in transactions
        if t.type == "expense" and t.payment_method == "bank"
    )

    total_income = cash_income + bank_income
    total_expense = cash_expense + bank_expense

    till_balance = cash_income - cash_expense
    bank_balance = bank_income - bank_expense
    net_profit = total_income - total_expense

    return {
        "period": {
            "start_date": start_date,
            "end_date": end_date,
        },
        "income": {
            "cash": cash_income,
            "bank": bank_income,
            "total": total_income,
        },
        "expense": {
            "cash": cash_expense,
            "bank": bank_expense,
            "total": total_expense,
        },
        "balance": {
            "till": till_balance,
            "bank": bank_balance,
            "net_profit": net_profit,
        },
        "transactions": {
            "count": len(transactions),
        },
    }
