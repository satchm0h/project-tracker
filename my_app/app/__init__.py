import os

from flask import Flask

from .database import db


def create_app(config_object: str | None = "app.config.Config", **overrides):
    static_folder = os.path.join(os.path.dirname(__file__), "..", "static")
    app = Flask(__name__, static_folder=static_folder, static_url_path="/")
    if config_object:
        app.config.from_object(config_object)
    if overrides:
        app.config.update(overrides)

    db.init_app(app)

    from .cli import register as register_cli
    from .views import bp as views_bp

    app.register_blueprint(views_bp)
    register_cli(app)

    @app.route("/")
    def index():
        """Serve the compiled SPA entry point."""
        return app.send_static_file("index.html")

    return app
