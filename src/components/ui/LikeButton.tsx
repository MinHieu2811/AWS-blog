'use client';

import { useState, useEffect } from 'react';
import { useDebounceValue } from '@/hooks/useDebounceValue';

interface LikeButtonProps {
  slug: string;
  initialTotalLikes: number;
}

const MAX_USER_LIKES = 15;

export const LikeButton = ({ slug, initialTotalLikes }: LikeButtonProps) => {
  const [totalLikes, setTotalLikes] = useState(initialTotalLikes);
  const [userLikes, setUserLikes] = useState(0);
  const [pendingLikes, setPendingLikes] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  const storageKey = `likes:${slug}`;
  const debouncedPendingLikes = useDebounceValue(pendingLikes, 1000);

  useEffect(() => {
    const savedLikes = localStorage.getItem(storageKey);
    const initialUserLikes = savedLikes ? parseInt(savedLikes, 10) : 0;
    setUserLikes(initialUserLikes);
  }, [storageKey]);

  useEffect(() => {
    if (debouncedPendingLikes > 0) {
      const newTotalUserLikes = userLikes + debouncedPendingLikes;
      setUserLikes(newTotalUserLikes);
      localStorage.setItem(storageKey, newTotalUserLikes.toString());
      setPendingLikes(0); // Reset pending likes after processing

      // TODO: Send debouncedPendingLikes to the server in the future
      // await api.post(`/api/likes/${slug}`, { likes: debouncedPendingLikes });
    }

  }, [debouncedPendingLikes, storageKey]);


  const handleClick = () => {
    if (userLikes >= MAX_USER_LIKES) {
      return;
    }

    setTotalLikes((prev) => prev + 1);
    setPendingLikes((prev) => prev + 1);
    setIsClicked(true);
  };
  
  // Reset animation state
  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsClicked(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);


  const isLimitReached = userLikes >= MAX_USER_LIKES;

  return (
    <button
      onClick={handleClick}
      disabled={isLimitReached}
      className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Like this post"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={userLikes > 0 ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-red-500 ${isClicked ? 'animate-like-pop' : ''}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="font-medium">{totalLikes.toLocaleString()}</span>
    </button>
  );
};