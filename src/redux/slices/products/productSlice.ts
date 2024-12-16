
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { WebSocketService } from "../../../services/websocketService";
import {
  getProducts,
  createProduct,
  deleteProduct,
  getProductRating,
  addProductRating,
  getProductsByCategory,
  fetchPersonalizedRecommendationsAPI,
  getRelatedProducts as fetchRelatedProductsAPI,
  fetchTags as fetchTagsAPI,
  fetchColors as fetchColorsAPI,
  fetchShops as fetchShopsAPI,
  getLocalizedPricing,
  updateProduct as apiUpdateProduct,
} from "../../../services/productService";
import { Product } from "../../../types/Product";
import { Brand } from "../../../types/brand";
import { Shop } from "../../../types/shop";
import { RootState } from "../../store";
import { Review } from "../../../types/review";
import { extractErrorMessage } from "../../../types/extractErrorMessage";


// Initialize WebSocket
const webSocketService = new WebSocketService("wss://your-websocket-url");




// Define the ProductState interface
interface ProductState {
  products: Product[];
  productsByTag: Record<string, Product[]>; // Products grouped by tag
  loadingProductsByTag: Record<string, boolean>; // Loading state for products by tag
  currentProduct: Product | null;
  relatedProducts: Product[];
  categories: Array<{ title: string; subCategories?: string[] }>;
  tags: string[];
  localizedPrices: Record<string, LocalizedPrice>; // Use the defined LocalizedPrice type
  tryOnData: Record<string, any>;
  shops: Shop[];
  brands: Brand[];
  colors: string[];
  loading: boolean;
  loadingProducts: boolean;
  loadingBrands: boolean;
  loadingCategories: boolean;
  loadingShops: boolean;
  error: string | null;
  totalPages: number;
  newArrivals: Product[];
  selectedBrand: string;
  categoryType: "brands" | "shops"; // Limit to valid options
  topRatedProducts: Product[]; // Made non-optional
  flashDeals: { product: Product; discount: number }[]; // Update type
  featuredProducts: Product[]; // Made non-optional
  selectedCategory: string | null;

  // Sales Page Additions
  salesProducts: Product[];
  personalizedRecommendations: Product[];
  filterOptions: {
    priceRange: [number, number];
    availability: boolean;
    rating: number;
    tags: string[];
  };

  // B2B, B2C, and C2C Specific
  b2cProducts: Product[];
  b2bProducts: Product[];
  c2cProducts: Product[];
  currentSegment: "B2C" | "B2B" | "C2C";
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
  productsByTag: {}, // Initialize as an empty object
  loadingProductsByTag: {}, // Initialize as an empty object
  currentProduct: null,
  relatedProducts: [],
  categories: [],
  tags: [],
  localizedPrices: {}, // Use an empty object for localized prices
  tryOnData: {}, // Initialize as an empty object
  shops: [],
  brands: [],
  colors: [],
  loading: false,
  loadingProducts: false,
  loadingBrands: false,
  loadingCategories: false,
  loadingShops: false,
  error: null,
  totalPages: 0,
  newArrivals: [],
  selectedBrand: "",
  selectedCategory: null,
  categoryType: "brands", // Default to "brands"
  topRatedProducts: [], // Initialize as an empty array
  flashDeals: [], // Initialize as an empty array
  featuredProducts: [], // Initialize as an empty array
  salesProducts: [], // Initialize as an empty array
  personalizedRecommendations: [], // Initialize as an empty array
  filterOptions: {
    priceRange: [0, 1000], // Example default price range
    availability: true, // Default to true (in stock only)
    rating: 0, // Default to no minimum rating
    tags: [], // Initialize with no selected tags
  },
  b2cProducts: [],
  b2bProducts: [],
  c2cProducts: [],
  currentSegment: "B2C", // Default segment to "B2C"
};




export const fetchB2CProducts = createAsyncThunk(
  "products/fetchB2CProducts",
  async (_, thunkAPI) => {
    try {
      const response = await getProducts(undefined, 1, { segment: "B2C" });
      return response.products;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);


export const fetchB2BProducts = createAsyncThunk(
  "products/fetchB2BProducts",
  async (_, thunkAPI) => {
    try {
      const response = await getProducts(undefined, 1, { segment: "B2B" });
      return response.products;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchC2CProducts = createAsyncThunk(
  "products/fetchC2CProducts",
  async (_, thunkAPI) => {
    try {
      const response = await getProducts(undefined, 1, { segment: "C2C" });
      return response.products;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);


export const fetchSalesProducts = createAsyncThunk(
  "products/fetchSalesProducts",
  async (_, thunkAPI) => {
    try {
      const response = await getProducts(undefined, 1, { tag: "Sales" });
      return response.products;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchPersonalizedRecommendations = createAsyncThunk<
  Product[],
  { userId?: string } | undefined,
  { rejectValue: string }
>("products/fetchPersonalizedRecommendations", async (args, thunkAPI) => {
  try {
    const userId = args?.userId || ""; // Default to an empty string
    const response = await fetchPersonalizedRecommendationsAPI(userId);
    return response; // Ensure API returns Product[]
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to fetch recommendations");
  }
});



export const fetchFlashDeals = createAsyncThunk<
  { product: Product; discount: number }[] // Expected return type
>("products/fetchFlashDeals", async (_, thunkAPI) => {
  try {
    const response = await axios.get("/api/flash-deals");
    return response.data; // Assume API returns an array of { product, discount }
  } catch (error) {
    return thunkAPI.rejectWithValue("Failed to fetch flash deals");
  }
});



export const fetchFilteredProducts = createAsyncThunk(
  "products/fetchFilteredProducts",
  async (
    { filters, page }: { filters: Record<string, any>; page: number },
    thunkAPI
  ) => {
    try {
      const response = await getProducts(undefined, page, filters);
      return response.products;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);


// Async Thunk to fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (
    { categoryType, category }: { categoryType: string; category: string | null },
    { rejectWithValue }
  ) => {
    try {
      const response = await getProductsByCategory(categoryType, category || "");
      return response.products; // Adjust according to API structure
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);



export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async (_, thunkAPI) => {
    try {
      const response = await getProducts(undefined, 1, { tag: "New Arrivals" });
      return response.products;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);



export const fetchTopRatedProducts = createAsyncThunk(
  "products/fetchTopRatedProducts",
  async (_, thunkAPI) => {
    try {
      const response = await getProducts(undefined, 1, { tag: "Top Ratings" });
      return response.products;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (_, thunkAPI) => {
    try {
      const response = await getProducts(undefined, 1, { tag: "Featured" });
      return response.products; // Adjust based on the actual API response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);



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


// Thunks for async operations
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    args: { page?: number; vendorId?: string; filters?: Record<string, any>; sort?: string } = {}, // Add vendorId
    thunkAPI
  ) => {
    const { page = 1, vendorId, filters = {}, sort = "popularity" } = args; // Include vendorId
    try {
      const response = await getProducts(vendorId, page, filters, sort); // Pass vendorId to the API call
      return { products: response.products, totalPages: response.totalPages };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);











export const fetchColors = createAsyncThunk("products/fetchColors", async (_, thunkAPI) => {
  try {
    return await fetchColorsAPI();
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});



export const fetchLocalizedPrices = createAsyncThunk(
  "products/fetchLocalizedPrices",
  async ({ productId, buyerCurrency }: { productId: string; buyerCurrency: string }, thunkAPI) => {
    try {
      const response = await getLocalizedPricing(productId, buyerCurrency);
      return { productId, priceData: response.data };
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





export const fetchShops = createAsyncThunk<Shop[], void, { rejectValue: string }>(
  "products/fetchShops",
  async (_, thunkAPI) => {
    try {
      return await fetchShopsAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

// Helper function to validate and transform API response into the expected Product structure
const transformProductResponse = (data: any): Product => {
  if (
    !data ||
    typeof data.id !== "string" ||
    typeof data.name !== "string" ||
    typeof data.price !== "number" ||
    typeof data.stock !== "number" ||
    typeof data.createdAt !== "string" // Ensure createdAt exists and is a string
  ) {
    throw new Error("Invalid product data structure from API");
  }

  return {
    id: data.id,
    name: data.name,
    price: data.price,
    currency: data.currency || "USD", // Default currency if not provided
    stock: data.stock,
    imgUrl: data.imgUrl || "/assets/images/default-product.png", // Default image if not provided
    description: data.description || "", // Default empty description
    category: data.category || "Uncategorized", // Default category
    rating: data.rating || 0, // Default rating
    vendorId: data.vendorId || "", // Default vendorId
    vendorName: data.vendorName || "Unknown Vendor", // Default vendor name
    createdAt: data.createdAt || new Date().toISOString(), // Default to current timestamp
    // Add more fields as needed from Product type
  };
};

// Fetch product details by ID
export const fetchProductDetails = createAsyncThunk<Product, string>(
  "products/fetchProductDetails",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      return {
        id: response.data.id,
        name: response.data.name,
        price: response.data.price,
        currency: response.data.currency || "USD",
        stock: response.data.stock,
        imgUrl: response.data.imgUrl || "/assets/images/default-product.png",
        description: response.data.description || "",
        category: response.data.category || "Uncategorized",
        rating: response.data.rating || 0,
        vendorId: response.data.vendorId || "",
        vendorName: response.data.vendorName || "Unknown Vendor",
        createdAt: response.data.createdAt || new Date().toISOString(),
      } as Product;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as AxiosError).response?.data?.message || "Failed to fetch product details"
      );
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


export const fetchProductsByType = createAsyncThunk(
  "product/fetchProductsByType",
  async ({ type, filter }: { type: string; filter?: string }, thunkAPI) => {
    try {
      const filters = filter ? { [type]: filter } : {};
      const response = await getProducts(undefined, 1, filters);
      return response.products;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchProductsByTag = createAsyncThunk(
  "product/fetchProductsByTag",
  async ({ tag }: { tag: string }, thunkAPI) => {
    try {
      const response = await getProducts(undefined, 1, { tag });
      return { tag, products: response.products || [] };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchProductsByBrand = createAsyncThunk(
  "products/fetchProductsByBrand",
  async (brand: string, thunkAPI) => {
    try {
      const response = await getProducts(undefined, 1, brand ? { brand } : {});
      return { products: response.products, brand };
    } catch (error: any) {
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

// Product slice definition
const productSlice = createSlice({
  name: "products",
  initialState, // Now correctly typed with ProductState
  reducers: {
    clearProducts(state) {
      state.products = [];
      state.selectedCategory = null;
      state.error = null;
    },
    setNewArrivals: (state, action: PayloadAction<Product[]>) => {
      state.newArrivals = action.payload;
    },
    updateProductStock: (
      state,
      action: PayloadAction<{ productId: string; stock: number }>
    ) => {
      const product = state.products.find((p) => p.id === action.payload.productId);
      if (product) {
        product.stock = action.payload.stock; // Immer.js handles immutability
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // B2C Products
      .addCase(fetchB2CProducts.fulfilled, (state, action) => {
        state.b2cProducts = action.payload;
      })
      // B2B Products
      .addCase(fetchB2BProducts.fulfilled, (state, action) => {
        state.b2bProducts = action.payload;
      })
      // C2C Products
      .addCase(fetchC2CProducts.fulfilled, (state, action) => {
        state.c2cProducts = action.payload;
      });

    builder
      // Handle sales products
      .addCase(fetchSalesProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesProducts.fulfilled, (state, action) => {
        state.salesProducts = action.payload;
        state.loading = false;
      })
      .addCase(fetchSalesProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle personalized recommendations
    builder
      .addCase(fetchPersonalizedRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalizedRecommendations.fulfilled, (state, action) => {
        state.personalizedRecommendations = action.payload;
        state.loading = false;
      })
      .addCase(fetchPersonalizedRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle flash deals
    builder
      .addCase(fetchFlashDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlashDeals.fulfilled, (state, action) => {
        state.flashDeals = action.payload;
        state.loading = false;
      })
      .addCase(fetchFlashDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle advanced filters
    builder
      .addCase(fetchFilteredProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchFilteredProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
    // Fetch products by brand
    builder
      .addCase(fetchProductsByBrand.pending, (state) => {
        state.loadingProducts = true;
        state.error = null;
      })
      .addCase(fetchProductsByBrand.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.selectedBrand = action.payload.brand;
        state.loadingProducts = false;
      })
      .addCase(fetchProductsByBrand.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loadingProducts = false;
      });

    builder
      .addCase(fetchProductsByTag.pending, (state, action) => {
        const { tag } = action.meta.arg;
        state.loadingProductsByTag[tag] = true;
        state.error = null;
      })
      .addCase(fetchProductsByTag.fulfilled, (state, action) => {
        const { tag, products } = action.payload;
        state.productsByTag[tag] = products;
        state.loadingProductsByTag[tag] = false;
      })
      .addCase(fetchProductsByTag.rejected, (state, action) => {
        const { tag } = action.meta.arg;
        state.error = action.payload as string;
        state.loadingProductsByTag[tag] = false;
      });

    builder
      // Fetch Shops
      .addCase(fetchShops.pending, (state) => {
        state.loadingCategories = true;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.shops = action.payload;
        state.loadingCategories = false;
      })
    builder.addCase(fetchShops.rejected, (state, action) => {
      state.error = action.payload || null;
      state.loadingCategories = false;
    })




    builder
      // Top Rated Products
      .addCase(fetchTopRatedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopRatedProducts.fulfilled, (state, action) => {
        state.topRatedProducts = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopRatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })



    builder
      .addCase(fetchFlashDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlashDeals.fulfilled, (state, action) => {
        state.flashDeals = action.payload;
        state.loading = false;
      })
      .addCase(fetchFlashDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

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
        })
      })
      .addCase(bulkUpdateProducts.rejected, (state, action) => {
        state.error = action.payload as string;
      })

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
    builder
      .addCase(fetchShops.pending, (state) => {
        state.loadingCategories = true;
      })
      .addCase(fetchShops.fulfilled, (state, action: PayloadAction<Shop[]>) => {
        state.shops = action.payload;
        state.loadingCategories = false;
      })
      .addCase(fetchShops.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || "An error occurred";
        state.loadingCategories = false;
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

// Selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductError = (state: RootState) => state.products.error;
export const selectSelectedCategory = (state: RootState) =>
  state.products.selectedCategory;
export const selectCurrentSegment = (state: RootState) =>
  state.products.currentSegment;

// Selector to get flash deals from the state
export const selectFlashDeals = (state: RootState) => state.products.flashDeals;

// Selector to get personalized recommendations from the state
export const selectPersonalizedRecommendations = (state: RootState) =>
  state.products.personalizedRecommendations;

// Export actions and reducer
export const { clearProducts } = productSlice.actions;

export const { updateProductStock } = productSlice.actions;

export default productSlice.reducer;

webSocketService.subscribe("product-update", (data: { productId: string; stock: number }) => {
  productSlice.actions.updateProductStock(data);
});
