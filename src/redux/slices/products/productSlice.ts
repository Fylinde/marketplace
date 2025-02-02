

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getProducts,
  createProduct as serviceCreateProduct,
  deleteProduct as serviceDeleteProduct,
  getProductRating as serviceGetProductRating,
  addProductRating as serviceAddProductRating,
  getProductsByCategory as serviceGetProductsByCategory,
  fetchPersonalizedRecommendationsAPI,
  fetchRelatedProductsAPI,
  fetchTagsAPI,
  fetchColorsAPI,
  fetchShopsAPI,
  getLocalizedPricing,
  apiUpdateProduct,
  fetchFeaturedProductsAPI,
  fetchFlashDealsAPI,
  fetchProductsByTypeAPI,
  fetchProductsByTagAPI,
  fetchTopRatedProductsAPI,
  fetchNewArrivalsAPI,
  fetchProductsByBrandAPI,
  fetchProductsByCategoryAPI,
  fetchProductDetailsAPI,
  removeProductAPI ,
} from "../../../services/productService";
import { Product, ProductResponse } from "../../../types/Product";
import { Review } from "../../../types/review";
import { RootState } from "../../../redux/store";
import { Brand } from "../../../types/brand";
import { Shop } from "../../../types/shop";
import { ProductFilters } from "../../../types/Product";
import { extractErrorMessage } from "../../../types/extractErrorMessage";
import axios, { AxiosError } from "axios";
import { Rating } from "../../../types/rating";
import { mockProducts } from "../../../mock/data/products";


interface ProductState {
  products: Product[];
  productsByTag: Record<string, Product[]>; // Products grouped by tag
  loadingProductsByTag: Record<string, boolean>;
  currentProduct: Product | null;
  review: Review[],
  productRatings: Record<string, number>; 
  relatedProducts: Product[];
  tags: string[];
  categories: Array<{ title: string; subCategories?: string[] }>;
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
  flashDeals: Product[]; 
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

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  totalPages: 0,
  productRatings: {},
  review: [],
  loading: false,
  error: null,
  personalizedRecommendations: [],
  relatedProducts: [],
  tags: [],


  productsByTag: {}, // Initialize as an empty object
  loadingProductsByTag: {}, // Initialize as an empty object
  categories: [],
  localizedPrices: {}, // Use an empty object for localized prices
  tryOnData: {}, // Initialize as an empty object
  shops: [],
  brands: [],
  colors: [],
  loadingProducts: false,
  loadingBrands: false,
  loadingCategories: false,
  loadingShops: false,
  newArrivals: [],
  selectedBrand: "",
  selectedCategory: null,
  categoryType: "brands", // Default to "brands"
  topRatedProducts: [], // Initialize as an empty array
  flashDeals: [], // Initialize as an empty array
  featuredProducts: [], // Initialize as an empty array
  salesProducts: [], // Initialize as an empty array
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


// Helper function to validate and transform API response into the expected Product structure
const transformProductResponse = (data: any): Product => {
  if (!data || typeof data.id !== "string" || typeof data.name !== "string") {
    throw new Error("Invalid product data structure from API");
  }

  return {
    id: data.id,
    name: data.name,
    sellerPrice: data.sellerPrice || 0,
    sellerCurrency: data.sellerCurrency || "USD",
    totalSellerPrice: data.totalSellerPrice || 0,
    buyerPrice: data.buyerPrice || 0,
    buyerCurrency: data.buyerCurrency || "USD",
    totalBuyerPrice: data.totalBuyerPrice || 0,
    createdAt: data.createdAt || new Date().toISOString(),
    stock: data.stock || 0,
    imgUrl: data.imgUrl || "/assets/images/default-product.png",
    description: data.description || "",
    status: data.status || "Unavailable",
    rating: data.rating || 0,
    category: data.category || "Uncategorized",
    sellerId: data.sellerId || "unknown",
    sellerName: data.sellerName || "Unknown Seller",
    ...data, // Include any additional fields dynamically
  };
};
// Async Thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    { filters, page = 1 }: { filters: Partial<ProductFilters>; page?: number },
    thunkAPI
  ) => {
    try {
      // Merge filters with default values
      const defaultFilters: ProductFilters = {
        context: null,
        buyerPrice: [0, Infinity],
        sellerPrice: [0, Infinity],
        availability: null,
        selectedCategories: [],
        ...filters,
      };

      // Ensure arguments are passed in correct order
      return await getProducts(undefined, page, defaultFilters);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);



export const fetchProductById = createAsyncThunk<Product, string>(
  "products/fetchProductById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      return transformProductResponse(response.data); // Ensure correct Product structure
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);


export const createProduct = createAsyncThunk(
    "products/createProduct",
    async (newProduct: Partial<Product>, thunkAPI) => {
      try {
        return await serviceCreateProduct(newProduct);
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
  export const deleteProduct = createAsyncThunk(
    "products/deleteProduct",
    async (productId: string, thunkAPI) => {
      try {
        await serviceDeleteProduct(productId);
        return productId; // Return the deleted product's ID
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  // Async Thunks
  export const getProductRating = createAsyncThunk<
  { productId: string; rating: number },
  string // Argument type (productId)
>(
  "products/getProductRating",
  async (productId, thunkAPI) => {
    try {
      const response = await serviceGetProductRating(productId);
    
      if (typeof response === 'number') {
        return { productId, rating: response }; // Handle number case
      }
    
      // Assuming `response` is of type `Rating`, safely access its properties
      return { productId, rating: response.average }; // Use `average` or other relevant property
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
    
    
  }
);

  
  export const addProductRating = createAsyncThunk<
  { productId: string; rating: number }, // Expected return type
  { productId: string; rating: number } // Arguments passed to thunk
>(
  "products/addProductRating",
  async ({ productId, rating }, thunkAPI) => {
    try {
      const response = await serviceAddProductRating(productId, { rating });
      return { productId, rating: response.rating };
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

  
  
  
  export const getProductsByCategory = createAsyncThunk(
    "products/getProductsByCategory",
    async (category: string, thunkAPI) => {
      try {
        return await serviceGetProductsByCategory(category); // Pass only the category
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
  
  
  


// Async Thunks
export const fetchPersonalizedRecommendations = createAsyncThunk(
    "products/fetchPersonalizedRecommendations",
    async (userId: string, thunkAPI) => {
      try {
        return await fetchPersonalizedRecommendationsAPI(userId);
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
  export const fetchRelatedProducts = createAsyncThunk(
    "products/fetchRelatedProducts",
    async (productId: string, thunkAPI) => {
      try {
        return await fetchRelatedProductsAPI(productId);
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
  export const fetchTags = createAsyncThunk(
    "products/fetchTags",
    async (_, thunkAPI) => {
      try {
        return await fetchTagsAPI();
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );

  // Fetch Colors
export const fetchColors = createAsyncThunk(
  "products/fetchColors",
  async (_, thunkAPI) => {
    try {
      return await fetchColorsAPI();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch Shops
export const fetchShops = createAsyncThunk(
  "products/fetchShops",
  async (_, thunkAPI) => {
    try {
      return await fetchShopsAPI();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Get Localized Pricing
export const fetchLocalizedPricing = createAsyncThunk(
  "products/fetchLocalizedPricing",
  async (
    { productId, buyerCurrency }: { productId: string; buyerCurrency: string },
    thunkAPI
  ) => {
    try {
      return await getLocalizedPricing(productId, buyerCurrency);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    { productId, productData }: { productId: string; productData: Partial<Product> },
    thunkAPI
  ) => {
    try {
      return await apiUpdateProduct(productId, productData);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch Featured Products
export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (_, thunkAPI) => {
    try {
      return await fetchFeaturedProductsAPI();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);




export const fetchFlashDeals = createAsyncThunk(
  "products/fetchFlashDeals",
  async (_, thunkAPI) => {
    try {
      return await fetchProductsByTagAPI('flash-deal'); // Fetch only flash deals
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch flash deals");
    }
  }
);





// Fetch Products by Type
export const fetchProductsByType = createAsyncThunk(
  "products/fetchProductsByType",
  async ({ type, filter }: { type: string; filter?: string }, thunkAPI) => {
    try {
      return await fetchProductsByTypeAPI(type, filter);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const fetchProductsByTag = createAsyncThunk<
  { tag: string; products: Product[] },
  { tag: string }
>(
  "products/fetchProductsByTag",
  async ({ tag }, thunkAPI) => {
    try {
      // Attempt to fetch products from the backend
      const response = await fetch(`/api/products?tag=${tag}`);
      if (!response.ok) {
        throw new Error(`Backend API returned ${response.status}`);
      }
      const data = await response.json();

      // If backend returns empty, fallback to mock products
      if (data.products.length === 0) {
        console.warn(`Backend returned empty products for tag: ${tag}, falling back to mock data.`);
        const { mockProducts } = await import("../../../mock/data/products");
        const fallbackProducts = mockProducts.filter((product) => product.tag === tag);        
        return { tag, products: fallbackProducts };
      }

      return { tag, products: data.products };
    } catch (error) {
      console.error(`Error fetching products from backend for tag: ${tag}`, error);

      // Fallback to mock products on error
      const { mockProducts } = await import("../../../mock/data/products");
      const fallbackProducts = mockProducts.filter((product) => product.tag === tag);      
      return { tag, products: fallbackProducts };
    }
  }
);


// Fetch Top-Rated Product

export const fetchTopRatedProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchTopRatedProducts", async (_, thunkAPI) => {
  try {
    const response = await fetch(`/api/products?topRated=true`);
    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`);
    }
    const data = await response.json();

    if (data.products.length === 0) {
      console.warn("Backend returned empty top-rated products, falling back to mock data.");
      const { mockTopRatedProducts } = await import("../../../mock/data/mockTopRatedProducts");
      return mockTopRatedProducts;
    }

    return data.products;
  } catch (error) {
    console.error("Error fetching Top Rated Products:", error);
    const { mockTopRatedProducts } = await import("../../../mock/data/mockTopRatedProducts");
    return mockTopRatedProducts;
  }
});

// Fetch New Arrivals
export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async (_, thunkAPI) => {
    try {
      return await fetchNewArrivalsAPI();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch Products by Brand
export const fetchProductsByBrand = createAsyncThunk(
  "products/fetchProductsByBrand",
  async (brand: string, thunkAPI) => {
    try {
      return await fetchProductsByBrandAPI(brand);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch Products by Category
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (
    { categoryType, category }: { categoryType: "brands" | "shops"; category: string },
    thunkAPI
  ) => {
    try {
      const response = await fetchProductsByCategoryAPI(categoryType, category);
      return response; // { categoryType, products: Product[] }
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);



// Fetch product details by ID
export const fetchProductDetails = createAsyncThunk<Product, string>(
  "products/fetchProductDetails",
  async (productId, thunkAPI) => {
    try {
      const response = await axios.get(`/api/products/${productId}`);
      return transformProductResponse(response.data); // Use updated transformation
    } catch (error) {
      return thunkAPI.rejectWithValue(
        (error as AxiosError).response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (productId: string, thunkAPI) => {
    try {
      return await removeProductAPI(productId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Define the thunk
export const fetchProductRating = createAsyncThunk<
  { productId: string; rating: Rating | number }, // Return type
  string // Argument type (productId)
>("products/fetchProductRating", async (productId, thunkAPI) => {
  try {
    // Call the service to fetch the rating
    const response = await serviceGetProductRating(productId);

    // Validate the response and return the result
    if (typeof response === "number" || (response && typeof response.average === "number")) {
      return { productId, rating: response };
    }

    throw new Error("Invalid response structure");
  } catch (error) {
    // Handle errors
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});



export const addRating = createAsyncThunk<
  { productId: string; rating: number }, // Return type
  { productId: string; reviewData: { rating: number; comment: string; userId: string } } // Input type
>(
  "products/addRating",
  async ({ productId, reviewData }, thunkAPI) => {
    try {
      const response = await serviceAddProductRating(productId, reviewData);
      return { productId, rating: response.rating };
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);

  

export const fetchSalesProducts = createAsyncThunk(
  "products/fetchSalesProducts",
  async (_, thunkAPI) => {
    try {
      const filters: ProductFilters = {
        context: null,
        buyerPrice: [0, Infinity],
        sellerPrice: [0, Infinity],
        availability: null,
        selectedCategories: [],
        // Include any other properties relevant to your API logic
      };
      const response = await getProducts(undefined, 1, filters);
      return response.products;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

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

export const fetchB2CProducts = createAsyncThunk(
  "products/fetchB2CProducts",
  async (_, thunkAPI) => {
    try {
      const filters: ProductFilters = {
        segment: "B2C",
        context: "B2C",               // Use a valid value for context
        buyerPrice: [0, Infinity],    // Provide a range for buyerPrice
        sellerPrice: [0, Infinity],   // Provide a range for sellerPrice
        availability: "inStock",      // Use a valid availability value
        selectedCategories: [],       // Keep default as empty array
        tags: [],                     // Optional: Additional filters
        rating: [0, 5],               // Optional: Filter by rating range
        brand: [],                    // Optional: Filter by brand
        color: [],                    // Optional: Filter by color
        size: [],                     // Optional: Filter by size
      };
      const response = await getProducts(undefined, 1, filters);
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
      const filters: ProductFilters = {
        segment: "B2B",
        context: "B2B",
        buyerPrice: [0, Infinity],
        sellerPrice: [0, Infinity],
        availability: "inStock",
        selectedCategories: [],
        tags: [],
        rating: [0, 5],
        brand: [],
        color: [],
        size: [],
      };
      const response = await getProducts(undefined, 1, filters);
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
      const filters: ProductFilters = {
        segment: "C2C",
        context: "C2C",
        buyerPrice: [0, Infinity],
        sellerPrice: [0, Infinity],
        availability: "inStock",
        selectedCategories: [],
        tags: [],
        rating: [0, 5],
        brand: [],
        color: [],
        size: [],
      };
      const response = await getProducts(undefined, 1, filters);
      return response.products;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error));
    }
  }
);


// Slice Definition
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentProduct(state, action: PayloadAction<Product>) {
      state.currentProduct = action.payload;
    },
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
    .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
      state.currentProduct = action.payload;
    })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.error = action.payload as string;
      });

      builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products.push(action.payload); // Add the newly created product to the list
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.products = state.products.filter((product) => product.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

      builder
      // Get Product Rating
      .addCase(getProductRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductRating.fulfilled, (state, action) => {
        state.productRatings[action.payload.productId] = action.payload.rating; // Assign the rating
      })
      .addCase(getProductRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add Product Rating
    builder
      .addCase(addProductRating.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductRating.fulfilled, (state, action) => {
        const product = state.products.find((prod) => prod.id === action.payload.productId);
        if (product) {
          product.rating = action.payload.rating;
        }
      })
      .addCase(addProductRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get Products by Category
    builder
      .addCase(getProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getProductsByCategory.fulfilled,
        (state, action: PayloadAction<ProductResponse>) => {
          state.loading = false;
          state.products = action.payload.products;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      builder
      .addCase(fetchPersonalizedRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalizedRecommendations.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.personalizedRecommendations = action.payload;
      })
      .addCase(fetchPersonalizedRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Related Products
    builder
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Tags
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      builder
      .addCase(fetchProductsByTag.pending, (state, action) => {
        const { tag } = action.meta.arg;
        state.loadingProductsByTag[tag] = true;
        state.error = null; // Reset error for this tag
      })
      .addCase(fetchProductsByTag.fulfilled, (state, action) => {
        const { tag, products } = action.payload;
        state.loadingProductsByTag[tag] = false;
        state.productsByTag[tag] = products; // Store products (real or mock)
        console.log(`Fulfilled action for tag: ${tag}, Products:`, products);
      })
      .addCase(fetchProductsByTag.rejected, (state, action) => {
        const { tag } = action.meta.arg;
        state.loadingProductsByTag[tag] = false;
        state.error = action.payload as string; // Log error for debugging
        console.warn(`Rejected action for tag: ${tag}. Error:`, action.payload);
      });
    
    
    
      
        // Fetch Colors
        builder
        .addCase(fetchColors.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchColors.fulfilled, (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.tags = action.payload; // Assuming tags hold color info
        })
        .addCase(fetchColors.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
  
      // Fetch Shops
      builder
        .addCase(fetchShops.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchShops.fulfilled, (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.tags = action.payload; // Assuming tags hold shop info
        })
        .addCase(fetchShops.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
  
      // Fetch Localized Pricing
      builder
        .addCase(fetchLocalizedPricing.pending, (state) => {
          state.loading = true;
        })
        .addCase(
          fetchLocalizedPricing.fulfilled,
          (state, action: PayloadAction<{ productId: string; priceData: any }>) => {
            state.loading = false;
            // Assuming state has localized pricing structure
            state.productRatings[action.payload.productId] = action.payload.priceData;
          }
        )
        .addCase(fetchLocalizedPricing.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
  
      // Update Product
      builder
        .addCase(updateProduct.pending, (state) => {
          state.loading = true;
        })
        .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
          state.loading = false;
          const index = state.products.findIndex((p) => p.id === action.payload.id);
          if (index >= 0) {
            state.products[index] = action.payload;
          }
        })
        .addCase(updateProduct.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
     // Fetch Featured Products
     builder
     .addCase(fetchFeaturedProducts.pending, (state) => {
       state.loading = true;
     })
     .addCase(fetchFeaturedProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
       state.loading = false;
       state.products = action.payload;
     })
     .addCase(fetchFeaturedProducts.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload as string;
     });

   // Fetch Flash Deals
   builder
   .addCase(fetchFlashDeals.pending, (state) => {
     state.loading = true;
     state.error = null;
   })
   builder.addCase(fetchFlashDeals.fulfilled, (state, action: PayloadAction<Product[]>) => {
    state.loading = false;
    state.flashDeals = action.payload; // Directly store Product[]
  })
  
   .addCase(fetchFlashDeals.rejected, (state, action) => {
     state.loading = false;
     state.error = action.payload as string;
   });
 

   // Fetch Products by Type
   builder
     .addCase(fetchProductsByType.pending, (state) => {
       state.loading = true;
     })
     .addCase(fetchProductsByType.fulfilled, (state, action: PayloadAction<Product[]>) => {
       state.loading = false;
       state.products = action.payload;
     })
     .addCase(fetchProductsByType.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload as string;
     });
     // Fetch Top-Rated Products
     builder
     .addCase(fetchTopRatedProducts.pending, (state) => {
       state.loading = true;
       state.error = null;
     })
     .addCase(fetchTopRatedProducts.fulfilled, (state, action) => {
       state.loading = false;
       state.topRatedProducts = action.payload;
     })
     .addCase(fetchTopRatedProducts.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload || "Failed to fetch top-rated products";
     });

   // Fetch New Arrivals
   builder
     .addCase(fetchNewArrivals.pending, (state) => {
       state.loading = true;
     })
     .addCase(fetchNewArrivals.fulfilled, (state, action: PayloadAction<Product[]>) => {
       state.loading = false;
       state.products = action.payload;
     })
     .addCase(fetchNewArrivals.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload as string;
     });

   // Fetch Products by Brand
   builder
     .addCase(fetchProductsByBrand.pending, (state) => {
       state.loading = true;
     })
     .addCase(fetchProductsByBrand.fulfilled, (state, action: PayloadAction<Product[]>) => {
       state.loading = false;
       state.products = action.payload;
     })
     .addCase(fetchProductsByBrand.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload as string;
     });

   // Fetch Products by Category
   builder
     .addCase(fetchProductsByCategory.pending, (state) => {
       state.loading = true;
     })
     .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<{ categoryType: string; products: Product[] }>) => {
      state.loading = false;
      state.products = action.payload.products;
    })
     .addCase(fetchProductsByCategory.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload as string;
     });
    
      // Fetch Product Details
    builder
    .addCase(fetchProductDetails.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchProductDetails.fulfilled, (state, action: PayloadAction<Product>) => {
      state.loading = false;
      state.currentProduct = action.payload;
    })
    .addCase(fetchProductDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

  // Remove Product
  builder
    .addCase(removeProduct.pending, (state) => {
      state.loading = true;
    })
    .addCase(removeProduct.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.products = state.products.filter((product) => product.id !== action.payload);
    })
    .addCase(removeProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder
    .addCase(fetchProductRating.fulfilled, (state, action) => {
      const product = state.products.find((prod) => prod.id === action.payload.productId);
      if (product) {
        product.rating = action.payload.rating; // Dynamically assign `number` or `Rating`
      }
    })
      .addCase(addRating.fulfilled, (state, action) => {
        const product = state.products.find((prod) => prod.id === action.payload.productId);
        if (product) {
          product.rating = action.payload.rating; // Handle `Rating` or `number`
        }
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
    builder
      .addCase(fetchLocalizedPrices.fulfilled, (state, action) => {
        const { productId, priceData } = action.payload;
        state.localizedPrices[productId] = priceData;
      });
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
  },
});

// Selectors
export const selectTopRatedProducts = (state: RootState) => ({
  topRatedProducts: state.products.topRatedProducts,
  loading: state.products.loading,
  error: state.products.error,
});

export const selectFlashDeals = (state: RootState) => state.products.flashDeals;

export const selectProductById = (state: RootState, id: string) =>
  state.products.products.find((product: Product) => product.id === id);

export const selectBuyerPrice = (state: RootState, id: string) => {
  const product = state.products.products.find(
    (product: Product) => product.id === id
  );
  return product?.buyerPrice || 0;
};


export const selectProductRating = (state: RootState, id: string): Rating | number | undefined => {
  const product = state.products.products.find((prod) => prod.id === id);
  return product?.rating;
};

export const selectProducts = (state: RootState) => state.products.products;
export const selectProductError = (state: RootState) => state.products.error;
export const selectSelectedCategory = (state: RootState) =>
  state.products.selectedCategory;
export const selectCurrentSegment = (state: RootState) =>
  state.products.currentSegment;

// Selector to get personalized recommendations from the state
export const selectPersonalizedRecommendations = (state: RootState) =>
  state.products.personalizedRecommendations;

// Export actions and reducer
export const { clearProducts } = productSlice.actions;

export const { updateProductStock } = productSlice.actions;
export const { setCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
