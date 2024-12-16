import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchSellerRating, addSellerRating } from "../../redux/slices/auth/sellerSlice";
import Rating from "../rating/Rating";

const VendorProfile = ({ sellerId }: { sellerId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const rating = useSelector((state: RootState) => state.sellers.ratings[sellerId]);

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchSellerRating(sellerId));
    }
  }, [dispatch, sellerId]);

  const handleAddRating = (newRating: number) => {
    dispatch(addSellerRating({ sellerId, ratingData: { rating: newRating } }));
  };

  return (
    <div>
      <Rating value={rating?.average || 0} count={rating?.count || 0} onRate={handleAddRating} />
    </div>
  );
};

export default VendorProfile;
