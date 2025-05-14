
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/services/tmdbApi";
import { Bookmark, BookmarkPlus, Play } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface MediaCardProps {
  media: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    poster?: { url: string };
    media_type: "movie" | "tv" | "local" | string;
    first_air_date?: string;
    release_date?: string;
    type?: string;
    genre?: string;
  };
  showType?: boolean;
}

export default function MediaCard({ media, showType = true }: MediaCardProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const title = media.title || media.name || "Untitled";
  const type = media.media_type || media.type || "movie";
  
  // Get image URL based on source (TMDB or local)
  const getPosterUrl = () => {
    if (media.poster && media.poster.url) {
      return media.poster.url;
    } else if (media.poster_path) {
      return getImageUrl(media.poster_path, "w500");
    } else if (media.backdrop_path) {
      return getImageUrl(media.backdrop_path, "w500");
    }
    return "/no-image.png";
  };
  
  const imageUrl = getPosterUrl();
  const releaseYear = media.release_date?.substring(0, 4) || 
    media.first_air_date?.substring(0, 4) || "";

  // Check if the media is in watchlist on component mount
  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const found = watchlist.some((item: any) => item.id === media.id);
    setIsInWatchlist(found);
  }, [media.id]);

  const handleAddToWatchlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    
    if (!isInWatchlist) {
      // Add to watchlist
      const updatedWatchlist = [...watchlist, media];
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      setIsInWatchlist(true);
      toast.success(`Added "${title}" to your watchlist`);
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('watchlistUpdate'));
    } else {
      // Remove from watchlist
      const filteredWatchlist = watchlist.filter((item: any) => item.id !== media.id);
      localStorage.setItem('watchlist', JSON.stringify(filteredWatchlist));
      setIsInWatchlist(false);
      toast.info(`Removed "${title}" from your watchlist`);
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('watchlistUpdate'));
    }
  };
  
  // Determine link URL based on content type
  const getMediaLink = () => {
    if (type === "local" || media.media_type === "local") {
      // Use the content type from the item itself for correct routing
      const contentType = media.type || type;
      return `/${contentType}/${media.id}`;
    }
    return `/${type}/${media.id}`;
  };

  return (
    <div className="group relative rounded-lg overflow-hidden card-hover">
      <Link to={getMediaLink()}>
        <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
          <img 
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/no-image.png";
            }}
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="w-12 h-12 rounded-full bg-eazybee-yellow flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play size={20} className="text-black ml-1" />
            </div>
          </div>
          
          <button 
            className={`absolute top-2 right-2 p-1.5 ${isInWatchlist ? 'bg-eazybee-yellow text-black' : 'bg-black/60'} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            onClick={handleAddToWatchlist}
            aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            {isInWatchlist ? 
              <Bookmark size={18} /> : 
              <BookmarkPlus size={18} />
            }
          </button>
          
          {showType && (
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium capitalize">
                  {media.genre || type}
                </span>
                {releaseYear && <span className="text-xs">{releaseYear}</span>}
              </div>
            </div>
          )}
        </div>
      </Link>
      
      <div className="pt-2">
        <Link to={getMediaLink()} className="text-sm font-medium hover:text-eazybee-yellow">
          {title.length > 20 ? `${title.substring(0, 20)}...` : title}
        </Link>
      </div>
    </div>
  );
}
