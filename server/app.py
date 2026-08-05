from flask import Flask
from config import Config
from extensions import db, migrate, bcrypt, jwt, cors, ma
from flask_migrate import upgrade
from flask_restful import Api

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    # Initialize extensions safely
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://localhost:5173/",
        "https://meditrack-app-chi.vercel.app",
        "https://meditrack-app-chi.vercel.app/"
    ]
    
    cors.init_app(
        app, 
        resources={r"/*": {
            "origins": ALLOWED_ORIGINS,
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }}, 
        supports_credentials=True
    )
    
    ma.init_app(app)
    
    api = Api(app)

    # Deferred absolute path controller imports
    from controllers.auth import Register, Login
    from controllers.medication import MedicationList, MedicationResource
    from controllers.prescription import PrescriptionList, PrescriptionResource
    from controllers.reminder import ReminderList, ReminderResource, PendingReminderList

    # Route registrations
    api.add_resource(Register, "/register")
    api.add_resource(Login, "/login")
    api.add_resource(MedicationList, "/medications")
    api.add_resource(MedicationResource, "/medications/<int:id>")
    
    api.add_resource(PrescriptionList, "/prescriptions")
    api.add_resource(PrescriptionResource, "/prescriptions/<int:id>")

    api.add_resource(ReminderList, "/reminders")
    api.add_resource(ReminderResource, "/reminders/<int:id>")
    api.add_resource(PendingReminderList, "/reminders/pending")

    return app

# Instantiate single app instance for Gunicorn container binding
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
