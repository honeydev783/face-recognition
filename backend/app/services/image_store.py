import os
import uuid
from PIL import Image
import io


IMAGE_DIR = "/app/data/images"
os.makedirs(IMAGE_DIR, exist_ok=True)

def save_image(image_bytes: bytes) -> str:
    image_id = str(uuid.uuid4())
    path = os.path.join(IMAGE_DIR, f"{image_id}.jpg")

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image.save(path, "JPEG")

    return image_id