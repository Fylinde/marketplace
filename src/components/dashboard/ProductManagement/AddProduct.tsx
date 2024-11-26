import React, { useEffect, useState } from "react";
import Button from "components/buttons/Button";
import Card from "components/Card";
import DropZone from "components/DropZone";
import Grid from "components/grid/Grid";
import DashboardPageHeader from "components/layout/DashboardPageHeader";
import VendorDashboardLayout from "components/layout/VendorDashboardLayout";
import Select from "components/Select";
import TextField from "components/text-field/TextField";
import ReactQuill from "react-quill"; // Rich text editor
import "react-quill/dist/quill.snow.css";
import { Formik } from "formik";
import * as yup from "yup";
import { fetchCategories, fetchTags, createProduct } from "services/productService";
import { RootState } from "redux/store";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "redux/store";
import { MultiValue, SingleValue } from "react-select";
import { SelectOption } from "@/types/selectOption";

// Define interface for form values
interface FormValues {
  name: string;
  sku: string;
  barcode: string;
  stock: number;
  price: number;
  sale_price: number;
  description: string;
  tags: string[];
  category: string;
  images: File[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  customAttributes: { key: string; value: string }[];
}


const AddProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<SelectOption[]>([]);

  // Fetch categories dynamically
  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(
        data.map((category: { id: string; name: string }) => ({
          label: category.name,
          value: category.id,
        }))
      );
    });
  }, []);

  // Fetch tag suggestions
  useEffect(() => {
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

  return (
    <div>
      <DashboardPageHeader
        title="Add Product"
        iconName="delivery-box"
        button={
          <Button
            color="primary"
            bg="primary.light"
            px="2rem"
            as="a"
            href="/vendor/products"
          >
            Back to Product List
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
                    label="Product Name"
                    placeholder="Enter product name"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    errorText={touched.name && errors.name}
                  />
                </Grid>
                {/* Category */}
                <Grid item sm={6} xs={12}>
                    <Select
                      label="Category"
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
                    label="SKU"
                    placeholder="Enter product SKU"
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
                    label="Barcode"
                    placeholder="Enter product barcode"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.barcode}
                    errorText={touched.barcode && errors.barcode}
                  />
                </Grid>

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
                    name="price"
                    label="Regular Price"
                    placeholder="Enter regular price"
                    type="number"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price}
                    errorText={touched.price && errors.price}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    name="sale_price"
                    label="Sale Price"
                    placeholder="Enter sale price"
                    type="number"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.sale_price}
                    errorText={touched.sale_price && errors.sale_price}
                  />
                </Grid>

               {/* Tags */}
               <Grid item sm={6} xs={12}>
                  <Select
                    label="Tags"
                    placeholder="Select tags"
                    options={tagSuggestions}
                    isMulti
                    value={tagSuggestions.filter((tag) => values.tags.includes(tag.value)) as MultiValue<SelectOption>}
                    onChange={(options, actionMeta) => {
                      const selectedTags = (options as MultiValue<SelectOption>)?.map((option) => option.value) || [];
                      setFieldValue("tags", selectedTags);
                    }}
                    errorText={touched.tags && errors.tags ? String(errors.tags) : undefined}
                  />
                </Grid>


                {/* SEO Metadata */}
                <Grid item xs={12}>
                  <TextField
                    name="metaTitle"
                    label="Meta Title"
                    placeholder="Enter meta title"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.metaTitle}
                    errorText={touched.metaTitle && errors.metaTitle}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="metaDescription"
                    label="Meta Description"
                    placeholder="Enter meta description"
                    fullwidth
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.metaDescription}
                    errorText={touched.metaDescription && errors.metaDescription}
                  />
                </Grid>
              </Grid>

              <Button
                mt="25px"
                variant="contained"
                color="primary"
                type="submit"
              >
                Save Product
              </Button>
            </form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

// Initial Values
const initialValues: FormValues = {
  name: "",
  sku: "",
  barcode: "",
  stock: 0,
  price: 0,
  sale_price: 0,
  description: "",
  tags: [],
  category: "",
  images: [],
  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
  customAttributes: [],
};

// Validation Schema
const checkoutSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  sku: yup.string().required("SKU is required"),
  barcode: yup.string().required("Barcode is required"),
  category: yup.string().required("Category is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .required("Regular price is required")
    .min(0, "Price must be greater than or equal to 0"),
  sale_price: yup
    .number()
    .required("Sale price is required")
    .min(0, "Sale price must be greater than or equal to 0")
    .test(
      "is-lower",
      "Sale price must be lower than regular price",
      function (value) {
        return value === undefined || value < this.parent.price;
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
});

AddProduct.layout = VendorDashboardLayout;

export default AddProduct;

