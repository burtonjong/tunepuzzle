"use client";

import React, { useState } from "react";

import { CardNE } from "@/components/cardne";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ArtistStats from "@/components/home/artiststats";

import type { Artist } from "@/util/types";

export default function ArtistsContainer({ token }: { token: string }) {
  const router = useRouter();
  const [filteredArtists, setFilteredArtists] = useState([]);

  const { isFetching, data } = useQuery({
    initialData: {} as Artist[],
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
      setFilteredArtists(data.artists.items);
      return data;
    },
  });

  const handleArtistClick = (id: string) => {
    router.push(`/artist/${id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredArtists = data.artists.items.filter((artist: Artist) => {
      return artist.name.toLowerCase().includes(e.target.value.toLowerCase());
    });

    setFilteredArtists(filteredArtists);
  };

  return (
    <>
      <ArtistStats
        numArtists={data?.artists?.items.length}
        handleSearchChange={handleSearchChange}
      />{" "}
      {isFetching ? (
        <div className="gap-8 mx-auto">
          <div className="w-full h-full">
            <article className="relative w-full h-full p-4 md:p-8">
              <h2
                id="featured-post"
                className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
              >
                Loading...
              </h2>
            </article>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-px bg-zinc-800" />
          <div
            className="animate-fade-up w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 "
            style={{ marginTop: "1rem" }}
          >
            {filteredArtists?.map((artist: Artist) => (
              <CardNE key={artist.id}>
                <div
                  onClick={() => handleArtistClick(artist.id)}
                  className="cursor-pointer"
                >
                  <article className="relative w-full h-full p-4 md:p-8 min-w-64 flex flex-col items-center sm:items-start">
                    <Image
                      src="/spotify/logos/spotifywhitelogo.png"
                      width={100}
                      height={100}
                      alt="spotify logo white"
                      className="pb-2"
                    />

                    <Image
                      src={artist.images[1].url}
                      width={artist.images[1].width}
                      height={artist.images[1].height}
                      alt="artist image"
                      className="mx-auto"
                    />

                    <h2
                      id="artst-name"
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
                          className="underline z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Go to spotify profile
                        </a>
                      </div>
                    </div>
                  </article>{" "}
                </div>
              </CardNE>
            ))}
          </div>
        </>
      )}
    </>
  );
}
