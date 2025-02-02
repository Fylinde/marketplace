import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchResults,
  fetchMoreSearchResults,
  resetSearch,
} from "@/redux/slices/utils/searchSlice";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Typography from "../Typography";
import Button from "../buttons/Button";
import Card from "../Card";
import Modal from "../modal/Modal";
import Spinner from "../Spinner";
import { useInView } from "react-intersection-observer";
import ARViewer from "./ARViewer"; // Import the ARViewer component
import RecommendedItems from "./RecommendedItems";
import type { AppDispatch, RootState } from "../../redux/store";

const SearchResults: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    results,
    loading,
    hasMore,
    query,
    filters,
    buyerCurrency,
    sellerCurrency,
  } = useSelector((state: RootState) => state.search);

  const [currentPage, setCurrentPage] = useState(1);
  const [arProduct, setArProduct] = useState<string | null>(null); // State for the product to be viewed in AR
  const [preferences, setPreferences] = useState<string[]>([]); // Personalization preferences

  // Infinite Scroll Intersection Observer
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  // Fetch initial results
  useEffect(() => {
    if (query) {
      dispatch(resetSearch());
      dispatch(fetchSearchResults({ query, page: 1, filters }));
      setCurrentPage(1);
    }
  }, [dispatch, query, filters]);

  // Fetch more results when in view (infinite scrolling)
  useEffect(() => {
    if (inView && hasMore && !loading) {
      dispatch(fetchMoreSearchResults({ query, page: currentPage + 1, filters }));
      setCurrentPage((prev) => prev + 1);
    }
  }, [dispatch, inView, hasMore, loading, query, filters, currentPage]);

  // Highlight query terms in search results
  const highlightQuery = (text: string): React.ReactNode => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ fontWeight: "bold", color: "blue" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleArView = (productId: string) => {
    setArProduct(productId);
  };

  return (
    <Box>
      <Typography variant="h5" mb="1rem">
        Search Results for "{query}"
      </Typography>

      <FlexBox flexDirection="column" gap="1rem">
        {results.map((result) => (
          <Card key={result.id} p="1rem" boxShadow="medium">
            <FlexBox justifyContent="space-between">
              {/* Product Image */}
              <Box flex="0 0 100px">
                <img
                  src={result.imageUrl}
                  alt={result.title}
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              </Box>

              {/* Product Details */}
              <Box flex="1 1 auto" ml="1rem">
                <Typography variant="h6" mb="0.5rem">
                  {highlightQuery(result.title)}
                </Typography>
                <Typography color="textSecondary" mb="0.5rem">
                  {result.description}
                </Typography>

                {/* Dual Pricing */}
                <FlexBox justifyContent="space-between" alignItems="center">
                  <Typography color="success">
                    Buyer Price: {buyerCurrency} {result.buyerPrice.toFixed(2)}
                  </Typography>
                  <Typography color="info">
                    Seller Price: {sellerCurrency} {result.sellerPrice.toFixed(2)}
                  </Typography>
                </FlexBox>

                {/* AR View Button */}
                {result.isArEnabled && (
                  <Button variant="outlined" color="primary" onClick={() => handleArView(result.id)}>
                    View in AR
                  </Button>
                )}
              </Box>
            </FlexBox>
          </Card>
        ))}

        {/* Infinite Scroll Loader */}
        {loading && (
          <FlexBox justifyContent="center" mt="1rem">
            <Spinner size="24px" />
          </FlexBox>
        )}

        {/* Intersection Observer Trigger */}
        <div ref={ref} />
      </FlexBox>

      {/* AR Modal */}
      {arProduct && (
        <Modal
          title="Augmented Reality View"
          open={!!arProduct}
          onClose={() => setArProduct(null)}
        >
          <Typography variant="h6" mb="1rem">
            Visualize your product in AR
          </Typography>
          <ARViewer productId={arProduct} /> {/* Render ARViewer for AR experience */}
        </Modal>
      )}

      {/* No Results Feedback */}
      {!hasMore && !loading && results.length === 0 && (
        <Typography textAlign="center" mt="2rem">
          No results found for "{query}".
        </Typography>
      )}
      <RecommendedItems context="search" query={query} />
    </Box>
  );
};

export default SearchResults;
