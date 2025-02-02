import { mockCategories } from './mock/data/categories';
import { mockProducts } from './mock/data/products';
import { mockOrders } from './mock/data/orders';
import { mockUsers } from './mock/data/users';
import { mockAppleWatchAdvertisement } from './mock/data';
import { setupWorker } from 'msw';
import { usersHandlers, ordersHandlers, advertisementHandlers } from './mock/handlers';
import { productsHandlers } from './mock/handlers/productsHandlers';
import { categoriesHandlers  } from './mock/handlers/categoriesHandlers ';
import { topRatedProductsHandlers } from './mock/handlers';
import { mockTopRatedProducts } from './mock/data';
import { featuredBrandsHandlers } from './mock/handlers';
import { mockFeaturedBrands } from './mock/data';


const allHandlers = [
  ...usersHandlers,
  ...productsHandlers,
  ...ordersHandlers,
  ...advertisementHandlers,
  ...categoriesHandlers, // Include directly, no spread
  ...topRatedProductsHandlers,
  ...featuredBrandsHandlers,
];

export const worker = setupWorker(...allHandlers); // Export worker

export const initializeMockService = async () => {
  await worker.start();
  console.log('MockService initialized');
};

export {
  mockCategories,
  mockProducts,
  mockOrders,
  mockUsers,
  mockAppleWatchAdvertisement,
  mockTopRatedProducts,
  mockFeaturedBrands,
}; // Export mock data
