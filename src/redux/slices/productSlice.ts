





import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { WebSocketService } from "services/websocketService";
import {
  getProducts,
  createProduct,
  deleteProduct,
  getProductRating,
  addProductRating,
  getRelatedProducts as fetchRelatedProductsAPI,
  fetchTags as fetchTagsAPI,
} from "@/services/productService";
import { Product } from "types/Product";
import { updateProduct as apiUpdateProduct } from "services/productService";



// Initialize WebSocket
const webSocketService = new WebSocketService("wss://your-websocket-url");


// Utility to extract error message from Axios or other error types
const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "An unexpected error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};




// Define the Rating interface for product reviews
// Interfaces
interface Rating {
  average: number;
  count: number;
  reviews: Array<{
    id: string;
    userId: string;
    comment: string;
    rating: number;
    date: string;
  }>;
}

// Define the structure of a Category
interface Category {
  title: string;
  subCategories?: string[];
}

// Add the Shop interface
interface Shop {
  id: string;
  imgUrl: string;
  name: string;
}

// Define the ProductState interface
interface ProductState {
  products: Array<Product>;
  currentProduct: Product | null;
  relatedProducts: Array<Product>;
  categories: Array<Category>;
  tags: Array<string>;
  localizedPrices: Record<string, LocalizedPrice>;
  tryOnData: Record<string, any>;
  shops: Shop[];
  brands: string[];
  colors: string[];
  loading: boolean;
  error: string | null;
  totalPages: number;
}

// Define the structure of a Review
interface Review {
  userId: string;    // ID of the user who wrote the review
  rating: number;    // Rating value (e.g., 1-5)
  comment: string;   // The review comment
  date?: string;     // Optional: date the review was submitted
}


interface LocalizedPrice {
  buyerCurrency: string;
  sellerCurrency: string;
  exchangeRate: number;
  buyerPrice: number;
  sellerPrice: number;
}

// Initial state for product slice
const initialState: ProductState = {
  products: [],
  currentProduct: null,
  relatedProducts: [],
  categories: [],
  tags: [],
  localizedPrices: {},
  tryOnData: {},
  shops: [],
  brands: [],
  colors: [],
  loading: false,
  error: null,
  totalPages: 0,
};

export const fetchTags = createAsyncThunk(
  "products/fetchTags",
  async (_, thunkAPI) => {
    try {
      const response = await fetchTagsAPI();
      return response.data; // Assuming the API returns an array of tags
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

  // Thunks for async operations
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/categories");
      return response.data as Category[]; // Ensure the API returns an array of categories with subCategories
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Thunks for async operations
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, filters = {}, sort = "popularity" }: { page?: number; filters?: Record<string, any>; sort?: string }, thunkAPI) => {
    try {
      const response = await getProducts(undefined, page, filters, sort);
      return {
        products: response.products,
        totalPages: response.totalPages,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch products.");
    }
  }
);



export const fetchBrands = createAsyncThunk(
  "products/fetchBrands",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/brands");
      return response.data; // Assuming API returns an array of brands
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchColors = createAsyncThunk(
  "products/fetchColors",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/colors");
      return response.data; // Assuming API returns an array of colors
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);



export const fetchLocalizedPrices = createAsyncThunk(
  "products/fetchLocalizedPrices",
  async (
    { productId, buyerCurrency }: { productId: string; buyerCurrency: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.get(`/api/products/${productId}/price`, {
        params: { buyerCurrency },
      });
      return { productId, priceData: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchTryOnData = createAsyncThunk(
  "products/fetchTryOnData",
  async (productId: string, thunkAPI) => {
    try {
      const response = await axios.get(`/api/products/${productId}/tryon`);
      return { productId, tryOnData: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const bulkUpdateProducts = createAsyncThunk(
  "products/bulkUpdateProducts",
  async (productData: Array<Partial<Product>>, thunkAPI) => {
    try {
      const response = await axios.put("/api/products/bulk", productData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchProductRating = createAsyncThunk(
  "products/fetchProductRating",
  async (productId: string, thunkAPI) => {
    try {
      const response = await getProductRating(productId);
      return { productId, rating: response.data.rating };
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const addRating = createAsyncThunk(
  "products/addRating",
  async (
    { productId, reviewData }: { productId: string; reviewData: Review },
    thunkAPI
  ) => {
    try {
      const response = await addProductRating(productId, reviewData);
      return { productId, rating: response.data.rating };
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);


export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData: any, thunkAPI) => {
    try {
      const response = await createProduct(productData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async (
    { productId, productData }: { productId: string; productData: any },
    thunkAPI
  ) => {
    try {
      const response = await apiUpdateProduct(productId, productData);
      return response.data; // Return the updated product object
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (productId: string, thunkAPI) => {
    try {
      await deleteProduct(productId);
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelatedProducts",
  async (
    { productId, filters = {}, page = 1 }: { productId: string; filters?: Record<string, any>; page?: number },
    thunkAPI
  ) => {
    try {
      // Construct query parameters dynamically
      const queryParams = new URLSearchParams({
        ...filters,
        page: String(page),
      });

      const url = `/api/products/${productId}/related?${queryParams.toString()}`;

      const response = await fetchRelatedProductsAPI(url);

      // Handle cases where no related products are found
      if (!response.data || response.data.length === 0) {
        console.warn("No related products found.");
        return [];
      }

      return response.data;
    } catch (error) {
      // Extract and return error message
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);





export const fetchShops = createAsyncThunk(
  "products/fetchShops",
  async (payload: { productId?: string }, thunkAPI) => {
    try {
      const { productId } = payload; // Destructure productId from payload
      const url = productId
        ? `/api/shops?productId=${productId}`
        : "/api/shops";
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Fetch product details by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (productId: string, thunkAPI) => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      return response.data as Product;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || err.message || "Failed to fetch product details";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// Update an existing product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    { productId, productData }: { productId: string; productData: Partial<Product> },
    thunkAPI
  ) => {
    try {
      // Call the API helper
      const response = await apiUpdateProduct(productId, productData);
      return response.data as Product; // Assume the API returns the updated product object
    } catch (error) {
      // Handle API errors gracefully
      const err = error as AxiosError<{ message?: string }>;
      const message =
        err.response?.data?.message || err.message || "Failed to update product";
      return thunkAPI.rejectWithValue(message);
    }
  }
);



// Product slice definition
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    updateProductStock: (state, action: PayloadAction<{ productId: string; stock: boolean }>) => {
      const product = state.products.find((p) => p.id === action.payload.productId);
      if (product) {
        product.stock = action.payload.stock;
      }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchTags.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchTags.fulfilled, (state, action) => {
      state.loading = false;
      state.tags = action.payload;
    })
    .addCase(fetchTags.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder
      .addCase(fetchLocalizedPrices.fulfilled, (state, action) => {
        const { productId, priceData } = action.payload;
        state.localizedPrices[productId] = priceData;
      })
      .addCase(fetchTryOnData.fulfilled, (state, action) => {
        const { productId, tryOnData } = action.payload;
        state.tryOnData[productId] = tryOnData;
      })
      .addCase(bulkUpdateProducts.fulfilled, (state, action) => {
        action.payload.forEach((updatedProduct: Product) => {
          const index = state.products.findIndex((p) => p.id === updatedProduct.id);
          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
        });
      })
      .addCase(bulkUpdateProducts.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    builder
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Brands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Colors
      .addCase(fetchColors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColors.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.colors = action.payload;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Shops
      .addCase(fetchShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
 
    
      builder
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Set the error message in the state
      })
      
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      });
    
    builder
      .addCase(fetchProductRating.fulfilled, (state, action) => {
        const product = state.products.find((prod) => prod.id === action.payload.productId);
        if (product) {
          product.rating = action.payload.rating;
        }
      })
      .addCase(addRating.fulfilled, (state, action) => {
        const product = state.products.find((prod) => prod.id === action.payload.productId);
        if (product) {
          product.rating = action.payload.rating;
        }
      });
  },
});

export const { updateProductStock } = productSlice.actions;

export default productSlice.reducer;

webSocketService.subscribe("product-update", (data: { productId: string; stock: boolean }) => {
  productSlice.actions.updateProductStock(data);
});
