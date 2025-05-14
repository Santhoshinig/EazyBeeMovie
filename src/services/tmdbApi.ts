
import { toast } from "@/components/ui/sonner";

const API_KEY = "0eb6fad5c86426c9bfd3242d294bd074";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Helper to format the image URL with appropriate size
export const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return "/placeholder.svg";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// API request wrapper with better error handling
const apiRequest = async (endpoint: string, options = {}) => {
  try {
    const url = `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}`;
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", response.status, errorData);
      
      // Show appropriate error message based on status code
      if (response.status === 404) {
        toast.error("Content not found. It may have been removed or is unavailable.");
      } else if (response.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error(`Failed to fetch data: ${errorData.status_message || response.statusText}`);
      }
      
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    
    // Only show toast if error wasn't already handled above
    if (!(error instanceof Error && error.message.startsWith("API Error:"))) {
      toast.error("Failed to fetch data. Please check your connection and try again.");
    }
    
    throw error;
  }
};

// API endpoints
export const tmdbApi = {
  // Get trending content
  getTrending: (mediaType: "all" | "movie" | "tv" = "all", timeWindow: "day" | "week" = "week") => {
    return apiRequest(`/trending/${mediaType}/${timeWindow}`);
  },
  
  // Get popular content
  getPopular: (mediaType: "movie" | "tv") => {
    return apiRequest(`/${mediaType}/popular`);
  },
  
  // Get content details
  getDetails: (mediaType: "movie" | "tv", id: number) => {
    return apiRequest(`/${mediaType}/${id}`);
  },
  
  // Search for content
  searchContent: (query: string, page: number = 1) => {
    return apiRequest(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
  },
  
  // Get content by genre
  getByGenre: (mediaType: "movie" | "tv", genreId: number, page: number = 1) => {
    return apiRequest(`/discover/${mediaType}?with_genres=${genreId}&page=${page}`);
  },
  
  // Get genre lists
  getGenres: (mediaType: "movie" | "tv") => {
    return apiRequest(`/genre/${mediaType}/list`);
  },
  
  // Get videos (trailers, etc.)
  getVideos: (mediaType: "movie" | "tv", id: number) => {
    return apiRequest(`/${mediaType}/${id}/videos`);
  },
  
  // Get recommendations
  getRecommendations: (mediaType: "movie" | "tv", id: number) => {
    return apiRequest(`/${mediaType}/${id}/recommendations`);
  },
  
  // Get similar content
  getSimilar: (mediaType: "movie" | "tv", id: number) => {
    return apiRequest(`/${mediaType}/${id}/similar`);
  }
};
