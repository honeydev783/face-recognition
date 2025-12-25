import faiss
import os
import json
from app.core.config import FAISS_DIM, FAISS_HNSW_M


DATA_DIR = "/app/data/faiss"
INDEX_PATH = os.path.join(DATA_DIR, "index.bin")
META_PATH = os.path.join(DATA_DIR, "metadata.json")

os.makedirs(DATA_DIR, exist_ok=True)
index = faiss.IndexHNSWFlat(FAISS_DIM, FAISS_HNSW_M)
index.hnsw.efConstruction = 200
index.hnsw.efSearch = 64

def load_index():
    if os.path.exists(INDEX_PATH):
        index = faiss.read_index(INDEX_PATH)
        with open(META_PATH, "r") as f:
            metadata = json.load(f)
        return index, metadata

    index = faiss.IndexHNSWFlat(FAISS_DIM, FAISS_HNSW_M)
    index.hnsw.efConstruction = 200
    index.hnsw.efSearch = 64
    return index, {}


def save_index(index, metadata):
    faiss.write_index(index, INDEX_PATH)
    with open(META_PATH, "w") as f:
        json.dump(metadata, f)


index, face_metadata = load_index()
