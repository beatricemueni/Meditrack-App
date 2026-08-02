from extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100),unique=True,nullable=False)
    email = db.Column(db.String(120),unique=True,nullable=False)
    password_hash = db.Column(db.String(255),nullable=False)
    role_id = db.Column(db.Integer,db.ForeignKey("roles.id"),nullable=False)


    role = db.relationship("Role",back_populates="users")
    profile = db.relationship("Profile",back_populates="user",uselist=False,cascade="all, delete-orphan")
    medications = db.relationship("Medication",back_populates="user",cascade="all, delete-orphan")