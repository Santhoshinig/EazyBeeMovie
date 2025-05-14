import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "@/services/tmdbApi";
import MediaCard from "@/components/MediaCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const GENRES = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
  // Regional categories
  kdrama: "Korean Drama",
  cdrama: "Chinese Drama",
};

export default function Series() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "popular";
  const [localSeries, setLocalSeries] = useState([]);

  // Load local content
  useEffect(() => {
    const storedContent = JSON.parse(
      localStorage.getItem("eazybee-content") || "[]",
    );
    // Filter content by type (tv, kdrama, cdrama)
    const tvContent = storedContent
      .filter(
        (item) =>
          item.type === "tv" ||
          item.type === "kdrama" ||
          item.type === "cdrama",
      )
      .map((item) => ({
        ...item,
        media_type: "local",
        poster_path: item.poster?.url,
      }));
    setLocalSeries(tvContent);
  }, []);

  const handleCategoryChange = (value: string) => {
    setSearchParams({ category: value });
  };

  // Fetch popular TV shows
  const { data: popularSeries, isLoading: loadingPopular } = useQuery({
    queryKey: ["tv", "popular"],
    queryFn: () => tmdbApi.getPopular("tv"),
  });

  // Fetch K-dramas (using South Korea as origin country)
  const { data: kdramas, isLoading: loadingKdramas } = useQuery({
    queryKey: ["tv", "kdrama"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=0eb6fad5c86426c9bfd3242d294bd074&with_original_language=ko&sort_by=popularity.desc`,
      );
      return response.json();
    },
  });

  // Fetch C-dramas (using China as origin country)
  const { data: cdramas, isLoading: loadingCdramas } = useQuery({
    queryKey: ["tv", "cdrama"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=0eb6fad5c86426c9bfd3242d294bd074&with_original_language=zh&sort_by=popularity.desc`,
      );
      return response.json();
    },
  });

  // Fetch genre-based content
  const { data: genreContent, isLoading: loadingGenre } = useQuery({
    queryKey: ["tv", "genre", currentCategory],
    queryFn: () => {
      if (Object.keys(GENRES).includes(currentCategory)) {
        return tmdbApi.getByGenre("tv", parseInt(currentCategory));
      }
      return null;
    },
    enabled:
      Object.keys(GENRES).includes(currentCategory) &&
      currentCategory !== "kdrama" &&
      currentCategory !== "cdrama",
  });

  const isLoading =
    loadingPopular ||
    (currentCategory === "kdrama" && loadingKdramas) ||
    (currentCategory === "cdrama" && loadingCdramas) ||
    (Object.keys(GENRES).includes(currentCategory) && loadingGenre);

  // Determine which content to display based on the selected category
  const getDisplayContent = () => {
    if (currentCategory === "popular" && popularSeries) {
      const apiContent = popularSeries.results.map((show) => ({
        ...show,
        media_type: "tv",
      }));
      const localContent = localSeries.filter(
        (item) =>
          item.type === "tv" || !["kdrama", "cdrama"].includes(item.type),
      );
      return [...localContent, ...apiContent];
    } else if (currentCategory === "kdrama") {
      const apiContent = kdramas
        ? kdramas.results.map((show) => ({ ...show, media_type: "tv" }))
        : [];
      const localContent = localSeries.filter((item) => item.type === "kdrama");
      return [...localContent, ...apiContent];
    } else if (currentCategory === "cdrama") {
      const apiContent = cdramas
        ? cdramas.results.map((show) => ({ ...show, media_type: "tv" }))
        : [];
      const localContent = localSeries.filter((item) => item.type === "cdrama");
      return [...localContent, ...apiContent];
    } else if (genreContent) {
      // For genre categories, just show API content as local content doesn't have TMDB genre IDs
      return genreContent.results.map((show) => ({
        ...show,
        media_type: "tv",
      }));
    }
    return [];
  };

  const displayContent = getDisplayContent();

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          TV Series
        </h1>

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
                Popular Series
              </TabsTrigger>
              <TabsTrigger
                value="kdrama"
                className="flex-shrink-0 data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black"
              >
                K-Drama
              </TabsTrigger>
              <TabsTrigger
                value="cdrama"
                className="flex-shrink-0 data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black"
              >
                C-Drama
              </TabsTrigger>
              {Object.entries(GENRES).map(([id, name]) => {
                if (id !== "kdrama" && id !== "cdrama") {
                  return (
                    <TabsTrigger
                      key={id}
                      value={id}
                      className="flex-shrink-0 data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black"
                    >
                      {name}
                    </TabsTrigger>
                  );
                }
                return null;
              })}
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
                {displayContent.map((show) => (
                  <MediaCard
                    key={`${show.id}-${show.media_type}`}
                    media={show}
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
