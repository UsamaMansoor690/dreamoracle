from flask import request, jsonify
from config import app, db
from models import LikedImages, ImagesHistory
from flask_cors import CORS


# Get by UserName
@app.route("/get_images/<string:userName>", methods=["GET"])
def get_images(userName):
    images = LikedImages.query.filter_by(user_name=userName).all()
    json_images = list(map(lambda x: x.to_json(), images))
    return jsonify({"images": json_images})
    
# Get All Images
@app.route("/get_all_images", methods=["GET"])
def get_all_images():
    images = LikedImages.query.all()
    if not images:
        return jsonify({"message": "No images found"}), 404
    else:
        json_images = list(map(lambda x: x.to_json(), images))
        return jsonify({"images": json_images})
    

# Adding
@app.route("/addImages", methods=["POST"])
def addImage():
    user_email = request.json.get("userEmail")
    img_path = request.json.get("img_path")
    desc = request.json.get("img_desc")

    if not user_email or not img_path or not desc:
        return (
            jsonify({"message": "You must include a Username, image path and description"}),
            400,
        )

    new_obj = LikedImages(user_name=user_email, img_path=img_path, desc=desc)
    try:
        db.session.add(new_obj)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Image Added!"}), 201
    
# Delete
@app.route("/deleteImage/<int:image_id>", methods=["DELETE", "OPTIONS"])
def deleteImage(image_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    image = LikedImages.query.get(image_id)

    if not image:
        return jsonify({"message": "Image not found"}), 404

    db.session.delete(image)
    db.session.commit()

    return jsonify({"message": "Images deleted!"}), 200

#       History
# Adding to History DB
@app.route("/addHistory", methods=["POST"])
def addHistory():
    user_email = request.json.get("userEmail")
    img_path = request.json.get("img_path")
    desc = request.json.get("img_desc")

    if not user_email or not img_path or not desc:
        return (
            jsonify({"message": "You must include a Username, image path and description"}),
            400,
        )

    new_obj = ImagesHistory(user_email=user_email, img_path=img_path, desc=desc)
    try:
        db.session.add(new_obj)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "Image Added!"}), 201

# Getting User History
@app.route("/getHistory/<string:userEmail>", methods=["GET"])
def getHistory(userEmail):
    images = ImagesHistory.query.filter_by(user_email=userEmail).all()
    json_images = list(map(lambda x: x.to_json(), images))
    return jsonify({"images": json_images})


@app.route("/deleteHistory/<int:image_id>", methods=["DELETE", "OPTIONS"])
def deleteHistory(image_id):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    image = ImagesHistory.query.get(image_id)

    if not image:
        return jsonify({"message": "Image not found"}), 404

    db.session.delete(image)
    db.session.commit()

    return jsonify({"message": "Images deleted!"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)