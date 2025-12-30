// import { useState } from "react";
// import { uploadImage } from "../services/api";

// export default function UploadImage() {
//   const [file, setFile] = useState<File | null>(null);
//   const [response, setResponse] = useState<any>(null);

//   const handleUpload = async () => {
//     if (!file) return;
//     const res = await uploadImage(file);
//     setResponse(res);
//   };

//   return (
//     <div className="card">
//       <h2>Upload Image (Multi-Face)</h2>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//       />

//       <button onClick={handleUpload}>Upload</button>

//       {response && (
//         <pre>{JSON.stringify(response, null, 2)}</pre>
//       )}
//     </div>
//   );
// }

// import { useState } from "react";
// import { uploadImages } from "../services/api";

// export default function UploadImage() {
//   const [files, setFiles] = useState<File[]>([]);
//   const [response, setResponse] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async () => {
//     if (files.length === 0) return;
//     setLoading(true);
//     const res = await uploadImages(files);
//     setResponse(res);
//     setLoading(false);
//   };

//   return (
//     <div className="card">
//       <h2>Upload Images (Multi-Face, Multi-Image)</h2>

//       <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={(e) => setFiles(Array.from(e.target.files || []))}
//       />

//       <button onClick={handleUpload} disabled={loading}>
//         {loading ? "Uploading..." : "Upload"}
//       </button>

//       {response && (
//         <pre>{JSON.stringify(response, null, 2)}</pre>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { uploadImages } from "../services/api";

interface UploadResult {
  filename: string;
  image_id: string;
  faces_detected: number;
  faces_indexed: number;
  image_url: string;
}

const PREVIEW_LIMIT = 20;

export default function UploadImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // aggregate stats
  const [progress, setProgress] = useState({
    uploaded: 0,
    total: 0,
    facesIndexed: 0,
    failed: 0,
  });

  // optional preview only (small subset)
  const [previewResults, setPreviewResults] = useState<UploadResult[]>([]);

  async function uploadInBatches(files: File[], batchSize = 20) {
    setUploading(true);
    setError(null);
    setPreviewResults([]);
    setProgress({
      uploaded: 0,
      total: files.length,
      facesIndexed: 0,
      failed: 0,
    });

    let uploadedCount = 0;
    let facesIndexed = 0;
    let failedCount = 0;

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);

      try {
        const response = await uploadImages(batch);

        if (response?.results) {
          // accumulate stats
          for (const r of response.results) {
            facesIndexed += r.faces_indexed;
          }

          // keep only a small preview
          setPreviewResults((prev) => {
            if (prev.length >= PREVIEW_LIMIT) return prev;
            return [...prev, ...response.results].slice(0, PREVIEW_LIMIT);
          });
        }

        uploadedCount += batch.length;
      } catch (err) {
        console.error(err);
        failedCount += batch.length;
      }

      setProgress({
        uploaded: uploadedCount,
        total: files.length,
        facesIndexed,
        failed: failedCount,
      });
    }

    setUploading(false);
  }

  const handleUpload = () => {
    if (files.length === 0 || uploading) return;
    uploadInBatches(files);
  };

  return (
    <div className="card">
      <h2>Upload Images (Batch Mode)</h2>

      <input
        type="file"
        accept="image/*"
        multiple
        disabled={uploading}
        onChange={(e) =>
          setFiles(Array.from(e.target.files || []))
        }
      />

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Images"}
      </button>

      {(uploading || progress.uploaded > 0) && (
        <div style={{ marginTop: 12 }}>
          <p>
            Uploading: {progress.uploaded} / {progress.total} images
          </p>
          <p>
            Faces indexed so far: {progress.facesIndexed.toLocaleString()}
          </p>
          <p>
            Failed images: {progress.failed}
          </p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {previewResults.length > 0 && (
        <div className="results">
          <h3>
            Preview (first {PREVIEW_LIMIT} images)
          </h3>

          <div className="image-grid">
            {previewResults.map((res) => (
              <div key={res.image_id} className="image-card">
                <img
                  src={`http://localhost:9000${res.image_url}`}
                  alt={res.filename}
                />
                <div className="meta">
                  <p><strong>{res.filename}</strong></p>
                  <p>Faces: {res.faces_detected}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 8, fontSize: 12 }}>
            Showing preview only. Full dataset indexed in backend.
          </p>
        </div>
      )}
    </div>
  );
}