import { i18n } from "../../helpers/i18n";
import { getEndpoint } from "../../config/endpoints";

export type NotificationMessage = {
  title: string;
  body: string;
  action: string;
};

export type NotificationItem = {
  messageId: string;
  messageType: string;
  messagePayload: {
    stakes: number;
    plAmount: number;
    gamingSessionDuration: number;
    winnings: number;
  };
};

export const getNotificationMessage = (
  { messageType, messagePayload }: NotificationItem,
  currencySymbol = "",
): NotificationMessage | undefined => {
  switch (messageType) {
    case "NOTIFICATION_TIMER_LAPSED":
      return {
        title: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.GAMING_INTERVAL_NOTIFICATION.TITLE" }),
        body: i18n({
          key:
            messagePayload.plAmount > 0
              ? "I18N.HOMEPAGE_NOTIFICATIONS.GAMING_INTERVAL_NOTIFICATION.WIN_MESSAGE"
              : "I18N.HOMEPAGE_NOTIFICATIONS.GAMING_INTERVAL_NOTIFICATION.LOSS_MESSAGE",
          interpolationValues: {
            minutes: messagePayload.gamingSessionDuration,
            bet: `${currencySymbol}${messagePayload.stakes}`,
            profit: `${currencySymbol}${Math.abs(messagePayload.plAmount)}`,
            loss: `${currencySymbol}${Math.abs(messagePayload.plAmount)}`,
          },
        }),
        action: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.CONTINUE" }),
      };
    case "SESSION_TIMER_APPROACHING":
      return {
        title: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.APPROACHING_SESSION_TIMER.TITLE" }),
        body: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.APPROACHING_SESSION_TIMER.MESSAGE" }),
        action: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.CONTINUE" }),
      };
    case "SESSION_TIMER_LAPSED":
      return {
        title: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.LAPSED_SESSION_TIMER.TITLE" }),
        body: i18n({
          key:
            messagePayload.plAmount > 0
              ? "I18N.HOMEPAGE_NOTIFICATIONS.LAPSED_SESSION_TIMER.WIN_MESSAGE"
              : "I18N.HOMEPAGE_NOTIFICATIONS.LAPSED_SESSION_TIMER.LOSS_MESSAGE",
          interpolationValues: {
            bet: `${currencySymbol}${messagePayload.stakes}`,
            win: `${currencySymbol}${messagePayload.winnings}`,
            profit: `${currencySymbol}${Math.abs(messagePayload.plAmount)}`,
            loss: `${currencySymbol}${Math.abs(messagePayload.plAmount)}`,
          },
        }),
        action: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.ACCEPT" }),
      };
    case "SESSION_LOSS_LIMIT_APPROACHING":
      return {
        title: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.APPROACHING_LOSS_LIMIT.TITLE" }),
        body: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.APPROACHING_LOSS_LIMIT.MESSAGE" }),
        action: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.CONTINUE" }),
      };
    case "SESSION_LOSS_LIMIT_REACHED":
      return {
        title: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.REACHED_LOSS_LIMIT.TITLE" }),
        body: i18n({
          key:
            messagePayload.plAmount > 0
              ? "I18N.HOMEPAGE_NOTIFICATIONS.REACHED_LOSS_LIMIT.WIN_MESSAGE"
              : "I18N.HOMEPAGE_NOTIFICATIONS.REACHED_LOSS_LIMIT.LOSS_MESSAGE",
          interpolationValues: {
            bet: `${currencySymbol}${messagePayload.stakes}`,
            win: `${currencySymbol}${messagePayload.winnings}`,
            profit: `${currencySymbol}${Math.abs(messagePayload.plAmount)}`,
            loss: `${currencySymbol}${Math.abs(messagePayload.plAmount)}`,
          },
        }),
        action: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.ACCEPT" }),
      };
    case "SESSION_END":
      return {
        title: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.CLOSED_SESSION.TITLE" }),
        body: i18n({
          key:
            messagePayload.plAmount > 0
              ? "I18N.HOMEPAGE_NOTIFICATIONS.CLOSED_SESSION.WIN_MESSAGE"
              : "I18N.HOMEPAGE_NOTIFICATIONS.CLOSED_SESSION.LOSS_MESSAGE",
          interpolationValues: {
            bet: `${currencySymbol}${messagePayload.stakes}`,
            win: `${currencySymbol}${messagePayload.winnings}`,
            profit: `${currencySymbol}${Math.abs(messagePayload.plAmount)}`,
            loss: `${currencySymbol}${Math.abs(messagePayload.plAmount)}`,
          },
        }),
        action: i18n({ key: "I18N.HOMEPAGE_NOTIFICATIONS.ACCEPT" }),
      };
    default:
      return undefined;
  }
};

export const handleWebSocketCallbacks = (webSocket: WebSocket, addNotification: (data: NotificationItem) => void) => {
  const ws = webSocket;

  ws.onopen = () => {
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send("2");
      }
    }, 6000);

    ws.onclose = () => clearInterval(pingInterval);
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data) {
      addNotification(data);
    }
  };
};

export const getWebSocket = (authorizationToken: string) => {
  const params = new URLSearchParams({
    ssoid: authorizationToken,
    "x-request-id": `${Date.now()}-${Math.random().toString().slice(2, 10)}`,
    transport: "websocket",
    EIO: "3",
  });

  const ws = new WebSocket(`${getEndpoint("SPANISH_DECREE_NOTIFICATION")}?${params}`);

  if (ws.readyState === WebSocket.OPEN) {
    return null;
  }

  return ws;
};
