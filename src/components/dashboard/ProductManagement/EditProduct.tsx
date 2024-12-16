import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "components/buttons/Button";
import Card from "components/Card";
import DropZone from "components/DropZone";
import Grid from "components/grid/Grid";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import Select from "components/Select";
import TextField from "components/text-field/TextField";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Formik } from "formik";
import * as yup from "yup";
import { fetchTags, fetchProductDetails, updateProduct } from "../../../redux/slices/products/productSlice";
import { fetchCategories } from "../../../redux/slices/products/categorySlice";
import { useParams, useNavigate } from "react-router-dom";
import { AppDispatch } from "redux/store";
import { useDispatch } from "react-redux";
import { MultiValue, SingleValue } from "react-select";
import { SelectOption } from "@/types/selectOption";
import { getLocalizedText } from "../../../utils/localizationUtils";
import { unwrapResult } from "@reduxjs/toolkit";

// Styled Components
const StyledWrapper = styled.div`
  .tryon-section {
    margin-top: 2rem;
    border-top: 1px solid #ddd;
    padding-top: 1rem;
  }

  .color-picker {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .color-swatch {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    border: 1px solid #ccc;
  }
`;

// Define interface for form values
interface FormValues {
  name: string;
  sku: string;
  barcode: string;
  stock: number;
  sellerPrice: number;
  buyerPrice: number;
  salePrice: number;
  description: string;
  tags: string[];
  category: string;
  images: File[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  enableTryOn: boolean;
  sizes: string[];
  colors: string[];
  material: string;
  customAttributes: { key: string; value: string }[];
  transactionType: string;
  minOrderQuantity?: number;
  bulkDiscount?: string;
  simpleDescription?: string;
}

const EditProduct = () => {
  const { productId = "" } = useParams<{ productId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<SelectOption[]>([]);
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);

  useEffect(() => {
    dispatch(fetchCategories())
      .then(unwrapResult)
      .then((data: { id: string; name: string }[]) => {
        setCategories(
          data.map((category) => ({
            label: category.name,
            value: category.id,
          }))
        );
      })
      .catch((error) => console.error("Error fetching categories:", error));

    dispatch(fetchTags())
      .then(unwrapResult)
      .then((data: string[]) => {
        setTagSuggestions(
          data.map((tag) => ({
            label: tag,
            value: tag,
          }))
        );
      })
      .catch((error) => console.error("Error fetching tags:", error));

    dispatch(fetchProductDetails(productId))
      .then(unwrapResult)
      .then((product) => {
        setInitialValues({
          name: product.name || "",
          sku: product.sku || "",
          barcode: product.barcode || "",
          stock: product.stock || 0,
          sellerPrice: product.sellerPrice || 0,
          buyerPrice: product.buyerPrice || 0,
          salePrice: product.salePrice || 0,
          description: product.description || "",
          tags: product.tags || [],
          category: product.category || "",
          images: [],
          metaTitle: product.metaTitle || "",
          metaDescription: product.metaDescription || "",
          metaKeywords: product.metaKeywords || [],
          enableTryOn: product.enableTryOn || false,
          sizes: product.sizes || [],
          colors: product.colors || [],
          material: product.material || "",
          customAttributes: product.customAttributes || [],
          transactionType: product.transactionType || "",
          minOrderQuantity: product.minOrderQuantity || 0,
          bulkDiscount: product.bulkDiscount || "",
          simpleDescription: product.simpleDescription || "",
        });
      })
      .catch((error) => console.error("Error fetching product details:", error));
  }, [productId]);

  const handleFormSubmit = async (values: FormValues) => {
    try {
      // Convert File[] to string[] if needed
      const imageUrls = values.images.map((file) => {
        if (typeof file === "string") {
          // Already a string, keep as is
          return file;
        } else {
          // Placeholder for image upload logic
          console.warn("File upload not implemented. Converting to placeholder URL.");
          return URL.createObjectURL(file); // Replace with actual upload logic
        }
      });

      // Prepare the data for submission
      const productData = {
        ...values,
        images: imageUrls,
      };

      // Ensure `updateProduct` receives the productId and converted values
      await dispatch(updateProduct({ productId, productData })).then(unwrapResult);

      alert("Product updated successfully!");
      navigate("/vendor/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };




  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <StyledWrapper>
      <DashboardPageHeader
        title={getLocalizedText("editProduct.title", "product")}
        iconName="delivery-box"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            as="a"
            href="/vendor/products"
          >
            {getLocalizedText("editProduct.backButton", "product")}
          </Button>
        }
      />

      <Card p="30px">
        <Formik
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={6}>
                {/* Basic Information */}
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="name"
                    label={getLocalizedText("editProduct.productName", "product")}
                    placeholder={getLocalizedText("editProduct.enterName", "product")}
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    errorText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Select
                    label={getLocalizedText("editProduct.category", "product")}
                    options={categories}
                    value={categories.find((cat) => cat.value === values.category) || undefined}
                    onChange={(option) => {
                      setFieldValue("category", (option as SingleValue<SelectOption>)?.value || "");
                    }}
                    errorText={touched.category && errors.category ? String(errors.category) : undefined}
                  />
                </Grid>

                {/* SKU and Barcode */}
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="sku"
                    label={getLocalizedText("editProduct.sku", "product")}
                    placeholder={getLocalizedText("editProduct.enterSKU", "product")}
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sku}
                    errorText={touched.sku && errors.sku}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="barcode"
                    label={getLocalizedText("editProduct.barcode", "product")}
                    placeholder={getLocalizedText("editProduct.enterBarcode", "product")}
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.barcode}
                    errorText={touched.barcode && errors.barcode}
                  />
                </Grid>

                {/* Transaction Type */}
                <Grid item sm={6} xs={12}>
                  <Select
                    name="transactionType"
                    label="Transaction Type"
                    options={[
                      { label: "B2B", value: "B2B" },
                      { label: "B2C", value: "B2C" },
                      { label: "C2C", value: "C2C" },
                    ]}
                    value={
                      values.transactionType
                        ? { label: values.transactionType, value: values.transactionType }
                        : undefined
                    }
                    onChange={(option) => {
                      setFieldValue("transactionType", (option as SelectOption)?.value || "");
                    }}
                    errorText={
                      touched.transactionType && errors.transactionType
                        ? String(errors.transactionType)
                        : undefined
                    }
                  />

                </Grid>

                {/* Transaction-Specific Fields */}
                {values.transactionType === "B2B" && (
                  <>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        name="minOrderQuantity"
                        label="Minimum Order Quantity"
                        type="number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.minOrderQuantity}
                        errorText={touched.minOrderQuantity && errors.minOrderQuantity}
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        name="bulkDiscount"
                        label="Bulk Discount"
                        placeholder="Enter bulk discount (e.g., 10% off for 10+)"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.bulkDiscount}
                        errorText={touched.bulkDiscount && errors.bulkDiscount}
                      />
                    </Grid>
                  </>
                )}

                {values.transactionType === "C2C" && (
                  <Grid item xs={12}>
                    <TextField
                      name="simpleDescription"
                      label="Simple Description"
                      placeholder="Enter a brief description"
                      fullwidth
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.simpleDescription}
                      errorText={touched.simpleDescription && errors.simpleDescription}
                    />
                  </Grid>
                )}

                {/* Images */}
                <Grid item xs={12}>
                  <DropZone
                    onChange={(files) => setFieldValue("images", files)}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <ReactQuill
                    theme="snow"
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                  />
                  {touched.description && errors.description && (
                    <div className="error-text">{errors.description}</div>
                  )}
                </Grid>

                {/* Pricing */}
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="sellerPrice"
                    label={getLocalizedText("editProduct.sellerPrice", "product")}
                    placeholder={getLocalizedText("editProduct.enterSellerPrice", "product")}
                    type="number"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sellerPrice}
                    errorText={touched.sellerPrice && errors.sellerPrice}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="buyerPrice"
                    label={getLocalizedText("editProduct.buyerPrice", "product")}
                    placeholder="Calculated automatically"
                    type="number"
                    fullwidth
                    value={values.buyerPrice}
                    disabled
                  />
                </Grid>

                {/* TryOn Section */}
                <Grid item xs={12} className="tryon-section">
                  <label>
                    <input
                      type="checkbox"
                      name="enableTryOn"
                      checked={values.enableTryOn}
                      onChange={(e) => setFieldValue("enableTryOn", e.target.checked)}
                    />
                    {getLocalizedText("editProduct.enableTryOn", "product")}
                  </label>

                  {values.enableTryOn && (
                    <>
                      <TextField
                        name="material"
                        label={getLocalizedText("editProduct.material", "product")}
                        placeholder={getLocalizedText("editProduct.enterMaterial", "product")}
                        fullwidth
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.material}
                        errorText={touched.material && errors.material}
                      />

                      <div className="color-picker">
                        {values.colors.map((color, index) => (
                          <div
                            key={index}
                            className="color-swatch"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                    </>
                  )}
                </Grid>

              </Grid>
              <Button mt="25px" variant="contained" color="primary" type="submit">
                {getLocalizedText("editProduct.saveButton", "product")}
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    </StyledWrapper>
  );
};

// Validation Schema
const checkoutSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  sku: yup.string().required("SKU is required"),
  barcode: yup.string().required("Barcode is required"),
  category: yup.string().required("Category is required"),
  description: yup.string().required("Description is required"),
  sellerPrice: yup
    .number()
    .required("Seller price is required")
    .min(0, "Price must be greater than or equal to 0"),
  salePrice: yup
    .number()
    .required("Sale price is required")
    .min(0, "Sale price must be greater than or equal to 0")
    .test(
      "is-lower",
      "Sale price must be lower than seller price",
      function (value) {
        return value === undefined || value < this.parent.sellerPrice;
      }
    ),
  tags: yup
    .array()
    .of(yup.string())
    .required("At least one tag is required"),
  images: yup
    .array()
    .of(
      yup
        .mixed<File>()
        .test("fileSize", "Each image must be less than 2MB", (file) =>
          file ? file.size <= 2 * 1024 * 1024 : true
        )
        .test("fileType", "Only image files are supported", (file) =>
          file
            ? ["image/jpeg", "image/png", "image/webp"].includes(file.type)
            : true
        )
    )
    .required("At least one product image is required")
    .min(1, "You must upload at least one image"),
  metaTitle: yup.string().required("Meta title is required"),
  metaDescription: yup.string().required("Meta description is required"),
  metaKeywords: yup
    .array()
    .of(yup.string())
    .required("Meta keywords are required"),
  transactionType: yup.string().required("Transaction type is required"),
  minOrderQuantity: yup
    .number()
    .when("transactionType", (transactionType, schema) =>
      typeof transactionType === "string" && transactionType === "B2B"
        ? schema.required("Minimum order quantity is required")
        : schema.nullable()
    ),
  bulkDiscount: yup
    .string()
    .when("transactionType", (transactionType, schema) =>
      typeof transactionType === "string" && transactionType === "B2B"
        ? schema.required("Bulk discount is required")
        : schema.nullable()
    ),
  simpleDescription: yup
    .string()
    .when("transactionType", (transactionType, schema) =>
      typeof transactionType === "string" && transactionType === "C2C"
        ? schema.required("Simple description is required")
        : schema.nullable()
    ),
});

EditProduct.layout = VendorDashboardLayout;

export default EditProduct;
