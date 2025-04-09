from app.models.transaction import Transaction, TransactionType, TransactionStatus
from app.models.group import Group
from app.models.membership import Membership
from app.extensions import db

def create_contribution(user_id, group_id, amount, description=""):
    """
    Create a contribution transaction (deposit)
    """
    # Validate amount
    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
    except ValueError:
        raise ValueError("Amount must be a positive number")
    
    # Check if user is a member of the group
    membership = Membership.query.filter_by(
        user_id=user_id,
        group_id=group_id
    ).first()
    
    if not membership:
        raise ValueError("You are not a member of this group")
    
    # Get the group
    group = Group.query.get(group_id)
    if not group:
        raise ValueError("Group not found")
    
    # Create transaction
    transaction = Transaction(
        user_id=user_id,
        group_id=group_id,
        amount=amount,
        type=TransactionType.DEPOSIT,
        status=TransactionStatus.APPROVED,  # Deposits are auto-approved
        description=description
    )
    
    # Update group's current amount
    group.current_amount += amount
    
    db.session.add(transaction)
    db.session.commit()
    
    return transaction

def request_withdrawal(user_id, group_id, amount, description=""):
    """
    Create a withdrawal request
    """
    # Validate amount
    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError
    except ValueError:
        raise ValueError("Amount must be a positive number")
    
    # Check if user is a member of the group
    membership = Membership.query.filter_by(
        user_id=user_id,
        group_id=group_id
    ).first()
    
    if not membership:
        raise ValueError("You are not a member of this group")
    
    # Get the group
    group = Group.query.get(group_id)
    if not group:
        raise ValueError("Group not found")
    
    # Check if group has enough funds
    if amount > group.current_amount:
        raise ValueError("The group doesn't have enough funds for this withdrawal")
    
    # Create transaction
    transaction = Transaction(
        user_id=user_id,
        group_id=group_id,
        amount=amount,
        type=TransactionType.WITHDRAWAL,
        status=TransactionStatus.PENDING,
        description=description
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return transaction

def update_withdrawal_status(transaction_id, admin_id, status):
    """
    Update the status of a withdrawal request
    """
    # Get the transaction
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        raise ValueError("Transaction not found")
    
    # Ensure it's a withdrawal request
    if transaction.type != TransactionType.WITHDRAWAL:
        raise ValueError("This is not a withdrawal request")
    
    # Ensure the status is valid
    if status not in [TransactionStatus.APPROVED, TransactionStatus.REJECTED]:
        raise ValueError("Invalid status")
    
    # Check if the admin is actually an admin of the group
    admin_membership = Membership.query.filter_by(
        user_id=admin_id,
        group_id=transaction.group_id,
        is_admin=True
    ).first()
    
    if not admin_membership:
        raise ValueError("You don't have permission to approve/reject withdrawals")
    
    # Update the transaction status
    transaction.status = status
    
    # If approved, update the group's current amount
    if status == TransactionStatus.APPROVED:
        group = Group.query.get(transaction.group_id)
        group.current_amount -= transaction.amount
    
    db.session.commit()
    
    return transaction

def get_transactions_by_group(group_id, user_id):
    """
    Get all transactions for a group
    """
    # Check if user is a member of the group
    membership = Membership.query.filter_by(
        user_id=user_id,
        group_id=group_id
    ).first()
    
    if not membership:
        raise ValueError("You are not a member of this group")
    
    return Transaction.query.filter_by(group_id=group_id).order_by(Transaction.created_at.desc()).all()

def get_transaction_by_id(transaction_id, user_id):
    """
    Get a specific transaction if the user has access
    """
    transaction = Transaction.query.get(transaction_id)
    if not transaction:
        return None
    
    # Check if user is a member of the group
    membership = Membership.query.filter_by(
        user_id=user_id,
        group_id=transaction.group_id
    ).first()
    
    if not membership:
        return None
    
    return transaction
