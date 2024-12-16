import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHooks";
import { fetchSupportTicketById, fetchAISolutions, escalateTicketToHuman } from "@/redux/slices/support/supportSlice";
import styled from "styled-components";
import { Spin, Alert, Button as AntButton } from "antd";
import AISuggestionsModal from "./AISuggestionsModal";
import { getLocalizedText } from "utils/localizationUtils";

interface SupportTicketDetailsProps {
  ticketId: string;
}

const TicketDetailsContainer = styled.div`
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }

  p {
    margin-bottom: 10px;
    line-height: 1.5;
  }

  .button-group {
    display: flex;
    gap: 10px;
  }
`;

const SupportTicketDetails: React.FC<SupportTicketDetailsProps> = ({ ticketId }) => {
  const dispatch = useAppDispatch();
  const { selectedTicket, loading, error } = useAppSelector((state) => state.support);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [escalating, setEscalating] = useState(false);

  useEffect(() => {
    dispatch(fetchSupportTicketById(ticketId));
  }, [dispatch, ticketId]);

  const handleFetchAISuggestions = async () => {
    await dispatch(fetchAISolutions(ticketId));
    setIsModalOpen(true);
  };

  const handleEscalate = async () => {
    setEscalating(true);
    await dispatch(escalateTicketToHuman(ticketId));
    setEscalating(false);
    setIsModalOpen(false);
    alert(getLocalizedText("The ticket has been escalated to human support.", "support"));
  };

  const handleFeedback = (index: number, isHelpful: boolean) => {
    // Handle user feedback on AI suggestions (e.g., log or dispatch action)
    console.log(
      `${getLocalizedText("Feedback", "support")}: Suggestion ${index + 1} is ${isHelpful ? "Helpful" : "Not Helpful"
      }.`
    );
  };

  if (loading) return <Spin tip={getLocalizedText("Loading ticket details...", "support")} />;
  if (error) return <Alert message={getLocalizedText(`Error: ${error}`, "support")} type="error" />;

  return (
    <TicketDetailsContainer>
      {selectedTicket ? (
        <>
          <h2>{getLocalizedText("Ticket Details", "support")}</h2>
          <p>
            <strong>{getLocalizedText("Subject", "support")}:</strong> {selectedTicket.subject}
          </p>
          <p>
            <strong>{getLocalizedText("Status", "support")}:</strong> {selectedTicket.status}
          </p>
          <p>
            <strong>{getLocalizedText("Description", "support")}:</strong> {selectedTicket.description}
          </p>

          <div className="button-group">
            <AntButton type="primary" onClick={handleFetchAISuggestions}>
              {getLocalizedText("View AI Suggestions", "support")}
            </AntButton>
            <AntButton type="primary" danger={true} loading={escalating} onClick={handleEscalate}>
              {getLocalizedText("Escalate to Human", "support")}
            </AntButton>
          </div>

          <AISuggestionsModal
            isOpen={isModalOpen}
            suggestions={selectedTicket.aiSuggestions || []}
            loading={false} // Pass loading if applicable
            error={null} // Pass error if applicable
            onClose={() => setIsModalOpen(false)}
            onEscalate={handleEscalate}
            onFeedback={handleFeedback}
          />
        </>
      ) : (
        <Alert message={getLocalizedText("Ticket not found.", "support")} type="warning" />
      )}
    </TicketDetailsContainer>
  );
};

export default SupportTicketDetails;
