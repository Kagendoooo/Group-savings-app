from datetime import datetime
from app.extensions import db

class TransactionType:
    DEPOSIT = 'deposit'
    WITHDRAWAL = 'withdrawal'

class TransactionStatus:
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'deposit' or 'withdrawal'
    status = db.Column(db.String(20), default=TransactionStatus.PENDING)  # 'pending', 'approved', 'rejected'
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='transactions')
    group = db.relationship('Group', back_populates='transactions')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'group_id': self.group_id,
            'amount': self.amount,
            'type': self.type,
            'status': self.status,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'username': self.user.username if self.user else None
        }
