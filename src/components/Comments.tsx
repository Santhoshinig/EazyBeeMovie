
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar } from './ui/avatar';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  rating: number;
  timestamp: string;
}

interface CommentsProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
}

export default function Comments({ mediaId, mediaType }: CommentsProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(() => {
    const stored = localStorage.getItem(`comments-${mediaType}-${mediaId}`);
    return stored ? JSON.parse(stored) : [];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim() || rating === 0) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userImage: user.profileImage || '',
      content: comment.trim(),
      rating,
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments-${mediaType}-${mediaId}`, JSON.stringify(updatedComments));
    setComment('');
    setRating(0);
  };

  return (
    <div className="space-y-6">
      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'text-eazybee-yellow fill-eazybee-yellow' : 'text-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={!comment.trim() || rating === 0}>
            Post Review
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-eazybee-dark-accent p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <img src={comment.userImage} alt={comment.userName} />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.userName}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < comment.rating ? 'text-eazybee-yellow fill-eazybee-yellow' : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
