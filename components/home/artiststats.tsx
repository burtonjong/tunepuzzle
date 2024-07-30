import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/card";
import { Numans } from "@next/font/google";

interface ArtistStatsProps {
  numArtists: number;
}

export default function ArtistStats({ numArtists }: ArtistStatsProps) {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["artists"] });
  };

  return (
    <div className="flex flex-row justify-around">
      <button
        onClick={() => handleRefresh()}
        className="text-zinc-100 hover:text-white"
      >
        <Card>
          <article className="relative w-full h-full p-4 md:p-8">
            Refresh
          </article>
        </Card>
      </button>
      {numArtists && (
        <h2
          id="number-artists"
          className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
        >
          {numArtists} followed artists
        </h2>
      )}
      <h2
        id="todo"
        className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
      >
        Todo: add filters
      </h2>
    </div>
  );
}
