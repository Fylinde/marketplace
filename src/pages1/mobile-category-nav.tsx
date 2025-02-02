
import Accordion from "../components/accordion/Accordion";
import AccordionHeader from "../components/accordion/AccordionHeader";
import Box from "../components/Box";
import Divider from "../components/Divider";
import Grid from "../components/grid/Grid";
import Header from "../components/header/Header";
import Icon from "../components/icon/Icon";
import MobileCategoryImageBox from "../components/mobile-category-nav/MobileCategoryImageBox";
import { MobileCategoryNavStyle } from "../components/mobile-category-nav/MobileCategoryNavStyle";
import MobileNavigationBar from "../components/mobile-navigation/MobileNavigationBar";
import Typography from "../components/Typography";
import navigations from "../data/navigations";
import { Link } from "react-router-dom";
import React, { Fragment, useEffect, useState } from "react";

// Define the types for categories, menu data, etc.
interface SubCategory {
  title: string;
  href: string;
  imgUrl: string;
}

interface MenuCategory {
  title: string;
  href: string;
  subCategories?: SubCategory[]; // subCategories can be optional
}

interface MenuDataObject {
  categories: MenuCategory[];
  rightImage?: any;
  bottomImage?: any;
}

interface Category {
  title: string;
  href: string;
  icon: string;
  menuComponent?: string;
  menuData?: MenuDataObject | Category[]; // MenuData can be an object or an array
}

interface Suggestion {
  title: string;
  href: string;
  imgUrl: string;
}

const MobileCategoryNav = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [suggestedList, setSuggestedList] = useState<Suggestion[]>([]);
  const [subCategoryList, setSubCategoryList] = useState<MenuCategory[]>([]);

  const handleCategoryClick = (cat: Category) => () => {
    const menuData = cat.menuData;

    // Check if menuData is an object with categories
    if (menuData && Array.isArray((menuData as MenuDataObject).categories)) {
      setSubCategoryList((menuData as MenuDataObject).categories);
    } 
    // Check if menuData is an array of categories
    else if (Array.isArray(menuData)) {
      setSubCategoryList([]);
    } else {
      setSubCategoryList([]);
    }

    setCategory(cat);
  };

  useEffect(() => {
    setSuggestedList(suggestion);
  }, []);

  return (
    <MobileCategoryNavStyle>
      <Header className="header" />
      <div className="main-category-holder">
        {navigations.map((item: Category, ind: number) => (
          <Box
            className="main-category-box"
            borderLeft={`${category?.href === item.href ? "3px solid" : "0px solid"}`}
            onClick={handleCategoryClick(item)}
            key={item.title}
          >
            <Icon size="28px" mb="0.5rem">
              {item.icon}
            </Icon>
            <Typography
              className="ellipsis"
              textAlign="center"
              fontSize="11px"
              lineHeight="1"
            >
              {item.title}
            </Typography>
          </Box>
        ))}
      </div>

      <Box className="container">
        <Typography fontWeight="600" fontSize="15px" mb="1rem">
          Recommended Categories
        </Typography>
        <Box mb="2rem">
          <Grid container spacing={3}>
            {suggestedList.map((item, ind) => (
              <Grid item lg={1} md={2} sm={3} xs={4} key={ind}>
                <Link to="/product/search/423423">
                  <a>
                    <MobileCategoryImageBox {...item} />
                  </a>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>

        {category?.menuComponent === "MegaMenu1" ? (
          subCategoryList.map((item, ind) => (
            <Fragment key={ind}>
              <Divider />
              <Accordion>
                <AccordionHeader px="0px" py="10px">
                  <Typography fontWeight="600" fontSize="15px">
                    {item.title}
                  </Typography>
                </AccordionHeader>
                <Box mb="2rem" mt="0.5rem">
                  <Grid container spacing={3}>
                    {item.subCategories?.map((subItem, subInd) => (
                      <Grid item lg={1} md={2} sm={3} xs={4} key={subInd}>
                        <Link to="/product/search/423423">
                          <a>
                            <MobileCategoryImageBox {...subItem} />
                          </a>
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Accordion>
            </Fragment>
          ))
        ) : (
          <Box mb="2rem">
            <Grid container spacing={3}>
              {subCategoryList.map((item, ind) => (
                <Grid item lg={1} md={2} sm={3} xs={4} key={ind}>
                  <Link to="/product/search/423423">
                    <a>
                      <MobileCategoryImageBox {...item} />
                    </a>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
      <MobileNavigationBar />
    </MobileCategoryNavStyle>
  );
};

// Define the suggestions
const suggestion: Suggestion[] = [
  {
    title: "Belt",
    href: "/belt",
    imgUrl: "/assets/images/products/categories/belt.png",
  },
  {
    title: "Hat",
    href: "/Hat",
    imgUrl: "/assets/images/products/categories/hat.png",
  },
  {
    title: "Watches",
    href: "/Watches",
    imgUrl: "/assets/images/products/categories/watch.png",
  },
  {
    title: "Sunglasses",
    href: "/Sunglasses",
    imgUrl: "/assets/images/products/categories/sunglass.png",
  },
  {
    title: "Sneakers",
    href: "/Sneakers",
    imgUrl: "/assets/images/products/categories/sneaker.png",
  },
  {
    title: "Sandals",
    href: "/Sandals",
    imgUrl: "/assets/images/products/categories/sandal.png",
  },
  {
    title: "Formal",
    href: "/Formal",
    imgUrl: "/assets/images/products/categories/shirt.png",
  },
  {
    title: "Casual",
    href: "/Casual",
    imgUrl: "/assets/images/products/categories/t-shirt.png",
  },
];

export default MobileCategoryNav;
