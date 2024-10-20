// custom.d.ts (global type declarations)
import 'jquery';

interface Window {
    $: typeof import("jquery");
    jQuery: typeof import("jquery");
  }
  


  // Declare missing jQuery plugins like meanmenu and scrollUp
declare module 'jquery' {
  interface JQuery {
    
    meanmenu(options?: any): JQuery;
    scrollUp(options?: any): JQuery;
    owlCarousel(options?: any): JQuery;
  }
}

  declare module 'jquery' {
    interface JQueryStatic {
      scrollUp(options?: any): void;  // Declare the scrollUp plugin
    }
  }

  interface JQuery {
    meanmenu(options?: any): JQuery;
    scrollUp(options?: any): JQuery;
    owlCarousel(options?: any): JQuery;
  }

  // src/types/styled-components-react-native.d.ts
declare module 'styled-components-react-native' {
  const content: any;
  export default content;
}


declare module 'react-scroll' {
  const content: any;
  export = content;
}


declare module 'lodash' {
  const content: any;
  export default content;
}
