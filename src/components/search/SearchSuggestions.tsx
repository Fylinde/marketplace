import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/reduxHooks";
import { fetchSuggestions } from "../../redux/slices/utils/searchSlice";
import { RootState } from "../../redux/store";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Box from "../../components/Box";
import FlexBox from "../../components/FlexBox";
import Typography from "../../components/Typography";
import Icon from "../../components/icon/Icon";

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onSuggestionClick }) => {
  const dispatch = useAppDispatch();
  const { suggestions, loading } = useAppSelector((state: RootState) => state.search);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce query to minimize API calls
  useEffect(() => {
    const handler = debounce(() => setDebouncedQuery(query), 300);
    handler();
    return () => handler.cancel();
  }, [query]);

  // Fetch suggestions based on debounced query
  useEffect(() => {
    if (debouncedQuery) {
      const language = "en"; // Replace with your logic to determine language
      dispatch(fetchSuggestions({ query: debouncedQuery, language }));
    }
  }, [debouncedQuery, dispatch]);


  const handleClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
  };

  if (!query) return null;

  return (
    <StyledSuggestions>
      {loading ? (
        <Typography>Loading suggestions...</Typography>
      ) : suggestions.length > 0 ? (
        suggestions.map((item, index) => (
          <SuggestionItem key={index} onClick={() => handleClick(item.query)}>
            <FlexBox alignItems="center">
              <img src={item.image} alt={item.query} className="suggestion-image" />
              <Box>
                <Typography fontWeight="bold">
                  {highlightMatch(item.query, query)}
                </Typography>
                {item.category && (
                  <Typography fontSize="small" color="text.muted">
                    {item.category}
                  </Typography>
                )}
              </Box>
            </FlexBox>
            {item.price && (
              <Typography fontSize="small" color="success.main">
                {item.currency} {item.price}
              </Typography>
            )}
          </SuggestionItem>
        ))
      ) : (
        <Typography>No suggestions found</Typography>
      )}
    </StyledSuggestions>
  );
};

// Utility function to highlight matching parts of the suggestion
const highlightMatch = (text: string, query: string) => {
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="highlight">
        {part}
      </span>
    ) : (
      part
    )
  );
};

// Styled Components
const StyledSuggestions = styled(Box)`
  position: absolute;
  width: 100%;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;

  .highlight {
    color: #007aff;
    font-weight: bold;
  }
`;

const SuggestionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  cursor: pointer;
  &:hover {
    background-color: #f9f9f9;
  }

  .suggestion-image {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    object-fit: cover;
    border-radius: 4px;
  }
`;

export default SearchSuggestions;
