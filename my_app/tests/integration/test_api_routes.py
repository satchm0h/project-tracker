import pytest


def test_leader_routes(client, app):
    res = client.post("/api/leaders", json={"name": "Alice", "email": "a@e.com"})
    assert res.status_code == 201
    leader_id = res.get_json()["id"]

    res = client.get("/api/leaders")
    assert any(ldr["id"] == leader_id for ldr in res.get_json())

    res = client.get(f"/api/leaders/{leader_id}")
    assert res.status_code == 200

    res = client.put(f"/api/leaders/{leader_id}", json={"email": "new@e.com"})
    assert res.get_json()["email"] == "new@e.com"

    res = client.delete(f"/api/leaders/{leader_id}")
    assert res.get_json()["status"] == "deleted"

    res = client.get(f"/api/leaders/{leader_id}")
    assert res.status_code == 404


def test_project_routes(client, app):
    # create leader first
    leader = client.post(
        "/api/leaders", json={"name": "Bob", "email": "b@e.com"}
    ).get_json()

    payload = {
        "name": "Proj",
        "description": "Desc",
        "primary_contact_name": "PC",
        "primary_contact_email": "pc@e.com",
        "development_leader": leader["name"],
    }
    res = client.post("/api/projects", json=payload)
    assert res.status_code == 201
    proj_id = res.get_json()["id"]

    res = client.get("/api/projects")
    assert any(p["id"] == proj_id for p in res.get_json())

    res = client.get(f"/api/projects/{proj_id}")
    assert res.get_json()["name"] == "Proj"

    res = client.put(f"/api/projects/{proj_id}", json={"description": "Up"})
    assert res.get_json()["description"] == "Up"

    res = client.delete(f"/api/projects/{proj_id}")
    assert res.get_json()["status"] == "deleted"

    res = client.get(f"/api/projects/{proj_id}")
    assert res.status_code == 404
