from extensions import ma
from models.prescription import Prescription

class PrescriptionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Prescription
        load_instance = True