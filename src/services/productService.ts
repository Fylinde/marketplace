import axios from "axios";
import { Product, ProductResponse, ProductFilters } from "../types/Product";
import { Review } from "../types/review";
import { Rating } from "../types/rating";
import { mockProducts } from "../mockServer";

const validateRatingResponse = (data: any): Rating | number => {
  if (typeof data === "number") {
    return data;
  }
  if (data && typeof data.rating === "number") {
    return {
      average: data.average || 0,
      count: data.count || 0,
      reviews: data.reviews || [],
    };
  }
  throw new Error("Invalid rating response structure");
};



// Fetch all products, potentially filtered by Seller if needed
export const getProducts = async (
  sellerId?: string,
  page: number = 1,
  filters: ProductFilters = {
    context: null, // Matches type "B2B" | "B2C" | "C2C" | null
    buyerPrice: [0, 10000], // Changed to a tuple [number, number]
    sellerPrice: [0, 10000], // Changed to a tuple [number, number]
    availability: "inStock", // Matches type "inStock" | "outOfStock" | null
    selectedCategories: [], // No changes needed
  }, // Provide defaults inline
  sort: string = "popularity"
): Promise<ProductResponse> => {
  const params = { sellerId, page, ...filters, sort };
  const response = await axios.get<ProductResponse>("/api/products", { params });
  return response.data;
};




export const createProduct = async (product: Partial<Product>) => {
  const response = await axios.post("/api/products", product);
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  await axios.delete(`/api/products/${productId}`);
};



// Fetch product ratings by productId
export const getProductRating = async (productId: string): Promise<Rating | number> => {
  const response = await axios.get(`/api/products/${productId}/rating`);
  return validateRatingResponse(response.data);
};

export const addProductRating = async (
  productId: string,
  reviewData: { rating: number }
) => {
  const response = await axios.post(`/api/products/${productId}/rating`, reviewData);
  return { rating: response.data.rating }; // Return the required data structure
};




// Add Product Rating
export const serviceGetProductRating = async (
  productId: string
): Promise<Rating | number> => {
  const response = await axios.get(`/api/products/${productId}/rating`);
  const data = response.data;

  // Validate the response structure
  if (typeof data === "number") {
    return data;
  }

  if (data && typeof data.average === "number" && typeof data.count === "number") {
    return {
      average: data.average,
      count: data.count,
      reviews: data.reviews || [],
    };
  }

  throw new Error("Invalid response structure");
};
 
  
  // Get Products by Category
  export const serviceGetProductsByCategory = async (
    categoryType: "brands" | "shops",
    category: string
  ) => {
    const response = await axios.get(`/api/products/${categoryType}`, {
      params: { category },
    });
    return response.data;
  };
  
  

export const getProductsByCategory = async (category: string) => {
  const response = await axios.get<ProductResponse>(`/api/products/category/${category}`);
  return response.data;
};

export const fetchPersonalizedRecommendationsAPI = async (userId: string) => {
  const response = await axios.get<Product[]>("/api/recommendations", {
    params: { userId },
  });
  return response.data;
};

export const fetchRelatedProductsAPI = async (productId: string) => {
  const response = await axios.get<Product[]>(`/api/products/${productId}/related`);
  return response.data;
};

export const fetchTagsAPI = async () => {
  const response = await axios.get<string[]>("/api/products/tags");
  return response.data;
};

export const fetchColorsAPI = async () => {
  const response = await axios.get<string[]>("/api/products/colors");
  return response.data;
};

// should be a separate service or in seller-service
export const fetchShopsAPI = async () => {
  const response = await axios.get<string[]>("/api/products/shops");
  return response.data;
};

export const getLocalizedPricing = async (productId: string, buyerCurrency: string) => {
  const response = await axios.get(`/api/products/${productId}/pricing`, {
    params: { buyerCurrency },
  });
  return response.data;
};

export const apiUpdateProduct = async (productId: string, productData: Partial<Product>) => {
  const response = await axios.put(`/api/products/${productId}`, productData);
  return response.data;
};

export const fetchFeaturedProductsAPI = async () => {
  const response = await axios.get<Product[]>("/api/products/featured");
  return response.data;
};

export const fetchProductsByTypeAPI = async (type: string, filter?: string) => {
  const response = await axios.get<Product[]>("/api/products/by-type", {
    params: { type, filter },
  });
  return response.data;
};

export const fetchProductsByTagAPI = async (tag: string): Promise<Product[]> => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Using mock products for tag: ${tag}`);
    return mockProducts.filter((product) => product.tag === tag);
  }

  try {
    const response = await axios.get<Product[]>("/api/products", { params: { tag } });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products by tag. Falling back to mock data:", error);
    return mockProducts.filter((product) => product.tag === tag);
  }
};

export const fetchFlashDealsAPI = async (): Promise<Product[]> => {
  if (process.env.NODE_ENV === "development") {
    console.log("Using mock flash deals in development mode");
    return mockProducts.filter((product) => product.tag === "flash-deal");
  }

  try {
    // Updated endpoint to match mock server setup
    const response = await axios.get<Product[]>("/api/products?tag=flash-deal");

    // Use response data directly since it's an array, not an object with `products`
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch flash deals. Falling back to mock data:", error);
    return mockProducts.filter((product) => product.tag === "flash-deal");
  }
};





export const fetchTopRatedProductsAPI = async () => {
  const response = await axios.get<Product[]>("/api/products/top-rated");
  return response.data;
};


export const fetchNewArrivalsAPI = async () => {
  const response = await axios.get<Product[]>("/api/products/new-arrivals");
  return response.data;
};


export const fetchProductsByBrandAPI = async (brand: string) => {
  const response = await axios.get<Product[]>("/api/products/by-brand", {
    params: { brand },
  });
  return response.data;
};


export const fetchProductsByCategoryAPI = async (categoryType: "brands" | "shops", category: string) => {
  const response = await axios.get(`/api/products/${categoryType}/${category}`);
  return {
    categoryType,
    products: response.data.products || [], // Ensure `products` is always an array
  };
};



export const fetchProductDetailsAPI = async (productId: string) => {
  const response = await axios.get<Product>(`/api/products/${productId}`);
  return response.data;
};

export const removeProductAPI = async (productId: string) => {
  const response = await axios.delete(`/api/products/${productId}`);
  return response.data;
};


 