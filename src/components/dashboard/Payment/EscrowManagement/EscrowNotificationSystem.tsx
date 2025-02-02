import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";


const EscrowNotificationSystem = () => {
  useEffect(() => {
    //const ws = new WebSocket("wss://your-backend.com/escrow-notifications"); // ('ws://mock-server', true)
    const ws = new WebSocket("wss:///mock-server/escrow-notifications");
    ws.onmessage = (message) => {
      const notification = JSON.parse(message.data);
      toast.info(`Escrow Update: ${notification.message}`);
    };

    return () => ws.close();
  }, []);

  return null; // This component doesn't render anything but manages notifications.
};

export default EscrowNotificationSystem;
