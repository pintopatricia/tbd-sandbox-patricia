import {
  createClientFactory,
  setAppCustomHeaders,
  setHTTPClientsConfig,
  setUserAgentClientsConfig,
  setCBSChannelConfig,
  getCBSChannelConfig,
} from "./client-factory";

describe("client factory", () => {
  describe("setUserAgentClientsConfig", () => {
    it("should set APP_USER_AGENT", () => {
      setUserAgentClientsConfig("customUserAgentMock");
      const clientMock = jest.fn();
      const factory = createClientFactory(clientMock);
      factory("TLA");

      expect(clientMock).toHaveBeenCalledWith(
        "undefined",
        {
          applicationKey: undefined,
          overrideUserAgent: "customUserAgentMock",
        },
        undefined,
      );
      expect(clientMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("setAppCustomHeaders", () => {
    beforeAll(() => {
      setAppCustomHeaders("appCustomHeadersMock");
    });
    afterAll(() => {
      setAppCustomHeaders(undefined);
    });
    it("should set APP_CUSTOM_HEADERS", () => {
      const clientMock = jest.fn();
      const factory = createClientFactory(clientMock);
      factory("TLA");

      expect(clientMock).toHaveBeenCalledWith(
        "undefined",
        {
          applicationKey: undefined,
          overrideUserAgent: "customUserAgentMock",
          overrideCustomHeaders: "appCustomHeadersMock",
        },
        undefined,
      );
      expect(clientMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("setHTTPClientsConfig", () => {
    it("should set ENDPOINTS, APP_KEY, APP_USER_AGENT, APP_REFERER and AUTHORIZATION_TOKEN", () => {
      setHTTPClientsConfig({ TLA: "endpoint" }, "appKey", "userAgentMock", "refererMock", "authTokenMock");
      const clientMock = jest.fn();
      const factory = createClientFactory(clientMock);
      factory("TLA");

      expect(clientMock).toHaveBeenCalledWith(
        "endpoint",
        {
          applicationKey: "appKey",
          authorizationToken: "authTokenMock",
          overrideUserAgent: "userAgentMock",
        },
        "refererMock",
      );
      expect(clientMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("setCBSChannelConfig", () => {
    it("should set CBS_CHANNEL", () => {
      setCBSChannelConfig("test-channel");
      const clientMock = jest.fn();
      const factory = createClientFactory(clientMock);
      factory("TLA");

      expect(clientMock).toHaveBeenCalledWith(
        "endpoint",
        {
          applicationKey: "appKey",
          authorizationToken: "authTokenMock",
          overrideUserAgent: "userAgentMock",
        },
        "refererMock",
      );
      expect(clientMock).toHaveBeenCalledTimes(1);
    });

    it("should return the channel", () => {
      setCBSChannelConfig("test-channel");
      expect(getCBSChannelConfig()).toEqual("test-channel");
    });
  });

  describe("createClientFactory", () => {
    it("should return a function that initialize the client", () => {
      setHTTPClientsConfig({ RANDOM_TLA: "endpoint" }, "appKey", "userAgentMock", "refererMock");
      const mockClient = jest.fn(() => "client");
      const factory = createClientFactory(mockClient);
      const client = factory("RANDOM_TLA");

      expect(client).toBe("client");
      expect(mockClient).toHaveBeenCalledWith(
        "endpoint",
        {
          applicationKey: "appKey",
          overrideUserAgent: "userAgentMock",
        },
        "refererMock",
      );
    });

    it("should return always the same instance of the client", () => {
      setHTTPClientsConfig({ RANDOM_TLA: "endpoint" }, "appKey", "userAgentMock", "refererMock");
      const singleton = {};
      const mockClient = jest.fn(() => singleton);
      const factory = createClientFactory(mockClient);

      const client1 = factory("RANDOM_TLA");
      const client2 = factory("RANDOM_TLA");

      expect(client1).toBe(singleton);
      expect(client2).toBe(singleton);
    });

    it("should call client with the default base path", () => {
      setHTTPClientsConfig({ RANDOM_TLA: "endpoint" }, "appKey", "userAgentMock", "refererMock");
      const mockClient = jest.fn();
      const factory = createClientFactory(mockClient, "BASE_PATH");
      factory("ANOTHER_TLA");

      expect(mockClient).toHaveBeenCalledWith(
        "BASE_PATH",
        {
          applicationKey: "appKey",
          overrideUserAgent: "userAgentMock",
        },
        "refererMock",
      );
    });
  });
});
