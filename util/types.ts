interface Artist {
  type: string;
  uri: string;
  name: string;
  href: string;
  id: string;
  popularity: number;
  external_urls: {
    spotify: string;
  };
  images: Image[];
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
}

interface Image {
  url: string;
  height: number;
  width: number;
}
