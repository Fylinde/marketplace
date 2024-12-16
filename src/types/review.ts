export interface Review {
    id?: string; // Unique identifier for the review
    userId: string; // ID of the user who submitted the review
    rating: number; // Numeric rating given by the user
    comment: string; // Textual feedback from the user
    date?: string; // Date of the review, optional
    user?: string; // Optional if it can be undefined

}
  
