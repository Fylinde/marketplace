

declare module '@testing-library/jest-dom' {
    // Example: You can declare a matcher from jest-dom if necessary
    interface CustomMatchers<R = unknown> {
      toBeInTheDocument(): R;
    }
  
    // Extend Jest matchers to include custom jest-dom matchers
    namespace jest {
      interface Matchers<R> extends CustomMatchers<R> {}
    }
  }