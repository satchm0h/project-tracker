import pytest
from sqlalchemy.exc import NoResultFound

from app.services import (
    create_leader,
    delete_leader,
    get_leader,
    list_leaders,
    update_leader,
)


def test_create_and_list_leaders(app):
    with app.app_context():
        leader = create_leader(name="Alice", email="alice@example.com")
        leaders = list_leaders()
        assert leader in leaders


def test_get_update_delete_leader(app):
    with app.app_context():
        leader = create_leader(name="Bob", email="bob@example.com")
        fetched = get_leader(leader.id)
        assert fetched.email == "bob@example.com"

        updated = update_leader(leader.id, email="bobby@example.com")
        assert updated.email == "bobby@example.com"

        delete_leader(leader.id)
        with pytest.raises(NoResultFound):
            get_leader(leader.id)
