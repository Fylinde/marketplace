import { rest } from 'msw';
import { convertCurrency } from '../../utils/currencyConversion';

export const productsHandlers = [
  // Handler for fetching all products with optional filters
  rest.get('/api/products', async (req, res, ctx) => {
    const { mockProducts } = await import('../data/products');
    const tag = req.url.searchParams.get('tag');
    console.log('Received tag parameter:', tag);
    
    
   
    const filteredProducts = mockProducts.filter((product) => !tag || product.tag === tag);


    console.log('Filtered Flash Deals:', filteredProducts); // Debugging log
  
    return res(ctx.json({ products: filteredProducts }));
  }),
  

  // Handler for fetching a single product by ID
  rest.get('/api/products/:id', async (req, res, ctx) => {
    const { mockProducts } = await import('../data/products'); // Dynamic import
    const { id } = req.params;

    const product = mockProducts.find((p) => p.id === id);

    if (product) {
      return res(ctx.json(product));
    } else {
      return res(ctx.status(404), ctx.json({ error: 'Product not found' }));
    }
  }),
];
