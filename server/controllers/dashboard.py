from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt

class Dashboard(Resource):

    @jwt_required()
    def get(self):
        claims = get_jwt()

        if claims["role"] != "Admin":
            return {"message": "Admins only"}, 403

        return {
            "message": "Welcome Admin",
            "total_users": 100,
            "total_medications": 50
        }, 200