import { rest } from 'msw';
import { mockOrders } from '../data/orders';

export const ordersHandlers = [
  rest.get('/api/orders', (req, res, ctx) => {
    return res(ctx.json({ orders: mockOrders }));
  }),

  rest.get('/api/orders/:id', (req, res, ctx) => {
    const { id } = req.params;
    const order = mockOrders.find((o) => o.id === id);

    if (order) {
      return res(ctx.json(order));
    } else {
      return res(ctx.status(404), ctx.json({ error: 'Order not found' }));
    }
  }),
];
