import React, { useState } from "react";
import {
  StyledContainer,
  Header,
  SelectionGrid,
  Card,
  CardIcon,
  LearnMore,
} from "./TypeSelectionFormStyled";

interface TypeSelectionFormProps {
  onTypeSelect: (type: "individual" | "professional") => void;
}

const TypeSelectionForm: React.FC<TypeSelectionFormProps> = ({ onTypeSelect }) => {
 

  const handleSellerTypeClick = (type: "individual" | "professional") => {
    onTypeSelect(type); // Notify parent about the selection
  };

  return (
    <StyledContainer>
      <Header>
        <h1>Choose Your Seller Type</h1>
        <p>Let’s customize your experience based on your business type.</p>
      </Header>
      <SelectionGrid>
        <Card onClick={() => handleSellerTypeClick("individual")}>
          <CardIcon>👤</CardIcon>
          <h2>Individual Seller</h2>
          <p>Perfect for small-scale sellers or entrepreneurs just getting started.</p>
          <LearnMore>Learn More →</LearnMore>
        </Card>
        <Card onClick={() => handleSellerTypeClick("professional")}>
          <CardIcon>🏢</CardIcon>
          <h2>Professional Seller</h2>
          <p>Designed for established businesses or those with high sales volumes.</p>
          <LearnMore>Learn More →</LearnMore>
        </Card>
      </SelectionGrid>
    </StyledContainer>
  );
};
export default TypeSelectionForm;
