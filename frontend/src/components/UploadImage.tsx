import { useState } from "react";
import { uploadImage } from "../services/api";

export default function UploadImage() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;
    const res = await uploadImage(file);
    setResponse(res);
  };

  return (
    <div className="card">
      <h2>Upload Image (Multi-Face)</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload}>Upload</button>

      {response && (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  );
}