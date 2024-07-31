import Link from "next/link";
import React from "react";
import Particles from "../components/particles";
import { signIn } from "@/auth";

const navigation = [
  { name: "Login", type: "action", action: "login" },
  { name: "Contact", type: "link", href: "/contact" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav className="my-16 animate-fade-in">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) =>
            item.type === "link" ? (
              <Link
                key={item.href}
                href={item.href || ""}
                className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
              >
                {item.name}
              </Link>
            ) : (
              <form
                key={item.action}
                action={async () => {
                  "use server";
                  await signIn("spotify", { redirectTo: "/home" });
                }}
              >
                <button
                  type="submit"
                  className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
                >
                  {item.name}
                </button>
              </form>
            )
          )}
        </ul>
      </nav>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <Particles
        className="absolute inset-0 -z-10 animate-fade-in"
        quantity={1000}
      />
      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
        tunepuzzle
      </h1>

      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="my-16 text-center animate-fade-in">
        <h2 className="text-md text-zinc-400 pb-1">
          An app built with{" "}
          <Link
            target="_blank"
            href="https://open.spotify.com/"
            className="underline duration-500 hover:text-zinc-300"
          >
            Spotify
          </Link>{" "}
          to guess songs.
        </h2>
        <h2 className="text-sm text-zinc-500 ">
          Special thanks to{" "}
          <Link
            target="_blank"
            href="https://github.com/chronark/chronark.com"
            className="underline duration-500 hover:text-zinc-300"
          >
            chronark
          </Link>{" "}
          and{" "}
          <Link
            target="_blank"
            href="https://github.com/drcmda"
            className="underline duration-500 hover:text-zinc-300"
          >
            drcmda.
          </Link>{" "}
        </h2>
      </div>
    </div>
  );
}
