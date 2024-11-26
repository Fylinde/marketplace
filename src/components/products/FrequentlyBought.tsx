import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard8 from "../product-cards/ProductCard8";
import { H3 } from "../Typography";
import FrequentlyBoughtWrapper from "./FrequentlyBoughtStyle";

// Updated Product interface to include all required fields
interface Product {
  id: string;
  title: string;
  price: number;
  primaryImage?: string; // Added primaryImage property
  category?: string; // Added category property
  images?: string[];
  description?: string;
}

// Updated Config interface for type-safety
interface Config {
  defaultProductImage: string;
  categoryFallbackImages: Record<string, string>; // Record for category fallback images
}

export interface FrequentlyBoughtProps {
  productId: string;
}

const FrequentlyBought: React.FC<FrequentlyBoughtProps> = ({ productId }) => {
  const [products, setProducts] = useState<Product[]>([]); // Correctly typed state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [config, setConfig] = useState<Config>({ defaultProductImage: "", categoryFallbackImages: {} });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get("/api/config");
        setConfig(response.data);
      } catch (err) {
        setError("Failed to load config");
      }
    };

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/frequently-bought/${productId}`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchConfig();
    fetchProducts();
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <FrequentlyBoughtWrapper>
      <H3>Frequently Bought Together</H3>
      <div className="product-list">
        {products.map((item) => (
          <ProductCard8
            key={item.id}
            id={item.id}
            title={item.title}
            price={item.price}
            imgUrl={
              item.primaryImage ||
              config.categoryFallbackImages[item.category || ""] ||
              config.defaultProductImage
            }
          />
        ))}
      </div>
    </FrequentlyBoughtWrapper>
  );
};

export default FrequentlyBought;
