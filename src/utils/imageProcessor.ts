// src/utilities/imageProcessor.ts

export interface ImageProcessorOptions {
    maxWidth?: number; // Maximum width for resizing
    maxHeight?: number; // Maximum height for resizing
    quality?: number; // Compression quality (0 to 1)
    outputFormat?: "image/jpeg" | "image/png" | "image/webp"; // Desired output format
  }
  
  class ImageProcessor {
    /**
     * Processes an image file for resizing and compression.
     * @param file The image file to process.
     * @param options Options for resizing and compression.
     * @returns A Promise that resolves to the processed image as a Blob.
     */
    static processImage(file: File, options: ImageProcessorOptions): Promise<Blob> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
  
        // Read the file as a data URL
        reader.onload = (event) => {
          if (!event.target?.result) {
            reject(new Error("Failed to load image."));
            return;
          }
  
          const img = new Image();
          img.onload = () => {
            // Resize the image
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
  
            if (!ctx) {
              reject(new Error("Failed to initialize canvas context."));
              return;
            }
  
            // Calculate the target dimensions while maintaining aspect ratio
            const { maxWidth, maxHeight } = options;
            let { width, height } = img;
  
            if (maxWidth && width > maxWidth) {
              height = (maxWidth / width) * height;
              width = maxWidth;
            }
  
            if (maxHeight && height > maxHeight) {
              width = (maxHeight / height) * width;
              height = maxHeight;
            }
  
            canvas.width = width;
            canvas.height = height;
  
            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0, width, height);
  
            // Convert the canvas to a Blob
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Failed to generate image blob."));
                  return;
                }
                resolve(blob);
              },
              options.outputFormat || "image/jpeg",
              options.quality || 0.8
            );
          };
  
          img.onerror = () => reject(new Error("Failed to load image."));
          img.src = event.target.result as string;
        };
  
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsDataURL(file);
      });
    }
  
    /**
     * Converts a Blob to a File.
     * @param blob The Blob to convert.
     * @param fileName The desired file name.
     * @returns A File object.
     */
    static blobToFile(blob: Blob, fileName: string): File {
      return new File([blob], fileName, { type: blob.type });
    }
  }
  
  export default ImageProcessor;
  