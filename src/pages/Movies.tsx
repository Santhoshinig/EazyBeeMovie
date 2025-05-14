import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "@/services/tmdbApi";
import MediaCard from "@/components/MediaCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "popular";
  const [localMovies, setLocalMovies] = useState([]);

  // Load local content
  useEffect(() => {
    const storedContent = JSON.parse(
      localStorage.getItem("eazybee-content") || "[]",
    );
    // Filter content by type (movie)
    const movieContent = storedContent
      .filter((item) => item.type === "movie")
      .map((item) => ({
        ...item,
        media_type: "local",
        poster_path: item.poster?.url,
      }));
    setLocalMovies(movieContent);
  }, []);

  const handleCategoryChange = (value: string) => {
    setSearchParams({ category: value });
  };

  // Fetch popular movies
  const { data: popularMovies, isLoading: loadingPopular } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => tmdbApi.getPopular("movie"),
  });

  // Fetch genre-based content
  const { data: genreContent, isLoading: loadingGenre } = useQuery({
    queryKey: ["movies", "genre", currentCategory],
    queryFn: () => {
      if (Object.keys(GENRES).includes(currentCategory)) {
        return tmdbApi.getByGenre("movie", parseInt(currentCategory));
      }
      return null;
    },
    enabled: Object.keys(GENRES).includes(currentCategory),
  });

  const isLoading =
    loadingPopular ||
    (Object.keys(GENRES).includes(currentCategory) && loadingGenre);

  // Determine which content to display based on the selected category
  const getDisplayContent = () => {
    if (currentCategory === "popular" && popularMovies) {
      const apiContent = popularMovies.results.map((movie) => ({
        ...movie,
        media_type: "movie",
      }));
      return [...localMovies, ...apiContent];
    } else if (genreContent) {
      // For genre categories, just show API content as local content doesn't have TMDB genre IDs
      return genreContent.results.map((movie) => ({
        ...movie,
        media_type: "movie",
      }));
    }
    return [];
  };

  const displayContent = getDisplayContent();

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Movies</h1>

        <Tabs
          defaultValue={currentCategory}
          onValueChange={handleCategoryChange}
          className="mb-8"
        >
          <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="mb-4 flex flex-nowrap gap-2 bg-transparent min-w-max w-full md:w-auto">
              <TabsTrigger
                value="popular"
                className="flex-shrink-0 data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black"
              >
                Popular Movies
              </TabsTrigger>
              {Object.entries(GENRES).map(([id, name]) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="flex-shrink-0 data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black"
                >
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={currentCategory}>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {displayContent.map((movie) => (
                  <MediaCard
                    key={`${movie.id}-${movie.media_type}`}
                    media={movie}
                  />
                ))}
              </div>
            )}

            {!isLoading && displayContent.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No content found for this category.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
