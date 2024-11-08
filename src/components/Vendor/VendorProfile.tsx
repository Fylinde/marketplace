import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "redux/store";
import { fetchVendorRating, addVendorRating } from "redux/slices/vendorSlice";
import Rating from "../rating/Rating";

const VendorProfile = ({ vendorId }: { vendorId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const rating = useSelector((state: RootState) => state.vendors.ratings[vendorId]);

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorRating(vendorId));
    }
  }, [dispatch, vendorId]);

  const handleAddRating = (newRating: number) => {
    dispatch(addVendorRating({ vendorId, ratingData: { rating: newRating } }));
  };

  return (
    <div>
      <Rating value={rating?.average || 0} count={rating?.count || 0} onRate={handleAddRating} />
    </div>
  );
};

export default VendorProfile;
