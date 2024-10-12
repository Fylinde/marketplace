import React, { useEffect, useState } from "react";
import { WebSocketService } from "../../services/websocketService";

const ChatComponent: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");

    let websocketService: WebSocketService;

    useEffect(() => {
        websocketService = new WebSocketService("ws://localhost:8000/ws");

        websocketService.onMessage((data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            websocketService.closeConnection();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            websocketService.sendMessage(input);
            setInput(""); // Clear input field
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent;