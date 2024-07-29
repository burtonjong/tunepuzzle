"use client";

import { redirectToAuthCodeFlow } from "@/util/loginFlow";

import { CLIENT_ID } from "@/pages/api/secret";
import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) {
      redirectToAuthCodeFlow(CLIENT_ID);
    }
  }, []);

  return (
    <div className="bg-white 2-full flex justify-center items-center h-screen">
      <h1>Loading...</h1>
    </div>
  );
}
