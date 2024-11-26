import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRating, fetchProductRating } from "@/redux/slices/productSlice";
import { RootState } from "@/redux/store";
import type { AppDispatch } from "../../redux/store";
import ProductReviewsContainer from "./styles/ProductReviews.styles";

const ProductReviews: React.FC<{ productId: string }> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useSelector((state: RootState) => state.products);
  const product = products.find((p) => p.id === productId);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  const userId = "mockUserId"; // Replace with actual user ID from authentication

  React.useEffect(() => {
    dispatch(fetchProductRating(productId));
  }, [dispatch, productId]);

  const handleReviewSubmit = () => {
    dispatch(
      addRating({
        productId,
        reviewData: { ...newReview, userId },
      })
    );
    setNewReview({ rating: 0, comment: "" });
  };

  return (
    <ProductReviewsContainer>
      <h3>Reviews</h3>
      {product?.rating?.reviews.map((review: { id: string; comment: string; rating: number }) => (
        <div key={review.id}>
          <p>{review.comment}</p>
          <p>Rating: {review.rating}</p>
        </div>
      ))}
      <div>
        <h4>Leave a Review</h4>
        <textarea
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
        />
        <input
          type="number"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
          max={5}
          min={1}
        />
        <button onClick={handleReviewSubmit}>Submit</button>
      </div>
    </ProductReviewsContainer>
  );
};

export default ProductReviews;
