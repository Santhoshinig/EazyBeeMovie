
import React from "react";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { getImageUrl } from "@/services/tmdbApi";

interface HeroSectionProps {
  media: {
    id: number;
    title?: string;
    name?: string;
    backdrop_path: string;
    overview: string;
    media_type: "movie" | "tv";
    genre_ids: number[];
    first_air_date?: string;
    release_date?: string;
  };
  genres?: { [id: number]: string };
}

export default function HeroSection({ media, genres }: HeroSectionProps) {
  const title = media.title || media.name || "";
  const releaseYear = media.release_date?.substring(0, 4) || media.first_air_date?.substring(0, 4) || "";
  const imageUrl = getImageUrl(media.backdrop_path, "original");
  
  return (
    <div className="relative min-h-[70vh] w-full mt-[-64px]">
      <div 
        className="absolute inset-0 z-0 brightness-50"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-eazybee-dark via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-eazybee-dark via-eazybee-dark/50 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 h-full flex flex-col justify-end pb-16 pt-32">
        <div className="max-w-2xl">
          <div className="mb-4 flex flex-wrap gap-2">
            {media.media_type === "tv" && (
              <span className="category-badge bg-eazybee-yellow text-black">
                TV Series
              </span>
            )}
            {media.media_type === "movie" && (
              <span className="category-badge bg-eazybee-yellow text-black">
                Movie
              </span>
            )}
            
            {media.genre_ids.slice(0, 3).map((genreId) => (
              genres && genres[genreId] ? (
                <span key={genreId} className="category-badge">
                  {genres[genreId]}
                </span>
              ) : null
            ))}
            
            {releaseYear && <span className="category-badge">{releaseYear}</span>}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>
          
          <p className="text-gray-300 mb-8 line-clamp-3 md:line-clamp-4 max-w-xl">
            {media.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link 
              to={`/${media.media_type}/${media.id}`} 
              className="btn-primary"
            >
              <Play size={18} />
              Play Now
            </Link>
            
            <button className="btn-secondary">
              + Add to Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
