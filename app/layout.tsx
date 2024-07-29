import "../global.css";
import Provider from "@/contexts/Provider";
import { Inter } from "@next/font/google";
import LocalFont from "@next/font/local";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "tunepuzzle",
    template: "%s | tunepuzzle",
  },
  description: "guessing songs based on audio",
  openGraph: {
    title: "tunepuzzle",
    description: "guessing songs based on audio",
    url: "tunepuzzle.vercel.app",
    siteName: "tunepuzzle",
    images: [
      {
        url: "https://media.wired.com/photos/64125850412651fa6ee1479c/master/pass/AI-Powered-Future-of-Sound-Culture-1439768811.jpg",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    shortcut: "/favicon.png",
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <body
        className={`bg-black ${
          process.env.NODE_ENV === "development" ? "debug-screens" : undefined
        }`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
