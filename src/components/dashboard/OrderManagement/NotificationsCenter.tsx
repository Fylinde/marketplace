import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsRead,
  clearNotifications,
} from "../../../redux/slices/communication/notificationSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";

const NotificationCenter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, loading, error } = useSelector(
    (state: RootState) => state.notifications
  );
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
      alert(getLocalizedText("markReadError", "notificationCenter", { error: errorMessage }));
    }
  };

  const handleClearAll = async () => {
    if (window.confirm(getLocalizedText("confirmClearAll", "notificationCenter"))) {
      try {
        await dispatch(clearNotifications()).unwrap();
        alert(getLocalizedText("notificationsCleared", "notificationCenter"));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
        alert(
          getLocalizedText("clearNotificationsError", "notificationCenter", { error: errorMessage })
        );
      }
    }
  };

  const renderNotificationDetails = () => {
    const selectedNotification = notifications.find(
      (notification) => notification.id === showDetails
    );
    if (!selectedNotification) return null;

    return (
      <div className="notification-details">
        <h3>{getLocalizedText("notificationDetails", "notificationCenter")}</h3>
        <p>
          <strong>{getLocalizedText("title", "notificationCenter")}: </strong>
          {selectedNotification.title}
        </p>
        <p>
          <strong>{getLocalizedText("message", "notificationCenter")}: </strong>
          {selectedNotification.message}
        </p>
        <p>
          <strong>{getLocalizedText("timestamp", "notificationCenter")}: </strong>
          {new Date(selectedNotification.timestamp).toLocaleString()}
        </p>
      </div>
    );
  };

  const renderNotificationList = () => (
    <div className="notification-list">
      <h3>
        {getLocalizedText("notifications", "notificationCenter")} ({unreadCount}{" "}
        {getLocalizedText("unread", "notificationCenter")})
      </h3>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id} className={!notification.read ? "unread" : ""}>
            <p>
              <strong>{notification.title}</strong>
            </p>
            <p>{notification.message}</p>
            <button onClick={() => setShowDetails(notification.id)}>
              {getLocalizedText("viewDetails", "notificationCenter")}
            </button>
            {!notification.read && (
              <button onClick={() => handleMarkAsRead(notification.id)}>
                {getLocalizedText("markAsRead", "notificationCenter")}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error) {
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : typeof error === "string"
          ? error
          : "Unknown error";

    return (
      <p>
        {getLocalizedText("errorFetchingNotifications", "notificationCenter", {
          error: errorMessage,
        })}
      </p>
    );
  }


  return (
    <div className="notification-center">
      <h1>{getLocalizedText("notificationCenter", "notificationCenter")}</h1>
      <button onClick={handleClearAll}>
        {getLocalizedText("clearAll", "notificationCenter")}
      </button>
      <div className="notification-container">
        {renderNotificationList()}
        {renderNotificationDetails()}
      </div>
    </div>
  );
};

export default NotificationCenter;
