from click.testing import CliRunner

from app import create_app
from app.cli import (
    create_leader_command,
    list_projects_command,
    seed_data_command,
)
from app.database import db
from app.services import list_leaders


def setup_app():
    app = create_app(SQLALCHEMY_DATABASE_URI="sqlite:///:memory:")
    app.config["TESTING"] = True
    with app.app_context():
        db.create_all()
    return app


def test_create_leader_command():
    app = setup_app()
    runner = CliRunner()
    with app.app_context():
        result = runner.invoke(
            create_leader_command,
            ["Alice", "alice@example.com"],
        )
        assert result.exit_code == 0
        assert len(list_leaders()) == 1


def test_seed_data_and_list_projects():
    app = setup_app()
    runner = CliRunner()
    with app.app_context():
        result = runner.invoke(seed_data_command)
        assert result.exit_code == 0
        result = runner.invoke(list_projects_command)
        assert result.exit_code == 0
        assert "Example" in result.output
