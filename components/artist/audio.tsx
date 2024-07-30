"use client";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Image from "next/image";
import { CardNE } from "@/components/cardne";
import type { Song } from "@/util/types";

export default function Audio({ song }: { song: Song }) {
  return (
    <>
      <CardNE key={song.name}>
        <article className="relative w-full h-full p-4 md:p-8 min-w-64 flex flex-col items-center sm:items-start">
          <Image
            src="/spotify/logos/spotifywhitelogo.png"
            width={100}
            height={100}
            alt="spotify logo white"
            className="pb-2"
          />

          {song.images && (
            <Image
              src={song.images[1].url ?? ""}
              width={250}
              height={250}
              alt="album cover"
              className="mx-auto"
            />
          )}

          <h2
            id="featured-post"
            className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
          >
            {song.name}
          </h2>
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-zinc-100">
              {song.external_urls && (
                <a
                  target="_blank"
                  href={song.external_urls.spotify}
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Go to song
                </a>
              )}
            </div>
          </div>
        </article>
        <AudioPlayer
          src={song.preview_url}
          volume={0.5}
          showSkipControls={false}
          showJumpControls={false}
          hasDefaultKeyBindings={false}
          customAdditionalControls={[]}
          layout="stacked-reverse"
        />
      </CardNE>
    </>
  );
}
