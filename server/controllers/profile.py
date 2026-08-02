from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Profile


class ProfileResource(Resource):

    @jwt_required()
    def get(self):
        user_id = int(get_jwt_identity())

        profile = Profile.query.filter_by(user_id=user_id).first()

        if not profile:
            return {"message": "Profile not found"}, 404

        return profile.to_dict(), 200

    @jwt_required()
    def post(self):
        user_id = int(get_jwt_identity())

        if Profile.query.filter_by(user_id=user_id).first():
            return {"message": "Profile already exists"}, 400

        data = request.get_json()

        profile = Profile(
            fullname=data["fullname"],
            age=data["age"],
            phone=data["phone"],
            user_id=user_id
        )

        db.session.add(profile)
        db.session.commit()

        return profile.to_dict(), 201

    @jwt_required()
    def patch(self):
        user_id = int(get_jwt_identity())

        profile = Profile.query.filter_by(user_id=user_id).first()

        if not profile:
            return {"message": "Profile not found"}, 404

        data = request.get_json()

        profile.fullname = data.get("fullname", profile.fullname)
        profile.age = data.get("age", profile.age)
        profile.phone = data.get("phone", profile.phone)

        db.session.commit()

        return profile.to_dict(), 200

    @jwt_required()
    def delete(self):
        user_id = int(get_jwt_identity())

        profile = Profile.query.filter_by(user_id=user_id).first()

        if not profile:
            return {"message": "Profile not found"}, 404

        db.session.delete(profile)
        db.session.commit()

        return {"message": "Profile deleted"}, 200