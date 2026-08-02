from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from sqlalchemy import func

from extensions import db
from models import Prescription, Medication, MedicationPrescription


class PrescriptionList(Resource):

    @jwt_required()
    def get(self):
        prescriptions = Prescription.query.all()
        return [p.to_dict() for p in prescriptions], 200


    @jwt_required()
    def post(self):

        data = request.get_json()

        prescription = Prescription(
            doctor_name=data["doctor_name"],
            hospital=data["hospital"],
            image=data.get("image")
        )

        db.session.add(prescription)
        db.session.commit()

        return prescription.to_dict(), 201


class PrescriptionResource(Resource):

    @jwt_required()
    def get(self, id):

        prescription = Prescription.query.get_or_404(id)

        return prescription.to_dict(), 200


    @jwt_required()
    def patch(self, id):

        prescription = Prescription.query.get_or_404(id)

        data = request.get_json()

        prescription.doctor_name = data.get(
            "doctor_name",
            prescription.doctor_name
        )

        prescription.hospital = data.get(
            "hospital",
            prescription.hospital
        )

        prescription.image = data.get(
            "image",
            prescription.image
        )

        db.session.commit()

        return prescription.to_dict(), 200


    @jwt_required()
    def delete(self, id):

        prescription = Prescription.query.get_or_404(id)

        db.session.delete(prescription)
        db.session.commit()

        return {"message": "Prescription deleted"}, 200


class MedicationPrescriptionResource(Resource):

    @jwt_required()
    def post(self):

        data = request.get_json()

        medication = Medication.query.get(data["medication_id"])
        prescription = Prescription.query.get(data["prescription_id"])

        if not medication or not prescription:
            return {
                "message": "Medication or Prescription not found"
            }, 404

        link = MedicationPrescription(
            medication_id=data["medication_id"],
            prescription_id=data["prescription_id"],
            date_added=data["date_added"]
        )

        db.session.add(link)
        db.session.commit()

        return {
            "message": "Medication linked to Prescription"
        }, 201


# --------------------------
# ADVANCED QUERY
# --------------------------

class PrescriptionStatistics(Resource):

    @jwt_required()
    def get(self):

        results = (
            db.session.query(
                Prescription.doctor_name,
                func.count(MedicationPrescription.medication_id).label(
                    "total_medications"
                )
            )
            .join(MedicationPrescription)
            .group_by(Prescription.id)
            .all()
        )

        return [
            {
                "doctor": doctor,
                "total_medications": total
            }
            for doctor, total in results
        ], 200