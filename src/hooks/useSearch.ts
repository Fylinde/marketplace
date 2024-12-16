// src/hooks/useSearch.ts
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback } from "react";
import { fetchSuggestions, executeSearch } from "../redux/slices/utils/searchSlice";
import { RootState } from "../redux/store";
import { debounce } from "../utils/debounce";
import type { AppDispatch } from '../redux/store';

export const useSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { results, suggestions, isLoading, error } = useSelector((state: RootState) => state.search);

  const [query, setQuery] = useState<string>("");
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Debounced fetch suggestions
  const fetchDebouncedSuggestions = useCallback(
    debounce((query: string, language: string) => {
      dispatch(fetchSuggestions({ query, language }));
    }, 300),
    [dispatch]
  );

  // Execute search
  const performSearch = (newQuery: string, newFilters: Record<string, any>) => {
    setQuery(newQuery);
    setFilters(newFilters);
    dispatch(executeSearch({ query: newQuery, filters: newFilters }));
  };

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    suggestions,
    isLoading,
    error,
    performSearch,
    fetchDebouncedSuggestions,
  };
};
