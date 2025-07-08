from app import create_app
from app.database import db


def test_spa_served():
    app = create_app(SQLALCHEMY_DATABASE_URI="sqlite:///:memory:")
    app.config["TESTING"] = True
    with app.app_context():
        db.create_all()
    client = app.test_client()
    res = client.get("/")
    assert res.status_code == 200
    assert b"Project Tracker" in res.data
