from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.schemas import TransactionCreate
from app.schemas import TransactionUpdate

from app.database import SessionLocal
from app.models import Transaction, User
from app.routes.auth import get_current_user
from fastapi import HTTPException


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
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_txn = Transaction(
        amount=transaction.amount,
        description=transaction.description,
        type=transaction.type,
        transaction_date=transaction.transaction_date,
        user_id=current_user.id,
        payment_method=transaction.payment_method,
        category=transaction.category,
    )

    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)

    return {
        "message": "Transaction created",
        "transaction": {
            "id": new_txn.id,
            "amount": new_txn.amount,
            "description": new_txn.description,
            "type": new_txn.type,
            "transaction_date": new_txn.transaction_date,
            "payment_method": new_txn.payment_method,
            "category": new_txn.category,
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
# -----------------------
# DELETE TRANSACTIONS
# -----------------------


@router.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id,
        )
        .first()
    )

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()

    return {"message": "Transaction deleted successfully"}


@router.put("/transactions/{transaction_id}")
def update_transaction(
    transaction_id: int,
    updated_transaction: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id,
        )
        .first()
    )

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction.amount = updated_transaction.amount
    transaction.description = updated_transaction.description
    transaction.type = updated_transaction.type
    transaction.transaction_date = updated_transaction.transaction_date
    transaction.payment_method = updated_transaction.payment_method
    transaction.category = updated_transaction.category

    db.commit()
    db.refresh(transaction)

    return {
        "message": "Transaction updated successfully",
        "transaction": transaction,
    }


@router.get("/reports")
def get_report(
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
        "start_date": start_date,
        "end_date": end_date,
        "cash_income": cash_income,
        "bank_income": bank_income,
        "total_income": total_income,
        "cash_expense": cash_expense,
        "bank_expense": bank_expense,
        "total_expense": total_expense,
        "till_balance": till_balance,
        "bank_balance": bank_balance,
        "net_profit": net_profit,
        "transaction_count": len(transactions),
    }
