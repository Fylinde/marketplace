import React from "react";
import Box from "./Box";
import CategorySectionHeader from "./CategorySectionHeader";
import Container from "./Container";

export interface CategorySectionCreatorProps {
  iconName?: string;
  title?: string;
  seeMoreLink?: string;
  children?: React.ReactNode; // Add the children prop
}

const CategorySectionCreator: React.FC<CategorySectionCreatorProps> = ({
  iconName,
  seeMoreLink,
  title,
  children, // Destructure the children prop
}) => {
  return (
    <Box mb="3.75rem">
      <Container pb="1rem">
        {title && (
          <CategorySectionHeader
            title={title}
            seeMoreLink={seeMoreLink}
            iconName={iconName}
          />
        )}

        {/* Render children inside the component */}
        {children}
      </Container>
    </Box>
  );
};

export default CategorySectionCreator;
