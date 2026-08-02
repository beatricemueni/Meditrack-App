from extensions import ma
from models.medication import Medication

class MedicationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Medication
        load_instance = True