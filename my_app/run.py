from app import create_app
from app.database import db

app = create_app()


def init_db():
    with app.app_context():
        db.create_all()


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
