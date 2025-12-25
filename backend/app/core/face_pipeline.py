import cv2
import numpy as np
from app.core.face_engine import face_app
from app.core.config import FACE_MIN_SIZE, SIMILARITY_THRESHOLD
from app.utils.image import normalize_image


def extract_faces(image_bytes: bytes):
    np_img = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    print("will start normalization")
    img = normalize_image(img)
    faces = face_app.get(img)
    print(f"faces detected: {len(faces)}")
    results = []

    for face in faces:
        if face.det_score < SIMILARITY_THRESHOLD:
            continue
        x1, y1, x2, y2 = map(int, face.bbox)
        w, h = x2 - x1, y2 - y1
        print(f"width: {w}, hegith: {h}, age: {face.age}, gender: {face.gender}, score: {face.det_score}")
        if w < FACE_MIN_SIZE or h < FACE_MIN_SIZE:
            continue

        results.append({
            "embedding": face.normed_embedding,
            "bbox": [x1, y1, x2, y2],
            "score": float(face.det_score)
        })
    
    return results