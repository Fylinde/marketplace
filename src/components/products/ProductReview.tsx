import React, { useEffect, useState } from "react";
import Box from "../Box";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Rating from "../rating/Rating";
import TextArea from "../textarea/TextArea";
import { H2, H5 } from "../Typography";
import ProductComment from "./ProductComment";
import { useFormik } from "formik";
import * as yup from "yup";
import { getComments, addComment } from "services/productService"; // Import API functions
import { useParams } from "react-router-dom";

interface FormValues {
  rating: number;
  comment: string;
  date: string;
}

export interface ProductReviewProps {}

const ProductReview: React.FC<ProductReviewProps> = () => {
  const { id: productId } = useParams<{ id: string }>(); // Get product ID from URL
  const [comments, setComments] = useState<any[]>([]); // Hold comments from backend

  // Fetch comments on component load
  useEffect(() => {
    if (productId) {
      getComments(productId)
        .then((response) => setComments(response.data))
        .catch((error) => console.error("Failed to fetch comments", error));
    }
  }, [productId]);

  const handleFormSubmit = async (
    values: FormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    if (!productId) {
      console.error("Product ID is not available.");
      return;
    }
  
    try {
      await addComment(productId, values); // Submit comment to backend
      setComments((prevComments) => [...prevComments, values]); // Update comments list
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
    initialValues: initialValues,
    validationSchema: reviewSchema,
    onSubmit: handleFormSubmit,
  });

  return (
    <Box>
      {comments.map((item, ind) => (
        <ProductComment {...item} key={ind} />
      ))}

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

// Initial values for form
const initialValues: FormValues = {
  rating: 0,
  comment: "",
  date: new Date().toISOString(),
};

// Yup validation schema
const reviewSchema = yup.object().shape({
  rating: yup.number().required("required"),
  comment: yup.string().required("required"),
});

export default ProductReview;
