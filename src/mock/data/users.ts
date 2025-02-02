import { User } from '../../types/sharedTypes';

export const mockUsers: User[] = [
  {
    id: '1001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    context: 'User account management',
    createdAt: '2023-01-01T08:00:00Z',
    role: 'Customer',
  },
  {
    id: '1002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    context: 'Admin panel management',
    createdAt: '2023-02-01T09:00:00Z',
    role: 'Admin',
  },
];
