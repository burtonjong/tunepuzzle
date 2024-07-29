"use client";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import Image from "next/image";
import { CardNE } from "@/components/cardne";

export default function Audio({ data }) {
  return (
    <>
      <CardNE key={data[0].name}>
        <article className="relative w-full h-full p-4 md:p-8 min-w-64 flex flex-col items-center sm:items-start">
          <Image
            src="/spotify/logos/spotifywhitelogo.png"
            width={100}
            height={100}
            alt="spotify logo white"
            className="pb-2"
          />

          <Image
            src={data?.[3].images[1].url ?? ""}
            width={data?.[3].images[1].width}
            height={data?.[3].images[1].height}
            alt="album cover"
            className="mx-auto"
          />

          <h2
            id="featured-post"
            className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
          >
            {data?.[0].name}
          </h2>
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-zinc-100">
              <a
                target="_blank"
                href={data[0].external_urls.spotify}
                rel="noopener noreferrer"
                className="underline"
              >
                Go to song
              </a>
            </div>
          </div>
        </article>
        <AudioPlayer
          src={data?.[2]?.tracks?.[0]?.preview_url}
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
