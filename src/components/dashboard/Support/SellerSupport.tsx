import React, { useState } from "react";
import { Tabs, Button as AntButton } from "antd";
import styled from "styled-components";
import AISuggestionsModal from "./AISuggestionsModal";
import KnowledgeBase from "./KnowledgeBase";
import SupportTicketDetails from "./SupportTicketDetails";
import { getLocalizedText } from "../../../utils/localizationUtils";
import { SupportTicket } from "../../../services/supportService";

const SellerSupportContainer = styled.div`
  padding: 20px;

  h2 {
    margin-bottom: 20px;
    font-size: 1.8rem;
  }
`;

const ButtonGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`;

interface SellerSupportProps {
  tickets: SupportTicket[];
  loading: boolean;
  error: string | null;
  onSelectTicket: (ticketId: string | null) => void;
}

const SellerSupport: React.FC<SellerSupportProps> = ({ tickets, loading, error, onSelectTicket }) => {
  const [aiModalVisible, setAIModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("1");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const fetchAISuggestions = () => {
    // Simulate fetching AI suggestions
    setSuggestions(["Suggestion 1", "Suggestion 2", "Suggestion 3"]);
  };

  const handleSelectTicket = (ticketId: string | null) => {
    setSelectedTicketId(ticketId);
  };

  return (
    <SellerSupportContainer>
      <h2>{getLocalizedText("Seller Support", "support")}</h2>

      <ButtonGroup>
        <AntButton
          type="primary"
          onClick={() => {
            fetchAISuggestions();
            setAIModalVisible(true);
          }}
        >
          {getLocalizedText("Open AI Suggestions", "support")}
        </AntButton>
        <AntButton type="default" onClick={() => setSelectedTab("2")}>
          {getLocalizedText("Go to Tickets", "support")}
        </AntButton>
      </ButtonGroup>

      <Tabs
        activeKey={selectedTab}
        onChange={(key) => setSelectedTab(key)}
        defaultActiveKey="1"
      >
        <Tabs.TabPane tab={getLocalizedText("Knowledge Base", "support")} key="1">
          <KnowledgeBase loading={loading} error={error} knowledgeBase={[]} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={getLocalizedText("Support Tickets", "support")} key="2">
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <div key={ticket.id} onClick={() => handleSelectTicket(ticket.id)}>
                <h3>{ticket.title}</h3>
                <p>{ticket.description}</p>
              </div>
            ))
          ) : (
            <p>{loading ? getLocalizedText("Loading tickets...", "support") : getLocalizedText("No tickets available", "support")}</p>
          )}
        </Tabs.TabPane>
      </Tabs>

      {selectedTicketId && (
        <SupportTicketDetails ticketId={selectedTicketId} />
      )}

      <AISuggestionsModal
        isOpen={aiModalVisible}
        suggestions={suggestions}
        loading={loading}
        error={error}
        onClose={() => setAIModalVisible(false)}
        onEscalate={() => console.log("Escalate ticket")}
        onFeedback={(feedback) => console.log("Feedback:", feedback)}
      />
    </SellerSupportContainer>
  );
};

export default SellerSupport;
