import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import { H4 } from "components/Typography";
import { Link } from "react-router-dom";
import React from "react";

export interface ProductCard2Props {
  imgUrl: string;
  title: string;
  price: number;
  productUrl: string;
}

const ProductCard2: React.FC<ProductCard2Props> = ({
  imgUrl,
  title,
  price,
  productUrl,
}) => {
  return (
    <Link to={productUrl}>
      {/* Removed unnecessary <a> tag */}
      <HoverBox borderRadius={8} mb="0.5rem">
        <LazyImage
          src={imgUrl || '/assets/images/default-product.png'}
          style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
          alt={title || 'Product Image'}
        />
      </HoverBox>
      <H4 fontWeight="600" fontSize="14px" mb="0.25rem">
        {title}
      </H4>
      <H4 fontWeight="600" fontSize="14px" color="primary.main">
        ${Math.ceil(price).toLocaleString()}
      </H4>
    </Link>
  );
};

export default ProductCard2;
