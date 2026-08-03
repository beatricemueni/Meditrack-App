from flask import Flask

from config import Config
from extensions import (db, migrate, bcrypt, jwt, cors, ma, api)


def create_app():

    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize basic database and auth extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    ma.init_app(app)

    # Import controllers
    from controllers.auth import Register, Login
    from controllers.medication import MedicationList, MedicationResource
    from controllers.reminder import ReminderList, ReminderResource       
    from controllers.prescription import PrescriptionList, PrescriptionResource 
    from controllers.profile import ProfileResource                       

    # Register operational resource mapping pathways
    api.add_resource(Register, "/register")
    api.add_resource(Login, "/login")
    api.add_resource(MedicationList, "/medications")
    api.add_resource(MedicationResource, "/medications/<int:id>")
    api.add_resource(ReminderList, "/reminders")
    api.add_resource(ReminderResource, "/reminders/<int:id>")
    api.add_resource(PrescriptionList, "/prescriptions")
    api.add_resource(PrescriptionResource, "/prescriptions/<int:id>")
    api.add_resource(ProfileResource, "/profile")

    # 1. Initialize the Flask-RESTful API engine endpoints first
    api.init_app(app)

    # 2. 🎯 FIX: Apply CORS explicitly AFTER the routes are fully initialized.
    # This prevents Flask-RESTful from blocking the browser's preflight OPTIONS checks.
    cors.init_app(app, resources={
        r"/*": {
            "origins": "*",
            "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Headers"],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
        }
    })

    return app


app = create_app()
app.config['PROPAGATE_EXCEPTIONS'] = True

if __name__ == "__main__":
    app.run(debug=True)

