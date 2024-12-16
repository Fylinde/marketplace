import { Review } from "./review";


export interface Rating {
    average: number;
    count: number;
    reviews: Review[];
}
  
