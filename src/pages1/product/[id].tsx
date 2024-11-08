import Box from "components/Box";
import FlexBox from "components/FlexBox";
import NavbarLayout from "components/layout/NavbarLayout";
import AvailableShops from "components/products/AvailableShops";
import FrequentlyBought from "components/products/FrequentlyBought";
import ProductDescription from "components/products/ProductDescription";
import ProductIntro from "components/products/ProductIntro";
import ProductReview from "components/products/ProductReview";
import RelatedProducts from "components/products/RelatedProducts";
import { H5 } from "components/Typography";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id: productId } = useParams<{ id: string }>(); 
  

  const state = {
    title: "Mi Note 11 Pro",
    price: 1135,
  };

  const [selectedOption, setSelectedOption] = useState("description");

  // Provide type annotations for opt to avoid 'any' error
  const handleOptionClick = (opt: "description" | "review") => () => {
    setSelectedOption(opt);
  };

  return (
    <div>
      <ProductIntro {...state} />

      <FlexBox
        borderBottom="1px solid"
        borderColor="gray.400"
        mt="80px"
        mb="26px"
      >
        <H5
          className="cursor-pointer"
          mr="25px"
          p="4px 10px"
          color={
            selectedOption === "description" ? "primary.main" : "text.muted"
          }
          borderBottom={
            selectedOption === "description" ? "2px solid" : undefined
          }
          borderColor="primary.main"
          onClick={handleOptionClick("description")}
        >
          Description
        </H5>
        <H5
          className="cursor-pointer"
          p="4px 10px"
          color={selectedOption === "review" ? "primary.main" : "text.muted"}
          onClick={handleOptionClick("review")}
          borderBottom={selectedOption === "review" ? "2px solid" : undefined}
          borderColor="primary.main"
        >
          Review (3)
        </H5>
      </FlexBox>

      <Box mb="50px">
        {selectedOption === "description" && <ProductDescription />}
        {selectedOption === "review" && <ProductReview />}
      </Box>

      <FrequentlyBought />

      <AvailableShops />

      {/* Pass the productId prop to RelatedProducts */}
      {productId && <RelatedProducts productId={productId} />}
    </div>
  );
};

ProductDetails.layout = NavbarLayout;

export default ProductDetails;
