import uuid
import numpy as np
from app.core.vector_index import index, face_metadata, save_index


def store_face(embedding, image_id, bbox):
    face_id = str(uuid.uuid4())
    vector = np.array([embedding]).astype("float32")
    vector /= np.linalg.norm(vector, axis=1, keepdims=True)
    
    faiss_id = index.ntotal
    index.add(vector)

    face_metadata[str(faiss_id)] = {
        "face_id": face_id,
        "image_id": image_id,
        "bbox": bbox
    }

    save_index(index, face_metadata)

    return face_id
# def store_face(embedding, image_id, bbox):
#     face_id = str(uuid.uuid4())
#     vector = np.array([embedding]).astype("float32")

#     faiss_id = index.ntotal
#     index.add(vector)

#     face_metadata[faiss_id] = {
#         "face_id": face_id,
#         "image_id": image_id,
#         "bbox": bbox
#     }

#     return face_id