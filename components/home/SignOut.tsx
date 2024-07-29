"use client";
import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <button
      onClick={() => signOut()}
      className="duration-200 text-zinc-300 hover:text-zinc-100"
    >
      Sign out
    </button>
  );
}
