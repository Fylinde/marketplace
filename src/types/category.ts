export interface Category {
    id: string; // Unique identifier for the category
    name: string;
    title: string; // Title of the category (displayed in the UI)
    subtitle?: string; // Optional subtitle for additional context
    imgUrl?: string; // Optional URL to the category image
    categoryUrl?: string; // Optional URL for category navigation
    description?: string;
    status?: 'active' | 'inactive';
    tag?: string[];
}
  