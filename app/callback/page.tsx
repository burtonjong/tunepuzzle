"use client";

import { useQuery } from "@tanstack/react-query";

import {
  redirectToAuthCodeFlow,
  fetchProfile,
  getAccessToken,
} from "@/util/loginFlow";

import { CLIENT_ID } from "@/pages/api/secret";

type UserProfile = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: { spotify: string };
  followers: { href: string; total: number };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
};

export default function CallbackPage() {
  // tanstack query for fetching profile
  const { data, isFetching } = useQuery({
    initialData: {} as UserProfile,
    queryKey: ["User"],
    queryFn: async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) {
        redirectToAuthCodeFlow(CLIENT_ID);
      } else {
        const accessToken = await getAccessToken(CLIENT_ID, code);
        const profile = await fetchProfile(accessToken);
        return profile;
      }
    },
  });

  return (
    <div className="bg-white 2-full flex justify-center items-center">
      {isFetching ? (
        <>
          <h1>Loading...</h1>
        </>
      ) : (
        <>
          <h1>succesfully logged in</h1>
          <h2>{data?.display_name}</h2>
          {data?.images?.[0]?.url && (
            <img src={data.images[0].url} alt="profile" />
          )}
        </>
      )}
    </div>
  );
}
