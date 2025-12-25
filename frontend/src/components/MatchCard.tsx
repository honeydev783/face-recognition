import type {Match} from "../types";

const API_BASE = "http://localhost:8000";

export default function MatchCard({ match }: { match: Match }) {
  return (
    <div className="match-card">
      <img
        src={API_BASE + match.image_url}
        alt="Matched face"
      />
      <div className="score">
        Similarity: {match.similarity.toFixed(3)}
      </div>
    </div>
  );
}