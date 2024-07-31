import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import { CardNE } from "@/components/cardne";
import { Song } from "@/util/types";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

interface AnswerCarosuelProps {
  userInputs: {
    [round: number]: { userChoice: Song; correctSong: Song };
  };
}

export default function AnswerCarosuel({ userInputs }: AnswerCarosuelProps) {
  return (
    <>
      <Swiper
        pagination={{
          type: "bullets",
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper "
      >
        {Object.values(userInputs).map((round, index) => (
          <>
            <SwiperSlide>
              <div className="flex flex-col h-full">
                <h2
                  id={`user-round-${index + 1}`}
                  className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                >
                  Round: {index + 1}
                </h2>
                <div className="flex flex-row justify-center gap-4 h-full pb-12 mx-auto">
                  <div className="flex flex-col ">
                    {" "}
                    <h2 className="mt-4 text-xl font-bold text-zinc-100 group-hover:text-white sm:text-2xl font-display">
                      User Choice
                    </h2>
                    <SongCard index={index} song={round.userChoice} />
                  </div>
                  <div className="flex flex-col h-full">
                    <h2 className="mt-4 text-xl font-bold text-zinc-100 group-hover:text-white sm:text-2xl font-display">
                      Correct Answer
                    </h2>
                    <SongCard index={index} song={round.correctSong} />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </>
        ))}
      </Swiper>
    </>
  );
}

function SongCard({ index, song }: { index: number; song: Song }) {
  return (
    <CardNE key={index + 1} className="max-w-64">
      <article className="w-full h-full p-4 md:p-8 min-w-64 flex flex-col items-center sm:items-start">
        <Image
          src="/spotify/logos/spotifywhitelogo.png"
          width={75}
          height={75}
          alt="spotify logo white"
          className="pb-2"
        />

        <Image
          src={song.images[1].url}
          width={225}
          height={225}
          alt="artist image"
        />

        <h2
          id={`user-choice-${index + 1}`}
          className="mt-4 text-xl font-bold text-zinc-100 group-hover:text-white sm:text-2xl font-display"
        >
          {song.name}
        </h2>
        <div className="flex items-center justify-between gap-2 h-full">
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
