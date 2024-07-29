"use client";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/nav";
import { Card } from "@/components/card";

const socials = [
  {
    icon: <Mail size={20} />,
    href: "mailto:burtonjong05@gmail.com",
    label: "Email",
    handle: "burtonjong05@gmail.com",
  },
  {
    icon: <Github size={20} />,
    href: "https://github.com/burtonjong",
    label: "Github",
    handle: "burtonjong",
  },
  {
    icon: <Linkedin size={20} />,
    href: "https://www.linkedin.com/in/burtonjong/",
    label: "LinkedIn",
    handle: "burtonjong",
  },
];

export default function ContactPage() {
  return (
    <div className=" bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <Navigation />
      <div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
        <div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16">
          {socials.map((social) => (
            <Card>
              <Link
                href={social.href}
                target="_blank"
                className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24  lg:pb-48  md:p-16"
              >
                <span
                  className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
                  aria-hidden="true"
                />
                <span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
                  {social.icon}
                </span>{" "}
                <div className="z-10 flex flex-col items-center">
                  <span className="lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display">
                    {social.handle}
                  </span>
                  <span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
                    {social.label}
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
