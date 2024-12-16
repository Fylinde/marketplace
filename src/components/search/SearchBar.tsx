import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { debounce } from "../../utils/debounce";
import { useAppSelector } from "../../redux/reduxHooks";
import { fetchSuggestions, executeSearch, setFilters } from "@/redux/slices/utils/searchSlice";
import { RootState } from "redux/store";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Card from "../Card";
import Icon from "../icon/Icon";
import Menu from "../Menu";
import MenuItem from "../MenuItem";
import TextField from "../text-field/TextField";
import SearchUploader from "./SearchUploader";
import VoiceToText from "../../utils/voiceToText";
import AdvancedSearchFilters from "./AdvancedSearchFilters";
import SearchSuggestions from "./SearchSuggestions";
import StyledSearchBox from "../search-box/SearchBoxStyle";
import { createCrossModalPayload } from "../../utils/CrossModalProcessor";
import { executePersonalizedSearch, executeCrossModalSearch } from "@/redux/slices/utils/searchSlice";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";

const SearchBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { suggestions, isLoading } = useSelector((state: RootState) => state.search);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("All Categories");
  const [activeInputType, setActiveInputType] = useState<"text" | "image" | "voice">("text");
  const [filters, setFiltersState] = useState({ region: "US", currency: "USD", language: "en" });
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);


  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((query: string) => {
      dispatch(fetchSuggestions({ query, language: filters.language }));
    }, 300),
    [dispatch, filters.language]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    if (value) {
      debouncedFetchSuggestions(value);
    }
  };

  const handleSearch = () => {
    const payload = createCrossModalPayload(query, selectedImage);
    dispatch(executeCrossModalSearch(payload));
    dispatch(executeSearch({ query, filters, category }));
    dispatch(
      executePersonalizedSearch({
        query,
        filters,
        userId: String(userId || ''),
      })
    );
  };

  const handleImageUpload = (image: File) => {
    setSelectedImage(image);
    dispatch(executeSearch({ query: "", filters, category }));
  };

  /**
   * Handle Voice Search
   * Triggered when the `VoiceToText` utility receives a final transcript.
   * Updates the search query, fetches suggestions, and executes the search.
   */
  const handleVoiceSearch = (transcript: string) => {
    setQuery(transcript); // Update the query with the transcribed voice input

    // Fetch suggestions based on the transcribed query
    dispatch(fetchSuggestions({ query: transcript, language: filters.language }));

    // Execute the search with the transcribed query
    dispatch(executeSearch({ query: transcript, filters, category }));
  };

  const handleStartVoiceSearch = () => {
    setIsListening(true);
    setVoiceError(null);

    const voiceToText = new VoiceToText({
      language: filters.language,
      continuous: true,
      interimResults: true,
      onResult: (transcript) => {
        setQuery(transcript); // Update the query in real-time
        handleVoiceSearch(transcript);
      },
      onError: (error) => {
        setIsListening(false);
        setVoiceError(error);
      },
      onEnd: () => {
        setIsListening(false);
        handleSearch(); // Trigger search on completion of voice input
      },
    });

    voiceToText.start();

    // Optional: Stop listening after a timeout
    setTimeout(() => {
      voiceToText.stop();
    }, 60000);
  };

  const handleStopVoiceSearch = () => {
    setIsListening(false);
  };

  const handleFilterUpdate = (newFilters: Record<string, string>) => {
    setFiltersState((prevFilters) => ({ ...prevFilters, ...newFilters }));
    dispatch(setFilters(newFilters));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch();
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  useEffect(() => {
    if (!query) {
      dispatch(fetchSuggestions({ query: "", language: filters.language }));
    }
  }, [query, dispatch, filters.language]);

  return (
    <Box position="relative" flex="1 1 0" maxWidth="800px" mx="auto">
      <StyledSearchBox>
        <Icon className="search-icon" size="18px">
          search
        </Icon>

        {activeInputType === "text" && (
          <TextField
            className="search-field"
            placeholder="Search by text, image, or voice..."
            value={query}
            onChange={handleInputChange}
            fullwidth
          />
        )}
        {activeInputType === "image" && <SearchUploader onUpload={handleImageUpload} />}
        <button onClick={handleSearch}>
          Search Text + Image
        </button>
        {activeInputType === "voice" && (
          <FlexBox mt="1rem">
            {!isListening ? (
              <button onClick={handleStartVoiceSearch}>🎤 Start Voice Search</button>
            ) : (
              <button onClick={handleStopVoiceSearch}>🛑 Stop Voice Search</button>
            )}
          </FlexBox>
        )}

        <Menu
          className="category-dropdown"
          direction="right"
          handler={
            <FlexBox className="dropdown-handler" alignItems="center">
              <span>{category}</span>
              <Icon variant="small">chevron-down</Icon>
            </FlexBox>
          }
        >
          {categories.map((cat) => (
            <MenuItem key={cat} onClick={() => handleCategoryChange(cat)}>
              {cat}
            </MenuItem>
          ))}
        </Menu>
      </StyledSearchBox>

      <SearchSuggestions query={query} onSuggestionClick={handleSuggestionClick} />

      {/* Toggle Filters */}
      <FlexBox justifyContent="flex-end" mt="1rem">
        <button onClick={toggleFilters}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </FlexBox>

      {showFilters && (
        <AdvancedSearchFilters filters={filters} onFilterChange={handleFilterUpdate} />
      )}

      {/* Search Mode Toggle */}
      <FlexBox justifyContent="space-between" mt="1rem">
        <button onClick={() => setActiveInputType("text")}>Text</button>
        <button onClick={() => setActiveInputType("image")}>Image</button>
        <button onClick={() => setActiveInputType("voice")}>Voice</button>
      </FlexBox>

      {isLoading && <p>Loading suggestions...</p>}
      {suggestions.length > 0 && (
        <Card position="absolute" top="100%" py="0.5rem" width="100%" boxShadow="large" style={{ zIndex: 99 }}>
          {suggestions.map((suggestion, idx) => (
            <p key={idx}>{suggestion.query}</p>
          ))}
        </Card>
      )}


      {voiceError && <p style={{ color: "red" }}>Error: {voiceError}</p>}
    </Box>
  );
};

const categories = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Furniture",
  "Beauty",
  "Automotive",
  "Books",
  "Toys",
  "Sports",
];

export default SearchBar;
