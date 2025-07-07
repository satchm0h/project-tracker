from app import create_app
from app.database import db
from app.services import (
    create_leader,
    create_project,
    get_project,
    list_leaders,
    list_projects,
)


def setup_app():
    app = create_app(SQLALCHEMY_DATABASE_URI="sqlite:///:memory:")
    app.config["TESTING"] = True
    with app.app_context():
        db.create_all()
    return app


def test_create_leader_and_project():
    app = setup_app()
    with app.app_context():
        leader = create_leader(name="Alice", email="alice@example.com")
        project = create_project(
            name="Example",
            description="A sample project",
            primary_contact_name="Bob",
            primary_contact_email="bob@example.com",
            url="http://example.com",
            development_leader=leader.name,
        )
        assert leader in list_leaders()
        assert project in list_projects()
        assert get_project(project.id).leader == leader
