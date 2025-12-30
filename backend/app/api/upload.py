from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from app.services.image_store import save_image
from app.core.face_pipeline import extract_faces
from app.services.face_store import store_face
import uuid

router = APIRouter()


@router.post("/upload")
async def upload_images(files: List[UploadFile] = File(...)):
    results = []

    for file in files:
        if not file.content_type.startswith("image/"):
            continue

        image_bytes = await file.read()

        # save image
        image_id = save_image(image_bytes)

        faces = extract_faces(image_bytes)

        face_count = 0
        for face in faces:
            store_face(
                embedding=face["embedding"],
                image_id=image_id,
                bbox=face["bbox"]
            )
            face_count += 1

        results.append({
            "filename": file.filename,
            "image_id": image_id,
            "faces_detected": len(faces),
            "faces_indexed": face_count,
            "image_url": f"/images/{image_id}.jpg"
        })

    if not results:
        raise HTTPException(status_code=400, detail="No valid images uploaded")

    return {
        "uploaded": len(results),
        "results": results
    }
    
# @router.post("/upload")
# async def upload_image(file: UploadFile = File(...)):
#     if not file.content_type.startswith("image/"):
#         raise HTTPException(status_code=400, detail="Invalid image")
#     image_bytes = await file.read()
#     image_id = save_image(image_bytes)
#     print(f"image id : {image_id}")
#     faces = extract_faces(image_bytes)
#     print(f"length: {len(faces)}")
#     if not faces:
#         return {"status": "no_faces_detected"}

#     for face in faces:
#         store_face(
#             embedding=face["embedding"],
#             image_id=image_id,
#             bbox=face["bbox"]
#         )

#     return {
#         "image_id": image_id,
#         "faces_indexed": len(faces)
#     }