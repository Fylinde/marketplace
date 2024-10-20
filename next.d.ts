declare module 'next/link' {
    import { LinkProps } from 'next/dist/client/link';
    import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
  
    export default function Link(
      props: React.PropsWithChildren<LinkProps & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, 'href'>>
    ): JSX.Element;
  }
  