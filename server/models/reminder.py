from extensions import db

class Reminder(db.Model):
    __tablename__ = "reminders"

    id = db.Column(db.Integer, primary_key=True)
    reminder_time = db.Column(db.String(20))
    status = db.Column(db.String(20))

    medication_id = db.Column(db.Integer,db.ForeignKey("medications.id"),nullable=False)

    medication = db.relationship("Medication",back_populates="reminders")