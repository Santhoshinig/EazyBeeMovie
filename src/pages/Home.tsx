import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { tmdbApi, getImageUrl } from "@/services/tmdbApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import MediaCard from "@/components/MediaCard";
import HomeBanner from "@/components/HomeBanner";
import GenreCategories from "@/components/GenreCategories";

// Local storage keys
const CONTENT_STORAGE_KEY = "eazybee-content";
const CONTINUE_WATCHING_KEY = "eazybee-continue-watching";
const WATCHLIST_KEY = "watchlist";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);
  const [featuredItem, setFeaturedItem] = useState(null);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [continueWatching, setContinueWatching] = useState([]);
  const [localContent, setLocalContent] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Load local content, continue watching data, and watchlist
  useEffect(() => {
    if (isAuthenticated) {
      // Load content from localStorage
      const storedContent = JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY) || "[]");
      setLocalContent(storedContent.map(item => ({
        ...item,
        media_type: "local",
        poster_path: item.poster?.url
      })));

      // Load continue watching data
      const storedContinueWatching = JSON.parse(localStorage.getItem(CONTINUE_WATCHING_KEY) || "[]");
      setContinueWatching(storedContinueWatching);

      // Load watchlist
      const storedWatchlist = JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
      setWatchlist(storedWatchlist);
    }
  }, [isAuthenticated]);

  // Fetch data from TMDB API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get genres
        const movieGenres = await tmdbApi.getGenres("movie");
        const tvGenres = await tmdbApi.getGenres("tv");

        const genresMap = {};
        [...movieGenres.genres, ...tvGenres.genres].forEach((genre) => {
          genresMap[genre.id] = genre.name;
        });
        setGenres(genresMap);

        // Get trending content
        const trendingData = await tmdbApi.getTrending();
        setTrending(trendingData.results.map(item => ({
          ...item,
          media_type: item.media_type || "movie"
        })));

        // Set featured item
        const featuredContent = trendingData.results.find(item => 
          (item.backdrop_path && item.overview && item.overview.length > 100)
        );
        setFeaturedItem(featuredContent);

        // Get popular movies
        const movies = await tmdbApi.getPopular("movie");
        setPopularMovies(movies.results.map(movie => ({
          ...movie,
          media_type: "movie"
        })));

        // Get popular TV shows
        const shows = await tmdbApi.getPopular("tv");
        setPopularShows(shows.results.map(show => ({
          ...show,
          media_type: "tv"
        })));

      } catch (error) {
        console.error("Error fetching home data:", error);
        toast.error("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handlePlayContinueWatching = (item) => {
    // Update the progress (in a real app, this would track actual playback)
    const updatedProgress = Math.min(item.progress + 10, 100);

    const updatedItem = {
      ...item,
      progress: updatedProgress,
      lastWatched: new Date().toISOString()
    };

    // Update the item in the continue watching list
    const updatedList = continueWatching.map(watchItem => 
      watchItem.id === item.id ? updatedItem : watchItem
    );

    setContinueWatching(updatedList);
    localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updatedList));

    // Navigate to media detail page
    if (item.media_type === 'local') {
      navigate(`/movie/${item.id}`);
    } else {
      navigate(`/${item.media_type}/${item.id}`);
    }
  };

  // Add to continue watching (for new content)
  const addToContinueWatching = (media) => {
    // Check if already in continue watching
    const existing = continueWatching.find(item => item.id === media.id);

    if (!existing) {
      const continueWatchingItem = {
        ...media,
        progress: 0,
        runtime: media.duration || 120,
        lastWatched: new Date().toISOString()
      };

      const updatedList = [continueWatchingItem, ...continueWatching];
      setContinueWatching(updatedList);
      localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updatedList));
    }

    // Navigate to media detail page
    if (media.media_type === 'local') {
      navigate(`/movie/${media.id}`);
    } else {
      navigate(`/${media.media_type}/${media.id}`);
    }
  };

  if (loading) {
    return (
      <div className="pt-20">
        <Skeleton className="w-full h-[50vh] md:h-[70vh]" />
        <div className="container mx-auto px-4 pt-8">
          <Skeleton className="w-1/3 h-8 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* New Banner Component - Replacing Hero Section */}
      <HomeBanner />

      <div className="container mx-auto px-4">
        {/* Popular Genres Section */}
        <GenreCategories />

        {/* Watchlist */}
        {watchlist.length > 0 && (
          <div className="py-4 mt-8">
            <h2 className="text-xl font-medium mb-4">My Watchlist</h2>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {watchlist.map((item) => (
                <MediaCard 
                  key={`watchlist-${item.id}-${item.media_type}`} 
                  media={item} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <div className="py-4 mt-8">
            <h2 className="text-xl font-medium mb-4">Continue Watching</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {continueWatching.map((item) => (
                <div key={`continue-${item.id}-${item.media_type}`} className="rounded-lg overflow-hidden bg-eazybee-dark-accent card-hover">
                  <div className="relative">
                    <img 
                      src={item.poster_path?.startsWith('blob:') ? item.poster_path : getImageUrl(item.poster_path, "w500")}
                      alt={item.title || item.name}
                      className="w-full aspect-video object-cover object-center"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        className="w-14 h-14 bg-eazybee-yellow rounded-full flex items-center justify-center"
                        onClick={() => handlePlayContinueWatching(item)}
                      >
                        <span className="sr-only">Play</span>
                        <svg 
                          className="w-6 h-6 text-black ml-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{item.title || item.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {Math.floor((100 - item.progress) * (item.runtime || 30) / 100)}m left
                      </span>
                    </div>
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-eazybee-yellow" 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Content */}
        {localContent.length > 0 && (
          <div className="py-4 mt-8">
            <h2 className="text-xl font-medium mb-4">Your Uploads</h2>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {localContent.map(item => (
                <MediaCard 
                  key={`local-${item.id}`} 
                  media={item} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Trending Now - Using Grid Layout */}
        {trending.length > 0 && (
          <div className="py-4 mt-8">
            <h2 className="text-xl font-medium mb-4">Trending Now</h2>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {trending.slice(0, 12).map(item => (
                <MediaCard 
                  key={`trending-${item.id}`} 
                  media={item} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Popular Movies - Using Grid Layout */}
        {popularMovies.length > 0 && (
          <div className="py-4 mt-8">
            <h2 className="text-xl font-medium mb-4">Popular Movies</h2>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {popularMovies.slice(0, 12).map(movie => (
                <MediaCard 
                  key={`movie-${movie.id}`} 
                  media={movie}
                />
              ))}
            </div>
          </div>
        )}

        {/* Popular TV Shows - Using Grid Layout */}
        {popularShows.length > 0 && (
          <div className="py-4 mt-8">
            <h2 className="text-xl font-medium mb-4">Popular TV Series</h2>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {popularShows.slice(0, 12).map(show => (
                <MediaCard 
                  key={`show-${show.id}`} 
                  media={show}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}