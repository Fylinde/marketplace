declare namespace JSX {
    interface Window {
      AFRAME: any;
    }
  
    interface IntrinsicElements {
      "a-scene": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        embedded?: boolean;
        "vr-mode-ui"?: string;
        arjs?: string;
      };
      "a-light": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: string;
        position?: string;
        intensity?: string;
        color?: string;
      };
      "a-entity": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        position?: string;
        scale?: string;
        "gltf-model"?: string;
        "animation-mixer"?: boolean;
      };
      "a-plane": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        position?: string;
        rotation?: string;
        width?: string;
        height?: string;
        color?: string;
      };
      "a-marker-camera": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        preset?: string;
      };
    }
  }
  