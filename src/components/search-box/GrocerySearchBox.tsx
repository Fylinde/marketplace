
import Button from "components/buttons/Button";
import Card from "components/Card";
import MenuItem from "components/MenuItem";
import { Span } from "components/Typography";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import Box from "../Box";
import Icon from "../icon/Icon";
import TextField from "../text-field/TextField";
import SearchBoxStyle from "./SearchBoxStyle";

export interface GrocerySearchBoxProps {}

const GrocerySearchBox: React.FC<GrocerySearchBoxProps> = () => {
  const [resultList, setResultList] = useState<string[]>([]); // Explicitly define resultList as an array of strings

  // Add type annotation for the event
  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value;

    if (!value) setResultList([]); // Clear the result list if input is empty
    else setResultList(dummySearchResult); // Otherwise, set dummy search results
  }, 200);

  // Add type annotation for the event
  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist(); // Persist the event
    search(event); // Call the debounce search function
  }, []);

  const handleDocumentClick = () => {
    setResultList([]); // Clear the result list when clicking outside
  };

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
      <SearchBoxStyle>
        <Icon className="search-icon" size="18px">
          search
        </Icon>
        <TextField
          className="search-field"
          placeholder="Search and hit enter..."
          fullwidth
          onChange={handleSearch} // Attach the handleSearch function to the input change event
        />
        <Button className="search-button" variant="contained" color="primary">
          Search
        </Button>
        <Box className="menu-button" ml="14px" cursor="pointer">
          <Icon color="primary">menu</Icon>
        </Box>
      </SearchBoxStyle>

      {!!resultList.length && ( // Only show resultList if there are results
        <Card
          position="absolute"
          top="100%"
          py="0.5rem"
          width="100%"
          boxShadow="large"
          style={{ zIndex: 99 }}
        >
          {resultList.map((item) => (
            <Link to={`/product/search/${item}`} key={item}>
              <MenuItem key={item}>
                <Span fontSize="14px">{item}</Span>
              </MenuItem>
            </Link>
          ))}
        </Card>
      )}
    </Box>
  );
};

const dummySearchResult = [
  "Macbook Air 13",
  "Ksus K555LA",
  "Acer Aspire X453",
  "iPad Mini 3",
];

export default GrocerySearchBox;
