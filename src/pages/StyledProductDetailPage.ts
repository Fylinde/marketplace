import styled from 'styled-components';

export const ProductDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
`;

export const ProductInfo = styled.div`
  flex: 1;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
`;

export const SectionTitle = styled.h4`
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
`;

export const ActionButton = styled.button`
  display: block;
  margin: 10px 0;
  padding: 10px 20px;
  background-color: #007185;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #005f5f;
  }
`;

export const ContactSeller = styled.div`
  margin-top: 20px;
`;

export const ContactButton = styled.button`
  display: block;
  margin: 10px 0;
  padding: 10px 20px;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #005f5f;
  }
`;

export const ImageGalleryWrapper = styled.div`
  flex: 1;

  .image-gallery-slide img {
    height: 500px;
    object-fit: contain;
  }

  .image-gallery-thumbnails img {
    border-radius: 8px;
  }
`;
