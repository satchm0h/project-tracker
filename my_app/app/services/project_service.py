from __future__ import annotations

from sqlalchemy.exc import NoResultFound

from app.database import db
from app.models import Project


def create_project(
    *,
    name: str,
    description: str,
    primary_contact_name: str,
    primary_contact_email: str,
    url: str | None = None,
    development_leader: str,
) -> Project:
    """Create and persist a new Project."""
    project = Project(
        name=name,
        description=description,
        primary_contact_name=primary_contact_name,
        primary_contact_email=primary_contact_email,
        url=url,
        development_leader=development_leader,
    )
    db.session.add(project)
    db.session.commit()
    return project


def get_project(project_id: int) -> Project:
    """Return a project by its ID."""
    project = Project.query.get(project_id)
    if project is None:
        raise NoResultFound(f"Project id {project_id} not found")
    return project


def list_projects() -> list[Project]:
    """Return all projects."""
    return Project.query.all()


def update_project(project_id: int, **updates) -> Project:
    """Update an existing project and return it."""
    project = get_project(project_id)
    for field, value in updates.items():
        if hasattr(project, field):
            setattr(project, field, value)
    db.session.commit()
    return project


def delete_project(project_id: int) -> None:
    """Delete a project by ID."""
    project = get_project(project_id)
    db.session.delete(project)
    db.session.commit()
