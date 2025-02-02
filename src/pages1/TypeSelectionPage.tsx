import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSellerType } from "../redux/slices/auth/registrationSlice";
import TypeSelectionForm from "../components/Registration/TypeSelectionForm";

const TypeSelectionPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTypeSelection = (type: "individual" | "professional") => {
    // Save the seller type in Redux
    dispatch(setSellerType(type));

    // Navigate to the next step
    navigate(`/register/seller/${type}/create-account`);
  };

  return <TypeSelectionForm onTypeSelect={handleTypeSelection} />;
};

export default TypeSelectionPage;
