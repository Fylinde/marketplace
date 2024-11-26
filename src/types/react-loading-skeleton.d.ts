declare module 'react-loading-skeleton' {
    import { ComponentType, CSSProperties } from 'react';
  
    interface SkeletonProps {
      count?: number;
      duration?: number;
      width?: string | number;
      height?: string | number;
      circle?: boolean;
      style?: CSSProperties;
    }
  
    const Skeleton: ComponentType<SkeletonProps>;
    export default Skeleton;
  }
  