import React from "react";
import Avatar from "../avatar/Avatar";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Rating from "../rating/Rating";
import { H5, Paragraph, SemiSpan } from "../Typography";
import { getDateDifference } from "../../utils/utils";

export interface ProductCommentProps {
  productId: string;
  name: string;
  imgUrl: string;
  rating: number;
  date: string;
  comment: string;
}

const ProductComment: React.FC<ProductCommentProps> = ({
  productId,
  name,
  imgUrl,
  rating,
  date,
  comment,
}) => {
  return (
    <Box mb="32px" maxWidth="600px">
      <FlexBox alignItems="center" mb="1rem">
        <Avatar src={imgUrl} alt={`${name}'s avatar`} />
        <Box ml="1rem">
          <H5 mb="4px">{name}</H5>
          <FlexBox alignItems="center">
            <Rating value={rating} color="warn" readonly />
            <SemiSpan mx="10px">{rating.toFixed(1)}</SemiSpan>
            <SemiSpan>{getDateDifference(date)}</SemiSpan>
          </FlexBox>
        </Box>
      </FlexBox>
      <Paragraph>{comment}</Paragraph>
    </Box>
  );
};

export default ProductComment;
