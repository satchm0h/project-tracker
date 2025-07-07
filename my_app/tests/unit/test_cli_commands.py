from app.cli import init_db_command, create_leader_command, seed_data_command, list_projects_command
from app.services import list_leaders, list_projects


def test_init_db_command(runner):
    result = runner.invoke(init_db_command)
    assert result.exit_code == 0
    # running again should still succeed
    result = runner.invoke(init_db_command)
    assert result.exit_code == 0


def test_create_leader_command(runner, app):
    result = runner.invoke(create_leader_command, ["Alice", "alice@example.com"])
    assert result.exit_code == 0
    with app.app_context():
        assert len(list_leaders()) == 1


def test_seed_data_and_list_projects(runner, app):
    result = runner.invoke(seed_data_command)
    assert result.exit_code == 0
    with app.app_context():
        assert len(list_projects()) == 1

    result = runner.invoke(list_projects_command)
    assert result.exit_code == 0
    assert "Example" in result.output
