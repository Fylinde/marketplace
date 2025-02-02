// utils/convertFileMetadataToFile.ts
import { FileMetadata } from "../types/sharedTypes";

export const convertFileMetadataToFile = (metadata: FileMetadata): File => {
  const { name, size, type, lastModified } = metadata;
  return new File([], name, { type, lastModified });
};
