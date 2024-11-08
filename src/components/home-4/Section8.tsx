import Box from "components/Box";
import FlexBox from "components/FlexBox";
import Icon from "components/icon/Icon";
import { H3, SemiSpan } from "components/Typography";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface ServiceItem {
  title: string;
  subtitle: string;
  iconName: string;
}

const Section8: React.FC = () => {
  const [serviceList, setServiceList] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/services");
        setServiceList(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <FlexBox
      mb="3.75rem"
      p="1rem"
      border="1px solid"
      borderColor="gray.400"
      borderRadius={8}
      flexWrap="wrap"
    >
      {serviceList.map((item) => (
        <FlexBox alignItems="center" p="1rem" mx="auto" key={item.title}>
          <Icon size="42px" mr="0.87rem">
            {item.iconName}
          </Icon>
          <Box>
            <H3 lineHeight="1.3">{item.title}</H3>
            <SemiSpan color="text.muted">{item.subtitle}</SemiSpan>
          </Box>
        </FlexBox>
      ))}
    </FlexBox>
  );
};

export default Section8;
