// src/models/Address.ts or src/types.ts

export interface Address {
    id?: number;  // Mark 'id' as optional if it's not always present (e.g., before saving to the database)
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_primary?: boolean;
  }
  