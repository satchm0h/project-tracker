from flask import Flask

from .database import db


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    db.init_app(app)

    from .cli import register as register_cli
    from .views import bp as views_bp

    app.register_blueprint(views_bp)
    register_cli(app)

    return app
