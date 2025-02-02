import { rest } from 'msw';
import { mockUsers } from '../data/users';

export const usersHandlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json({ users: mockUsers }));
  }),

  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    const user = mockUsers.find((u) => u.id === id);

    if (user) {
      return res(ctx.json(user));
    } else {
      return res(ctx.status(404), ctx.json({ error: 'User not found' }));
    }
  }),
];
