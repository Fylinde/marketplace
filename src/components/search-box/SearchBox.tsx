
import Card from "../../components/Card";
import { Span } from "../../components/Typography";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import Menu from "../Menu";
import MenuItem from "../MenuItem";
import TextField from "../text-field/TextField";
import StyledSearchBox from "./SearchBoxStyle";

export interface SearchBoxProps {}

const SearchBox: React.FC<SearchBoxProps> = () => {
  const [category, setCategory] = useState<string>("All Categories"); // Specify the type as string
  const [resultList, setResultList] = useState<string[]>([]); // Specify the type as an array of strings

  // Type `cat` as string
  const handleCategoryChange = (cat: string) => () => {
    setCategory(cat);
  };

  // Type the event as React.ChangeEvent<HTMLInputElement>
  const search = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value;

    if (!value) setResultList([]);
    else setResultList(dummySearchResult);
  }, 200);

  // Type the event as React.ChangeEvent<HTMLInputElement>
  const hanldeSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    search(event);
  }, []);

  const handleDocumentClick = () => {
    setResultList([]);
  };

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <Box position="relative" flex="1 1 0" maxWidth="670px" mx="auto">
      <StyledSearchBox>
        <Icon className="search-icon" size="18px">
          search
        </Icon>
        <TextField
          className="search-field"
          placeholder="Search and hit enter..."
          fullwidth
          onChange={hanldeSearch} // Attach the handleSearch function to the input change event
        />
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
          {categories.map((item) => (
            <MenuItem key={item} onClick={handleCategoryChange(item)}>
              {item}
            </MenuItem>
          ))}
        </Menu>
      </StyledSearchBox>

      {!!resultList.length && (
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

const categories = [
  "All Categories",
  "Car",
  "Clothes",
  "Electronics",
  "Laptop",
  "Desktop",
  "Camera",
  "Toys",
];

const dummySearchResult = [
  "Macbook Air 13",
  "Ksus K555LA",
  "Acer Aspire X453",
  "iPad Mini 3",
];

export default SearchBox;
