import { NotificationSubscriptionService } from "@flutter-global/uki-channels-http-clients";
import nssClient from "./notification-subscription-service";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  NotificationSubscriptionService: jest.fn().mockReturnValue({
    register: jest.fn(),
    subscribeToEvents: jest.fn(),
    unsubscribeFromEvents: jest.fn(),
    subscribeLiveActivity: jest.fn(),
    unsubscribeLiveActivity: jest.fn(),
  }),
}));

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => NotificationSubscriptionService),
}));

function setupSubscribeToEventsMock(mock = [], reject = false) {
  NotificationSubscriptionService().subscribeToEvents.mockReturnValue(
    reject ? Promise.reject() : Promise.resolve(mock),
  );
}

describe("NotificationSubscriptionService", () => {
  describe("register", () => {
    describe("and all necessary params are defined", () => {
      it("should call NotificationSubscriptionService with the correct params", async () => {
        const requestParams = {
          applicationTypeId: "dDxVFp7aQ9ixN5szm2R6Bg",
          deviceId: "caf4bc7be433dae30d8f159819c61ba72ccb9745cb88d329aa6704b832cad457",
        };

        await nssClient.register(requestParams.applicationTypeId, requestParams.deviceId);

        expect(NotificationSubscriptionService).toHaveBeenCalledWith("NSS");
        expect(NotificationSubscriptionService().register).toHaveBeenCalledWith(
          requestParams.applicationTypeId,
          requestParams.deviceId,
          { applicationDetails: undefined, deviceDetails: undefined, notificationPreferences: undefined },
        );
      });
    });

    describe("and some parameters are not defined", () => {
      it("should throw an error", async () => {
        await expect(nssClient.register()).rejects.toThrow("Insufficient data provided, cannot register device");
      });
    });

    describe("when the client throws an error", () => {
      beforeAll(() => {
        NotificationSubscriptionService().register.mockRejectedValue(new Error("NSS error"));
      });
      it("should throw an error", async () => {
        const requestParams = {
          applicationTypeId: "dDxVFp7aQ9ixN5szm2R6Bg",
          deviceId: "caf4bc7be433dae30d8f159819c61ba72ccb9745cb88d329aa6704b832cad457",
        };
        await expect(nssClient.register(requestParams.applicationTypeId, requestParams.deviceId)).rejects.toThrow(
          "NSS error",
        );
      });
    });
  });

  describe("subscribeToEvents", () => {
    describe("when all params are defined", () => {
      const requestParams = {
        topics: [
          {
            topicSpecification: {
              eventId: "1233228",
            },
            incidentTypes: ["FOOTBALL_SCORE_CHANGE"],
          },
          {
            topicSpecification: {
              marketId: "1233227",
            },
            incidentTypes: ["FOOTBALL_SCORE_CHANGE"],
          },
        ],
        applicationTypeId: "dDxVFp7aQ9ixN5szm2R6Bg",
        deviceId: "caf4bc7be433dae30d8f159819c61ba72ccb9745cb88d329aa6704b832cad457",
        locale: "en_GB",
      };

      beforeAll(async () => {
        await setupSubscribeToEventsMock([]);
        await nssClient.subscribeToEvents(
          requestParams.applicationTypeId,
          requestParams.deviceId,
          requestParams.locale,
          requestParams.topics,
        );
      });

      it("should call NotificationSubscriptionService with the correct params", async () => {
        expect(NotificationSubscriptionService().subscribeToEvents).toHaveBeenCalledWith({
          applicationTypeId: requestParams.applicationTypeId,
          deviceId: requestParams.deviceId,
          locale: requestParams.locale,
          topics: requestParams.topics,
        });
      });

      it("should return mapped results", async () => {
        expect(
          await nssClient.subscribeToEvents(
            requestParams.applicationTypeId,
            requestParams.deviceId,
            requestParams.locale,
            requestParams.topics,
          ),
        ).toEqual([]);
      });
    });

    describe("when some parameters are not defined", () => {
      it("should throw an error", async () => {
        await expect(nssClient.subscribeToEvents()).rejects.toThrow(
          "Insufficient data provided, cannot subscribe event",
        );
      });
    });

    describe("when the client throws an error", () => {
      beforeAll(() => {
        NotificationSubscriptionService().subscribeToEvents.mockRejectedValue(new Error("NSS error"));
      });
      it("should throw an error", async () => {
        const requestParams = {
          applicationTypeId: "dDxVFp7aQ9ixN5szm2R6Bg",
          deviceId: "caf4bc7be433dae30d8f159819c61ba72ccb9745cb88d329aa6704b832cad457",
          locale: "locale",
          topics: [{}],
        };
        await expect(
          nssClient.subscribeToEvents(
            requestParams.applicationTypeId,
            requestParams.deviceId,
            requestParams.locale,
            requestParams.topics,
          ),
        ).rejects.toThrow("NSS error");
      });
    });
  });

  describe("unsubscribeFromEvents", () => {
    describe("when all params are defined", () => {
      it("should call NotificationSubscriptionService with the correct params", async () => {
        const requestParams = {
          topics: [
            {
              topicSpecification: {
                eventId: "321124",
              },
              topicType: "EVENT_UPDATE",
              incidentTypes: ["FOOTBALL_SCORE_CHANGE"],
            },
          ],
          applicationTypeId: "dDxVFp7aQ9ixN5szm2R6Bg",
          deviceId: "caf4bc7be433dae30d8f159819c61ba72ccb9745cb88d329aa6704b832cad457",
        };

        await nssClient.unsubscribeFromEvents(
          requestParams.applicationTypeId,
          requestParams.deviceId,
          requestParams.topics,
        );

        expect(NotificationSubscriptionService).toHaveBeenCalledWith("NSS");
        expect(NotificationSubscriptionService().unsubscribeFromEvents).toHaveBeenCalledWith({
          applicationTypeId: requestParams.applicationTypeId,
          deviceId: requestParams.deviceId,
          topics: requestParams.topics,
        });
      });
    });

    describe("when some parameters are not defined", () => {
      it("should throw an error", async () => {
        await expect(nssClient.unsubscribeFromEvents()).rejects.toThrow(
          "Insufficient data provided, cannot unsubscribe from event",
        );
      });
    });

    describe("when the client throws an error", () => {
      beforeAll(() => {
        NotificationSubscriptionService().unsubscribeFromEvents.mockRejectedValue(new Error("NSS error"));
      });
      it("should throw an error", async () => {
        const requestParams = {
          applicationTypeId: "dDxVFp7aQ9ixN5szm2R6Bg",
          deviceId: "caf4bc7be433dae30d8f159819c61ba72ccb9745cb88d329aa6704b832cad457",
          topic: {},
        };
        await expect(
          nssClient.unsubscribeFromEvents(requestParams.applicationTypeId, requestParams.deviceId, requestParams.topic),
        ).rejects.toThrow("NSS error");
      });
    });
  });

  describe("subscribeLiveActivity", () => {
    const subscribeLiveActivity = {
      applicationTypeId: "appType",
      deviceId: "device",
      liveActivityEvents: [{ eventId: "event-1", pushToken: "token-1" }],
    };

    describe("when the request is defined", () => {
      const response = {
        success: true,
        liveActivityEvents: [{ eventId: "event-1", pushToken: "token-1" }],
      };

      beforeAll(() => {
        NotificationSubscriptionService().subscribeLiveActivity.mockResolvedValue(response);
      });

      it("should call NotificationSubscriptionService with the correct params and return the response", async () => {
        const result = await nssClient.subscribeLiveActivity(subscribeLiveActivity);

        expect(NotificationSubscriptionService).toHaveBeenCalledWith("NSS");
        expect(NotificationSubscriptionService().subscribeLiveActivity).toHaveBeenCalledWith(subscribeLiveActivity);
        expect(result).toEqual(response);
      });
    });

    describe("when no request is provided", () => {
      it("should throw an error", async () => {
        await expect(nssClient.subscribeLiveActivity()).rejects.toThrow(
          "Insufficient data provided, cannot subscribe to live activity",
        );
      });
    });

    describe("when the client throws an error", () => {
      beforeAll(() => {
        NotificationSubscriptionService().subscribeLiveActivity.mockRejectedValue(new Error("NSS error"));
      });
      it("should throw an error", async () => {
        await expect(nssClient.subscribeLiveActivity(subscribeLiveActivity)).rejects.toThrow("NSS error");
      });
    });
  });

  describe("unsubscribeLiveActivity", () => {
    const unsubscribeLiveActivity = {
      applicationTypeId: "appType",
      deviceId: "device",
      liveActivityEvents: [{ eventId: "event-1", pushToken: "token-1" }],
    };

    describe("when the request is defined", () => {
      const response = { success: true, liveActivityEvents: [] };

      beforeAll(() => {
        NotificationSubscriptionService().unsubscribeLiveActivity.mockResolvedValue(response);
      });

      it("should call NotificationSubscriptionService with the correct params and return the response", async () => {
        const result = await nssClient.unsubscribeLiveActivity(unsubscribeLiveActivity);

        expect(NotificationSubscriptionService).toHaveBeenCalledWith("NSS");
        expect(NotificationSubscriptionService().unsubscribeLiveActivity).toHaveBeenCalledWith(unsubscribeLiveActivity);
        expect(result).toEqual(response);
      });
    });

    describe("when no request is provided", () => {
      it("should throw an error", async () => {
        await expect(nssClient.unsubscribeLiveActivity()).rejects.toThrow(
          "Insufficient data provided, cannot unsubscribe from live activity",
        );
      });
    });

    describe("when the client throws an error", () => {
      beforeAll(() => {
        NotificationSubscriptionService().unsubscribeLiveActivity.mockRejectedValue(new Error("NSS error"));
      });
      it("should throw an error", async () => {
        await expect(nssClient.unsubscribeLiveActivity(unsubscribeLiveActivity)).rejects.toThrow("NSS error");
      });
    });
  });
});
