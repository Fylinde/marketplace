// src/utilities/CrossModalProcessor.ts
export interface CrossModalQuery {
    text: string;
    image: File | null;
  }
  
  export const createCrossModalPayload = (
    text: string,
    image: File | null
  ): CrossModalQuery => {
    return { text, image };
  };
  