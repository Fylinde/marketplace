import Icon from "@component/icon/Icon";
import LazyImage from "@component/LazyImage";
import React from "react";
import FlexBox from "../FlexBox";
import Typography from "../Typography";

export interface MobileCategoryImageBoxProps {
  title: string;
  imgUrl?: string;
  icon?: string;
}

const MobileCategoryImageBox: React.FC<MobileCategoryImageBoxProps> = ({
  title,
  imgUrl,
  icon,
}) => {
  return (
    <FlexBox flexDirection="column" alignItems="center" justifyContent="center">
      {imgUrl ? (
        <LazyImage
          src={imgUrl}
          borderRadius="5px"
          layout="responsive"  // Makes the image responsive based on the container
          objectFit="cover"
          alt={title}  // Always add alt for accessibility
        />
      ) : (
        icon && <Icon size="48px">{icon}</Icon>
      )}
      <Typography
        className="ellipsis"
        textAlign="center"
        fontSize="11px"
        lineHeight="1"
        mt="0.5rem"
      >
        {title}
      </Typography>
    </FlexBox>
  );
};

export default MobileCategoryImageBox;
