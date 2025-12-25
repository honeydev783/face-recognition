import UploadImage from "./components/UploadImage";
import CameraTest from "./components/CameraTest";
import "./styles.css";

export default function App() {
  return (
    <div className="container">
      <h1>Face Recognition Test UI</h1>

      <UploadImage />
      <CameraTest />
    </div>
  );
}