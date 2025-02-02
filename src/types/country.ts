export interface Country {
    label: string;
    value: string;
    region?: string;
    phoneCode?: string;
    isoAlpha3?: string;
    flag?: string;
    name?: string; // Add this if 'name' exists
    code?: string; // Add this if 'code' exists
  }