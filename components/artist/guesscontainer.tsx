"use client";

import Options from "@/components/artist/options";
import ScoreCard from "@/components/artist/scorecard/scorecard";
import { Card } from "@/components/card";
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
        `https://api.spotify.com/v1/artists/${params.id}/albums?include_groups=album,single&market=US&limit=50`,
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
    totalRounds: 7,
    game: null as Game | null,
    currentRound: null as any,
    audio: undefined as Song | undefined,
    options: [] as Song[],
    volume: 0.5,
  });

  const start = () => {
    if (isSuccess) {
      const game = new Game(songs, gameState.totalRounds);
      setGameState((prevState) => ({
        ...prevState,
        game,
        totalRounds: gameState.totalRounds,
      }));
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
          setGameState((prevState) => ({
            ...prevState,
            options: [],
          }));
          setGameState((prevState) => ({
            ...prevState,
            currentRound: null,
            game: null,
          }));
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
        gameState.game.checkAnswer(
          chosenSong,
          gameState.currentRound.currentSong
        );
        setGameState((prevState) => ({ ...prevState, currentRound: null }));
      }
    },
    [gameState.game, gameState.currentRound]
  );

  const handleSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "volume") {
      setGameState((prevState) => ({
        ...prevState,
        volume: Number(event.target.value),
      }));
    } else if (event.target.name === "total-rounds") {
      console.log(event.target.value);
      setGameState((prevState) => ({
        ...prevState,
        totalRounds: Number(event.target.value),
      }));
    }
  };

  return (
    <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-32 lg:pt-72">
      {gameState.game?.isGameOver() &&
      gameState.currentRound?.roundNumber ===
        gameState.game.getTotalRounds() ? (
        <div className="flex justify-center">
          <div className="absolute w-10/12 top-28">
            <ScoreCard
              start={start}
              score={gameState.game?.getScore() ?? 0}
              totalRounds={gameState.game.getTotalRounds() ?? 0}
              userInputs={gameState.game?.getUserInputs() ?? {}}
            />
          </div>
        </div>
      ) : isFetching ? (
        <div className="flex flex-row justify-between w-full">
          <div className="max-w-2xl mx-auto lg:mx-0 ">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              Loading...
            </h2>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute h-1/4 lg:h-1/2 w-screen left-0 -top-12 z-0">
            {gameState.currentRound?.roundNumber >= 0 && (
              <Visualizer
                url={gameState.audio?.preview_url ?? ""}
                volume={gameState.volume}
              />
            )}
          </div>

          {!gameState.game && (
            <div className="flex w-full justify-center items-end">
              <div className="w-1/8 h-full">
                <button
                  onClick={() => start()}
                  className="text-zinc-100 hover:text-white"
                >
                  <Card>
                    <article className="relative w-full h-full p-4 md:p-8 ">
                      Start Game
                    </article>
                  </Card>
                  <div className="mt-6">
                    <input
                      className="z-10 mt-4"
                      type="range"
                      name="total-rounds"
                      value={gameState.totalRounds}
                      min="2"
                      max="12"
                      step="1"
                      onChange={handleSlider}
                    />
                    <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                      Total Rounds: {gameState.totalRounds}
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className=" flex justify-center w-full flex-col items-center gap-4">
            <div className="w-full h-px bg-zinc-800" />

            {gameState.game &&
            gameState.options &&
            gameState.options.length > 0 ? (
              <>
                <input
                  className="z-10 my-4"
                  type="range"
                  name="volume"
                  value={gameState.volume}
                  min="0"
                  max="1"
                  step="0.01"
                  onChange={handleSlider}
                />

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  <Options
                    songs={gameState.options ?? []}
                    handleAnswer={handleAnswer}
                  />
                </div>
              </>
            ) : (
              <h2 className="text-3xl mt-10 font-bold tracking-tight text-zinc-100 sm:text-4xl">
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
