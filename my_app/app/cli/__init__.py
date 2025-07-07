import click
from flask.cli import with_appcontext

from app.database import db


@click.command("init-db")
@with_appcontext
def init_db_command():
    db.create_all()
    click.echo("Initialized the database.")


def register(app):
    app.cli.add_command(init_db_command)
