import Box from "components/Box";
import Card from "components/Card";
import CategorySectionCreator from "components/CategorySectionCreator";
import Grid from "components/grid/Grid";
import LazyImage from "components/LazyImage";
import { H3, H5 } from "components/Typography";
import { Link } from "react-router-dom";
import React from "react";

export interface Section6Props {}

const Section6: React.FC<Section6Props> = () => {
  return (
    <CategorySectionCreator title="Featured Categories">
      <Grid container spacing={6} containerHeight="100%">
        <Grid item md={6} xs={12}>
          {/* Removed unnecessary <a> tag */}
          <Link to="/product/34543543">
            <Card height="100%" hoverEffect>
              <LazyImage
                src="/assets/images/products/Rectangle 133.png"
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                alt="Camera" // Added alt attribute for accessibility
              />
              <H3 fontWeight="600" p="1.5rem">
                CAMERA
              </H3>
            </Card>
          </Link>
        </Grid>
        <Grid item md={6} xs={12}>
          <Box height="100%">
            <Grid container spacing={6} containerHeight="100%">
              {gridProductList.map((item) => (
                <Grid item sm={6} xs={12} key={item.title}>
                  {/* Removed unnecessary <a> tag */}
                  <Link to={item.productUrl}>
                    <Card height="100%" hoverEffect>
                      <LazyImage
                        src={item.imgUrl}
                        style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                        alt={item.title} // Added alt attribute for accessibility
                      />
                      <H5 fontWeight="600" p="1rem" mt="1rem">
                        {item.title}
                      </H5>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </CategorySectionCreator>
  );
};

const gridProductList = [
  {
    title: "GAMING",
    imgUrl: "/assets/images/products/Rectangle 134432.png",
    productUrl: "/product/34543543",
  },
  {
    title: "WATCH",
    imgUrl: "/assets/images/products/Rectangle 134 (1).png",
    productUrl: "/product/34543543",
  },
  {
    title: "DRONES",
    imgUrl: "/assets/images/products/Rectangle 137.png",
    productUrl: "/product/34543543",
  },
  {
    title: "PHONES",
    imgUrl: "/assets/images/products/Rectangle 134.png",
    productUrl: "/product/34543543",
  },
];

export default Section6;
