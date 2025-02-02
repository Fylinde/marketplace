import React, { useEffect } from "react";
import Box from "../Box";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Rating from "../rating/Rating";
import TextArea from "../textarea/TextArea";
import { H2, H5 } from "../Typography";
import ProductComment from "./ProductComment";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchComments, addComment } from "../../redux/slices/communication/commentSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import type { ReviewComment } from "../../redux/slices/communication/commentSlice";

interface FormValues {
  rating: number;
  comment: string;
}

const ProductReview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id: productId } = useParams<{ id: string }>();
  const { comments, loading } = useSelector((state: RootState) => state.comments);

  useEffect(() => {
    if (productId) {
      dispatch(fetchComments(productId));
    }
  }, [dispatch, productId]);

  const handleFormSubmit = async (
    values: FormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    if (!productId) {
      console.error("Product ID is not available.");
      return;
    }

    try {
      await dispatch(addComment({ productId, ...values }));
      resetForm();
    } catch (error) {
      console.error("Failed to submit comment", error);
    }
  };

  const {
    values,
    errors,
    touched,
    dirty,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik<FormValues>({
    initialValues,
    validationSchema: reviewSchema,
    onSubmit: handleFormSubmit,
  });

  if (loading) return <p>Loading comments...</p>;

  return (
    <Box>
      {/* Render Comments */}
      {comments.length > 0 ? (
        comments.map((item: ReviewComment) => (
          <ProductComment
            key={item.id}
            productId={item.productId}
            name={item.userName}
            imgUrl={`/api/users/${item.userId}/avatar`}
            rating={item.rating}
            date={item.createdAt}
            comment={item.comment}
          />
        ))
      ) : (
        <p>No comments available</p>
      )}

      {/* Write a Review Form */}
      <H2 fontWeight="600" mt="55px" mb="20">
        Write a Review for this product
      </H2>

      <form onSubmit={handleSubmit}>
        <Box mb="20px">
          <FlexBox mb="12px">
            <H5 color="gray.700" mr="6px">
              Your Rating
            </H5>
            <H5 color="error.main">*</H5>
          </FlexBox>

          <Rating
            outof={5}
            color="warn"
            size="medium"
            readonly={false}
            value={values.rating || 0}
            onChange={(value) => setFieldValue("rating", value)}
          />
        </Box>

        <Box mb="24px">
          <FlexBox mb="12px">
            <H5 color="gray.700" mr="6px">
              Your Review
            </H5>
            <H5 color="error.main">*</H5>
          </FlexBox>

          <TextArea
            name="comment"
            placeholder="Write a review here..."
            fullwidth
            rows={8}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.comment || ""}
            errorText={touched.comment && errors.comment}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="small"
          type="submit"
          disabled={!(dirty && isValid)}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

const initialValues: FormValues = {
  rating: 0,
  comment: "",
};

const reviewSchema = yup.object().shape({
  rating: yup.number().required("Rating is required"),
  comment: yup.string().required("Comment is required"),
});

export default ProductReview;
