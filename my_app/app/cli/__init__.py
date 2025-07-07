import click
from flask.cli import with_appcontext

from app.database import db
from app.services import create_leader, create_project, list_projects


@click.command("init-db")
@with_appcontext
def init_db_command():
    db.create_all()
    click.echo("Initialized the database.")


@click.command("create-leader")
@click.argument("name")
@click.argument("email")
@with_appcontext
def create_leader_command(name: str, email: str) -> None:
    """Create a development leader."""
    leader = create_leader(name=name, email=email)
    click.echo(f"Created leader {leader.name} (id={leader.id})")


@click.command("list-projects")
@with_appcontext
def list_projects_command() -> None:
    """List all projects."""
    projects = list_projects()
    for project in projects:
        click.echo(f"{project.id}: {project.name}")


@click.command("seed-data")
@with_appcontext
def seed_data_command() -> None:
    """Insert initial example data."""
    leader = create_leader(name="Alice", email="alice@example.com")
    create_project(
        name="Example",
        description="A sample project",
        primary_contact_name="Bob",
        primary_contact_email="bob@example.com",
        url="http://example.com",
        development_leader=leader.name,
    )
    click.echo("Seed data inserted.")


def register(app):
    app.cli.add_command(init_db_command)
    app.cli.add_command(create_leader_command)
    app.cli.add_command(list_projects_command)
    app.cli.add_command(seed_data_command)
