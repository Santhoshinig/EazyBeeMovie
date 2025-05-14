
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MediaCard from '@/components/MediaCard';
import { toast } from '@/components/ui/sonner';

export default function WatchHistory() {
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    const loadWatchHistory = () => {
      const storedHistory = JSON.parse(localStorage.getItem('watch-history') || '[]');
      setWatchHistory(storedHistory);
    };

    loadWatchHistory();
    
    // Listen for history updates
    window.addEventListener('watchHistoryUpdate', loadWatchHistory);
    
    return () => {
      window.removeEventListener('watchHistoryUpdate', loadWatchHistory);
    };
  }, []);

  const handleRemoveFromHistory = (mediaId: number) => {
    const updatedHistory = watchHistory.filter((item: any) => item.id !== mediaId);
    setWatchHistory(updatedHistory);
    localStorage.setItem('watch-history', JSON.stringify(updatedHistory));
    toast.success("Removed from watch history");
  };

  const handleClearHistory = () => {
    setWatchHistory([]);
    localStorage.setItem('watch-history', '[]');
    toast.success("Watch history cleared");
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Watch History</h1>
        {watchHistory.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="text-sm text-red-500 hover:text-red-400"
          >
            Clear History
          </button>
        )}
      </div>
      
      {watchHistory.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchHistory.map((item: any) => (
            <div key={`${item.id}-${item.media_type}`} className="relative group">
              <MediaCard media={item} />
              <button
                onClick={() => handleRemoveFromHistory(item.id)}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from history"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">Your watch history is empty</p>
        </div>
      )}
    </div>
  );
}
