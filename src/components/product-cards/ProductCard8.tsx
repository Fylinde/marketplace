
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import { Link } from "react-router-dom";
import React from "react";
import Card from "../Card";
import FlexBox from "../FlexBox";
import { H6, SemiSpan } from "../Typography";

export interface ProductCard8Props {
  id: string;
  imgUrl: string;
  price: number;
  title: string;
  [key: string]: unknown;
}

const ProductCard8: React.FC<ProductCard8Props> = ({
  id,
  imgUrl,
  price,
  title,
  ...props
}) => {
  return (
    <Card p="1rem" {...props}>
      <Link to={`/product/${id}`}>
        <a>
          <HoverBox mb="0.75rem" borderRadius={8}>
            <LazyImage
              src={imgUrl || "/assets/images/products/Rectangle 116.png"}
              borderRadius={8}
              style={{ width: '500', height: '500', borderRadius: '4px' }}
              alt={title}  // Always include an alt attribute for accessibility
            />
          </HoverBox>
          <SemiSpan
            title={title}
            mb="0.25rem"
            color="inherit"
            ellipsis
            display="block"
          >
            {title}
          </SemiSpan>
          <FlexBox alignItems="center">
            <H6 color="primary.main" mr="0.25rem">
              ${price}
            </H6>
            <SemiSpan>
              <del>$1600</del>
            </SemiSpan>
          </FlexBox>
        </a>
      </Link>
    </Card>
  );
};

export default ProductCard8;
