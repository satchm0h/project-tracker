from app import create_app
from app.database import db
from app.models import DevelopmentLeader, Project


def test_create_project_with_leader():
    app = create_app(SQLALCHEMY_DATABASE_URI="sqlite:///:memory:")
    with app.app_context():
        db.create_all()
        leader = DevelopmentLeader(name="Alice", email="alice@example.com")
        db.session.add(leader)
        db.session.commit()

        project = Project(
            name="Example",
            description="A sample project",
            primary_contact_name="Bob",
            primary_contact_email="bob@example.com",
            url="http://example.com",
            development_leader="Alice",
        )
        db.session.add(project)
        db.session.commit()

        fetched = Project.query.filter_by(name="Example").one()
        assert fetched.leader.name == "Alice"
