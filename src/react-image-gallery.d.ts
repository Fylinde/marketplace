declare module 'react-image-gallery' {
    import * as React from 'react';
    
    export interface ImageGalleryItem {
      original: string;
      thumbnail: string;
      description?: string;
      originalClass?: string;
      thumbnailClass?: string;
      renderItem?: () => React.ReactNode;
      renderThumbInner?: () => React.ReactNode;
      originalAlt?: string;
      thumbnailAlt?: string;
      originalTitle?: string;
      thumbnailTitle?: string;
    }
  
    export interface ImageGalleryProps {
      items: ImageGalleryItem[];
      showThumbnails?: boolean;
      showFullscreenButton?: boolean;
      showPlayButton?: boolean;
      showBullets?: boolean;
      showIndex?: boolean;
      isRTL?: boolean;
      autoPlay?: boolean;
      disableThumbnailScroll?: boolean;
      disableKeyDown?: boolean;
      disableSwipe?: boolean;
      lazyLoad?: boolean;
      infinite?: boolean;
      onSlide?: (currentIndex: number) => void;
      onScreenChange?: (fullScreenElement: HTMLElement | null) => void;
      onPlay?: (playing: boolean) => void;
      startIndex?: number;
      slideInterval?: number;
      slideDuration?: number;
      swipingTransitionDuration?: number;
      renderLeftNav?: (onClick: () => void, disabled: boolean) => React.ReactNode;
      renderRightNav?: (onClick: () => void, disabled: boolean) => React.ReactNode;
      renderPlayPauseButton?: (onClick: () => void, isPlaying: boolean) => React.ReactNode;
      renderFullscreenButton?: (onClick: () => void, isFullscreen: boolean) => React.ReactNode;
    }
  
    export default class ImageGallery extends React.Component<ImageGalleryProps, any> {}
  }
  