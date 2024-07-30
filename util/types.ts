export type Image = {
  url: string;
  height: number;
  width: number;
};

export type Song = {
  name: string;
  id: string;
  preview_url: string;
  external_urls: {
    spotify: string;
  };
  images: Image[];
};
