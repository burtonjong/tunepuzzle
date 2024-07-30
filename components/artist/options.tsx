// shout kishin and daesang cause i was listening to options when it worked
"use client";

import Image from "next/image";
import { CardNE } from "@/components/cardne";
import { Song } from "@/util/types";

export default function Options({
  songs,
  handleAnswer,
}: {
  songs: Song[];
  handleAnswer: (chosenSong: Song) => void;
}) {
  return (
    <>
      {songs.map((song: Song) => (
        <CardNE key={song.id}>
          <article className="relative w-full h-full p-4 md:p-8 min-w-64 flex flex-col items-center sm:items-start">
            <Image
              src="/spotify/logos/spotifywhitelogo.png"
              width={100}
              height={100}
              alt="spotify logo white"
              className="pb-2"
            />
            <div onClick={() => handleAnswer(song)} className="cursor-pointer">
              <Image
                src={song.images[1].url}
                width={song.images[1].width}
                height={song.images[1].height}
                alt="artist image"
                className="mx-auto"
              />
            </div>

            <h2
              id="featured-post"
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
      ))}
    </>
  );
}
