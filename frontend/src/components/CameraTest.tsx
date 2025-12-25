import { useEffect, useRef, useState } from "react";
import { recognizeImage } from "../services/api";
import type { Match } from "../types";

const API_BASE = "http://localhost:9000";

export default function CameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
    initCamera();
  }, []);

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    setLoading(true);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      try {
        const res = await recognizeImage(blob);
        console.log("result====>", res)
        setMatches(res.results || []);
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="card">
      <h2>Camera Recognition</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width={320}
        height={240}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <button onClick={captureAndRecognize}>
        {loading ? "Recognizing..." : "Capture & Recognize"}
      </button>

      <div className="match-grid">
        {matches.map((match, i) => (
          <div key={i} className="match-card">
            <img
              src={API_BASE + match.image_url}
              alt="Matched"
            />
            <div className="score">
              Distance: {match.similarity.toFixed(3)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}