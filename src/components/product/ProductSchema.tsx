import React from "react";
import { Product } from "../../types/Product";

const ProductSchema: React.FC<{ product: Product }> = ({ product }) => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.imgUrl,
    description: product.description || "No description available.", // Provide a default description
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: (product.stock ?? 0) > 0 ? "InStock" : "OutOfStock", // Default stock to 0
    },
  };

  return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
};

export default ProductSchema;
