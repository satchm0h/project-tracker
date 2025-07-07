from flask import Flask

from .database import db


def create_app(config_object: str | None = "app.config.Config", **overrides):
    app = Flask(__name__)
    if config_object:
        app.config.from_object(config_object)
    if overrides:
        app.config.update(overrides)

    db.init_app(app)

    from .cli import register as register_cli
    from .views import bp as views_bp

    app.register_blueprint(views_bp)
    register_cli(app)

    return app
