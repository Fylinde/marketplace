import styled from "styled-components";
import { getTheme } from "../../utils/utils";

const StyledVendorDashboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;

  .top-section,
  .bottom-section {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .dashboard-card {
    flex: 1 1 20%;
    background: ${getTheme("colors.background.paper")};
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .card-title {
      font-size: 1rem;
      font-weight: bold;
      color: ${getTheme("colors.text.primary")};
      margin-bottom: 0.5rem;
    }

    .card-content {
      font-size: 0.875rem;
      color: ${getTheme("colors.text.secondary")};
    }
  }

  @media only screen and (max-width: 900px) {
    flex-direction: column;

    .dashboard-card {
      min-width: unset;
      flex: 1 1 100%;
    }
  }
`;

export default StyledVendorDashboard;
