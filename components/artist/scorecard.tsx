import { useRouter } from "next/navigation";

import { Card } from "@/components/card";

interface ScoreProps {
  currentRound: number;
  totalRounds: number;
  score: number;
  start: () => void;
}

export default function ScoreCard({
  currentRound,
  totalRounds,
  score,
  start,
}: ScoreProps) {
  const router = useRouter();

  console.log(currentRound, score, totalRounds);

  return (
    <Card>
      <article className="relative w-full h-full p-4 md:p-8">
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
          <div className="flex flex-row mx-auto gap-4">
            <button
              onClick={() => router.back()}
              className="transition-all duration-300 ease-in-out bg-transparent hover:bg-zinc-500 text-zinc-100 font-semibold hover:text-white py-2 px-4 border border-zinc-500 hover:border-transparent rounded"
            >
              Quit
            </button>
            <button
              onClick={() => start()}
              className="transition-all duration-300 ease-in-out bg-transparent hover:bg-zinc-500 text-zinc-100 font-semibold hover:text-white py-2 px-4 border border-zinc-500 hover:border-transparent rounded"
            >
              Retry
            </button>
          </div>
        </>
      </article>
    </Card>
  );
}
