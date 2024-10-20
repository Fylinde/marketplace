declare module 'react-svg' {
    import * as React from 'react';
  
    interface ReactSVGProps {
      src: string;
      onError?: (error: Error) => void;
      onLoad?: () => void;
      // add other properties as needed based on the package documentation
    }
  
    const ReactSVG: React.FC<ReactSVGProps>;
    export default ReactSVG;
  }
  