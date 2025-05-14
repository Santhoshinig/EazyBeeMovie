
import { Link } from "react-router-dom";
import { Tags } from "lucide-react";

interface Genre {
  id: number;
  name: string;
  icon?: React.ReactNode;
  color?: string;
}

export default function GenreCategories() {
  // Popular genre categories with custom styling
  const genres: Genre[] = [
    { id: 28, name: "Action", color: "from-red-500 to-orange-500" },
    { id: 35, name: "Comedy", color: "from-yellow-400 to-amber-500" },
    { id: 18, name: "Drama", color: "from-blue-500 to-indigo-500" },
    { id: 27, name: "Horror", color: "from-purple-600 to-fuchsia-600" },
    { id: 10749, name: "Romance", color: "from-pink-500 to-rose-500" },
    { id: 878, name: "Sci-Fi", color: "from-cyan-500 to-blue-500" },
    { id: 53, name: "Thriller", color: "from-emerald-500 to-green-600" },
    { id: 16, name: "Animation", color: "from-violet-500 to-purple-600" },
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium md:text-2xl">
          <span className="inline-flex items-center gap-2">
            <Tags size={20} className="text-eazybee-yellow" />
            Popular Genres
          </span>
        </h2>
        <Link to="/browse" className="text-sm text-eazybee-yellow hover:underline">
          View all
        </Link>
      </div>

      <div className="grid grid-rows-2 grid-flow-col gap-3">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            to={`/browse?category=genre&genreId=${genre.id}`}
            className="relative overflow-hidden transition-transform duration-300 rounded-lg group hover:scale-105"
          >
            <div className={`bg-gradient-to-r ${genre.color} h-32 flex items-center justify-center p-4`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <h3 className="relative z-10 text-xl font-bold text-center text-white">{genre.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
