import React from "react";
import Modal from "components/modal/Modal";
import Button from "components/buttons/Button";
import Box from "components/Box";
import styled from "styled-components";
import { Spin } from "antd";
import { getLocalizedText } from "utils/localizationUtils";

interface AISuggestionsModalProps {
  isOpen: boolean;
  suggestions?: string[]; // Default to an empty array
  loading?: boolean; // Default to false
  error?: string | null; // Default to null
  onClose: () => void;
  onEscalate: () => void;
  onFeedback: (index: number, isHelpful: boolean) => void;
}

const SuggestionList = styled.ul`
  padding: 0;
  list-style: none;

  li {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      margin-left: 10px;
    }
  }
`;

const AISuggestionsModal: React.FC<AISuggestionsModalProps> = ({
  isOpen,
  suggestions = [],
  loading = false,
  error = null,
  onClose,
  onEscalate,
  onFeedback,
}) => {
  return (
    <Modal
      open={isOpen}
      title={getLocalizedText("AI Suggestions", "support")}
      onClose={onClose}
    >
      <Box>
        <h3>{getLocalizedText("Suggested Responses", "support")}</h3>

        {loading ? (
          <Spin aria-live="polite" />
        ) : error ? (
          <p style={{ color: "red" }} aria-live="assertive">
            {getLocalizedText("Failed to load suggestions.", "support")}
          </p>
        ) : suggestions.length ? (
          <SuggestionList>
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <span>{suggestion}</span>
                <div>
                  <Button
                    variant="text"
                    onClick={() => onFeedback(index, true)}
                    aria-label={getLocalizedText("Mark as helpful", "support")}
                  >
                    {getLocalizedText("Helpful", "support")}
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => onFeedback(index, false)}
                    aria-label={getLocalizedText("Mark as not helpful", "support")}
                  >
                    {getLocalizedText("Not Helpful", "support")}
                  </Button>
                </div>
              </li>
            ))}
          </SuggestionList>
        ) : (
          <p aria-live="polite">
            {getLocalizedText("No suggestions available at the moment.", "support")}
          </p>
        )}

        <Box mt="20px" display="flex" justifyContent="space-between">
          <Button onClick={onClose}>
            {getLocalizedText("Close", "support")}
          </Button>
          <Button onClick={onEscalate}>
            {getLocalizedText("Escalate to Human", "support")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AISuggestionsModal;
