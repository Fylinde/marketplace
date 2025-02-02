// src/layouts/SellerRegistrationLayoutStyle.ts
import styled from "styled-components";
import { getTheme } from "../../utils/utils";

const StyledSellerRegistrationLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${getTheme("colors.body.paper")};

  /* Header styling */
  header {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  /* Progress Indicator */
.progress-indicator-wrapper {
  margin: 1rem 0; /* Add spacing around the progress bar */
}



  /* Main Content Area */
  .registration-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    margin-top: 0; /* Ensures no visible gap between the header/progress indicator */
  }

  .form-wrapper {
    width: 100%;
    max-width: 600px;
    padding: 2rem;
    background-color: ${getTheme("colors.body.paper")};
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    h2 {
      text-align: center;
      font-size: 1.5rem;
      color: ${getTheme("colors.text.primary")};
      margin-bottom: 1.5rem;
    }
  }

  /* Footer styling */
  footer {
    margin-top: auto;
  }

  /* Responsive Styles */
  @media (max-width: 768px) {
    .progress-indicator {
      font-size: 0.9rem;
      padding: 0.75rem;
    }

    .registration-content {
      padding: 1.5rem;
    }

    .form-wrapper {
      padding: 1.5rem;
      max-width: 100%; /* Use full width on smaller screens */
    }
  }

  @media (max-width: 480px) {
    .progress-indicator {
      font-size: 0.8rem;
      padding: 0.5rem;
    }

    .registration-content {
      padding: 1rem;
    }

    .form-wrapper {
      padding: 1rem;
    }
  }
`;

export default StyledSellerRegistrationLayout;
