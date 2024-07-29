import { Session } from "next-auth";
import React from "react";

import { Card } from "@/components/card";
import Link from "next/link";

export default function ArtistsContainer({ session }: { session: Session }) {
  return (
    <>
      {session ? (
        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
          <Card>
            <Link href={`/home`}>
              <article className="relative w-full h-full p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-zinc-100">
                    <p>date</p>
                  </div>
                </div>

                <h2
                  id="featured-post"
                  className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                >
                  title
                </h2>
                <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                  desc
                </p>
              </article>
            </Link>
          </Card>
        </div>
      ) : (
        <h1>Didnt work</h1>
      )}
    </>
  );
}
