from .database import db


class DevelopmentLeader(db.Model):  # type: ignore[name-defined]
    """Represents a leader in charge of development projects."""

    __tablename__ = "development_leader"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False)

    projects = db.relationship(
        "Project",
        back_populates="leader",
        primaryjoin="Project.development_leader == DevelopmentLeader.name",
    )


class Project(db.Model):  # type: ignore[name-defined]
    """A project belonging to a development team."""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=False)
    primary_contact_name = db.Column(db.String(120), nullable=False)
    primary_contact_email = db.Column(db.String(120), nullable=False)
    url = db.Column(db.String(255))

    development_leader = db.Column(
        db.String(120),
        db.ForeignKey("development_leader.name"),
        nullable=False,
    )

    leader = db.relationship(
        "DevelopmentLeader",
        back_populates="projects",
        primaryjoin="Project.development_leader == DevelopmentLeader.name",
    )
