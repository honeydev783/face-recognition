import cv2
import numpy as np

# Maximum size for the longer side of the image
# Prevents unstable face detection on very large images
MAX_IMAGE_SIDE = 1280


def normalize_image(img: np.ndarray) -> np.ndarray:
    """
    Resize image so that max(width, height) <= MAX_IMAGE_SIDE
    while preserving aspect ratio.

    This improves multi-face detection consistency.
    """
    if img is None:
        raise ValueError("Invalid image: None")

    h, w = img.shape[:2]
    max_side = max(h, w)

    if max_side <= MAX_IMAGE_SIDE:
        return img

    scale = MAX_IMAGE_SIDE / max_side
    new_w = int(w * scale)
    new_h = int(h * scale)

    resized = cv2.resize(
        img,
        (new_w, new_h),
        interpolation=cv2.INTER_AREA
    )

    return resized