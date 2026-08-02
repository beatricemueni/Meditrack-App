from datetime import date

from app import app
from extensions import db, bcrypt
from models import (
    Role,
    User,
    Profile,
    Medication,
    Reminder,
    Prescription,
    MedicationPrescription,
)

with app.app_context():

    print("Deleting old data...")

    MedicationPrescription.query.delete()
    Reminder.query.delete()
    Prescription.query.delete()
    Medication.query.delete()
    Profile.query.delete()
    User.query.delete()
    Role.query.delete()

    db.session.commit()

    print("Creating roles...")

    admin_role = Role(
        name="admin",
        description="System administrator"
    )

    user_role = Role(
        name="user",
        description="Regular application user"
    )

    db.session.add_all([admin_role, user_role])
    db.session.commit()

    print("Creating users...")

    admin = User(
        username="admin",
        email="admin@gmail.com",
        password_hash=bcrypt.generate_password_hash("admin123").decode("utf-8"),
        role_id=admin_role.id
    )

    user1 = User(
        username="john",
        email="john@gmail.com",
        password_hash=bcrypt.generate_password_hash("password123").decode("utf-8"),
        role_id=user_role.id
    )

    user2 = User(
        username="mary",
        email="mary@gmail.com",
        password_hash=bcrypt.generate_password_hash("password123").decode("utf-8"),
        role_id=user_role.id
    )

    db.session.add_all([admin, user1, user2])
    db.session.commit()

    print("Creating profiles...")

    profiles = [
        Profile(
            fullname="System Admin",
            age=30,
            phone="0700000000",
            user_id=admin.id
        ),
        Profile(
            fullname="John Doe",
            age=27,
            phone="0711111111",
            user_id=user1.id
        ),
        Profile(
            fullname="Mary Jane",
            age=25,
            phone="0722222222",
            user_id=user2.id
        )
    ]

    db.session.add_all(profiles)
    db.session.commit()

    print("Creating medications...")

    med1 = Medication(
        name="Paracetamol",
        dosage="500mg",
        frequency="Twice Daily",
        user_id=user1.id
    )

    med2 = Medication(
        name="Amoxicillin",
        dosage="250mg",
        frequency="Three Times Daily",
        user_id=user1.id
    )

    med3 = Medication(
        name="Ibuprofen",
        dosage="400mg",
        frequency="Once Daily",
        user_id=user2.id
    )

    db.session.add_all([med1, med2, med3])
    db.session.commit()

    print("Creating reminders...")

    reminders = [
        Reminder(
            reminder_time="08:00 AM",
            status="Pending",
            medication_id=med1.id
        ),
        Reminder(
            reminder_time="02:00 PM",
            status="Completed",
            medication_id=med1.id
        ),
        Reminder(
            reminder_time="09:00 PM",
            status="Pending",
            medication_id=med2.id
        ),
        Reminder(
            reminder_time="07:00 AM",
            status="Pending",
            medication_id=med3.id
        )
    ]

    db.session.add_all(reminders)
    db.session.commit()

    print("Creating prescriptions...")

    prescription1 = Prescription(
        doctor_name="Dr. Kimani",
        hospital="Nairobi Hospital",
        image="prescription1.jpg"
    )

    prescription2 = Prescription(
        doctor_name="Dr. Wanjiku",
        hospital="Aga Khan Hospital",
        image="prescription2.jpg"
    )

    db.session.add_all([prescription1, prescription2])
    db.session.commit()

    print("Creating medication-prescription links...")

    links = [
        MedicationPrescription(
            medication_id=med1.id,
            prescription_id=prescription1.id,
            date_added=date.today()
        ),
        MedicationPrescription(
            medication_id=med2.id,
            prescription_id=prescription1.id,
            date_added=date.today()
        ),
        MedicationPrescription(
            medication_id=med3.id,
            prescription_id=prescription2.id,
            date_added=date.today()
        )
    ]

    db.session.add_all(links)
    db.session.commit()

    print("Database seeded successfully!")