import Box from "components/Box";
import FlexBox from "components/FlexBox";
import Icon from "components/icon/Icon";
import LazyImage from "components/LazyImage";
import { H3, Paragraph, SemiSpan, Small } from "components/Typography";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import React from "react";

export interface FashionCard6Props {
  imgUrl: string;
  title: string;
  date: string;
  commentCount: number;
  description: string;
  blogUrl: string;
}

const FashionCard6: React.FC<FashionCard6Props> = ({
  imgUrl,
  title,
  date,
  commentCount,
  description,
  blogUrl,
}) => {
  return (
    <Box>
      <Box mb="1.5rem">
        <LazyImage
          src={imgUrl}
          width={588}
          height={272}
          style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          alt={title}
        />
      </Box>
      <H3 fontWeight="600" mb="0.25rem">
        {title}
      </H3>

      <FlexBox style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }} mb="1rem">
        <FlexBox style={{ display: "flex", alignItems: "center" }} mr="0.75rem">
          <Icon size="14px" mr="0.5rem" defaultcolor="auto">
            clock-circular-outline
          </Icon>
          <SemiSpan color="text.muted">
            {format(new Date(date), "dd MMMM, yyyy")}
          </SemiSpan>
        </FlexBox>
        <FlexBox style={{ display: "flex", alignItems: "center" }}>
          <Box color="text.muted" mr="0.5rem">
            <Icon size="14px" defaultcolor="currentColor">
              comment
            </Icon>
          </Box>
          <SemiSpan color="text.muted">{commentCount} comments</SemiSpan>
        </FlexBox>
      </FlexBox>

      <Paragraph color="gray.700" mb="0.75rem">
        {description}
      </Paragraph>

      <Link to={blogUrl}>
        <Small fontWeight="700" borderBottom="2px solid" borderColor="primary.main">
          CONTINUE READING
        </Small>
      </Link>
    </Box>
  );
};

export default FashionCard6;
