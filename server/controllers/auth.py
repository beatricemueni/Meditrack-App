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
        
        
        role_name = data.get("role", "user") 

        if not username or not email or not password:
            return {"message": "All fields are required"}, 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {"message": "Email already exists"}, 400

    
        user_role = Role.query.filter(Role.name.ilike(role_name)).first()

        
        if not user_role:
            user_role = Role.query.first()
            if not user_role:
                return {"message": "Roles are not initialized. Please seed your database roles first."}, 500

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        user = User(
            username=username,
            email=email,
            password_hash=hashed_password,
            role_id=user_role.id
        )

        try:
            db.session.add(user)
            db.session.commit()

        
            token = create_access_token(
                identity=str(user.id),
                additional_claims={"role": user_role.name.lower()}
            )

    
            return {
                "token": token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user_role.name.lower()
                }
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {"message": f"Internal database commit error: {str(e)}"}, 500


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
            additional_claims={"role": user.role.name.lower()}
        )

        return {
            "token": token, 
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role.name.lower() 
            }
        }, 200
