import Box from "components/Box";
import Button from "components/buttons/Button";
import IconButton from "components/buttons/IconButton";
import Card from "components/Card";
import Carousel from "components/carousel/Carousel";
import FlexBox from "components/FlexBox";
import Grid from "components/grid/Grid";
import Icon from "components/icon/Icon";
import Image from "components/Image";
import { H3, H4, Paragraph, SemiSpan } from "components/Typography";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const SectionWrapper = styled.div`
  margin-top: -0.25rem;
  margin-bottom: -0.25rem;

  .hot {
    position: absolute;
    top: 0;
    right: 3.5rem;
  }

  .dot-group {
    position: absolute;
    bottom: 1rem;
    left: 20%;
  }

  @media only screen and (max-width: 768px) {
    .hot {
      right: 0;
      width: 10%;
    }
    .dot-group {
      display: none;
    }
  }
`;

// Define the Deal type
interface Deal {
  imgUrl: string;
  title: string;
  productName: string;
  description: string;
  countdown: {
    days: number;
    hours: number;
    mins: number;
    secs: number;
  };
}

const Section6: React.FC = () => {
  const totalSlides = 3;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [deals, setDeals] = useState<Deal[]>([]);

  const handleSlideChange = (count: number) => () => {
    if (count < 0) setCurrentSlide(0);
    else if (count > totalSlides - 1) setCurrentSlide(totalSlides - 1);
    else setCurrentSlide(count);
  };

  // Fetch deals data
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get("/api/deals"); // Replace with your endpoint
        setDeals(response.data);
      } catch (error) {
        console.error("Error fetching deals:", error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <Box mb="3.75rem">
      <SectionWrapper>
        <Carousel
          totalSlides={totalSlides}
          visibleSlides={1}
          showDots={true}
          showArrow={false}
          dotClass="dot-group"
          currentSlide={currentSlide}
        >
          {deals.map((deal, ind) => (
            <Box py="0.25rem" key={ind}>
              <Card
                p="1rem"
                bg="secondary.100"
                overflow="hidden"
                position="relative"
              >
                <Grid container alignItems="center" spacing={6}>
                  <Grid item md={6} xs={12} key={ind}>
                    <Image src={deal.imgUrl} mx="auto" maxWidth="100%" />
                  </Grid>
                  <Grid item md={6} xs={12} key={ind}>
                    <FlexBox mt="3rem" mb="1.125rem">
                      <IconButton
                        variant="contained"
                        color="primary"
                        mr="0.5rem"
                        disabled={currentSlide === 0}
                        onClick={handleSlideChange(currentSlide - 1)}
                      >
                        <Icon variant="small" defaultcolor="currentColor">
                          arrow-left
                        </Icon>
                      </IconButton>
                      <IconButton
                        variant="contained"
                        color="primary"
                        disabled={currentSlide === totalSlides - 1}
                        onClick={handleSlideChange(currentSlide + 1)}
                      >
                        <Icon variant="small" defaultcolor="currentColor">
                          arrow-right
                        </Icon>
                      </IconButton>
                    </FlexBox>
                    <H3 mb="0.875rem" color="primary.main" lineHeight="1.3">
                      {deal.title}
                    </H3>

                    <H3 mb="0.5rem" fontSize="25px" lineHeight="1.2">
                      {deal.productName}
                    </H3>
                    <Paragraph mb="2rem" color="text.muted" maxWidth="400px">
                      {deal.description}
                    </Paragraph>

                    <H4 mb="0.5rem" lineHeight="1.3" fontWeight="600">
                      Fresh Deal Everyday, Get It Now!
                    </H4>

                    <FlexBox flexWrap="wrap" mb="2rem">
                      <FlexBox alignItems="flex-end" mr="1.75rem">
                        <H3 lineHeight="1.3" mr="0.25rem">
                          {deal.countdown.days}
                        </H3>
                        <SemiSpan fontWeight="600" lineHeight="1.7">
                          DAYS
                        </SemiSpan>
                      </FlexBox>

                      <FlexBox alignItems="flex-end" mr="1.75rem">
                        <H3 lineHeight="1.3" mr="0.25rem">
                          {deal.countdown.hours}
                        </H3>
                        <SemiSpan fontWeight="600" lineHeight="1.7">
                          HOURS
                        </SemiSpan>
                      </FlexBox>

                      <FlexBox alignItems="flex-end" mr="1.75rem">
                        <H3 lineHeight="1.3" mr="0.25rem">
                          {deal.countdown.mins}
                        </H3>
                        <SemiSpan fontWeight="600" lineHeight="1.7">
                          MINS
                        </SemiSpan>
                      </FlexBox>

                      <FlexBox alignItems="flex-end">
                        <H3 lineHeight="1.3" mr="0.25rem">
                          {deal.countdown.secs}
                        </H3>
                        <SemiSpan fontWeight="600" lineHeight="1.7">
                          SECS
                        </SemiSpan>
                      </FlexBox>
                    </FlexBox>

                    <FlexBox alignItems="center" mb="3rem">
                      <Button color="primary" variant="contained" borderRadius={8} mr="0.5rem">
                        BUY NOW
                      </Button>
                      <FlexBox
                        color="white"
                        bg="gray.500"
                        borderRadius={8}
                        cursor="pointer"
                        size="40px"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Icon defaultcolor="currentColor">heart_filled</Icon>
                      </FlexBox>
                    </FlexBox>
                  </Grid>
                </Grid>

                <Image className="hot" maxWidth="100px" src="/assets/images/badges/hot.svg" />
              </Card>
            </Box>
          ))}
        </Carousel>
      </SectionWrapper>
    </Box>
  );
};

export default Section6;
