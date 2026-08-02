from extensions import db

class Profile(db.Model):
    __tablename__ = "profiles"

    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(150))
    age = db.Column(db.Integer)
    phone = db.Column(db.String(30))

    user_id = db.Column(db.Integer,db.ForeignKey("users.id"),unique=True,nullable=False)
    user = db.relationship("User",back_populates="profile")