from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required

from extensions import db
from models import Reminder, Medication


class ReminderList(Resource):

    @jwt_required()
    def get(self):
        reminders = Reminder.query.all()
        # 💡 FIX: Manually serialize columns and map database names to frontend property expectations
        return [
            {
                "id": r.id,
                "time": str(r.reminder_time)[:5] if r.reminder_time else "00:00", # Formats 'HH:MM:SS' down to 'HH:MM'
                "is_taken": r.status == "Taken" or r.status == "Completed",      # Evaluates status string into a boolean flag
                "medication_name": r.medication.name if r.medication else "Unknown Medication",
                "dosage_instructions": f"Take with water • Dosage: {r.medication.dosage}" if r.medication else ""
            } for r in reminders
        ], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        medication = Medication.query.get(data["medication_id"])

        if not medication:
            return {"message": "Medication not found"}, 404

        reminder = Reminder(
            reminder_time=data["reminder_time"],
            status=data.get("status", "Pending"),
            medication_id=data["medication_id"]
        )

        db.session.add(reminder)
        db.session.commit()

        return {
            "id": reminder.id,
            "time": str(reminder.reminder_time)[:5] if reminder.reminder_time else "00:00",
            "is_taken": reminder.status == "Taken" or reminder.status == "Completed",
            "medication_name": medication.name
        }, 201


class ReminderResource(Resource):

    @jwt_required()
    def get(self, id):
        reminder = Reminder.query.get_or_404(id)
        return {
            "id": reminder.id,
            "time": str(reminder.reminder_time)[:5] if reminder.reminder_time else "00:00",
            "is_taken": reminder.status == "Taken" or reminder.status == "Completed",
            "medication_name": reminder.medication.name if reminder.medication else "Unknown Medication"
        }, 200

    @jwt_required()
    def patch(self, id):
        reminder = Reminder.query.get_or_404(id)
        data = request.get_json()

        reminder.reminder_time = data.get("reminder_time", reminder.reminder_time)
        reminder.status = data.get("status", reminder.status)

        db.session.commit()

        return {
            "id": reminder.id,
            "time": str(reminder.reminder_time)[:5] if reminder.reminder_time else "00:00",
            "is_taken": reminder.status == "Taken" or reminder.status == "Completed",
            "medication_name": reminder.medication.name if reminder.medication else "Unknown Medication"
        }, 200

    @jwt_required()
    def delete(self, id):
        reminder = Reminder.query.get_or_404(id)
        db.session.delete(reminder)
        db.session.commit()
        return {"message": "Reminder deleted successfully"}, 200


class PendingReminderList(Resource):

    @jwt_required()
    def get(self):
        reminders = (
            Reminder.query
            .filter(Reminder.status == "Pending")
            .order_by(Reminder.reminder_time.asc())
            .all()
        )
        return [
            {
                "id": r.id,
                "time": str(r.reminder_time)[:5] if r.reminder_time else "00:00",
                "is_taken": False,
                "medication_name": r.medication.name if r.medication else "Unknown Medication",
                "dosage_instructions": f"Take with water • Dosage: {r.medication.dosage}" if r.medication else ""
            } for r in reminders
        ], 200
