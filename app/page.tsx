import Link from "next/link";
import React from "react";
import Particles from "../components/particles";
import { signIn } from "@/auth";

const navigation = [
  { name: "Login", type: "action", action: "login" },
  { name: "Contact", type: "link", href: "/contact" },
];

export default function Home() {
  // for fetching client secret from the api route

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("/api/secret");
  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.status}`);
  //       }
  //       const result = await response.json();
  //       console.log(result);
  //     } catch (err: any) {
  //       console.error(err.message);
  //     }
  //   };

  //   fetchData();
  // }, []);
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
                action={async () => {
                  "use server";
                  await signIn("spotify");
                }}
              >
                <button
                  key={item.action}
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
        quantity={100}
      />
      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
        tunepuzzle
      </h1>

      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="my-16 text-center animate-fade-in">
        <h2 className="text-sm text-zinc-500 ">
          An app built with{" "}
          <Link
            target="_blank"
            href="https://unkey.dev"
            className="underline duration-500 hover:text-zinc-300"
          >
            Spotify
          </Link>{" "}
          to guess songs.
        </h2>
      </div>
    </div>
  );
}
