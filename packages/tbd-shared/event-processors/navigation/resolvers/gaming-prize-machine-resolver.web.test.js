import { getStore } from "@ppb/tbd-store/create-store";
import { gamingPrizeMachineOnTapProcessor } from "./gaming-prize-machine-resolver.web";

jest.mock("@ppb/tbd-store/create-store", () => {
  const dispatch = jest.fn();

  return {
    getStore: jest.fn(() => ({
      dispatch,
    })),
  };
});

global.window = Object.create(window);

Object.defineProperty(window, "location", {
  value: {
    href: "http://www.random-website.com",
  },
});

describe("gaming-prize-machine-resolver.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("gamingPrizeMachineOnTapProcessor", () => {
    it("should dispatch a PUSH action with the viewLink", () => {
      gamingPrizeMachineOnTapProcessor({
        urn: "test-urn",
        viewLink: { viewUrn: "test", viewUrl: "test" },
      });

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "Router/push",
        payload: { viewUrn: "test", viewUrl: "test" },
      });
    });

    it("should attach returnURL to the viewUrl when viewUrn contains ExternalView", () => {
      gamingPrizeMachineOnTapProcessor({
        urn: "test-urn",
        viewLink: { viewUrn: "ppb:tbd:view:external", viewUrl: "http://www.betfair.com" },
      });

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "Router/push",
        payload: {
          viewUrn: "ppb:tbd:view:external",
          viewUrl: "http://www.betfair.com/?returnURL=http%3A%2F%2Fwww.random-website.com",
        },
      });
    });

    it("should not attach returnURL when viewUrn does not contain ExternalView", () => {
      gamingPrizeMachineOnTapProcessor({
        urn: "test-urn",
        viewLink: { viewUrn: "ppb:tbd:view:internal", viewUrl: "http://www.betfair.com" },
      });

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "Router/push",
        payload: {
          viewUrn: "ppb:tbd:view:internal",
          viewUrl: "http://www.betfair.com",
        },
      });
    });
  });
});
