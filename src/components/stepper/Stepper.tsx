import React, { Fragment, useEffect, useState } from "react";
import Box from "../Box";
import { Chip } from "../Chip";
import FlexBox from "../FlexBox";

type Step = {
  title: string;
  disabled: boolean;
};

type StepperProps = {
  selectedStep?: number; // Optional because of defaultProps
  stepperList: Step[];
  onChange?: (step: Step, index: number) => void; // Explicitly typed parameters
};

const Stepper: React.FC<StepperProps> = ({
  selectedStep = 1, // Default to 1 if undefined
  stepperList,
  onChange,
}) => {
  const [selected, setSelected] = useState<number>(selectedStep - 1); // `number` type

  const handleStepClick = (step: Step, ind: number) => () => { // Explicit `number` type for ind
    if (!step.disabled) {
      setSelected(ind); // Update selected index
      if (onChange) onChange(step, ind); // Call onChange if defined
    }
  };

  useEffect(() => {
    if (selectedStep !== undefined) {
      setSelected(selectedStep - 1); // Safely handle selectedStep being undefined
    }
  }, [selectedStep]);

  return (
    <FlexBox
      alignItems="center"
      flexWrap="wrap"
      justifyContent="center"
      my="-4px"
    >
      {stepperList.map((step, ind) => (
        <Fragment key={step.title}>
          <Chip
            bg={ind <= selected ? "primary.main" : "primary.light"}
            color={ind <= selected ? "white" : "primary.main"}
            p="0.5rem 1.5rem"
            fontSize="14px"
            fontWeight="600"
            my="4px"
            cursor={step.disabled ? "not-allowed" : "pointer"}
            onClick={handleStepClick(step, ind)}
          >
            {ind + 1}. {step.title}
          </Chip>
          {ind < stepperList.length - 1 && (
            <Box
              width="50px"
              height="4px"
              bg={ind < selected ? "primary.main" : "primary.light"}
            />
          )}
        </Fragment>
      ))}
    </FlexBox>
  );
};

// Provide default props if `selectedStep` is not provided
Stepper.defaultProps = {
  selectedStep: 1,
};

export default Stepper;
