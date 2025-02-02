
import { FileMetadata } from "../types/sharedTypes";
export const transformFileToMetadata = (file: File): FileMetadata => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified, // Include this field
  });
  
  
  