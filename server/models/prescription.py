from extensions import db


class Prescription(db.Model):
    __tablename__ = "prescriptions"

    id = db.Column(db.Integer, primary_key=True)
    doctor_name = db.Column(db.String(100))
    hospital = db.Column(db.String(150))
    image = db.Column(db.String(255))
    medication_prescriptions = db.relationship("MedicationPrescription", back_populates="prescription",cascade="all, delete-orphan")