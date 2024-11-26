import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessage,
  startCall,
  endCall,
  setTypingStatus,
} from "@/redux/slices/chatSlice";
import { RootState, AppDispatch } from "@/redux/store";

const SellerChat: React.FC<{ chatId: string }> = ({ chatId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { messages, callStatus, typingStatus } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    dispatch(fetchMessages(chatId));
  }, [dispatch, chatId]);
    
 
 // Handle typing detection
 const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // If not already typing, set typing status
    if (!isTyping) {
      setIsTyping(true);
      dispatch(setTypingStatus({ chatId, typing: true }));
    }

    // Clear existing timeout and set a new one to reset typing status after 2 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      dispatch(setTypingStatus({ chatId, typing: false }));
    }, 2000);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      dispatch(sendMessage({ chatId, message }));
      setMessage("");
      setIsTyping(false); // Reset typing status
      dispatch(setTypingStatus({ chatId, typing: false }));
    }
  };

  const handleStartCall = async () => {
    try {
      dispatch(startCall({ chatId, participants: ["buyer", "seller"] }));
      setIsCalling(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerConnection.current = new RTCPeerConnection();
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Signaling for WebRTC (to be integrated with backend)
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("ICE Candidate:", event.candidate);
          // Send ICE candidate to the server
        }
      };
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleEndCall = () => {
    dispatch(endCall(chatId));
    setIsCalling(false);

    // Close video streams
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    }
    if (remoteVideoRef.current?.srcObject) {
      (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    }

    peerConnection.current?.close();
    peerConnection.current = null;
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  };

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getVideoTracks().forEach((track) => {
        track.enabled = !isCameraOn;
      });
    }
  };

  return (
    <ChatContainer>
       <MessageList>
        {messages[chatId]?.map((msg: { senderId: string; content: string }, idx: number) => (
          <MessageBubble key={idx} isOwn={msg.senderId === "buyer"}>
            {msg.content}
          </MessageBubble>
        ))}
          </MessageList>
          {typingStatus[chatId] && <TypingIndicator>Seller is typing...</TypingIndicator>}


      {isCalling && (
        <VideoContainer>
          <Video ref={localVideoRef} autoPlay muted />
          <Video ref={remoteVideoRef} autoPlay />
          <CallControls>
            <ControlButton onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</ControlButton>
            <ControlButton onClick={toggleCamera}>{isCameraOn ? "Camera Off" : "Camera On"}</ControlButton>
            <EndCallButton onClick={handleEndCall}>End Call</EndCallButton>
          </CallControls>
        </VideoContainer>
      )}

      <ChatInputContainer>
        <ChatInput
          value={message}
          onChange={handleTyping} 
          placeholder="Type a message..."
        />
        <SendButton onClick={handleSendMessage}>Send</SendButton>
          </ChatInputContainer>
          {!isCalling && (
              <CallControls>
                  {callStatus === "in-progress" ? (
                      <EndCallButton onClick={handleEndCall}>End Call</EndCallButton>
                  ) : (
                      <StartCallButton onClick={handleStartCall}>Start Call</StartCallButton>
                  )}
              </CallControls>
          )}
    </ChatContainer>
  );
};

export default SellerChat;

// Styled Components
const TypingIndicator = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 10px;
  text-align: center;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  background: #fff;
`;

const MessageList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  background-color: ${(props) => (props.isOwn ? "#007bff" : "#f1f1f1")};
  color: ${(props) => (props.isOwn ? "#fff" : "#000")};
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  align-self: ${(props) => (props.isOwn ? "flex-end" : "flex-start")};
`;

const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const Video = styled.video`
  width: 100%;
  max-height: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #000;
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const SendButton = styled.button`
  padding: 10px;
  margin-left: 10px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }

  &:active {
    background: #004494;
  }
`;

const CallControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
`;

const ControlButton = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

const StartCallButton = styled(ControlButton)`
  background: #28a745;

  &:hover {
    background: #218838;
  }
`;

const EndCallButton = styled(ControlButton)`
  background: #dc3545;

  &:hover {
    background: #c82333;
  }
`;


