import { getStore } from "@ppb/tbd-store/create-store";
import { promotionOnTapProcessor } from "./promotion-resolver.web";

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

describe("promotion-resolver.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("promotionOnTapProcessor", () => {
    it("shoulkd do nothing if the viewLink is not provided", () => {
      promotionOnTapProcessor({});

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });

    it("should dispatch a PUSH action with the viewLink", () => {
      promotionOnTapProcessor({ viewLink: { viewUrn: "test", viewUrl: "test" } });

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "Router/push",
        payload: { viewUrn: "test", viewUrl: "test" },
      });
    });

    it("should attatch returnURL to the viewLink", () => {
      promotionOnTapProcessor({ viewLink: { viewUrn: "ppb:tbd:view:external", viewUrl: "http://www.betfair.com" } });

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "Router/push",
        payload: {
          viewUrn: "ppb:tbd:view:external",
          viewUrl: "http://www.betfair.com/?returnURL=http%3A%2F%2Fwww.random-website.com",
        },
      });
    });
  });
});
