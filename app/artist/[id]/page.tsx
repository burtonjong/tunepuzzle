import React from "react";
import { auth } from "@/auth";

import GuessContainer from "@/components/artist/guesscontainer";
import { Navigation } from "@/components/nav";
export default async function HomePage() {
  const session = await auth();

  return (
    <>
      {session ? (
        <div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-zinc-400/10 to-zinc-900 ">
          <Navigation />{" "}
          <div className="relative pb-16">
            <GuessContainer token={session?.accessToken ?? ""} />
          </div>
        </div>
      ) : (
        <h1>An error occured</h1>
      )}
    </>
  );
}
