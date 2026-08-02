from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt

from models.user import User
from schema.user_schema import UserSchema

users_schema = UserSchema(many=True)

class UserList(Resource):

    @jwt_required()
    def get(self):
        claims = get_jwt()

        if claims["role"] != "Admin":
            return {"message": "Admins only"}, 403

        users = User.query.all()
        return users_schema.dump(users), 200