"use client";

import SignOut from "@/components/home/SignOut";
import Options from "@/components/artist/options";

import Audio from "@/components/artist/audio";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function GuessContainer({ token }: { token: string }) {
  const params = useParams();
  console.log(params);

  const { data, isFetching } = useQuery({
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

      const whatIsNeeded = albumData.map(
        (album: {
          name: string;
          external_urls: { spotify: string };
          images: Image[];
          tracks: {
            items: {
              name: string;
              external_urls: { spotify: string };
              preview_url: string;
              id: string;
            }[];
          };
        }) => ({
          name: album.name,
          external_urls: album.external_urls,
          images: album.images,
          tracks: album.tracks.items.map((track) => ({
            name: track.name,
            external_urls: track.external_urls,
            preview_url: track.preview_url,
            id: track.id,
          })),
        })
      );

      return whatIsNeeded;
    },
  });

  console.log(data);

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
            <div className="max-w-2xl mx-auto lg:mx-0 ">
              {/* <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl"></h2> */}
              <Audio data={data} />
            </div>
            <SignOut />
          </div>
          <div className="w-full h-px bg-zinc-800" />
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Options data={data} />
          </div>
          <div className="hidden w-full h-px md:block bg-zinc-800" />
        </>
      )}
    </div>
  );
}
