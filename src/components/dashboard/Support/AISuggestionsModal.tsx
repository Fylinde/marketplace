import React from "react";
import Modal from "components/modal/Modal";
import Button from "components/buttons/Button";
import Box from "components/Box";

interface AISuggestionsModalProps {
  isOpen: boolean;
  suggestions: string[];
  onClose: () => void;
  onEscalate: () => void;
}

const AISuggestionsModal: React.FC<AISuggestionsModalProps> = ({
  isOpen,
  suggestions,
  onClose,
  onEscalate,
}) => {
  return (
    <Modal open={isOpen} title="AI Suggestions" onClose={onClose}>
      <Box>
        <h3>Suggested Responses</h3>
        {suggestions.length ? (
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {suggestion}
              </li>
            ))}
          </ul>
        ) : (
          <p>No suggestions available at the moment.</p>
        )}

        <Box mt="20px" display="flex" justifyContent="space-between">
          <Button onClick={onClose}>Close</Button>
          <Button onClick={onEscalate}>Escalate to Human</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AISuggestionsModal;
