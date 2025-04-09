from datetime import datetime
from app.extensions import db

class Membership(db.Model):
    __tablename__ = 'memberships'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='memberships')
    group = db.relationship('Group', back_populates='memberships')
    
    # Constraint to ensure a user can only be a member of a group once
    __table_args__ = (db.UniqueConstraint('user_id', 'group_id'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'group_id': self.group_id,
            'is_admin': self.is_admin,
            'joined_at': self.joined_at.isoformat()
        }
