
import React, { useEffect, useState } from "react";
import ProductCard1 from "../product-cards/ProductCard1";
import Box from "../Box";
import Carousel from "../carousel/Carousel";
import CategorySectionCreator from "../CategorySectionCreator";

const FlashDealsSection: React.FC = () => {
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlashDeals = async () => {
        try {
          const response = await fetch("/api/products/flash-deals");
          console.log("Raw Response:", response);
          if (!response.ok) throw new Error(`Failed to fetch Flash Deals: ${response.status}`);
          const data = await response.json();
          console.log("Parsed Data:", data);
          setFlashDeals(data);
        } catch (err: any) {
          console.error("Error:", err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      

    fetchFlashDeals();
  }, []);

  return (
    <CategorySectionCreator iconName="light" title="Flash Deals" seeMoreLink="#">
      <Box mt="1.5rem" mb="1.5rem">
        {loading ? (
          <p>Loading Flash Deals...</p>
        ) : error ? (
            <p>Error loading Flash Deals: {error}</p>
        ) : flashDeals.length > 0 ? (
          <Carousel totalSlides={flashDeals.length} visibleSlides={4}>
            {flashDeals.map((product, index) => (
              <Box py="0.25rem" key={index}>
                <ProductCard1
                  id={product.id}
                  imgUrl={product.imgUrl || "/assets/images/default-product.png"}
                  title={product.name || "Untitled Product"}
                  rating={
                    typeof product.rating === "number"
                      ? product.rating
                      : product.rating?.average || 0
                  }
                  sellerPrice={product.sellerPrice || 0}
                  buyerPrice={product.buyerPrice || 0}
                  sellerCurrency={product.sellerCurrency || "USD"}
                  buyerCurrency={product.buyerCurrency || "USD"}
                  exchangeRates={{ baseCurrency: "USD", rates: {} }}
                />
              </Box>
            ))}
          </Carousel>
        ) : (
          <p>No Flash Deals Available</p>
        )}
      </Box>
    </CategorySectionCreator>
  );
};

export default FlashDealsSection;