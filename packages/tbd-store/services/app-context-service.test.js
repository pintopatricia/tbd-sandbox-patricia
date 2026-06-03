import AppContext from "../clients/app-context/app-context-client";
import Catalogue from "../clients/catalogue/catalogue-client";
import { createClientFactory } from "./client-factory";
import { getAppContextFromBFF, getAppVersion } from "./app-context-service";

jest.mock("@ppb/tbd-store/clients/app-context/app-context-client", () =>
  jest.fn().mockReturnValue({
    getAppContextData: jest.fn(),
  }),
);

jest.mock("../clients/catalogue/catalogue-client", () =>
  jest.fn().mockReturnValue({
    getAppContext: jest.fn(),
    getAppVersion: jest.fn(),
  }),
);

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn((ctx) => ctx),
}));

function setup(mock) {
  AppContext().getAppContextData.mockReturnValue(Promise.resolve(mock));
}

describe("App Context Service", () => {
  afterEach(jest.clearAllMocks);

  beforeEach(() => {
    setup({
      entities: {
        userdetails: { accountId: "accountId" },
        preferences: {},
      },
    });
  });

  describe("getAppContextFromBFF", () => {
    it("should return app context data", async () => {
      Catalogue().getAppContext.mockResolvedValue("bff-app-context");

      const appContextData = await getAppContextFromBFF("some-endpoint", "token", {
        throttlesOn: [],
        throttlesOff: [],
      });

      expect(appContextData).toBe("bff-app-context");
      expect(createClientFactory).toHaveBeenCalledWith(Catalogue, "some-endpoint");
    });
  });

  describe("getAppVersion", () => {
    it("should return app context data", async () => {
      Catalogue().getAppVersion.mockResolvedValue("bff-app-context");

      const appContextData = await getAppVersion("some-endpoint", {
        throttlesOn: [],
        throttlesOff: [],
      });

      expect(appContextData).toBe("bff-app-context");
      expect(createClientFactory).toHaveBeenCalledWith(Catalogue, "some-endpoint");
    });
  });
});
