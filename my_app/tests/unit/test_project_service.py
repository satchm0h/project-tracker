import pytest
from sqlalchemy.exc import NoResultFound

from app.services import (
    create_leader,
    create_project,
    delete_project,
    get_project,
    list_projects,
    update_project,
)


def test_create_and_list_projects(app):
    with app.app_context():
        leader = create_leader(name="Alice", email="alice@example.com")
        project = create_project(
            name="Example",
            description="A sample project",
            primary_contact_name="Bob",
            primary_contact_email="bob@example.com",
            development_leader=leader.name,
        )
        projects = list_projects()
        assert project in projects


def test_get_update_delete_project(app):
    with app.app_context():
        leader = create_leader(name="Carol", email="carol@example.com")
        project = create_project(
            name="Demo",
            description="Test",
            primary_contact_name="Dan",
            primary_contact_email="dan@example.com",
            development_leader=leader.name,
        )
        fetched = get_project(project.id)
        assert fetched.name == "Demo"

        updated = update_project(project.id, description="Updated")
        assert updated.description == "Updated"

        delete_project(project.id)
        with pytest.raises(NoResultFound):
            get_project(project.id)
