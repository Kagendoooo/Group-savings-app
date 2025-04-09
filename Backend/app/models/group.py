from datetime import datetime
from app.extensions import db

class Group(db.Model):
    __tablename__ = 'groups'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    target_amount = db.Column(db.Float, default=0.0)
    current_amount = db.Column(db.Float, default=0.0)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', back_populates='created_groups')
    memberships = db.relationship('Membership', back_populates='group', cascade='all, delete-orphan')
    transactions = db.relationship('Transaction', back_populates='group', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'target_amount': self.target_amount,
            'current_amount': self.current_amount,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat(),
            'progress': round((self.current_amount / self.target_amount * 100), 2) if self.target_amount > 0 else 0
        }
