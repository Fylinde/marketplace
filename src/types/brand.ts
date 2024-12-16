export interface Brand {
    id: string;
    name: string;
    logoUrl?: string;
    description?: string;
    establishedYear?: number;
    countryOfOrigin?: string;
    website?: string;
    tags?: string[];
    popularityScore?: number;
    productCount?: number;
    title: string; // Brand name or title
    imgUrl: string; // URL of the brand image
  }