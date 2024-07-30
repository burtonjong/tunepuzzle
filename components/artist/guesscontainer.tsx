"use client";

import Options from "@/components/artist/options";
import Score from "@/components/artist/score";
import Particles from "@/components/particles";
import Visualizer from "@/components/artist/visualizer/visualizer";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useCallback, useEffect, useState } from "react";

import { Game } from "@/util/game";
import type { Image, Song } from "@/util/types";

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
        `https://api.spotify.com/v1/artists/${params.id}/albums?include_groups=single,album&market=US`,
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

  const [gameState, setGameState] = useState({
    game: null as Game | null,
    currentRound: null as any,
    audio: undefined as Song | undefined,
    options: [] as Song[],
  });

  const start = () => {
    if (isSuccess) {
      const game = new Game(songs, 5);
      setGameState((prevState) => ({ ...prevState, game }));
    }
  };

  useEffect(() => {
    async function startGame() {
      if (gameState.game && !gameState.currentRound) {
        const round = gameState.game.startNewRound();
        if (round) {
          setGameState((prevState) => ({ ...prevState, currentRound: round }));
          const audio = round.currentSong;
          const options = round.options;
          setGameState((prevState) => ({ ...prevState, audio, options }));
        } else {
          console.log(
            `Game Over! Your final score is ${gameState.game.getScore()} out of ${gameState.game.getTotalRounds()}`
          );
        }
      }
    }

    startGame().catch((error) => {
      console.error("Error starting game:", error);
    });
  }, [gameState.game, gameState.currentRound]);

  const handleAnswer = useCallback(
    (chosenSong: Song) => {
      if (gameState.game && gameState.currentRound) {
        const isCorrect = gameState.game.checkAnswer(
          chosenSong,
          gameState.currentRound.currentSong
        );
        console.log(
          isCorrect
            ? "Correct!"
            : `Wrong! The correct answer was: ${gameState.currentRound.currentSong.name}`
        );
        setGameState((prevState) => ({ ...prevState, currentRound: null }));
      }
    },
    [gameState.game, gameState.currentRound]
  );

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
          <div className="absolute h-1/2 w-screen left-0 -top-12">
            {gameState.currentRound?.roundNumber && (
              <Visualizer url={gameState.audio?.preview_url ?? ""} />
            )}
          </div>

          <div className="flex flex-row w-full" style={{ marginTop: "1rem" }}>
            <div className="w-1/8 h-full">
              <Score
                start={start}
                score={gameState.game?.getScore() ?? 0}
                currentRound={gameState.currentRound?.roundNumber}
              />
            </div>
          </div>
          <div className="w-full h-px bg-zinc-800" />
          <div className=" flex justify-center w-full">
            {gameState.game ? (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Options
                  songs={gameState.options ?? []}
                  handleAnswer={handleAnswer}
                />
              </div>
            ) : (
              <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                Options will appear here.
              </h2>
            )}
          </div>

          <div className="hidden w-full h-px md:block bg-zinc-800" />
        </>
      )}
    </div>
  );
}
