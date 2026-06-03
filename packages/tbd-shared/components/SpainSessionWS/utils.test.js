import { getNotificationMessage, getWebSocket, handleWebSocketCallbacks } from "./utils";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => (interpolationValues ? { key, interpolationValues } : key)),
}));

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn().mockReturnValue("ws://test-endpoint"),
}));

describe("getNotificationMessage", () => {
  const currencySymbol = "$";
  describe("when messageType is SESSION_LOSS_LIMIT_APPROACHING", () => {
    it("should return correct notification message for SESSION_LOSS_LIMIT_APPROACHING", () => {
      const notification = {
        messageId: 1,
        messageType: "SESSION_LOSS_LIMIT_APPROACHING",
        authentication: null,
        messagePayload: {
          stakes: 10,
          plAmount: 5,
          gamingSessionDuration: 10,
          winnings: 5,
        },
      };

      const result = getNotificationMessage(notification, currencySymbol);

      expect(result).toEqual({
        title: "I18N.HOMEPAGE_NOTIFICATIONS.APPROACHING_LOSS_LIMIT.TITLE",
        body: "I18N.HOMEPAGE_NOTIFICATIONS.APPROACHING_LOSS_LIMIT.MESSAGE",
        action: "I18N.HOMEPAGE_NOTIFICATIONS.CONTINUE",
      });
    });
  });

  describe("when messageType is NOTIFICATION_TIMER_LAPSED", () => {
    describe("and when the plAmount is greater than 0", () => {
      it("should return correct message for SESSION_LOSS_LIMIT_APPROACHING with WIN_MESSAGE for body", () => {
        const notification = {
          messageId: 1,
          messageType: "NOTIFICATION_TIMER_LAPSED",
          authentication: null,
          messagePayload: {
            stakes: 10,
            plAmount: 5,
            gamingSessionDuration: 10,
            winnings: 5,
          },
        };

        const result = getNotificationMessage(notification, currencySymbol);

        expect(result).toEqual({
          title: "I18N.HOMEPAGE_NOTIFICATIONS.GAMING_INTERVAL_NOTIFICATION.TITLE",
          action: "I18N.HOMEPAGE_NOTIFICATIONS.CONTINUE",
          body: {
            key: "I18N.HOMEPAGE_NOTIFICATIONS.GAMING_INTERVAL_NOTIFICATION.WIN_MESSAGE",
            interpolationValues: {
              minutes: notification.messagePayload.gamingSessionDuration,
              bet: `${currencySymbol}${notification.messagePayload.stakes}`,
              profit: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
              loss: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
            },
          },
        });
      });
    });
    describe("and when the plAmount is not greater than 0", () => {
      it("should return correct message for SESSION_LOSS_LIMIT_APPROACHING with LOSS_MESSAGE for body", () => {
        const notification = {
          messageId: 1,
          messageType: "NOTIFICATION_TIMER_LAPSED",
          authentication: null,
          messagePayload: {
            stakes: 10,
            plAmount: 0,
            gamingSessionDuration: 10,
            winnings: 5,
          },
        };

        const result = getNotificationMessage(notification, currencySymbol);

        expect(result).toEqual({
          title: "I18N.HOMEPAGE_NOTIFICATIONS.GAMING_INTERVAL_NOTIFICATION.TITLE",
          action: "I18N.HOMEPAGE_NOTIFICATIONS.CONTINUE",
          body: {
            key: "I18N.HOMEPAGE_NOTIFICATIONS.GAMING_INTERVAL_NOTIFICATION.LOSS_MESSAGE",
            interpolationValues: {
              minutes: notification.messagePayload.gamingSessionDuration,
              bet: `${currencySymbol}${notification.messagePayload.stakes}`,
              profit: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
              loss: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
            },
          },
        });
      });
    });
  });

  describe("when messageType is SESSION_TIMER_APPROACHING", () => {
    it("should return correct message for SESSION_TIMER_APPROACHING", () => {
      const notification = {
        messageId: 1,
        messageType: "SESSION_TIMER_APPROACHING",
        authentication: null,
        messagePayload: {
          stakes: 10,
          plAmount: 5,
          gamingSessionDuration: 10,
          winnings: 5,
        },
      };

      const result = getNotificationMessage(notification, currencySymbol);

      expect(result).toEqual({
        title: "I18N.HOMEPAGE_NOTIFICATIONS.APPROACHING_SESSION_TIMER.TITLE",
        action: "I18N.HOMEPAGE_NOTIFICATIONS.CONTINUE",
        body: "I18N.HOMEPAGE_NOTIFICATIONS.APPROACHING_SESSION_TIMER.MESSAGE",
      });
    });
  });

  describe("when messageType is SESSION_END", () => {
    describe("and when the plAmount is greater than 0", () => {
      it("should return correct message for SESSION_END with WIN_MESSAGE for body", () => {
        const notification = {
          messageId: 1,
          messageType: "SESSION_END",
          authentication: null,
          messagePayload: {
            stakes: 10,
            plAmount: 5,
            gamingSessionDuration: 10,
            winnings: 5,
          },
        };

        const result = getNotificationMessage(notification, currencySymbol);

        expect(result).toEqual({
          title: "I18N.HOMEPAGE_NOTIFICATIONS.CLOSED_SESSION.TITLE",
          action: "I18N.HOMEPAGE_NOTIFICATIONS.ACCEPT",
          body: {
            key: "I18N.HOMEPAGE_NOTIFICATIONS.CLOSED_SESSION.WIN_MESSAGE",
            interpolationValues: {
              bet: `${currencySymbol}${notification.messagePayload.stakes}`,
              win: `${currencySymbol}${notification.messagePayload.winnings}`,
              profit: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
              loss: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
            },
          },
        });
      });
    });
    describe("and when the plAmount is not greater than 0", () => {
      it("should return correct message for SESSION_END with LOSS_MESSAGE for body", () => {
        const notification = {
          messageId: 1,
          messageType: "SESSION_END",
          authentication: null,
          messagePayload: {
            stakes: 10,
            plAmount: 0,
            gamingSessionDuration: 10,
            winnings: 5,
          },
        };

        const result = getNotificationMessage(notification, currencySymbol);

        expect(result).toEqual({
          title: "I18N.HOMEPAGE_NOTIFICATIONS.CLOSED_SESSION.TITLE",
          action: "I18N.HOMEPAGE_NOTIFICATIONS.ACCEPT",
          body: {
            key: "I18N.HOMEPAGE_NOTIFICATIONS.CLOSED_SESSION.LOSS_MESSAGE",
            interpolationValues: {
              bet: `${currencySymbol}${notification.messagePayload.stakes}`,
              win: `${currencySymbol}${notification.messagePayload.winnings}`,
              profit: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
              loss: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
            },
          },
        });
      });
    });
  });

  describe("when messageType is SESSION_TIMER_LAPSED", () => {
    describe("and when the plAmount is greater than 0", () => {
      it("should return correct message for SESSION_TIMER_LAPSED with WIN_MESSAGE for body", () => {
        const notification = {
          messageId: 1,
          messageType: "SESSION_TIMER_LAPSED",
          authentication: null,
          messagePayload: {
            stakes: 10,
            plAmount: 5,
            gamingSessionDuration: 10,
            winnings: 5,
          },
        };

        const result = getNotificationMessage(notification, currencySymbol);

        expect(result).toEqual({
          title: "I18N.HOMEPAGE_NOTIFICATIONS.LAPSED_SESSION_TIMER.TITLE",
          action: "I18N.HOMEPAGE_NOTIFICATIONS.ACCEPT",
          body: {
            key: "I18N.HOMEPAGE_NOTIFICATIONS.LAPSED_SESSION_TIMER.WIN_MESSAGE",
            interpolationValues: {
              bet: `${currencySymbol}${notification.messagePayload.stakes}`,
              win: `${currencySymbol}${notification.messagePayload.winnings}`,
              profit: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
              loss: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
            },
          },
        });
      });
    });
    describe("and when the plAmount is not greater than 0", () => {
      it("should return correct message for SESSION_TIMER_LAPSED with LOSS_MESSAGE for body", () => {
        const notification = {
          messageId: 1,
          messageType: "SESSION_TIMER_LAPSED",
          authentication: null,
          messagePayload: {
            stakes: 10,
            plAmount: 0,
            gamingSessionDuration: 10,
            winnings: 5,
          },
        };

        const result = getNotificationMessage(notification, currencySymbol);

        expect(result).toEqual({
          title: "I18N.HOMEPAGE_NOTIFICATIONS.LAPSED_SESSION_TIMER.TITLE",
          action: "I18N.HOMEPAGE_NOTIFICATIONS.ACCEPT",
          body: {
            key: "I18N.HOMEPAGE_NOTIFICATIONS.LAPSED_SESSION_TIMER.LOSS_MESSAGE",
            interpolationValues: {
              bet: `${currencySymbol}${notification.messagePayload.stakes}`,
              win: `${currencySymbol}${notification.messagePayload.winnings}`,
              profit: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
              loss: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
            },
          },
        });
      });
    });
  });

  describe("when messageType is SESSION_LOSS_LIMIT_REACHED", () => {
    describe("and when the plAmount is greater than 0", () => {
      it("should return correct message for SESSION_LOSS_LIMIT_REACHED with WIN_MESSAGE for body", () => {
        const notification = {
          messageId: 1,
          messageType: "SESSION_LOSS_LIMIT_REACHED",
          authentication: null,
          messagePayload: {
            stakes: 10,
            plAmount: 5,
            gamingSessionDuration: 10,
            winnings: 5,
          },
        };

        const result = getNotificationMessage(notification, currencySymbol);

        expect(result).toEqual({
          title: "I18N.HOMEPAGE_NOTIFICATIONS.REACHED_LOSS_LIMIT.TITLE",
          action: "I18N.HOMEPAGE_NOTIFICATIONS.ACCEPT",
          body: {
            key: "I18N.HOMEPAGE_NOTIFICATIONS.REACHED_LOSS_LIMIT.WIN_MESSAGE",
            interpolationValues: {
              bet: `${currencySymbol}${notification.messagePayload.stakes}`,
              win: `${currencySymbol}${notification.messagePayload.winnings}`,
              profit: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
              loss: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
            },
          },
        });
      });
    });
    describe("and when the plAmount is not greater than 0", () => {
      it("should return correct message for SESSION_LOSS_LIMIT_REACHED with LOSS_MESSAGE for body", () => {
        const notification = {
          messageId: 1,
          messageType: "SESSION_LOSS_LIMIT_REACHED",
          authentication: null,
          messagePayload: {
            stakes: 10,
            plAmount: 0,
            gamingSessionDuration: 10,
            winnings: 5,
          },
        };

        const result = getNotificationMessage(notification, currencySymbol);

        expect(result).toEqual({
          title: "I18N.HOMEPAGE_NOTIFICATIONS.REACHED_LOSS_LIMIT.TITLE",
          action: "I18N.HOMEPAGE_NOTIFICATIONS.ACCEPT",
          body: {
            key: "I18N.HOMEPAGE_NOTIFICATIONS.REACHED_LOSS_LIMIT.LOSS_MESSAGE",
            interpolationValues: {
              bet: `${currencySymbol}${notification.messagePayload.stakes}`,
              win: `${currencySymbol}${notification.messagePayload.winnings}`,
              profit: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
              loss: `${currencySymbol}${Math.abs(notification.messagePayload.plAmount)}`,
            },
          },
        });
      });
    });
  });
});

describe("handleWebSocketCallbacks", () => {
  let mockWebSocket;
  let mockAddNotification;

  beforeEach(() => {
    mockAddNotification = jest.fn();

    mockWebSocket = {
      send: jest.fn(),
      onopen: jest.fn(),
      onmessage: jest.fn(),
      onclose: jest.fn(),
      readyState: WebSocket.OPEN,
    };
    jest.useFakeTimers();

    jest.spyOn(global, "setInterval");
    jest.spyOn(global, "clearInterval");
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it("should send ping message every 6 seconds when WebSocket is open", () => {
    handleWebSocketCallbacks(mockWebSocket, mockAddNotification);

    mockWebSocket.onopen();

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 6000);

    jest.advanceTimersByTime(6000);

    expect(mockWebSocket.send).toHaveBeenCalledWith("2");
    expect(mockWebSocket.send).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it("should call addNotification when specific message types are received", () => {
    const mockData = { messageType: "SESSION_LOSS_LIMIT_APPROACHING" };

    handleWebSocketCallbacks(mockWebSocket, mockAddNotification);

    mockWebSocket.onmessage({ data: JSON.stringify(mockData) });

    expect(mockAddNotification).toHaveBeenCalledWith(mockData);
    expect(mockAddNotification).toHaveBeenCalledTimes(1);
  });
});

describe("getWebSocket", () => {
  let mockWebSocket;
  beforeEach(() => {
    mockWebSocket = {
      send: jest.fn(),
      onopen: jest.fn(),
      onmessage: jest.fn(),
      onclose: jest.fn(),
      readyState: WebSocket.CONNECTING,
    };
  });

  global.WebSocket = jest.fn();
  global.WebSocket.mockImplementation(() => mockWebSocket);

  global.URLSearchParams = jest.fn().mockImplementation(() => ({
    ssoid: "token",
    "x-request-id": expect.any(String),
    transport: "websocket",
    EIO: "3",
  }));

  it("should return WebSocket instance when the connection is not open", () => {
    mockWebSocket.readyState = 0;

    const result = getWebSocket("token");

    expect(result).toEqual(mockWebSocket);
  });
});
