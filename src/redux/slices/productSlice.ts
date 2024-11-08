// src/redux/slices/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getProducts, createProduct, updateProduct, deleteProduct, getProductRating, addProductRating } from "services/productService";
import axios from 'axios'; // Import axios here

// Define the Product interface based on your product structure
interface Product {
  id: string;
  title: string;
  price: number;
  createdAt: string;
  status?: string;
  rating?: Rating; // Add rating field
  // Add more fields as per your product structure
}

// Define the Rating interface for product reviews
interface Rating {
  average: number;
  count: number;
  reviews: Review[];
}

interface Review {
  id: string;
  userId: string;
  comment: string;
  rating: number;
  date: string;
}

// Define the ProductState interface
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

// Initial state for product slice
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  totalPages: 0,
};

// Thunks for async operations

// Fetch products for a specific vendor with pagination
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ vendorId, page }: { vendorId: string; page: number }, thunkAPI) => {
      const response = await axios.get(`/api/products?vendorId=${vendorId}&page=${page}`);
      return {
        products: response.data.products as Product[],
        totalPages: response.data.totalPages // Adjust this based on your actual API response
      };
    }
);

// Fetch product rating
export const fetchProductRating = createAsyncThunk(
  "products/fetchProductRating",
  async (productId: string) => {
    const response = await getProductRating(productId);
    return { productId, rating: response.data.rating };
  }
);

// Add a new rating to a product
export const addRating = createAsyncThunk(
  "products/addRating",
  async ({ productId, reviewData }: { productId: string; reviewData: Review }) => {
    const response = await addProductRating(productId, reviewData);
    return { productId, rating: response.data.rating };
  }
);

// Add a new product
export const addProduct = createAsyncThunk("products/addProduct", async (productData: any) => {
  const response = await createProduct(productData);
  return response.data;
});

// Update an existing product
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ productId, productData }: { productId: string; productData: any }) => {
    const response = await updateProduct(productId, productData);
    return response.data;
  }
);

// Delete a product by ID
export const removeProduct = createAsyncThunk("products/removeProduct", async (productId: string) => {
  await deleteProduct(productId);
  return productId;
});

// Product slice definition
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {}, // Add any non-async reducers here if needed
  extraReducers: (builder) => {
    builder
      // Handle fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{ products: Product[]; totalPages: number }>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      // Handle add product
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
      })

      // Handle edit product
      .addCase(editProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      // Handle remove product
      .addCase(removeProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      })

      // Handle fetch product rating
      .addCase(fetchProductRating.fulfilled, (state, action: PayloadAction<{ productId: string; rating: Rating }>) => {
        const product = state.products.find((prod) => prod.id === action.payload.productId);
        if (product) {
          product.rating = action.payload.rating;
        }
      })

      // Handle add product rating
      .addCase(addRating.fulfilled, (state, action: PayloadAction<{ productId: string; rating: Rating }>) => {
        const product = state.products.find((prod) => prod.id === action.payload.productId);
        if (product) {
          product.rating = action.payload.rating;
        }
      });
  },
});

export default productSlice.reducer;
