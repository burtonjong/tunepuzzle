import { Card } from "@/components/card";

interface ScoreProps {
  currentRound: number;
  totalRounds: number;
  score: number;
}

export default function ScoreCard({
  currentRound,
  totalRounds,
  score,
}: ScoreProps) {
  return (
    <Card>
      <article className="relative w-full h-full p-4 md:p-8">
        {!currentRound && (
          <>
            <h2
              id="featured-post"
              className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
            >
              {score} / {totalRounds}
            </h2>
            <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
              Total Rounds: {totalRounds}
            </p>
          </>
        )}
      </article>
    </Card>
  );
}
