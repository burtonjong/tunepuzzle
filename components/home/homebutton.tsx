"use client";
import { useRouter } from "next/navigation";

export default function HomeButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/")}
      className="duration-200 text-zinc-300 hover:text-zinc-100"
    >
      Home
    </button>
  );
}
