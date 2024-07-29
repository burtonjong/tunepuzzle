"use client";

import React from "react";

import { CardNE } from "@/components/cardne";
import { Card } from "@/components/card";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ArtistsContainer({ token }: { token: string }) {
  const router = useRouter();

  const { isFetching, data } = useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.spotify.com/v1/me/following?type=artist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch artists");
      }

      const data = await response.json();
      console.log(data);
      return data;
    },
  });

  const handleArtistClick = (id: string) => {
    router.push(`/artist/${id}`);
  };

  return (
    <>
      {" "}
      {isFetching ? (
        <div className="gap-8 mx-auto">
          <div className="w-full h-full">
            <Card>
              <article className="relative w-full h-full p-4 md:p-8">
                <h2
                  id="featured-post"
                  className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                >
                  Loading...
                </h2>
              </article>
            </Card>
          </div>
        </div>
      ) : (
        data.artists.items.map((artist: Artist) => (
          <CardNE key={artist.id}>
            <article className="relative w-full h-full p-4 md:p-8 min-w-64 flex flex-col items-center sm:items-start">
              <Image
                src="/spotify/logos/spotifywhitelogo.png"
                width={100}
                height={100}
                alt="spotify logo white"
                className="pb-2"
              />
              <div
                onClick={() => handleArtistClick(artist.id)}
                className="cursor-pointer"
              >
                <Image
                  src={artist.images[1].url}
                  width={artist.images[1].width}
                  height={artist.images[1].height}
                  alt="artist image"
                  className="mx-auto"
                />
              </div>

              <h2
                id="featured-post"
                className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
              >
                {artist.name}
              </h2>
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-zinc-100">
                  <a
                    target="_blank"
                    href={artist.external_urls.spotify}
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Go to spotify profile
                  </a>
                </div>
              </div>
            </article>
          </CardNE>
        ))
      )}
    </>
  );
}
