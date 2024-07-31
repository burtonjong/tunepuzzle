import NextAuth, { type User } from "next-auth";
import Spotify from "next-auth/providers/spotify";
import "next-auth/jwt";
import { JWT } from "next-auth/jwt";

import type { AdapterUser } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Spotify({
      clientId: process.env.AUTH_SPOTIFY_ID,
      clientSecret: process.env.AUTH_SPOTIFY_SECRET,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email%20user-follow-read",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }): Promise<JWT | null> {
      // if this is the first time the JWT callback is called, include the accessToken
      if (account) {
        const userProfile: User = {
          id: token.sub,
          name: token.name,
          email: profile?.email,
          image: token?.picture,
        };

        return {
          access_token: account.access_token || "",
          expires_at: Date.now() - 1000, // its going to be 3600 between this and Date.now() / 1000
          refresh_token: account.refresh_token || "",
          user: userProfile,
        };
      } else if (Date.now() < token.expires_at * 1000) {
        // Subsequent logins, if the `access_token` is still valid, return the JWT
        return token;
      } else {
        // Subsequent logins, if the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new Error("Missing refresh token");

        console.log("refreshing!!!!!!!");

        try {
          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                client_id: process.env.AUTH_SPOTIFY_ID!,
                client_secret: process.env.AUTH_SPOTIFY_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refresh_token!,
              }),
            }
          );

          const responseTokens = await response.json();

          if (!response.ok) throw responseTokens;

          return {
            // Keep the previous token properties
            ...token,
            access_token: responseTokens.access_token,
            expires_at: Math.floor(
              Date.now() / 1000 + (responseTokens.expires_in as number)
            ),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: responseTokens.refresh_token ?? token.refresh_token,
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          // The error property can be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
      }
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as AdapterUser;
        session.accessToken = token.access_token;
      }

      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token: string;
    error?: "RefreshAccessTokenError";
  }
}
