"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Navigation } from "../../components/nav";
import { Card } from "../../components/card";
import { ArrowLeft } from "lucide-react";

export default function HomePage() {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative pb-16">
      <header ref={ref}>
        <div
          className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
            isIntersecting
              ? "bg-zinc-900/0 border-transparent"
              : "bg-zinc-900/500  border-zinc-800 "
          }`}
        >
          <div className="container p-6 mx-auto">
            <Link
              href="/"
              className="duration-200 text-zinc-300 hover:text-zinc-100"
            >
              <ArrowLeft className="w-6 h-6 " />
            </Link>
          </div>
        </div>
      </header>
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Login
          </h2>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        <div className="flex gap-8 w-1/3">
          <Card>
            <div className="flex justify-center w-full h-full p-4 md:p-8">
              <h2 className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">
                Login to Spotify
              </h2>
            </div>
          </Card>
        </div>
        <div className="hidden w-full h-px md:block bg-zinc-800" />
      </div>
    </div>
  );
}
