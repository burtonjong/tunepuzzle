import { config } from "dotenv";

config();

export const CLIENT_ID = process.env.AUTH_SPOTIFY_ID as string;

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientSecret = process.env.CLIENT_SECRET;

  if (!clientSecret) {
    return res.status(500).json({ error: "Client secret not configured" });
  }

  res.status(200).json({ message: "Client secret is safe", clientSecret });
}
