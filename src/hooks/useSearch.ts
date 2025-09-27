import { useState, useEffect, useRef } from 'react';
import Fuse, { FuseResult, IFuseOptions } from 'fuse.js';

export interface SearchItem {
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
}

// The result from Fuse.js will now include match details
export type SearchResult = FuseResult<SearchItem>;

const FUSE_OPTIONS: IFuseOptions<SearchItem> = {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'content', weight: 0.3 },
    { name: 'tags', weight: 0.1 },
  ],
  includeScore: true,
  includeMatches: true, // This is the crucial part to get match indices
  threshold: 0.4,
  minMatchCharLength: 2,
};

export function useSearch() {
  const [, setSearchIndex] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fuseRef = useRef<Fuse<SearchItem> | null>(null);

  useEffect(() => {
    const prefetchSearchIndex = () => {
      fetch('/search-index.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch search index');
          }
          return response.json();
        })
        .then((data: SearchItem[]) => {
          setSearchIndex(data);
          fuseRef.current = new Fuse(data, FUSE_OPTIONS);
          setIsLoading(false);
          console.log('Search index loaded and ready.');
        })
        .catch((error) => {
          console.error('Error prefetching search index:', error);
          setIsLoading(false);
        });
    };

    // Use requestIdleCallback to fetch the index when the browser is idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetchSearchIndex);
    } else {
      // Fallback for older browsers
      const timeoutId = setTimeout(prefetchSearchIndex, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const search = (query: string): SearchResult[] => {
    if (!query || !fuseRef.current) {
      return [];
    }
    return fuseRef.current.search(query);
  };

  return { search, isLoading };
}
