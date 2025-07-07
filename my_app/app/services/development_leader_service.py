from __future__ import annotations

from sqlalchemy.exc import NoResultFound

from app.database import db
from app.models import DevelopmentLeader


def create_leader(*, name: str, email: str) -> DevelopmentLeader:
    """Create and persist a new DevelopmentLeader."""
    leader = DevelopmentLeader(name=name, email=email)
    db.session.add(leader)
    db.session.commit()
    return leader


def get_leader(leader_id: int) -> DevelopmentLeader:
    """Return a leader by ID."""
    leader = DevelopmentLeader.query.get(leader_id)
    if leader is None:
        raise NoResultFound(f"Leader id {leader_id} not found")
    return leader


def list_leaders() -> list[DevelopmentLeader]:
    """Return all leaders."""
    return DevelopmentLeader.query.all()


def update_leader(leader_id: int, **updates) -> DevelopmentLeader:
    """Update an existing leader and return it."""
    leader = get_leader(leader_id)
    for field, value in updates.items():
        if hasattr(leader, field):
            setattr(leader, field, value)
    db.session.commit()
    return leader


def delete_leader(leader_id: int) -> None:
    """Delete a leader by ID."""
    leader = get_leader(leader_id)
    db.session.delete(leader)
    db.session.commit()
