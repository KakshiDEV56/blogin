"use client";

import { Input } from "@/components/ui/input";
import { SearchResult } from "@/types/blog";
import React, { useCallback, useState } from "react";

interface SearchInputProps {
  onClose: () => void;
}

export function SearchInput({ onClose }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
      setSelectedIndex(0);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      window.location.href = `/blogs/${results[selectedIndex].slug}`;
    }
  };

  return (
    <div className="space-y-4">
      <Input
        autoFocus
        placeholder="Search blogs... (Cmd+K)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      <SearchResults
        results={results}
        isLoading={isLoading}
        selectedIndex={selectedIndex}
        query={query}
      />
    </div>
  );
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  selectedIndex: number;
  query: string;
}

function SearchResults({
  results,
  isLoading,
  selectedIndex,
  query,
}: SearchResultsProps) {
  if (!query.trim()) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Start typing to search...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Searching...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>{`No results found for "${query}"`}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {results.map((result, index) => (
        <a
          key={result.id}
          href={`/blogs/${result.slug}`}
          className="block"
        >
          <div
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              index === selectedIndex
                ? "bg-blue-100"
                : "hover:bg-gray-100"
            }`}
          >
            <h3 className="font-semibold text-gray-900">{result.title}</h3>
            <p
              className="text-sm text-gray-600 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: result.snippet }}
            />
          </div>
        </a>
      ))}
    </div>
  );
}
