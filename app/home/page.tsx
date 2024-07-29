import React from "react";
import { auth } from "@/auth";

import SignOut from "@/components/home/SignOut";

import ArtistsContainer from "@/components/home/artistscontainer";

export default async function HomePage() {
  const session = await auth();

  return (
    <>
      {session ? (
        <div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900 ">
          {" "}
          <div className="relative pb-16">
            <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
              <div className="flex flex-row justify-between w-full">
                <div className="max-w-2xl mx-auto lg:mx-0 ">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
                    Hi, {session.user?.name}
                  </h2>
                  <p className="mt-4 text-zinc-400">
                    Your followed Spotify artists will show up here. Click the
                    artists images to play.
                  </p>
                </div>
                <SignOut />
              </div>
              <div className="w-full h-px bg-zinc-800" />
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <ArtistsContainer token={session?.accessToken ?? ""} />
              </div>

              <div className="hidden w-full h-px md:block bg-zinc-800" />
            </div>
          </div>
        </div>
      ) : (
        <h1>An error occured</h1>
      )}
    </>
  );
}
