from extensions import ma
from models.medication_prescription import MedicationPrescription


class MedicationPrescriptionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = MedicationPrescription
        load_instance = True


medication_prescription_schema = MedicationPrescriptionSchema()
medication_prescriptions_schema = MedicationPrescriptionSchema(many=True)