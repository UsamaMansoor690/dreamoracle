from config import db


class LikedImages(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(80), unique=False, nullable=False)
    img_path = db.Column(db.String(200), unique=False, nullable=False)
    desc = db.Column(db.String(200), unique=False, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "userName": self.user_name,
            "imgPath": self.img_path,
            "desc": self.desc,
        }
    

class ImagesHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(80), unique=False, nullable=False)
    img_path = db.Column(db.String(200), unique=False, nullable=False)
    desc = db.Column(db.String(200), unique=False, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "userEmail": self.user_email,
            "imgPath": self.img_path,
            "desc": self.desc,
        }
