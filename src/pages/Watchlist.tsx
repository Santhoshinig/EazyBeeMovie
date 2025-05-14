
import React, { useState, useEffect } from 'react';
import MediaCard from '@/components/MediaCard';
import { toast } from '@/components/ui/sonner';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const loadWatchlist = () => {
      const storedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      setWatchlist(storedWatchlist);
    };

    loadWatchlist();
    
    // Listen for watchlist updates
    window.addEventListener('watchlistUpdate', loadWatchlist);
    
    return () => {
      window.removeEventListener('watchlistUpdate', loadWatchlist);
    };
  }, []);

  const handleRemoveFromWatchlist = (mediaId: number, mediaType: string) => {
    const updatedWatchlist = watchlist.filter((item: any) => 
      !(item.id === mediaId && item.media_type === mediaType)
    );
    setWatchlist(updatedWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    toast.success("Removed from watchlist");
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">My Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlist.map((item: any) => (
            <MediaCard 
              key={`${item.id}-${item.media_type}`} 
              media={item}
              onRemoveFromWatchlist={() => handleRemoveFromWatchlist(item.id, item.media_type)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">Your watchlist is empty</p>
        </div>
      )}
    </div>
  );
}
