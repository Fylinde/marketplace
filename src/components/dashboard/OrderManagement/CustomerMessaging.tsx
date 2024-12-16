import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMessages, sendChatMessage } from "../../../redux/slices/communication/messageSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";

const CustomerMessaging: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [filter, setFilter] = useState<"all" | "chatbot" | "chat">("all");
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");

  // Access chat state from Redux
  const chatState = useSelector((state: RootState) => state.message.chat);
  const { messages, loading, error } = chatState;

  useEffect(() => {
    dispatch(fetchAllMessages());
  }, [dispatch]);

  const senderMap: Record<string, "seller" | "buyer"> = {
    chat: "seller",
    chatbot: "buyer",
  };

  const filteredMessages =
    filter === "all"
      ? messages
      : messages.filter((msg) =>
        msg.messages.some(
          (message) => message.sender === senderMap[filter]
        )
      );



  const handleSendMessage = async () => {
    if (!activeConversation || !newMessage.trim()) return;

    try {
      await dispatch(sendChatMessage({ conversationId: activeConversation, content: newMessage }));
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const renderActiveConversation = () => {
    const conversation = messages.find((msg) => msg.id === activeConversation);

    if (!conversation) {
      return <p>{getLocalizedText("No conversation selected", "customerMessaging")}</p>;
    }

    return (
      <div>
        <h2>
          {getLocalizedText("Conversation with", "customerMessaging")} {conversation.buyerName}
        </h2>
        <div className="messages">
          {conversation.messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            placeholder={getLocalizedText("Type a message", "customerMessaging")}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>
            {getLocalizedText("Send", "customerMessaging")}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="customer-messaging">
      <h1>{getLocalizedText("Customer Messaging", "customerMessaging")}</h1>
      {loading && <p>{getLocalizedText("Loading messages...", "customerMessaging")}</p>}
      {error && <p className="error">{error}</p>}
      <div className="conversation-list">
        <h2>{getLocalizedText("Conversations", "customerMessaging")}</h2>
        <ul>
          {filteredMessages.map((conversation) => (
            <li
              key={conversation.id}
              className={conversation.id === activeConversation ? "active" : ""}
              onClick={() => setActiveConversation(conversation.id)}
            >
              {conversation.buyerName || conversation.lastMessage}
            </li>
          ))}
        </ul>
      </div>
      <div className="conversation-details">{renderActiveConversation()}</div>
    </div>
  );
};

export default CustomerMessaging;
