import React, { useEffect, useState } from "react";
import Autoplay from 'embla-carousel-autoplay';
import { Film } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { tmdbApi, getImageUrl } from "@/services/tmdbApi";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function HomeBanner() {
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const trendingData = await tmdbApi.getTrending("all", "week");
        setFeatured(trendingData.results.slice(0, 5));
      } catch (error) {
        console.error("Error fetching featured content:", error);
      }
    };

    fetchFeatured();
  }, []);

  const handleClick = (item) => {
    navigate(`/${item.media_type}/${item.id}`);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] mb-8">
      <Carousel className="w-full h-full" opts={{ loop: true, duration: 20, axis: 'x' }} plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]}>
        <CarouselContent>
          {featured.map((item) => (
            <CarouselItem key={item.id}>
              <div 
                className="relative w-full h-[400px] md:h-[500px] cursor-pointer"
                onClick={() => handleClick(item)}
              >
                {/* Background image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${getImageUrl(item.backdrop_path, "original")})`
                  }}
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                {/* Content */}
                <div className="relative z-20 flex flex-col justify-end h-full max-w-3xl p-8 md:p-12">
                  <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium rounded-full w-fit bg-eazybee-yellow text-black">
                    <Film size={16} />
                    {item.media_type === 'movie' ? 'Movie' : 'TV Series'}
                  </span>

                  <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                    {item.title || item.name}
                  </h1>

                  <p className="mb-8 text-lg text-white/80 line-clamp-2">
                    {item.overview}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}