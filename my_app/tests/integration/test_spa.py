from app import create_app
from app.database import db


def test_spa_served(tmp_path):
    app = create_app(SQLALCHEMY_DATABASE_URI="sqlite:///:memory:")
    app.config["TESTING"] = True
    # create a minimal index.html so the route returns 200 without the built SPA
    index_path = tmp_path / "index.html"
    index_path.write_text("<html><body>Project Tracker</body></html>")
    app.static_folder = tmp_path
    with app.app_context():
        db.create_all()
    client = app.test_client()
    res = client.get("/")
    assert res.status_code == 200
    assert b"Project Tracker" in res.data
