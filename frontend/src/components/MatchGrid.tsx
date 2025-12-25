import type { Match } from "../types";
import MatchCard from "./MatchCard";

export default function MatchGrid({ matches }: { matches: Match[] }) {
  if (!matches.length) {
    return <p>No matches found.</p>;
  }

  return (
    <div className="match-grid">
      {matches.map((m, i) => (
        <MatchCard key={i} match={m} />
      ))}
    </div>
  );
}