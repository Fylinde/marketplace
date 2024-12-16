import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  sendMessage,
  fetchConversationHistory,
  fetchSuggestedResponses,
  escalateConversation,
  fetchChatbotPerformance,
} from '@/redux/slices/communication/chatbotSlice ';

import { RootState, AppDispatch } from 'redux/store';
import styled from 'styled-components';

interface ChatbotProps {
  sessionId: string;
  language: string; // Add the language prop here
}

interface ChatMessage {
  sender: 'user' | 'bot'; // Explicitly define sender type
  message: string;
  timestamp: string;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  max-width: 400px;
  height: 600px;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const Message = styled.div<{ sender: 'user' | 'bot' }>`
  margin: 5px 0;
  padding: 10px;
  border-radius: 8px;
  background-color: ${(props) => (props.sender === 'user' ? '#d1f7c4' : '#f1f1f1')};
  align-self: ${(props) => (props.sender === 'user' ? 'flex-end' : 'flex-start')};
  max-width: 80%;
`;

const SuggestedResponsesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
`;

const SuggestedResponse = styled.button`
  padding: 8px 12px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const PerformanceContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const Chatbot: React.FC<ChatbotProps> = ({ sessionId, language }) => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const { suggestedResponses, loading, error, performance } = useSelector(
    (state: RootState) => state.chatbot
  );

  const messages: ChatMessage[] = [
    { sender: 'user', message: 'Hello', timestamp: '2024-01-01T12:00:00Z' },
    { sender: 'bot', message: 'Hi, how can I help you?', timestamp: '2024-01-01T12:01:00Z' },
  ];

  const [input, setInput] = useState('');

  useEffect(() => {
    dispatch(fetchConversationHistory(sessionId));
    dispatch(fetchChatbotPerformance());
  }, [dispatch, sessionId]);

  useEffect(() => {
    dispatch(fetchSuggestedResponses({ sessionId }));
  }, [dispatch, sessionId, messages]);

  const sendMessageToBot = () => {
    if (!input.trim()) return;
    dispatch(sendMessage({ message: input, context: { sessionId } }));
    setInput('');
  };

  const handleSuggestedResponseClick = (response: string) => {
    setInput(response);
  };

  const escalateToHuman = () => {
    dispatch(escalateConversation(sessionId));
  };

  return (
    <ChatContainer>
      <h3>{t('chatbotTitle')}</h3>
      <MessageList>
        {messages.map((message) => (
          <Message key={message.timestamp} sender={message.sender}>
            {message.message}
          </Message>
        ))}
      </MessageList>
      <SuggestedResponsesContainer>
        {suggestedResponses.map((response: string, index: number) => (
          <SuggestedResponse key={index} onClick={() => handleSuggestedResponseClick(response)}>
            {response}
          </SuggestedResponse>
        ))}
      </SuggestedResponsesContainer>
      {loading && <div>{t('chatbotLoading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <InputContainer>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chatbotPlaceholder')}
        />
        <Button onClick={sendMessageToBot}>{t('chatbotSendButton')}</Button>
      </InputContainer>
      <Button onClick={escalateToHuman}>{t('chatbotEscalateButton')}</Button>
      {performance && (
        <PerformanceContainer>
          <h4>{t('performanceMetrics')}</h4>
          <p>{t('totalConversations')}: {performance.totalConversations}</p>
          <p>{t('resolvedByChatbot')}: {performance.resolvedByChatbot}</p>
          <p>{t('escalatedToHuman')}: {performance.escalatedToHuman}</p>
          <p>{t('averageResponseTime')}: {performance.avgResponseTime}ms</p>
        </PerformanceContainer>
      )}
    </ChatContainer>
  );
};

export default Chatbot;
