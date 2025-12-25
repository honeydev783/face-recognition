const API_BASE = "http://localhost:9000/api";

export async function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: form,
  });

  return res.json();
}

export async function recognizeImage(blob: Blob) {
  const form = new FormData();
  form.append("file", blob, "capture.jpg");

  const res = await fetch(`${API_BASE}/recognize`, {
    method: "POST",
    body: form,
  });

  return res.json();
}