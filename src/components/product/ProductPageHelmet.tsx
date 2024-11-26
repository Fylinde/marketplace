import React from "react";
import Helmet  from "react-helmet";

const ProductPageHelmet: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="product" />
  </Helmet>
);

export default ProductPageHelmet;
