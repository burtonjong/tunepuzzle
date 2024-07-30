"use client";

import Options from "@/components/artist/options";
import type { Image, Song } from "@/util/types";
import Audio from "@/components/artist/audio";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";

import { Game } from "@/util/game";

export default function GuessContainer({ token }: { token: string }) {
  const params = useParams();

  const {
    data: songs,
    isFetching,
    isSuccess,
  } = useQuery({
    queryKey: ["artist", params.id],
    queryFn: async () => {
      const albumsResponse = await fetch(
        `https://api.spotify.com/v1/artists/${params.id}/albums?include_groups=single&market=US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!albumsResponse.ok) {
        throw new Error("Failed to fetch artist");
      }

      const albums = await albumsResponse.json();

      const albumIds = albums.items.map((album: { id: string }) => album.id);

      const fetchAlbumData = albumIds.map((id: string) =>
        fetch(`https://api.spotify.com/v1/albums/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch album with id ${id}`);
          }
          return res.json();
        })
      );

      const albumData = await Promise.all(fetchAlbumData);

      const songs = albumData.flatMap(
        (album: {
          images: Image[];
          tracks: {
            items: {
              name: string;
              external_urls: { spotify: string };
              preview_url: string;
              id: string;
            }[];
          };
        }) =>
          album.tracks.items.map((track) => ({
            images: album.images,
            name: track.name,
            external_urls: track.external_urls,
            preview_url: track.preview_url,
            id: track.id,
          }))
      );

      return songs;
    },
  });

  // console.log(songs);

  const [game, setGame] = useState<Game | null>(null);
  const [currentRound, setCurrentRound] = useState<any>(null);
  const [audio, setAudio] = useState<Song>({
    images: [
      {
        url: "https://i.scdn.co/image/ab67616d0000b273f6f61ab6fd1d9d101bce44de",
        height: 640,
        width: 640,
      },
      {
        url: "https://i.scdn.co/image/ab67616d00001e02f6f61ab6fd1d9d101bce44de",
        height: 300,
        width: 300,
      },
      {
        url: "https://i.scdn.co/image/ab67616d00004851f6f61ab6fd1d9d101bce44de",
        height: 64,
        width: 64,
      },
    ],
    name: "one way ticket to hell",
    external_urls: {
      spotify: "https://open.spotify.com/track/4xrxaGTgv4gMTWbQWFGnIx",
    },
    preview_url:
      "https://p.scdn.co/mp3-preview/b5b45f03c84023cea613862d3ee08b0499e06f91?cid=3d81a57a96cf40a0998cfac20a842d44",
    id: "4xrxaGTgv4gMTWbQWFGnIx",
  });

  const start = () => {
    const newGame = new Game(songs, 5);
    setGame(newGame);
    console.log("Game created");
  };

  useEffect(() => {
    async function startGame() {
      if (game && !currentRound) {
        const round = game.startNewRound();
        if (round) {
          setCurrentRound(round);
          // Create and load audio
          const audio = round.currentSong;
          setAudio(audio);
          // If you want to start playing immediately:
          // await audio.play();
        } else {
          // Game over
          console.log(
            `Game Over! Your final score is ${game.getScore()} out of ${game.getTotalRounds()}`
          );
        }
      }
    }

    startGame().catch((error) => {
      console.error("Error starting game:", error);
    });
  }, [game, currentRound]);

  const handleAnswer = (chosenSong: Song) => {
    if (game && currentRound) {
      const isCorrect = game.checkAnswer(chosenSong, currentRound.currentSong);
      console.log(
        isCorrect
          ? "Correct!"
          : `Wrong! The correct answer was: ${currentRound.currentSong.name}`
      );
      setCurrentRound(null);
    }
  };

  return (
    <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
      {isFetching ? (
        <div className="flex flex-row justify-between w-full">
          <div className="max-w-2xl mx-auto lg:mx-0 ">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Loading...
            </h2>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-row justify-between w-full">
            <div className="max-w-2xl mx-auto lg:mx-0 flex flex-row items-center gap-4">
              <Audio song={audio ?? {}} />
              <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                Round X
              </h2>
              <button
                onClick={() => start()}
                className="text-zinc-100 hover:text-white"
              >
                Start Game
              </button>
            </div>
          </div>
          <div className="w-full h-px bg-zinc-800" />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Options songs={songs ?? []} handleAnswer={handleAnswer} />
          </div>
          <div className="hidden w-full h-px md:block bg-zinc-800" />
        </>
      )}
    </div>
  );
}
