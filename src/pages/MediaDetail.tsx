import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Comments from "@/components/Comments";
import { tmdbApi, getImageUrl } from "@/services/tmdbApi";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Play, Plus, Check, Star } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MediaCarousel from "@/components/MediaCarousel";
import { toast } from "@/components/ui/sonner";

export default function MediaDetail() {
  const { id } = useParams<{ id: string }>();
  const type = useParams<{ type?: string }>().type as "movie" | "tv" || "movie";
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isInWatchlist, setIsInWatchlist] = useState<boolean>(false);

  const mediaId = parseInt(id || "0");

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const exists = watchlist.some((item: any) => 
      item.id === mediaId && item.media_type === type
    );
    setIsInWatchlist(exists);
  }, [mediaId, type]);

  const { data: mediaDetails, isLoading: loadingDetails, error } = useQuery({
    queryKey: ["mediaDetail", type, mediaId],
    queryFn: () => tmdbApi.getDetails(type!, mediaId),
    enabled: !!type && !!mediaId
  });

  const { data: mediaVideos, isLoading: loadingVideos } = useQuery({
    queryKey: ["mediaVideos", type, mediaId],
    queryFn: () => tmdbApi.getVideos(type!, mediaId),
    enabled: !!type && !!mediaId
  });

  const { data: recommendations, isLoading: loadingRecommendations } = useQuery({
    queryKey: ["recommendations", type, mediaId],
    queryFn: () => tmdbApi.getRecommendations(type!, mediaId),
    enabled: !!type && !!mediaId
  });

  const { data: similarContent } = useQuery({
    queryKey: ["similar", type, mediaId],
    queryFn: () => tmdbApi.getSimilar(type!, mediaId),
    enabled: !!type && !!mediaId
  });

  if (loadingDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[50vh] w-full rounded-lg mb-4" />
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-6 w-full max-w-2xl mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  // Check for local content
  const localContent = JSON.parse(localStorage.getItem('eazybee-content') || '[]')
    .find((item: any) => item.id === mediaId);

  if (localContent) {
    return (
      <div className="pb-16">
        <div className="w-full h-[40vh] md:h-[50vh] relative bg-cover bg-center"
          style={{
            backgroundImage: `url(${localContent.poster?.url || '/no-image.png'})`,
          }}>
          <div className="absolute inset-0 bg-gradient-to-t from-eazybee-dark via-eazybee-dark/60 to-transparent" />
          {localContent.video && (
            <div className="absolute inset-0 flex items-center justify-center">
              <video
                src={localContent.video.url || localContent.video}
                controls
                className="w-full h-full object-contain"
                controlsList="nodownload"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="w-full max-w-[150px] sm:max-w-[180px] md:max-w-[200px] mx-auto md:mx-0">
              <img 
                src={localContent.poster?.url || '/no-image.png'}
                alt={localContent.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="category-badge bg-eazybee-yellow text-black">
                  {localContent.type}
                </span>
                {localContent.releaseYear && (
                  <span className="category-badge">{localContent.releaseYear}</span>
                )}
                {localContent.genre && (
                  <span className="category-badge">{localContent.genre}</span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                {localContent.title}
              </h1>

              <p className="text-gray-300 mt-4">{localContent.description}</p>

              {localContent.duration && (
                <div className="mt-4">
                  <span className="text-gray-400">Duration: </span>
                  <span>{localContent.duration} minutes</span>
                </div>
              )}

              {localContent.cast && (
                <div className="mt-2">
                  <span className="text-gray-400">Cast: </span>
                  <span>{localContent.cast}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !mediaDetails) {
    return (
      <div className="py-16 container mx-auto px-4">
        <div className="bg-eazybee-dark-accent rounded-xl p-4 md:p-8">
          <h2 className="text-xl font-semibold mb-4">Content Not Found</h2>
          <p className="text-gray-400">The requested content could not be found or is currently unavailable.</p>
        </div>
      </div>
    );
  }

  const title = type === "movie" ? mediaDetails.title : mediaDetails.name;
  const releaseDate = type === "movie" 
    ? mediaDetails.release_date 
    : mediaDetails.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "";

  // Find a YouTube trailer if available
  const trailer = mediaVideos?.results?.find(
    video => video.type === "Trailer" && video.site === "YouTube"
  );

  const handlePlay = () => {
    if (trailer) {
      setIsPlaying(true);

      // Add to watch history
      const historyItem = {
        id: mediaDetails.id,
        title: mediaDetails.title || mediaDetails.name,
        poster_path: mediaDetails.poster_path,
        backdrop_path: mediaDetails.backdrop_path,
        media_type: type,
        watched_at: new Date().toISOString()
      };

      const history = JSON.parse(localStorage.getItem('watch-history') || '[]');
      // Remove if already exists
      const filteredHistory = history.filter((item: any) => item.id !== mediaDetails.id);
      // Add to beginning of array
      const updatedHistory = [historyItem, ...filteredHistory];
      localStorage.setItem('watch-history', JSON.stringify(updatedHistory));

      // Trigger update event
      window.dispatchEvent(new CustomEvent('watchHistoryUpdate'));
    } else {
      toast.info("No trailer available for this title");
    }
  };

  const handleAddToWatchlist = () => {
    if (!mediaDetails) return;

    setIsInWatchlist(!isInWatchlist);

    const watchlistItem = {
      id: mediaDetails.id,
      title: mediaDetails.title || mediaDetails.name,
      poster_path: mediaDetails.poster_path,
      backdrop_path: mediaDetails.backdrop_path,
      media_type: type
    };

    if (!isInWatchlist) {
      // Add to watchlist
      toast.success(`Added ${mediaDetails.title || mediaDetails.name} to your watchlist`);

      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      watchlist.push(watchlistItem);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    } else {
      // Remove from watchlist
      toast.info(`Removed ${mediaDetails.title || mediaDetails.name} from your watchlist`);

      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      const updatedWatchlist = watchlist.filter((item: any) => 
        !(item.id === mediaId && item.media_type === type)
      );
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    }
  };

  return (
    <div className="pb-16">
      {/* Backdrop Image */}
      <div 
        className="w-full h-[40vh] md:h-[50vh] relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${getImageUrl(mediaDetails.backdrop_path, "original")})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-eazybee-dark via-eazybee-dark/60 to-transparent" />

        {isPlaying && trailer ? (
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <div className="relative w-full h-full">
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="bg-eazybee-dark/90 p-3 rounded-full hover:bg-eazybee-yellow hover:text-black transition-all hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`}
                title={`${title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={handlePlay} 
              className="w-14 h-14 md:w-16 md:h-16 bg-eazybee-yellow rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Play className="w-6 h-6 md:w-8 md:h-8 text-black ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Poster */}
          <div className="w-full max-w-[150px] sm:max-w-[180px] md:max-w-[200px] mx-auto md:mx-0">
            <img 
              src={getImageUrl(mediaDetails.poster_path, "w500")} 
              alt={title} 
              className="w-full rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {type === "movie" && (
                <span className="category-badge bg-eazybee-yellow text-black">Movie</span>
              )}
              {type === "tv" && (
                <span className="category-badge bg-eazybee-yellow text-black">TV Series</span>
              )}
              {releaseYear && <span className="category-badge">{releaseYear}</span>}

              {mediaDetails.genres?.slice(0, 3).map(genre => (
                <span key={genre.id} className="category-badge">
                  {genre.name}
                </span>
              ))}

              {mediaDetails.vote_average && (
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="h-4 w-4 text-eazybee-yellow fill-eazybee-yellow" />
                  <span>{mediaDetails.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{title}</h1>

            <div className="flex flex-wrap gap-4 mb-6 md:mb-8">
              <button 
                className="btn-primary"
                onClick={handlePlay}
              >
                <Play size={18} />
                Play
              </button>

              <button 
                className={`${isInWatchlist ? 'bg-eazybee-yellow text-black' : 'btn-secondary'}`}
                onClick={handleAddToWatchlist}
              >
                {isInWatchlist ? (
                  <>
                    <Check size={18} />
                    Added to Watchlist
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Add to Watchlist
                  </>
                )}
              </button>
            </div>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-transparent">
                <TabsTrigger value="overview" className="data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black">
                  Overview
                </TabsTrigger>
                {type === "tv" && (
                  <TabsTrigger value="episodes" className="data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black">
                    Episodes
                  </TabsTrigger>
                )}
                <TabsTrigger value="cast" className="data-[state=active]:bg-eazybee-yellow data-[state=active]:text-black">
                  Cast
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-4">
                {mediaDetails.overview ? (
                  <p className="text-gray-300">{mediaDetails.overview}</p>
                ) : (
                  <p className="text-gray-500">No overview available.</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                  {type === "movie" && mediaDetails.runtime && (
                    <div>
                      <h3 className="text-sm text-gray-400">Runtime</h3>
                      <p>{Math.floor(mediaDetails.runtime / 60)}h {mediaDetails.runtime % 60}m</p>
                    </div>
                  )}

                  {type === "tv" && mediaDetails.number_of_seasons && (
                    <div>
                      <h3 className="text-sm text-gray-400">Seasons</h3>
                      <p>{mediaDetails.number_of_seasons}</p>
                    </div>
                  )}

                  {type === "tv" && mediaDetails.number_of_episodes && (
                    <div>
                      <h3 className="text-sm text-gray-400">Episodes</h3>
                      <p>{mediaDetails.number_of_episodes}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm text-gray-400">Status</h3>
                    <p>{mediaDetails.status}</p>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-400">Language</h3>
                    <p>{mediaDetails.original_language?.toUpperCase()}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="episodes" className="pt-4">
                {type === "tv" && mediaDetails.seasons ? (
                  <div className="space-y-4">
                    {mediaDetails.seasons.map(season => (
                      <div key={season.id} className="p-4 rounded-lg bg-eazybee-dark-accent">
                        <h3 className="font-bold">{season.name}</h3>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{season.episode_count} episodes</span>
                          <span>{season.air_date ? new Date(season.air_date).getFullYear() : "TBA"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No episode information available.</p>
                )}
              </TabsContent>

              <TabsContent value="cast" className="pt-4">
                <p className="text-gray-500">Cast information not available in this API endpoint.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Recommendations */}
        {!loadingRecommendations && recommendations?.results?.length > 0 && (
          <div className="mt-10 md:mt-12">
            <MediaCarousel
              title="More Like This" 
              media={recommendations.results.map(item => ({
                ...item,
                media_type: type
              }))}
            />
          </div>
        )}

        {/* Similar Content */}
        {similarContent?.results?.length > 0 && (
          <div className="mt-10 md:mt-12">
            <MediaCarousel
              title="Similar Content" 
              media={similarContent.results.map(item => ({
                ...item,
                media_type: type
              }))}
            />
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-10 md:mt-12">
          <h2 className="text-xl font-medium mb-6">Reviews & Ratings</h2>
          <Comments mediaId={mediaId} mediaType={type} />
        </div>
      </div>
    </div>
  );
}