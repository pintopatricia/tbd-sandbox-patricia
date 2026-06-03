import setupBehaviourLibrary from "behaviour-library";
import { BehaviourTracker } from "./behaviour-tracking";
import { getCBSChannelConfig } from "./client-factory";

jest.mock("behaviour-library", () => ({
  __esModule: true, // this property makes it work
  default: jest.fn(() => ({
    launchGame: jest.fn(),
    viewPage: jest.fn(),
    navigate: jest.fn(),
    exposed: jest.fn(),
  })),
}));

jest.mock("./behaviour-service-interface", () => ({
  httpInterface: "mockInterface",
}));

jest.mock("./client-factory", () => ({
  getCBSChannelConfig: jest.fn(),
}));

async function setup() {
  const behaviourTracker = new BehaviourTracker();
  await behaviourTracker.initLibrary("mockedEndpoint", "mockedAppkey");

  return behaviourTracker;
}

describe("core/behaviour-tracking", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialize library scenarios", () => {
    it("should create an inactive behaviour tracker", () => {
      const behaviourTracker = new BehaviourTracker();
      expect(behaviourTracker.behaviourLibrary).toBeNull();
    });

    it("should correctly create a behaviourLibrary instance", async () => {
      await setup();

      expect(setupBehaviourLibrary).toHaveBeenCalledWith("mockInterface", {
        endpoint: "mockedEndpoint",
        applicationKey: "mockedAppkey",
        channel: "Betfair Rebuild Mobile",
      });
      expect(getCBSChannelConfig).toHaveBeenCalledTimes(1);
    });

    it("should correctly create a behaviourLibrary instance with cbs channel set", async () => {
      getCBSChannelConfig.mockReturnValue("mockedChannel");
      await setup();

      expect(setupBehaviourLibrary).toHaveBeenCalledWith("mockInterface", {
        endpoint: "mockedEndpoint",
        applicationKey: "mockedAppkey",
        channel: "mockedChannel",
      });
      expect(getCBSChannelConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe("Launch game event", () => {
    it("should trigger a launchGame event", async () => {
      const behaviourTracker = await setup();

      behaviourTracker.triggerEvent("launchGame", {
        gameId: "game-test",
        item: { urn: "game-test", container: "fakeCardGroup" },
      });
      expect(behaviourTracker.behaviourLibrary.launchGame).toHaveBeenCalledWith("game-test", {
        urn: "game-test",
        container: "fakeCardGroup",
      });
    });
  });

  describe("View Page event", () => {
    it("should trigger a viewPage event", async () => {
      const behaviourTracker = await setup();

      behaviourTracker.triggerEvent("pageView", { uri: "urlFake", urn: "urnFake" });
      expect(behaviourTracker.behaviourLibrary.viewPage).toHaveBeenCalledWith("urlFake", "urnFake");
    });
  });

  describe("Navigate event", () => {
    it("should trigger a navigate event", async () => {
      const behaviourTracker = await setup();

      behaviourTracker.triggerEvent("navigate", { uri: "locationFake" });
      expect(behaviourTracker.behaviourLibrary.navigate).toHaveBeenCalledWith("locationFake");
    });
  });

  describe("Expose event", () => {
    it("should trigger an expose event", async () => {
      const behaviourTracker = await setup();

      behaviourTracker.triggerEvent("expose", { urn: "urnFake" });
      expect(behaviourTracker.behaviourLibrary.exposed).toHaveBeenCalledWith({ urn: "urnFake" });
    });
  });
});
