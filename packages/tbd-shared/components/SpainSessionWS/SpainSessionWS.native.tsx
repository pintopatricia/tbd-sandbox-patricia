import { FunctionComponent, useEffect, useState, useContext, useCallback } from "react";
import { View } from "react-native";
import { CetContext } from "@flutter-global/react-native-cet-framework";
import Notification from "./SpainSessionNotification.native";
import { ComponentProps } from "./props";
import styles from "./SpainSessionWS.native.styles";
import { getNotificationMessage, getWebSocket, handleWebSocketCallbacks, NotificationItem } from "./utils";

const SpainSessionWs: FunctionComponent<ComponentProps> = ({ shouldOpenWebSocket, currencySymbol }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { authorizationToken, language } = useContext(CetContext);

  const addNotification = useCallback((notification: NotificationItem) => {
    setNotifications((currentNotifications) => [...currentNotifications, notification]);
  }, []);

  const handleCloseNotification = useCallback((id: string) => {
    setNotifications((currentNotifications) =>
      currentNotifications.filter((notification) => notification.messageId !== id),
    );
  }, []);

  useEffect(() => {
    if (shouldOpenWebSocket && authorizationToken) {
      const ws = getWebSocket(authorizationToken);

      if (ws) {
        handleWebSocketCallbacks(ws, addNotification);

        return () => ws.close();
      }
    }

    return () => {};
  }, [authorizationToken, language, shouldOpenWebSocket, addNotification]);

  return (
    <View style={styles.notificationBoxContainer}>
      {notifications.map((notification) => {
        const message = getNotificationMessage(notification, currencySymbol);

        return (
          message && (
            <Notification
              key={notification.messageId}
              message={message}
              handleCloseNotification={() => handleCloseNotification(notification.messageId)}
            />
          )
        );
      })}
    </View>
  );
};

export default SpainSessionWs;
