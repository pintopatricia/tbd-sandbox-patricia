import { FunctionComponent, useEffect, useState } from "react";

import { PopupNotification } from "@ppb/the-wall-web";

import { getCookie } from "../../helpers/cookies.web";

import { getNotificationMessage, getWebSocket, handleWebSocketCallbacks, NotificationItem } from "./utils";
import { ComponentProps } from "./props";

const SpainSessionWs: FunctionComponent<ComponentProps> = ({ shouldOpenWebSocket, currencySymbol }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = (notification: NotificationItem) => {
    setNotifications((currentNotifications) => [...currentNotifications, notification]);
  };

  const handleCloseNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.messageId !== id));
  };

  useEffect(() => {
    const authorizationToken = getCookie("ssoid");

    if (shouldOpenWebSocket && authorizationToken) {
      const ws = getWebSocket(authorizationToken);

      if (ws) {
        handleWebSocketCallbacks(ws, addNotification);

        return () => ws.close();
      }
    }

    return () => {};
  }, [shouldOpenWebSocket]);

  return (
    <div>
      {notifications.map((notification) => {
        const message = getNotificationMessage(notification, currencySymbol);

        return (
          message && (
            <PopupNotification
              key={notification.messageId}
              message={message}
              handleCloseNotification={() => handleCloseNotification(notification.messageId)}
            />
          )
        );
      })}
    </div>
  );
};

export default SpainSessionWs;
