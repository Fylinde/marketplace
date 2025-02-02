import React, { useEffect, useState } from "react";
import styled from "styled-components";
import KnowledgeBase from "./KnowledgeBase";
import SellerSupport from "../../../components/dashboard/Support/SellerSupport";
import SupportTicketDetails from "./SupportTicketDetails";
import AISuggestionsModal from "./AISuggestionsModal";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store"; // Adjust path to match your setup
import {
  fetchSupportTickets,
  fetchKnowledgeBaseArticles,
  submitAISuggestion,
} from "../../../redux/slices/support/supportSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";

const SupportContainer = styled.div`
  padding: 20px;

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  .section {
    margin-bottom: 20px;
  }
`;

const Support: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    tickets,
    knowledgeBase,
    loading,
    error,
  } = useSelector((state: RootState) => state.support);

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [aiSuggestionsVisible, setAISuggestionsVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchSupportTickets());
    dispatch(fetchKnowledgeBaseArticles());
  }, [dispatch]);

  const fetchAISuggestions = async () => {
    setLoadingSuggestions(true);
    setSuggestionError(null);
    try {
      // Simulate API call or fetch actual suggestions from a service
      setSuggestions(["Suggestion 1", "Suggestion 2", "Suggestion 3"]);
    } catch (err) {
      setSuggestionError("Failed to fetch suggestions.");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAISuggestionSubmit = async (suggestion: string) => {
    try {
      await dispatch(submitAISuggestion(suggestion)).unwrap();
      alert(getLocalizedText("Suggestion submitted successfully!", "support"));
      setAISuggestionsVisible(false);
    } catch (err) {
      alert(getLocalizedText("Failed to submit suggestion.", "support"));
    }
  };

  return (
    <SupportContainer>
      <h1>{getLocalizedText("Support Management", "support")}</h1>

      {/* Knowledge Base */}
      <div className="section">
        <KnowledgeBase knowledgeBase={knowledgeBase} loading={loading} error={error} />
      </div>

      {/* Seller Support */}
      <div className="section">
        <SellerSupport
          tickets={tickets}
          loading={loading}
          error={error}
          onSelectTicket={setSelectedTicketId}
        />
      </div>

      {/* Support Ticket Details */}
      {selectedTicketId && (
        <div className="section">
          <SupportTicketDetails ticketId={selectedTicketId} />
        </div>
      )}

      {/* AI Suggestions Modal */}
      <AISuggestionsModal
        isOpen={aiSuggestionsVisible}
        suggestions={suggestions} // Provide actual suggestions from state
        loading={loadingSuggestions} // Replace with actual loading state
        error={suggestionError} // Replace with actual error state
        onClose={() => setAISuggestionsVisible(false)}
        onEscalate={() => console.log("Escalate to human")}
        onFeedback={(index, isHelpful) => {
          console.log(`Feedback on suggestion ${index}: ${isHelpful ? "Helpful" : "Not Helpful"}`);
        }}
      />

      {/* Button to trigger AI Suggestions Modal */}
      <div className="section">
        <button
          onClick={() => {
            setAISuggestionsVisible(true);
            fetchAISuggestions();
          }}
        >
          {getLocalizedText("Get AI Suggestions", "support")}
        </button>
      </div>
    </SupportContainer>
  );
};

export default Support;
