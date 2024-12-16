import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Accordion from "../accordion/Accordion";
import AccordionHeader from "../accordion/AccordionHeader";
import Avatar from "../avatar/Avatar";
import Card from "../Card";
import CheckBox from "../CheckBox";
import Divider from "../Divider";
import FlexBox from "../FlexBox";
import Rating from "../rating/Rating";
import TextField from "../text-field/TextField";
import { H5, H6, Paragraph, SemiSpan } from "../Typography";
import { fetchColors } from "../../redux/slices/products/productSlice";
import { fetchBrands } from "../../redux/slices/products/brandSlice";
import { fetchCategories } from "../../redux/slices/products/categorySlice";
import { RootState } from "../../redux/store";
import { updateFilters, toggleOption, resetFilters } from "../../redux/slices/support/filterSlice"; // Actions for filters
import type { AppDispatch } from "../../redux/store";

interface Category {
  title: string;
  subCategories?: string[];
}

type Brand = string;
type Color = string;

const ProductFilterCard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, brands, colors, loading, error } = useSelector((state: RootState) => state.products);
  const filters = useSelector((state: RootState) => state.filters);

  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: filters.minPrice || 0,
    max: filters.maxPrice || 250,
  });

  useEffect(() => {
    // Fetch filter options dynamically
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    dispatch(fetchColors());
  }, [dispatch]);

  const handleFilterUpdate = (key: string, value: any) => {
    dispatch(updateFilters({ [key]: value }));
    logAnalyticsEvent(key, value); // Log filter interaction for analytics
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
    const value = parseFloat(e.target.value) || 0;
    setPriceRange((prev) => ({ ...prev, [type]: value }));
    handleFilterUpdate(type === "min" ? "minPrice" : "maxPrice", value);
  };

  const logAnalyticsEvent = (filter: string, value: any) => {
    console.log(`Analytics Event: Filter ${filter} updated to`, value);
    // Replace with actual analytics integration (e.g., Google Analytics, Mixpanel)
  };

  if (loading) {
    return <p>Loading filters...</p>;
  }

  if (error) {
    return <p>Error loading filters: {error}</p>;
  }

  return (
    <Card p="18px 27px" elevation={5}>
      {/* Categories */}
      <H6 mb="10px">Categories</H6>
      {categories.map((item: Category) =>
        item.subCategories ? (
          <Accordion key={item.title} expanded>
            <AccordionHeader px="0px" py="6px" color="text.muted">
              <SemiSpan className="cursor-pointer" mr="9px">
                {item.title}
              </SemiSpan>
            </AccordionHeader>
            {item.subCategories.map((name: string) => (
              <Paragraph
                className="cursor-pointer"
                fontSize="14px"
                color="text.muted"
                pl="22px"
                py="6px"
                key={name}
                onClick={() => handleFilterUpdate("category", name)}
              >
                {name}
              </Paragraph>
            ))}
          </Accordion>
        ) : (
          <Paragraph
            className="cursor-pointer"
            fontSize="14px"
            color="text.muted"
            py="6px"
            key={item.title}
            onClick={() => handleFilterUpdate("category", item.title)}
          >
            {item.title}
          </Paragraph>
        )
      )}

      <Divider mt="18px" mb="24px" />

      {/* Price Range */}
      <H6 mb="16px">Price Range</H6>
      <FlexBox justifyContent="space-between" alignItems="center">
        <TextField
          placeholder="0"
          type="number"
          value={priceRange.min}
          onChange={(e) => handlePriceChange(e, "min")}
          fullwidth
        />
        <H5 color="text.muted" px="0.5rem">
          -
        </H5>
        <TextField
          placeholder="250"
          type="number"
          value={priceRange.max}
          onChange={(e) => handlePriceChange(e, "max")}
          fullwidth
        />
      </FlexBox>

      <Divider my="24px" />

      {/* Brands */}
      <H6 mb="16px">Brands</H6>
      {brands.map((item: { id: string; name: string }) => (
        <CheckBox
          key={item.id} // Use the `id` as the unique key
          name={item.name} // Display the name of the brand
          value={item.id} // Pass the `id` as the value for filtering
          color="secondary"
          label={<SemiSpan color="inherit">{item.name}</SemiSpan>} // Show the brand name
          my="10px"
          onChange={() => handleFilterUpdate("brand", item.id)} // Use the `id` for filtering
        />
      ))}


      <Divider my="24px" />

      {/* Ratings */}
      <H6 mb="16px">Ratings</H6>
      {[5, 4, 3, 2, 1].map((item: number) => (
        <CheckBox
          key={item}
          value={item}
          color="secondary"
          label={<Rating value={item} outof={5} color="warn" />}
          my="10px"
          onChange={() => handleFilterUpdate("rating", item)}
        />
      ))}

      <Divider my="24px" />

      {/* Colors */}
      <H6 mb="16px">Colors</H6>
      <FlexBox mb="1rem">
        {colors.map((item: Color) => (
          <LazyLoadImage
            key={item}
            src={`/assets/colors/${item}.png`} // Replace with your color asset path
            alt={item}
            width={25}
            height={25}
            style={{ cursor: "pointer", marginRight: "10px", borderRadius: "50%" }}
            onClick={() => handleFilterUpdate("color", item)}
          />
        ))}
      </FlexBox>
    </Card>
  );
};

export default ProductFilterCard;
