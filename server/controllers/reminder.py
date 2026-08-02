from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required

from extensions import db
from models import Reminder, Medication


class ReminderList(Resource):

    @jwt_required()
    def get(self):
        reminders = Reminder.query.all()
        return [r.to_dict() for r in reminders], 200

    @jwt_required()
    def post(self):

        data = request.get_json()

        medication = Medication.query.get(data["medication_id"])

        if not medication:
            return {"message": "Medication not found"}, 404

        reminder = Reminder(
            reminder_time=data["reminder_time"],
            status=data["status"],
            medication_id=data["medication_id"]
        )

        db.session.add(reminder)
        db.session.commit()

        return reminder.to_dict(), 201


class ReminderResource(Resource):

    @jwt_required()
    def get(self, id):

        reminder = Reminder.query.get_or_404(id)

        return reminder.to_dict(), 200


    @jwt_required()
    def patch(self, id):

        reminder = Reminder.query.get_or_404(id)

        data = request.get_json()

        reminder.reminder_time = data.get(
            "reminder_time",
            reminder.reminder_time
        )

        reminder.status = data.get(
            "status",
            reminder.status
        )

        db.session.commit()

        return reminder.to_dict(), 200


    @jwt_required()
    def delete(self, id):

        reminder = Reminder.query.get_or_404(id)

        db.session.delete(reminder)
        db.session.commit()

        return {
            "message": "Reminder deleted successfully"
        }, 200



class PendingReminderList(Resource):

    @jwt_required()
    def get(self):

        reminders = (
            Reminder.query
            .filter(Reminder.status == "Pending")
            .order_by(Reminder.reminder_time.asc())
            .all()
        )

        return [r.to_dict() for r in reminders], 200