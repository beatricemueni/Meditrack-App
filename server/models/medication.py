from extensions import db

class Medication(db.Model):
    __tablename__ = "medications"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    dosage = db.Column(db.String(50))
    frequency = db.Column(db.String(50))

    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),nullable=False)

    user = db.relationship("User",back_populates="medications")
    reminders = db.relationship("Reminder",back_populates="medication",cascade="all, delete-orphan")
    medication_prescriptions = db.relationship("MedicationPrescription",back_populates="medication", cascade="all, delete-orphan")