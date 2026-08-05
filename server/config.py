import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


def _get_database_uri():
    uri = os.environ.get("DATABASE_URI") or os.environ.get("DATABASE_URL")

    if not uri:
        return f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}"

    if uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    return uri


class Config:
    SQLALCHEMY_DATABASE_URI = _get_database_uri()

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get("SECRET_KEY", "local_development_fallback_secret_123")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "local_jwt_fallback_secret_456")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)