
import React from "react";
import MediaCard from "./MediaCard";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface MediaCarouselProps {
  title: string;
  media: Media[];
  seeAllLink?: string;
}

export default function MediaCarousel({ title, media, seeAllLink }: MediaCarouselProps) {
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {media.map((item) => (
          <div key={`${item.media_type}-${item.id}`}>
            <MediaCard media={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
