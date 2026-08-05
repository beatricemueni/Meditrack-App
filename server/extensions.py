from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_restful import Api

# Database
db = SQLAlchemy()

# Migrations
migrate = Migrate()

# Authentication
bcrypt = Bcrypt()
jwt = JWTManager()

# CORS
cors = CORS()

# Marshmallow
ma = Marshmallow()

# Flask-RESTful API
api = Api(prefix="")