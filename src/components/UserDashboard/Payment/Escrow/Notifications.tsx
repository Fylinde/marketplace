import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type NotificationType = "escrowUpdates" | "deliveryUpdates";

const Notifications = () => {
  const [notificationPreferences, setNotificationPreferences] = useState({
    escrowUpdates: true,
    deliveryUpdates: true,
  });

  useEffect(() => {
    const ws = new WebSocket("wss://your-backend.com/notifications");
    ws.onmessage = (message) => {
      const notification = JSON.parse(message.data);

      if (notification.type === "escrow" && notificationPreferences.escrowUpdates) {
        toast.info(notification.message);
      }

      if (notification.type === "delivery" && notificationPreferences.deliveryUpdates) {
        toast.success(notification.message);
      }
    };

    return () => ws.close();
  }, [notificationPreferences]);

  const handleTogglePreference = (type: NotificationType) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div>
      <h4>Notification Preferences</h4>
      <div>
        <label>
          <input
            type="checkbox"
            checked={notificationPreferences.escrowUpdates}
            onChange={() => handleTogglePreference("escrowUpdates")}
          />
          Escrow Updates
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={notificationPreferences.deliveryUpdates}
            onChange={() => handleTogglePreference("deliveryUpdates")}
          />
          Delivery Updates
        </label>
      </div>
    </div>
  );
};

export default Notifications;
