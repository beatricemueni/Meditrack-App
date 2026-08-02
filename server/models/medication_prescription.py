from extensions import db

class MedicationPrescription(db.Model,):
    __tablename__ = "medication_prescriptions"

    medication_id = db.Column(db.Integer,db.ForeignKey("medications.id"),primary_key=True)

    prescription_id = db.Column(db.Integer,db.ForeignKey("prescriptions.id"),primary_key=True)

    date_added = db.Column(db.Date)
    medication = db.relationship("Medication",back_populates="medication_prescriptions")
    prescription = db.relationship("Prescription",back_populates="medication_prescriptions")