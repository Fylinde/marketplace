import { Product } from '../../types/Product';



export const mockProducts: Product[] = [
    {
        id: '1',
        name: "Flash Deal Product 1",
        sellerPrice: 50.0,
        sellerCurrency: 'USD',
        totalSellerPrice: 50.0,
        buyerPrice: 60.0,
        buyerCurrency: 'EUR',
        totalBuyerPrice: 60.0,
        createdAt: '2024-01-01T00:00:00Z',
        stock: 20,
        imgUrl: '/assets/images/products/flash-1.png',
        description: 'This is a description of Mock Product 1.',
        rating: 4.5,
        category: 'Electronics',
        mock: true,
        marketplaceType: 'B2B',
        tag: 'flash-deal',
      },
      {
        id: '2',
        name: "Flash Deal Product 2",
        sellerPrice: 30.0,
        sellerCurrency: 'USD',
        totalSellerPrice: 30.0,
        buyerPrice: 35.0,
        buyerCurrency: 'EUR',
        totalBuyerPrice: 35.0,
        createdAt: '2024-01-02T00:00:00Z',
        stock: 15,
        imgUrl: '/assets/images/products/flash-2.png',
        description: 'This is a description of Mock Product 2.',
        rating: 4.0,
        category: 'Home Appliances',
        mock: true,
        marketplaceType: 'B2C',
        tag: 'flash-deal',
      },
      {
        id: '3',
        name: "Non-Flash Product 3",
        sellerPrice: 20.0,
        sellerCurrency: 'USD',
        totalSellerPrice: 20.0,
        buyerPrice: 22.0,
        buyerCurrency: 'EUR',
        totalBuyerPrice: 22.0,
        createdAt: '2024-01-03T00:00:00Z',
        stock: 10,
        imgUrl: '/assets/images/products/flash-3.png',
        description: 'This is a description of Mock Product 3.',
        rating: 4.7,
        category: 'Books',
        mock: true,
        marketplaceType: 'C2C',
        tag: 'flash-deal',
      },
      {
        id: '4',
        name: "Non-Flash Product 4",
        sellerPrice: 150.0,
        sellerCurrency: 'USD',
        totalSellerPrice: 150.0,
        buyerPrice: 165.0,
        buyerCurrency: 'EUR',
        totalBuyerPrice: 165.0,
        createdAt: '2024-01-04T00:00:00Z',
        stock: 50,
        imgUrl: '/assets/images/products/flash-4.png',
        description: 'This is a description of Mock Product 4.',
        rating: 4.2,
        category: 'Fashion',
        mock: true,
        marketplaceType: 'B2B',
        tag: 'flash-deal',
      },
      {
        id: '5',
        name: "Non-Flash Product 5",
        sellerPrice: 75.0,
        sellerCurrency: 'USD',
        totalSellerPrice: 75.0,
        buyerPrice: 82.5,
        buyerCurrency: 'EUR',
        totalBuyerPrice: 82.5,
        createdAt: '2024-01-05T00:00:00Z',
        stock: 25,
        imgUrl: '/assets/images/products/flash-1.png',
        description: 'This is a description of Mock Product 5.',
        rating: 3.9,
        category: 'Health & Beauty',
        mock: true,
        marketplaceType: 'B2C',
        tag: 'flash-deal',
      },
  // Add more products
];
