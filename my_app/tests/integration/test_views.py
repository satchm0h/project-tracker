from app import create_app
from app.database import db


def setup_app():
    app = create_app(SQLALCHEMY_DATABASE_URI="sqlite:///:memory:")
    app.config["TESTING"] = True
    with app.app_context():
        db.create_all()
    return app


def test_project_and_leader_endpoints():
    app = setup_app()
    client = app.test_client()

    # create leader
    res = client.post(
        "/api/leaders",
        json={"name": "Alice", "email": "alice@example.com"},
    )
    assert res.status_code == 201
    leader = res.get_json()
    assert leader["name"] == "Alice"

    # list leaders
    res = client.get("/api/leaders")
    assert res.status_code == 200
    assert any(ldr["name"] == "Alice" for ldr in res.get_json())

    # create project
    project_payload = {
        "name": "Project X",
        "description": "Secret",
        "primary_contact_name": "Bob",
        "primary_contact_email": "bob@example.com",
        "url": "http://example.com",
        "development_leader": "Alice",
    }
    res = client.post("/api/projects", json=project_payload)
    assert res.status_code == 201
    project = res.get_json()
    project_id = project["id"]

    # update project
    res = client.put(
        f"/api/projects/{project_id}",
        json={"description": "Updated"},
    )
    assert res.status_code == 200
    assert res.get_json()["description"] == "Updated"

    # delete project
    res = client.delete(f"/api/projects/{project_id}")
    assert res.status_code == 200
    assert res.get_json()["status"] == "deleted"

    # verify deletion
    res = client.get(f"/api/projects/{project_id}")
    assert res.status_code == 404
