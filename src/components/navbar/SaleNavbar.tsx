import React, { useCallback, useState } from "react";
import FlexBox from "../FlexBox";
import Icon from "../icon/Icon";
import { H5 } from "../Typography";
import Box from "../Box";
import { Select, MenuItem, TextField } from "@mui/material";

export interface SaleNavbarProps {
  saleCategoryList: {
    icon: string;
    title: string;
    segment: "B2B" | "B2C" | "C2C"; // Segment type for each category
  }[];
  currentSegment: "B2B" | "B2C" | "C2C"; // Current user segment
  onSegmentChange: (segment: "B2B" | "B2C" | "C2C") => void; // Callback for segment change
  onCategoryChange?: (value: { icon: string; title: string; segment: string }) => void; // Callback for category click
  showSearch?: boolean; // Optional: Show search bar
}

const SaleNavbar: React.FC<SaleNavbarProps> = ({
  saleCategoryList,
  currentSegment,
  onSegmentChange,
  onCategoryChange,
  showSearch = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [filter, setFilter] = useState<string>("");

  // Handle category click
  const handleCategoryClick = useCallback(
    (categoryIndex: number) => () => {
      setSelectedCategory(categoryIndex);
      if (onCategoryChange) onCategoryChange(saleCategoryList[categoryIndex]);
    },
    [onCategoryChange, saleCategoryList]
  );

  // Handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value.toLowerCase());
  };

  // Filter categories by the current segment and search query
  const filteredCategories = saleCategoryList
    .filter((category) => category.segment === currentSegment)
    .filter((category) =>
      category.title.toLowerCase().includes(filter.toLowerCase())
    );

  return (
    <Box position="relative" width="100%" bg="white" p="1rem" boxShadow="sm">
      {/* Segment Selection Dropdown */}
      <Box mb="1rem">
        <Select
          value={currentSegment}
          onChange={(e) => onSegmentChange(e.target.value as "B2B" | "B2C" | "C2C")}
          fullWidth
          variant="outlined"
        >
          <MenuItem value="B2B">Business to Business (B2B)</MenuItem>
          <MenuItem value="B2C">Business to Consumer (B2C)</MenuItem>
          <MenuItem value="C2C">Consumer to Consumer (C2C)</MenuItem>
        </Select>
      </Box>

      {/* Search Bar */}
      {showSearch && (
        <Box mb="1rem">
          <TextField
            placeholder="Search categories..."
            fullWidth
            onChange={handleSearchChange}
          />
        </Box>
      )}

      {/* Category Counter */}
      <Box mb="1rem" textAlign="center" fontWeight="500" fontSize="14px">
        Showing {filteredCategories.length} of {saleCategoryList.length} categories
      </Box>

      {/* Categories */}
      <FlexBox bg="white" overflowX="auto" height="5rem" alignItems="center">
        {filteredCategories.map((item, ind) => (
          <FlexBox
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            cursor="pointer"
            minWidth="100px"
            ml={ind === 0 ? "auto" : "unset"}
            mr={ind === filteredCategories.length - 1 ? "auto" : "unset"}
            bg={ind === selectedCategory ? "primary.light" : "transparent"}
            borderRadius="8px"
            p="0.5rem"
            key={ind}
            onClick={handleCategoryClick(ind)}
            style={{
              transition: "all 0.3s ease-in-out",
              boxShadow:
                ind === selectedCategory ? "0 4px 8px rgba(0,0,0,0.2)" : "none",
            }}
          >
            <Icon
              size="1.75rem"
              color={ind === selectedCategory ? "primary" : "secondary"}
            >
              {item.icon}
            </Icon>
            <H5
              fontSize="12px"
              textAlign="center"
              color={ind === selectedCategory ? "primary.main" : "inherit"}
              fontWeight={ind === selectedCategory ? "600" : "400"}
            >
              {item.title}
            </H5>
          </FlexBox>
        ))}
      </FlexBox>
    </Box>
  );
};

export default SaleNavbar;
