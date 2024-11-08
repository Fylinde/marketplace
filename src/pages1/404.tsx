
import Button from "components/buttons/Button";
import FlexBox from "components/FlexBox";
import Image from "components/Image";
import { Link, useNavigate } from "react-router-dom";  
import React from "react";

const Error404 = () => {
  const navigate = useNavigate();  // Replaced useRouter with useNavigate

  const handleGoBack = async () => {
    navigate(-1);  // Navigate back in history
  };

  return (
    <FlexBox
      flexDirection="column"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      px="1rem"
    >
      <Image
        src="/assets/images/illustrations/404.svg"
        maxWidth="320px"
        width="100%"
        mb="2rem"
      />
      <FlexBox flexWrap="wrap">
        <Button
          variant="outlined"
          color="primary"
          m="0.5rem"
          onClick={handleGoBack}
        >
          Go Back
        </Button>
        <Link to="/">  {/* Replaced href with to */}
          <Button variant="contained" color="primary" m="0.5rem">
            Go to Home
          </Button>
        </Link>
      </FlexBox>
    </FlexBox>
  );
};

export default Error404;
