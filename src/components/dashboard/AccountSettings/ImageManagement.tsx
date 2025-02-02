import React, { useState } from "react";
import Box from "../../../components/Box";
import Button from "../../../components/buttons/Button";
import Modal from "../../../components/modal/Modal";

interface Image {
  id: string;
  url: string;
  isCover: boolean;
  isIcon: boolean;
}

interface ImageManagementProps {
  data: Image[]; // Type for the data prop
  onUpdate: (updatedData: Image[]) => void; // Type for the onUpdate callback
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];

const ImageManagement: React.FC<ImageManagementProps> = ({ data, onUpdate }) => {
  const [images, setImages] = useState<Image[]>(data || []);
  const [errors, setErrors] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleFileUpload = (files: FileList | null): void => {
    if (!files) return;

    const newImages: Image[] = [];
    const validationErrors: string[] = [];

    Array.from(files).forEach((file) => {
      if (!ALLOWED_FORMATS.includes(file.type)) {
        validationErrors.push(
          `Invalid format: ${file.name}. Only JPEG and PNG are allowed.`
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        validationErrors.push(
          `File too large: ${file.name}. Max size is 5MB.`
        );
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      newImages.push({
        id: Date.now().toString() + file.name,
        url: imageUrl,
        isCover: false,
        isIcon: false,
      });
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors.join("\n"));
    } else {
      setErrors(null);
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onUpdate(updatedImages); // Pass the updated images to the parent
    }
  };

  const handleDeleteImage = (id: string): void => {
    const imageToDelete = images.find((image) => image.id === id);

    if (imageToDelete?.isCover) {
      alert(
        "You cannot delete the cover photo. Please set another image as the cover first."
      );
      return;
    }

    if (imageToDelete?.isIcon) {
      alert(
        "You cannot delete the icon. Please set another image as the icon first."
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this image?")) {
      const updatedImages = images.filter((image) => image.id !== id);
      setImages(updatedImages);
      onUpdate(updatedImages); // Pass the updated images to the parent
    }
  };

  const handleSetCoverPhoto = (id: string): void => {
    const updatedImages = images.map((image) =>
      image.id === id
        ? { ...image, isCover: true }
        : { ...image, isCover: false }
    );
    setImages(updatedImages);
    onUpdate(updatedImages); // Pass the updated images to the parent
  };

  const handleSetIcon = (id: string): void => {
    const updatedImages = images.map((image) =>
      image.id === id
        ? { ...image, isIcon: true }
        : { ...image, isIcon: false }
    );
    setImages(updatedImages);
    onUpdate(updatedImages); // Pass the updated images to the parent
  };

  const openModal = (id: string): void => {
    setSelectedImageId(id);
    setIsModalOpen(true);
  };

  return (
    <Box>
      <h1>Image Management</h1>
      {errors && (
        <Box color="red" mb="20px">
          {errors}
        </Box>
      )}

      <Box mb="20px">
        <input
          type="file"
          multiple
          accept="image/jpeg, image/png, image/jpg"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        <Box fontSize="12px" color="gray">
          Allowed formats: JPEG, PNG. Max size: 5MB.
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(150px, 1fr))"
        gap="20px"
      >
        {images.map((image) => (
          <Box
            key={image.id}
            position="relative"
            border="1px solid #ccc"
            borderRadius="8px"
          >
            <img
              src={image.url}
              alt="Uploaded"
              style={{
                width: "100%",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <Box p="10px">
              {image.isCover && (
                <Box color="green" fontWeight="bold">
                  Cover Photo
                </Box>
              )}
              {image.isIcon && (
                <Box color="blue" fontWeight="bold">
                  Icon
                </Box>
              )}
            </Box>
            <Box display="flex" justifyContent="space-between" p="10px">
              <Button onClick={() => handleSetCoverPhoto(image.id)}>
                Set as Cover
              </Button>
              <Button onClick={() => handleSetIcon(image.id)}>
                Set as Icon
                </Button>
              <Button onClick={() => handleDeleteImage(image.id)}>
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Modal for Preview or Advanced Editing */}
      {isModalOpen && selectedImageId && (
        <Modal
          title="Image Preview"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src={images.find((img) => img.id === selectedImageId)?.url || ""}
              alt="Selected"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
              }}
            />
            <Button mt="20px" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default ImageManagement;


