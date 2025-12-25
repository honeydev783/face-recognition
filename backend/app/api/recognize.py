from fastapi import APIRouter, UploadFile, File
from app.core.face_pipeline import extract_faces
from app.core.vector_index import index, face_metadata
from app.core.config import SIMILARITY_THRESHOLD, TOP_K
import numpy as np

router = APIRouter()


@router.post("/recognize")
async def recognize(file: UploadFile = File(...)):
    image_bytes = await file.read()
    faces = extract_faces(image_bytes)

    if not faces:
        return {"match": False}

    # choose largest face
    face = max(
        faces,
        key=lambda f: (f["bbox"][2]-f["bbox"][0]) *
                      (f["bbox"][3]-f["bbox"][1])
    )

    query = np.array([face["embedding"]]).astype("float32")
    query /= np.linalg.norm(query, axis=1, keepdims=True)
        # Search in FAISS
    distances, ids = index.search(query, TOP_K)
    print("distances====>", distances)
    print("ids====>", ids)
    matches = []
    for score, idx in zip(distances[0], ids[0]):
        if idx == -1:
            continue

        similarity = float(score)  # already cosine similarity
        print(f"similarity {idx}===>", similarity)
        # if similarity < SIMILARITY_THRESHOLD:
        #     continue

        meta = face_metadata.get(str(int(idx)))
        if meta is None:
            continue

        matches.append({
            "similarity": similarity,
            "image_url": f"/images/{meta['image_id']}.jpg",
            "bbox": meta["bbox"]
        })

        matches.sort(key=lambda x: x["similarity"], reverse=False)

    return {
            "match": bool(matches),
            "results": matches
    }
    # scores, ids = index.search(query, TOP_K)
    # print("face metadata===>", face_metadata)
    # print("scores====>", scores)
    # print("ids======>", ids)
    # matches = []
    # for score, idx in zip(scores[0], ids[0]):
    #     if idx == -1 or score < SIMILARITY_THRESHOLD:
    #         continue
    #     print("current idx==>", idx)
    #     meta = face_metadata.get(str(idx))
    #     print("current meta===>", meta)
    #     if meta is None:
    #         continue
    #     matches.append({
    #         "similarity": float(score),
    #         "image_url": f"/images/{meta.get('image_id')}.jpg",
    #         "bbox": meta.get("bbox")
    #     })
    # matches.sort(key=lambda x: x["similarity"], reverse=True)
    # return {
    #     "match": bool(matches),
    #     "results": matches
    # }