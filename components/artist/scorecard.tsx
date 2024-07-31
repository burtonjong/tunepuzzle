import { useRouter } from "next/navigation";

import { Card } from "@/components/card";
import { CardNE } from "@/components/cardne";
import Image from "next/image";
import { Song } from "@/util/types";

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

          <div className="w-full h-px bg-zinc-800 my-4" />

          {Object.values(userInputs).map((round, index) => (
            <>
              <div className="flex flex-col flex-wrap">
                <h2
                  id={`user-round-${index + 1}`}
                  className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                >
                  Round: {index + 1}
                </h2>
                <div className="flex flex-row">
                  <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">
                    User Choice
                  </h2>
                  <SongCard index={index} song={round.userChoice} />
                  <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">
                    Correct Answer
                  </h2>
                  <SongCard index={index} song={round.correctSong} />
                </div>
              </div>
            </>
          ))}

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

function SongCard({ index, song }: { index: number; song: Song }) {
  return (
    <CardNE key={index + 1}>
      <article className="relative w-full h-full p-4 md:p-8 min-w-64 flex flex-col items-center sm:items-start">
        <Image
          src="/spotify/logos/spotifywhitelogo.png"
          width={100}
          height={100}
          alt="spotify logo white"
          className="pb-2"
        />

        <Image
          src={song.images[1].url}
          width={song.images[1].width}
          height={song.images[1].height}
          alt="artist image"
          className="mx-auto"
        />

        <h2
          id={`user-choice-${index + 1}`}
          className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
        >
          {song.name}
        </h2>
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-zinc-100">
            <a
              target="_blank"
              href={song.external_urls.spotify}
              rel="noopener noreferrer"
              className="underline"
            >
              Go to song
            </a>
          </div>
        </div>
      </article>
    </CardNE>
  );
}
