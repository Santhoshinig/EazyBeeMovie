import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "@/services/tmdbApi";
import MediaCard from "@/components/MediaCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "trending";
  const urlSearchTerm = searchParams.get("search") || "";
  const genreId = searchParams.get("genreId");
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(urlSearchTerm);

  // Update search term when URL parameter changes
  useEffect(() => {
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
      setDebouncedSearchTerm(urlSearchTerm);
    }
  }, [urlSearchTerm]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update URL when search changes
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 0) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("search", debouncedSearchTerm);
      setSearchParams(newParams);
    } else if (searchParams.has("search")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("search");
      setSearchParams(newParams);
    }
  }, [debouncedSearchTerm]);

  const handleCategoryChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", value);
    setSearchParams(newParams);
  };

  // Fetch trending content
  const { data: trendingContent, isLoading: loadingTrending } = useQuery({
    queryKey: ["browse", "trending"],
    queryFn: () => tmdbApi.getTrending("all", "week")
  });

  // Fetch movies
  const { data: moviesContent, isLoading: loadingMovies } = useQuery({
    queryKey: ["browse", "movies"],
    queryFn: () => tmdbApi.getPopular("movie")
  });

  // Fetch TV shows
  const { data: tvContent, isLoading: loadingTv } = useQuery({
    queryKey: ["browse", "tv"],
    queryFn: () => tmdbApi.getPopular("tv")
  });

  // Search content
  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    queryKey: ["search", debouncedSearchTerm],
    queryFn: () => tmdbApi.searchContent(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 2
  });

  const isLoading = (currentCategory === "trending" && loadingTrending) ||
                   (currentCategory === "movies" && loadingMovies) ||
                   (currentCategory === "tv" && loadingTv) ||
                   (debouncedSearchTerm && loadingSearch);

  // Genre-based content
  const { data: genreContent, isLoading: loadingGenre } = useQuery({
    queryKey: ["browse", "genre", genreId],
    queryFn: () => tmdbApi.getByGenre("movie", parseInt(genreId!)),
    enabled: currentCategory === "genre" && !!genreId
  });

  // Determine which content to display based on the selected category
  const getDisplayContent = () => {
    if (debouncedSearchTerm && searchResults) {
      return searchResults.results.filter(item => 
        item.media_type === "movie" || item.media_type === "tv"
      );
    }

    if (currentCategory === "genre" && genreContent) {
      return genreContent.results.map(item => ({ ...item, media_type: "movie" }));
    } else if (currentCategory === "trending" && trendingContent) {
      return trendingContent.results;
    } else if (currentCategory === "movies" && moviesContent) {
      return moviesContent.results.map(movie => ({ ...movie, media_type: "movie" }));
    } else if (currentCategory === "tv" && tvContent) {
      return tvContent.results.map(show => ({ ...show, media_type: "tv" }));
    }

    return [];
  };

  const displayContent = getDisplayContent();

  return (
    <div className="pt-12 pb-16">
      <div className="container mx-auto px-4">

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search for movies or TV shows..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!debouncedSearchTerm && (
          <Tabs defaultValue={currentCategory} onValueChange={handleCategoryChange} className="mb-8">
            <TabsList className="mb-4 bg-transparent">
              <TabsTrigger value="trending" className="data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black">
                Trending
              </TabsTrigger>
              <TabsTrigger value="movies" className="data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black">
                Movies
              </TabsTrigger>
              <TabsTrigger value="tv" className="data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black">
                TV Shows
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {debouncedSearchTerm && (
          <h2 className="text-xl font-medium mb-4">
            Search results for: "{debouncedSearchTerm}"
          </h2>
        )}

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
          <>
            {displayContent.length > 0 ? (
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {displayContent.map((item) => (
                  <MediaCard key={`${item.id}-${item.media_type}`} media={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-xl text-gray-400">No results found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}