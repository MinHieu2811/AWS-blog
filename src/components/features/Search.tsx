'use client';

import { useState, useRef } from 'react';
import { useSearch, SearchResult } from '@/hooks/useSearch';
import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { Highlight } from './Highlight';
import { generateSnippet } from '@/utils/generateSnippet';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const { search, isLoading } = useSearch();
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery.length > 1) {
      const searchResults = search(newQuery);
      setResults(searchResults.slice(0, 5));
    } else {
      setResults([]);
    }
  };

  useClickOutside(searchContainerRef, () => setIsFocused(false));

  const showDropdown = isFocused && query.length > 1;

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          placeholder="Search posts..."
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <LoaderCircle className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            {results.length > 0 ? (
              results.map(({ item, matches }) => (
                <li key={item.slug}>
                  <Link 
                    href={`/blog/${item.slug}`} 
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsFocused(false)}
                  >
                    <div className="font-bold">
                        <Highlight text={item.title} indices={matches?.find(m => m.key === 'title')?.indices ?? []} />
                    </div>
                    <p className="text-sm text-gray-600">
                        {generateSnippet(item.content, matches)}
                    </p>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No results found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
