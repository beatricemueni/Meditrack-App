from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models import Prescription


class PrescriptionList(Resource):

    @jwt_required()
    def get(self):
        # 💡 FIX: Safely retrieve and serialize your prescriptions data mapping
        prescriptions = Prescription.query.all()
        
        return [
            {
                "id": p.id,
                "prescription_id": p.id,
                "doctor_name": p.doctor_name if hasattr(p, 'doctor_name') else "Primary Physician",
                "date_issued": str(p.date_issued) if hasattr(p, 'date_issued') and p.date_issued else "Not Specified",
                "instructions": p.instructions if hasattr(p, 'instructions') else "Take as directed by doctor.",
                # If your Prescription model links to medications, it can map them as strings
                "medications": [med.name for med in p.medications] if hasattr(p, 'medications') and p.medications else []
            } for p in prescriptions
        ], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = int(get_jwt_identity())

        prescription = Prescription(
            doctor_name=data.get("doctor_name"),
            instructions=data.get("instructions"),
            user_id=user_id
        )

        db.session.add(prescription)
        db.session.commit()

        return {
            "id": prescription.id,
            "prescription_id": prescription.id,
            "doctor_name": prescription.doctor_name,
            "instructions": prescription.instructions
        }, 201


class PrescriptionResource(Resource):

    @jwt_required()
    def get(self, id):
        prescription = Prescription.query.get_or_404(id)
        return {
            "id": prescription.id,
            "prescription_id": prescription.id,
            "doctor_name": getattr(prescription, 'doctor_name', 'Primary Physician'),
            "instructions": getattr(prescription, 'instructions', 'Take as directed.')
        }, 200

    @jwt_required()
    def patch(self, id):
        prescription = Prescription.query.get_or_404(id)
        data = request.get_json()

        if hasattr(prescription, 'doctor_name'):
            prescription.doctor_name = data.get("doctor_name", prescription.doctor_name)
        if hasattr(prescription, 'instructions'):
            prescription.instructions = data.get("instructions", prescription.instructions)

        db.session.commit()

        return {
            "id": prescription.id,
            "prescription_id": prescription.id,
            "doctor_name": getattr(prescription, 'doctor_name', 'Primary Physician'),
            "instructions": getattr(prescription, 'instructions', 'Take as directed.')
        }, 200

    @jwt_required()
    def delete(self, id):
        prescription = Prescription.query.get_or_404(id)
        db.session.delete(prescription)
        db.session.commit()
        return {"message": "Prescription deleted successfully"}, 200
