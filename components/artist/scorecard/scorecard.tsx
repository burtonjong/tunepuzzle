import { useRouter } from "next/navigation";

import { CardNE } from "@/components/cardne";
import Image from "next/image";
import { Song } from "@/util/types";
import AnswerCarosuel from "./answercarousel";

interface ScoreProps {
  totalRounds: number;
  score: number;
  start: () => void;
  userInputs: {
    [round: number]: { userChoice: Song; correctSong: Song };
  };
}

export default function ScoreCard({
  totalRounds,
  score,
  start,
  userInputs,
}: ScoreProps) {
  const router = useRouter();

  return (
    <CardNE>
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

          <div className="w-full h-px bg-zinc-800 my-4" />

          <div className="flex justify-center ">
            <AnswerCarosuel userInputs={userInputs} />
          </div>
          <div className="flex flex-row mt-12 gap-4">
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
    </CardNE>
  );
}
