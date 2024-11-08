import Container from "components/Container";
import FlexBox from "components/FlexBox";
import Icon from "components/icon/Icon";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios"; // To fetch dynamic data

// Styled Wrapper with responsive adjustments using styled-system
const Wrapper = styled(Container)`
  @media only screen and (max-width: 400px) {
    .flex {
      padding-bottom: 1rem;
      width: 100%;
      justify-content: center;
    }
  }
`;

interface IconItem {
  iconName: string;
  url: string;
}

const Footer: React.FC = () => {
  const [iconList, setIconList] = useState<IconItem[]>([]);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        const response = await axios.get("/api/icons"); // Replace with your API endpoint
        setIconList(response.data);
      } catch (error) {
        console.error("Failed to fetch icons:", error);
      }
    };

    fetchIcons();
  }, []);

  return (
    <Wrapper py="4rem">
      <FlexBox justifyContent="space-between" flexWrap="wrap">
        <FlexBox className="flex" alignItems="center">
          Developed with{" "}
          <Icon color="primary" mx="0.5rem" size="16px">
            heart_filled
          </Icon>{" "}
          & Care by Ui Lib
        </FlexBox>

        <FlexBox className="flex">
          {iconList.map((item) => (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              key={item.iconName}
            >
              <Icon size="1.25rem" defaultcolor="auto" mx="0.5rem">
                {item.iconName}
              </Icon>
            </a>
          ))}
        </FlexBox>
      </FlexBox>
    </Wrapper>
  );
};

export default Footer;
