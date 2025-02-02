import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  TaxFormContainer,
  FormTitle,
  FormGroup,
  ErrorText,
  SubmitButton,
  OptionalText,
} from './TaxInformationForm.styled';


interface TaxInformationFormProps {
    sellerId?: string; // Optional prop
    onUpdate: (data: { taxId: string; vatNumber?: string; country: string }) => void;
    onNext: () => void;
}
  
const TaxInformationForm: React.FC<TaxInformationFormProps> = ({
    sellerId,
    onUpdate,
    onNext,
  }) => {
    const initialValues = {
      taxId: "",
      vatNumber: "",
      country: "",
    };

  const validationSchema = Yup.object().shape({
    taxId: Yup.string().required('Taxpayer Identification Number (TIN) is required.'),
    vatNumber: Yup.string(),
    country: Yup.string().required('Country of tax residency is required.'),
  });

  const handleSubmit = (values: typeof initialValues) => {
    console.log("Seller ID:", sellerId); // Ensure seller ID is logged for debugging
    onUpdate(values); // Pass data back to the parent
    onNext();
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <TaxFormContainer>
        <Form>
          <FormTitle>Tax Information</FormTitle>

          <FormGroup>
            <label htmlFor="taxId">Taxpayer Identification Number (TIN)</label>
            <Field name="taxId" type="text" />
            <ErrorMessage name="taxId" component={ErrorText} />
          </FormGroup>

          <FormGroup>
            <label htmlFor="vatNumber">
              VAT Number <OptionalText>(Optional)</OptionalText>
            </label>
            <Field name="vatNumber" type="text" />
            <ErrorMessage name="vatNumber" component={ErrorText} />
          </FormGroup>

          <FormGroup>
            <label htmlFor="country">Country of Tax Residency</label>
            <Field name="country" as="select">
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              {/* Add more countries */}
            </Field>
            <ErrorMessage name="country" component={ErrorText} />
          </FormGroup>

          <SubmitButton type="submit">Save and Continue</SubmitButton>
        </Form>
      </TaxFormContainer>
    </Formik>
  );
};

export default TaxInformationForm;
