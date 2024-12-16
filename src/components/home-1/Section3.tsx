import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Card from 'components/Card';
import Carousel from 'components/carousel/Carousel';
import useWindowSize from 'hooks/useWindowSize';
import CategorySectionCreator from '../CategorySectionCreator';
import ProductCard6 from '../product-cards/ProductCard6';
import { fetchCategories, selectCategories } from '../../redux/slices/products/categorySlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Category } from '../../types/category';

const Section3: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => selectCategories(state));

  const [visibleSlides, setVisibleSlides] = React.useState(3);
  const { width } = useWindowSize();

  // Adjust visible slides based on screen width
  useEffect(() => {
    if (width && width < 500) setVisibleSlides(1);
    else if (width && width < 650) setVisibleSlides(2);
    else if (width && width < 950) setVisibleSlides(3);
    else setVisibleSlides(4);
  }, [width]);

  useEffect(() => {
    // Fetch categories if not already fetched
    if (!categories.length) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  return (
    <CategorySectionCreator iconName="categories" title="Top Categories" seeMoreLink="#">
      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p>Error loading categories: {error}</p>
      ) : (
        <Carousel totalSlides={categories.length} visibleSlides={visibleSlides}>
          {categories.map((item: Category, ind: number) => (
            <Link to={item.categoryUrl || '/'} key={ind}>
              <Card p="1rem">
                <ProductCard6
                  title={item.title}
                  subtitle={item.subtitle || ''}
                  imgUrl={item.imgUrl}
                />
              </Card>
            </Link>
          ))}
        </Carousel>
      )}
    </CategorySectionCreator>
  );
};

export default Section3;
