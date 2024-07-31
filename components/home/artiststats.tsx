import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/card";

interface ArtistStatsProps {
  numArtists: number;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ArtistStats({
  numArtists,
  handleSearchChange,
}: ArtistStatsProps) {
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
          <article className="relative w-full h-full p-2 md:p-4">
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

      <input
        className="px-3 overflow-hidden relative duration-700 border focus:outline-none rounded-xl hover:bg-zinc-500/10 bg-zinc-800/10 group md:gap-8 hover:border-zinc-400/50 border-zinc-600 text-white"
        type="text"
        placeholder="Search for an artist"
        onChange={(e) => handleSearchChange(e)}
      />
    </div>
  );
}
