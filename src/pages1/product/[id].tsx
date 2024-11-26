import React, { useState } from "react";
import { useParams } from "react-router-dom";
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

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ?? ""; // Ensure productId is always a string

  const [selectedOption, setSelectedOption] = useState<"description" | "review">(
    "description"
  );

  const productState = {
    id: "12345",
    images: ["image1.jpg", "image2.jpg"],
    title: "Mi Note 11 Pro",
    price: 1135,
    brand: "Xiaomi",
    stock: true,
    vendorId: "vendor-123",
    vendorName: "Xiaomi Official Store",
    description: "A great phone with excellent features.",
  };

  const handleOptionClick = (option: "description" | "review") => () => {
    setSelectedOption(option);
  };

  return (
    <div>
      {/* Pass product details dynamically */}
      <ProductIntro product={productState} />

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

      <FrequentlyBought productId={productId} />

      <AvailableShops productId={productId} />

      {productId && <RelatedProducts productId={productId} />}
    </div>
  );
};

// Assign NavbarLayout to ProductDetails
ProductDetails.layout = NavbarLayout;

export default ProductDetails;
