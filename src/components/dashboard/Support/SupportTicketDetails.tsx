import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/reduxHooks";
import { fetchSupportTicketById, fetchAISolutions, escalateTicketToHuman } from "../redux/slices/supportSlice";
import Box from "components/Box";
import Button from "components/buttons/Button";
import AISuggestionsModal from "./AISuggestionsModal";

interface SupportTicketDetailsProps {
  ticketId: string;
}

const SupportTicketDetails: React.FC<SupportTicketDetailsProps> = ({ ticketId }) => {
  const dispatch = useAppDispatch();
  const { selectedTicket, loading, error } = useAppSelector((state) => state.support);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSupportTicketById(ticketId));
  }, [dispatch, ticketId]);

  const handleFetchAISuggestions = () => {
    dispatch(fetchAISolutions(ticketId));
    setIsModalOpen(true);
  };

  const handleEscalate = () => {
    dispatch(escalateTicketToHuman(ticketId));
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading ticket details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box>
      {selectedTicket ? (
        <>
          <h2>Ticket Details</h2>
          <p><strong>Subject:</strong> {selectedTicket.subject}</p>
          <p><strong>Status:</strong> {selectedTicket.status}</p>
          <p><strong>Description:</strong> {selectedTicket.description}</p>

          <Button onClick={handleFetchAISuggestions}>View AI Suggestions</Button>

          <AISuggestionsModal
            isOpen={isModalOpen}
            suggestions={selectedTicket.aiSuggestions || []}
            onClose={() => setIsModalOpen(false)}
            onEscalate={handleEscalate}
          />
        </>
      ) : (
        <p>Ticket not found.</p>
      )}
    </Box>
  );
};

export default SupportTicketDetails;
