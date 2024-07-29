import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";
import "next-auth/jwt";

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
    async jwt({ token, account }) {
      // if this is the first time the JWT callback is called, include the accessToken
      if (account) {
        token.accessToken = account.access_token;
      }

      // console.log("JWT Callback - Token:", token);

      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
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
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
