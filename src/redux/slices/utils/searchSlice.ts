// src/redux/slices/searchSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import searchService from "../../../services/searchService";
import api from "./axiosSetup";


interface ExecuteSearchPayload {
  query: string;
  filters?: any;
  category?: string;
  userId?: string;
  image?: File;
}



interface Suggestion {
  query: string;
  image?: string;
  category?: string;
  price?: number;
  currency?: string;
}

interface Filters {
  categories?: string[];
  brands?: string[];
  priceRange?: { min: number; max: number };
  ratings?: number; // Minimum rating threshold
  region?: string;
  currency?: string;
  language?: string;
}

interface SearchState {
  query: string;
  results: any[];
  hasMore: boolean;
  suggestions: Suggestion[];
  filters: Filters;
  availableFilters: Filters;
  isLoading: boolean;
  error: string | null;
  language: string;
  region: string;
  currency: string;
  preferences: any; // New addition
  userId: string | null;
  buyerCurrency: string;
  sellerCurrency: string;
  loading: boolean;
}

const initialState: SearchState = {
  query: "",
  results: [],
  suggestions: [],
  filters: {
    region: "US",
    currency: "USD",
    language: "en",
  },
  availableFilters: {},
  hasMore: true,
  isLoading: false,
  error: null,
  language: "en", // Default to English
  region: "US", // Default to US
  currency: "USD", // Default to USD
  preferences: {},
  userId: null, // New addition
  buyerCurrency: 'USD',
  sellerCurrency: 'USD',
  loading: false,
};

// Thunks

export const searchByText = createAsyncThunk(
  "search/searchByText",
  async ({ query, filters }: { query: string; filters?: any }, thunkAPI) => {
    try {
      const results = await searchService.searchByText(query, filters);
      await searchService.logSearchMetrics({ query, filters }); // Log search analytics.
      return results;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Search failed");
    }
  }
);

/**
 * Perform an image-based search.
 */
export const searchByImage = createAsyncThunk(
  "search/searchByImage",
  async (imageData: string, thunkAPI) => {
    try {
      const results = await searchService.searchByImage(imageData);
      return results;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Image search failed");
    }
  }
);

/**
 * Fetch real-time search suggestions.
 */
export const fetchSuggestions = createAsyncThunk(
  "search/fetchSuggestions",
  async ({ query, language }: { query: string; language: string }, thunkAPI) => {
    try {
      const suggestions = await searchService.getSuggestions(query, language); // Pass both query and language
      return suggestions;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch suggestions");
    }
  }
);


/**
 * Fetch available filters.
 */
export const fetchAvailableFilters = createAsyncThunk(
  "search/fetchAvailableFilters",
  async (_, thunkAPI) => {
    try {
      const filters = await searchService.getAvailableFilters();
      return filters;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch filters");
    }
  }
);

export const semanticSearch = createAsyncThunk(
  "search/semanticSearch",
  async ({ query, filters, language, currency }: { query: string; filters?: any; language: string; currency: string }, thunkAPI) => {
    try {
      const results = await searchService.semanticSearch(query, filters, language, currency);
      await searchService.logSearchMetrics({ query, filters });
      return results;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Semantic search failed");
    }
  }
);

export const crossModalSearch = createAsyncThunk(
  "search/crossModalSearch",
  async ({ query, imageData }: { query: string; imageData: string }, thunkAPI) => {
    try {
      const results = await searchService.crossModalSearch(query, imageData);
      return results;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Cross-modal search failed");
    }
  }
);

export const visualTryOnSearch = createAsyncThunk(
  "search/visualTryOnSearch",
  async ({ imageData, tryOnType }: { imageData: string; tryOnType: string }, thunkAPI) => {
    try {
      const results = await searchService.visualTryOnSearch(imageData, tryOnType);
      return results;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Visual try-on search failed");
    }
  }
);

export const localizedSearch = createAsyncThunk(
  "search/localizedSearch",
  async ({ query, region, language }: { query: string; region: string; language: string }, thunkAPI) => {
    try {
      const results = await searchService.localizedSearch(query, region, language);
      return results;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Localized search failed");
    }
  }
);

export const executeCrossModalSearch = createAsyncThunk(
  "search/executeCrossModalSearch",
  async (payload: { text: string; image: File | null }, thunkAPI) => {
    try {
      return await searchService.executeCrossModalSearch(payload);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to execute cross-modal search."
      );
    }
  }
);

// Thunks
export const executePersonalizedSearch = createAsyncThunk(
  "search/executePersonalizedSearch",
  async (
    { query, filters, userId }: { query: string; filters?: any; userId: string },
    thunkAPI
  ) => {
    try {
      return await searchService.executeSearch({ query, filters, userId });
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Personalized search failed."
      );
    }
  }
);

export const executeSearch = createAsyncThunk(
  'search/executeSearch',
  async (
    {
      query,
      filters,
      category,
      userId,
      image,
    }: {
      query: string;
      filters?: any;
      category?: string;
      userId?: string;
      image?: File;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('query', query);
      if (filters) formData.append('filters', JSON.stringify(filters));
      if (category) formData.append('category', category);
      if (userId) formData.append('userId', userId);
      if (image) formData.append('image', image);

      const response = await api.post('/api/search', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);


export const fetchMoreSearchResults = createAsyncThunk(
  'search/fetchMoreSearchResults',
  async (
    { query, page, filters }: { query: string; page: number; filters: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await searchService.fetchSearchResults({ query, page, filters });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const fetchSearchResults = createAsyncThunk(
  'search/fetchSearchResults',
  async (
    { query, page, filters }: { query: string; page: number; filters: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await searchService.fetchSearchResults({ query, page, filters });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);


// Slice
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
    setPreferences(state, action: PayloadAction<any>) {
      state.preferences = action.payload;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setFilters(state, action: PayloadAction<any>) {
      state.filters = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setRegion(state, action: PayloadAction<string>) {
      state.region = action.payload;
    },
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
    },
    resetFilters(state) {
      state.filters = {
        region: state.filters.region,
        currency: state.filters.currency,
        language: state.filters.language,
      };
    },

    resetSearch(state) {
      state.query = "";
      state.results = [];
      state.suggestions = [];
      state.filters = {
        region: "US",
        currency: "USD",
        language: "en",
      };
      state.error = null;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoreSearchResults.fulfilled, (state, action) => {
        state.results = [...state.results, ...action.payload.results];
        state.hasMore = action.payload.hasMore;
      });

    builder
      .addCase(executeSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(executeSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(executeSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(executePersonalizedSearch.fulfilled, (state, action) => {
        state.results = action.payload;
      });

    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(semanticSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(semanticSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(semanticSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(crossModalSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(crossModalSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(crossModalSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(visualTryOnSearch.fulfilled, (state, action) => {
        state.results = action.payload;
      })
      .addCase(visualTryOnSearch.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Handle searchByText
    builder
      .addCase(searchByText.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchByText.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(searchByText.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle searchByImage
    builder
      .addCase(searchByImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchByImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload;
      })
      .addCase(searchByImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle fetchSuggestions
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload; // Ensure payload matches the Suggestion[] type
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });


    // Handle fetchAvailableFilters
    builder
      .addCase(fetchAvailableFilters.fulfilled, (state, action) => {
        state.availableFilters = action.payload;
      })
      .addCase(fetchAvailableFilters.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setQuery, setUserId, setPreferences, setFilters, setLanguage, setRegion, setCurrency, resetFilters, resetSearch } = searchSlice.actions;

export default searchSlice.reducer;
