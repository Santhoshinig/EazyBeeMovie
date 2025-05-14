
import React, { useState, useRef } from "react";
import MediaCard from "./MediaCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: "movie" | "tv";
  first_air_date?: string;
  release_date?: string;
}

interface MediaRowProps {
  title: string;
  media: Media[];
  seeAllLink?: string;
}

export default function MediaRow({ title, media, seeAllLink }: MediaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [hasLeftShadow, setHasLeftShadow] = useState(false);
  const [hasRightShadow, setHasRightShadow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      
      const newScrollLeft = direction === "right" 
        ? Math.min(scrollLeft + scrollAmount, scrollWidth - clientWidth)
        : Math.max(scrollLeft - scrollAmount, 0);
      
      rowRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth"
      });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setHasLeftShadow(scrollLeft > 0);
      setHasRightShadow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">{title}</h2>
        {seeAllLink && (
          <a href={seeAllLink} className="text-sm text-eazybee-yellow hover:underline">
            See all
          </a>
        )}
      </div>
      
      <div className="relative group">
        <div 
          className="overflow-x-scroll scrollbar-none" 
          ref={rowRef}
          onScroll={handleScroll}
        >
          <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
            {media.map((item) => (
              <div key={`${item.media_type}-${item.id}`} className="w-[180px]">
                <MediaCard media={item} />
              </div>
            ))}
          </div>
        </div>
        
        {hasLeftShadow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-eazybee-dark/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {hasRightShadow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-eazybee-dark/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
