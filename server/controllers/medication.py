from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Medication


class MedicationList(Resource):

    @jwt_required()
    def get(self):
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 20, type=int)  # Increased slightly to fetch more records

        medications = Medication.query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        return {
            # 💡 FIX: Manually serialize each object instance using standard key-value assignments
            "data": [
                {
                    "id": med.id,
                    "name": med.name,
                    "dosage": med.dosage,
                    "frequency": med.frequency,
                    "user_id": med.user_id
                } for med in medications.items
            ],
            "page": medications.page,
            "per_page": medications.per_page,
            "total": medications.total,
            "total_pages": medications.pages
        }, 200

    @jwt_required()
    def post(self):
        data = request.get_json()

        # Get the logged-in user's ID
        user_id = int(get_jwt_identity())

        medication = Medication(
            name=data["name"],
            dosage=data["dosage"],
            frequency=data["frequency"],
            user_id=user_id
        )

        db.session.add(medication)
        db.session.commit()

        return {
            "id": medication.id,
            "name": medication.name,
            "dosage": medication.dosage,
            "frequency": medication.frequency,
            "user_id": medication.user_id
        }, 201


class MedicationResource(Resource):

    @jwt_required()
    def get(self, id):
        medication = Medication.query.get_or_404(id)
        return {
            "id": medication.id,
            "name": medication.name,
            "dosage": medication.dosage,
            "frequency": medication.frequency,
            "user_id": medication.user_id
        }, 200

    @jwt_required()
    def patch(self, id):
        medication = Medication.query.get_or_404(id)

        data = request.get_json()

        medication.name = data.get("name", medication.name)
        medication.dosage = data.get("dosage", medication.dosage)
        medication.frequency = data.get("frequency", medication.frequency)

        db.session.commit()

        return {
            "id": medication.id,
            "name": medication.name,
            "dosage": medication.dosage,
            "frequency": medication.frequency,
            "user_id": medication.user_id
        }, 200

    @jwt_required()
    def delete(self, id):
        medication = Medication.query.get_or_404(id)

        db.session.delete(medication)
        db.session.commit()

        return {"message": "Medication deleted successfully"}, 200
