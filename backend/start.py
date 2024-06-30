from flask import Flask, request, jsonify
from stackgan import Stage1_G, Stage2_G
import config as cfg
import torch
from io import BytesIO
import base64
from PIL import Image
import numpy as np

# Load your models
stage1_model = Stage1_G()
stage2_model = Stage2_G(stage1_model)
#stage1_model.load_state_dict(torch.load('./Stage_1/netG_epoch_100.pth', map_location='cpu'))
#stage2_model.load_state_dict(torch.load('./Stage_2/netG_epoch_100.pth', map_location='cpu'))
stage1_model = torch.load("./Stage_1/netG_epoch_100.pth")
stage2_model = torch.load("./Stage_2/netG_epoch_100.pth")

app = Flask(__name__)

def generate_image(text):
    prompt = torch.Tensor(text)
    noise = torch.randn(1, cfg.Z_DIM)

    with torch.no_grad():
        fake_img = stage2_model(prompt, noise).cpu()

    fake_img = (fake_img + 1) / 2  # Denormalize the image
    fake_img = fake_img.squeeze().numpy().transpose(1, 2, 0) * 255
    return Image.fromarray(fake_img.astype(np.uint8))


@app.route('/generate', methods=['POST'])
def generate():
    text = request.form['text']
    image = generate_image(text)

    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return jsonify(img_str)

if __name__ == '__main__':
    app.run(debug=True)
