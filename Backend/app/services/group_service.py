from app.models.group import Group
from app.models.membership import Membership
from app.extensions import db

def create_group(user_id, data):
    """
    Create a new savings group
    """
    name = data.get('name')
    description = data.get('description', '')
    target_amount = float(data.get('target_amount', 0))
    
    # Create group
    group = Group(
        name=name,
        description=description,
        target_amount=target_amount,
        current_amount=0.0,
        created_by=user_id
    )
    
    db.session.add(group)
    db.session.flush()  # Flush to get the group ID
    
    # Create membership for the creator (as admin)
    membership = Membership(
        user_id=user_id,
        group_id=group.id,
        is_admin=True
    )
    
    db.session.add(membership)
    db.session.commit()
    
    return group

def get_user_groups(user_id):
    """
    Get all groups a user belongs to
    """
    memberships = Membership.query.filter_by(user_id=user_id).all()
    group_ids = [m.group_id for m in memberships]
    return Group.query.filter(Group.id.in_(group_ids)).all()

def get_group_by_id(group_id, user_id):
    """
    Get a specific group if the user is a member
    """
    # Check if user is a member of the group
    membership = Membership.query.filter_by(
        user_id=user_id, 
        group_id=group_id
    ).first()
    
    if not membership:
        return None
    
    return Group.query.get(group_id)

def update_group(group_id, user_id, data):
    """
    Update a group's information if the user is an admin
    """
    # Check if user is an admin of the group
    membership = Membership.query.filter_by(
        user_id=user_id, 
        group_id=group_id,
        is_admin=True
    ).first()
    
    if not membership:
        raise ValueError("You don't have permission to update this group")
    
    group = Group.query.get(group_id)
    if not group:
        raise ValueError("Group not found")
    
    # Update fields if they are provided
    if 'name' in data:
        group.name = data['name']
    
    if 'description' in data:
        group.description = data['description']
    
    if 'target_amount' in data:
        group.target_amount = float(data['target_amount'])
    
    db.session.commit()
    return group

def delete_group(group_id, user_id):
    """
    Delete a group if the user is an admin
    """
    # Check if user is an admin of the group
    membership = Membership.query.filter_by(
        user_id=user_id, 
        group_id=group_id,
        is_admin=True
    ).first()
    
    if not membership:
        raise ValueError("You don't have permission to delete this group")
    
    group = Group.query.get(group_id)
    if not group:
        raise ValueError("Group not found")
    
    db.session.delete(group)
    db.session.commit()

def join_group(group_id, user_id):
    """
    Join a savings group
    """
    # Check if group exists
    group = Group.query.get(group_id)
    if not group:
        raise ValueError("Group not found")
    
    # Check if user is already a member
    existing_membership = Membership.query.filter_by(
        user_id=user_id,
        group_id=group_id
    ).first()
    
    if existing_membership:
        raise ValueError("You are already a member of this group")
    
    # Create new membership
    membership = Membership(
        user_id=user_id,
        group_id=group_id,
        is_admin=False
    )
    
    db.session.add(membership)
    db.session.commit()
    
    return membership

def leave_group(group_id, user_id):
    """
    Leave a savings group
    """
    # Check if user is a member
    membership = Membership.query.filter_by(
        user_id=user_id,
        group_id=group_id
    ).first()
    
    if not membership:
        raise ValueError("You are not a member of this group")
    
    # Check if the user is the admin and if they're the only admin
    if membership.is_admin:
        admin_count = Membership.query.filter_by(
            group_id=group_id,
            is_admin=True
        ).count()
        
        if admin_count == 1:
            # Check if there are other members
            member_count = Membership.query.filter_by(group_id=group_id).count()
            
            if member_count > 1:
                raise ValueError("You cannot leave the group as you are the only admin. Please make someone else an admin first.")
    
    db.session.delete(membership)
    db.session.commit()
