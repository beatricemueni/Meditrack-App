from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token

from extensions import db, bcrypt
from models import User, Role


class Register(Resource):

    def post(self):

        data = request.get_json()

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return {"message": "All fields are required"}, 400

        existing_user = User.query.filter_by(email=email).first()

        if existing_user:
            return {"message": "Email already exists"}, 400

        user_role = Role.query.filter_by(name="user").first()

        if not user_role:
            return {"message": "Default role not found"}, 500

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        user = User(
            username=username,
            email=email,
            password_hash=hashed_password,
            role_id=user_role.id
        )

        db.session.add(user)
        db.session.commit()

        return {
            "message": "User registered successfully"
        }, 201


class Login(Resource):

    def post(self):

        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()

        if not user:
            return {"message": "Invalid email or password"}, 401

        if not bcrypt.check_password_hash(user.password_hash, password):
            return {"message": "Invalid email or password"}, 401

        token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role.name}
        )

        return {
            "access_token": token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.name
            }
        }, 200