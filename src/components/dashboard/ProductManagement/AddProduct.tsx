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
import { fetchCategories, fetchTags, createProduct } from "services/productService";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentExchangeRates } from "../../../redux/slices/utils/exchangeRateSlice";
import { AppDispatch } from "redux/store";
import { MultiValue, SingleValue } from "react-select";
import { SelectOption } from "@/types/selectOption";
import { getLocalizedText } from "../../../utils/localizationUtils";

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

const AddProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<SelectOption[]>([]);
  const [buyerCurrency, setBuyerCurrency] = useState<string>("USD");

  useEffect(() => {
    // Fetch categories dynamically
    fetchCategories().then((data) => {
      setCategories(
        data.map((category: { id: string; name: string }) => ({
          label: category.name,
          value: category.id,
        }))
      );
    });

    // Fetch tag suggestions
    fetchTags().then((data) =>
      setTagSuggestions(
        data.map((tag: string) => ({
          label: tag,
          value: tag,
        }))
      )
    );
  }, []);

  const handleFormSubmit = async (values: FormValues) => {
    try {
      const response = await createProduct(values);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  const calculateBuyerPrice = async (sellerPrice: number) => {
    const rateAction = await dispatch(fetchCurrentExchangeRates());
    const rates = (rateAction.payload as { rates: Record<string, number> }).rates; // Explicit type assertion
    const exchangeRate = rates[buyerCurrency];
    return sellerPrice * (exchangeRate || 1); // Fallback to 1 if exchangeRate is undefined
  };
  
  

  return (
    <StyledWrapper>
      <DashboardPageHeader
        title={getLocalizedText("addProduct.title", "product")}
        iconName="delivery-box"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            as="a"
            href="/vendor/products"
          >
            {getLocalizedText("addProduct.backButton", "product")}
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
                    label={getLocalizedText("addProduct.productName", "product")}
                    placeholder={getLocalizedText("addProduct.enterName", "product")}
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    errorText={touched.name && errors.name}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Select
                    label={getLocalizedText("addProduct.category", "product")}
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
                    label={getLocalizedText("addProduct.sku", "product")}
                    placeholder={getLocalizedText("addProduct.enterSKU", "product")}
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
                    label={getLocalizedText("addProduct.barcode", "product")}
                    placeholder={getLocalizedText("addProduct.enterBarcode", "product")}
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
                    label={getLocalizedText("addProduct.sellerPrice", "product")}
                    placeholder={getLocalizedText("addProduct.enterSellerPrice", "product")}
                    type="number"
                    fullwidth
                    onBlur={(e) => {
                      handleBlur(e);
                      const buyerPrice = calculateBuyerPrice(Number(values.sellerPrice));
                      setFieldValue("buyerPrice", buyerPrice);
                    }}
                    onChange={handleChange}
                    value={values.sellerPrice}
                    errorText={touched.sellerPrice && errors.sellerPrice}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="buyerPrice"
                    label={getLocalizedText("addProduct.buyerPrice", "product")}
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
                      onChange={(e) => setFieldValue("enableTryOn", e.target.checked)}
                    />
                    {getLocalizedText("addProduct.enableTryOn", "product")}
                  </label>

                  {values.enableTryOn && (
                    <>
                      <TextField
                        name="material"
                        label={getLocalizedText("addProduct.material", "product")}
                        placeholder={getLocalizedText("addProduct.enterMaterial", "product")}
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
                {getLocalizedText("addProduct.saveButton", "product")}
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    </StyledWrapper>
  );
};

// Initial Values
const initialValues: FormValues = {
  name: "",
  sku: "",
  barcode: "",
  stock: 0,
  sellerPrice: 0,
  buyerPrice: 0,
  salePrice: 0,
  description: "",
  tags: [],
  category: "",
  images: [],
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
  enableTryOn: false,
  sizes: [],
  colors: [],
  material: "",
  customAttributes: [],
  transactionType: "",
  minOrderQuantity: undefined,
  bulkDiscount: "",
  simpleDescription: "",
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

AddProduct.layout = VendorDashboardLayout;

export default AddProduct;