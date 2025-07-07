from __future__ import annotations

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import NoResultFound

from app.services import (
    create_leader,
    create_project,
    delete_leader,
    delete_project,
    get_leader,
    get_project,
    list_leaders,
    list_projects,
    update_leader,
    update_project,
)

bp = Blueprint("views", __name__)


@bp.route("/api/health")
def health():
    return jsonify({"status": "ok"})


def project_to_dict(project) -> dict:
    """Serialize a Project model to a dictionary."""
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "primary_contact_name": project.primary_contact_name,
        "primary_contact_email": project.primary_contact_email,
        "url": project.url,
        "development_leader": project.development_leader,
    }


def leader_to_dict(leader) -> dict:
    """Serialize a DevelopmentLeader model to a dictionary."""
    return {
        "id": leader.id,
        "name": leader.name,
        "email": leader.email,
    }


@bp.route("/api/projects", methods=["GET", "POST"])
def projects():
    if request.method == "POST":
        data = request.get_json() or {}
        project = create_project(**data)
        return jsonify(project_to_dict(project)), 201

    projects_list = list_projects()
    return jsonify([project_to_dict(p) for p in projects_list])


@bp.route("/api/projects/<int:project_id>", methods=["GET", "PUT", "DELETE"])
def project_detail(project_id: int):
    try:
        if request.method == "GET":
            project = get_project(project_id)
            return jsonify(project_to_dict(project))

        if request.method == "PUT":
            updates = request.get_json() or {}
            project = update_project(project_id, **updates)
            return jsonify(project_to_dict(project))

        delete_project(project_id)
        return jsonify({"status": "deleted"})
    except NoResultFound:
        return jsonify({"error": "not found"}), 404


@bp.route("/api/leaders", methods=["GET", "POST"])
def leaders():
    if request.method == "POST":
        data = request.get_json() or {}
        leader = create_leader(**data)
        return jsonify(leader_to_dict(leader)), 201

    leaders_list = list_leaders()
    return jsonify([leader_to_dict(ldr) for ldr in leaders_list])


@bp.route("/api/leaders/<int:leader_id>", methods=["GET", "PUT", "DELETE"])
def leader_detail(leader_id: int):
    try:
        if request.method == "GET":
            leader = get_leader(leader_id)
            return jsonify(leader_to_dict(leader))

        if request.method == "PUT":
            updates = request.get_json() or {}
            leader = update_leader(leader_id, **updates)
            return jsonify(leader_to_dict(leader))

        delete_leader(leader_id)
        return jsonify({"status": "deleted"})
    except NoResultFound:
        return jsonify({"error": "not found"}), 404
