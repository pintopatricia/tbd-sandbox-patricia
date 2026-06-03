import { navigate, navigateWithThirdPartyScreenName, ScreenName } from "@ppb/tbd-router";
import { promotionOnTapProcessor } from "./promotion-resolver.native";
import { getStore } from "@ppb/tbd-store/create-store";
import { UI__LAUNCH_GAME_FROM_PROMO } from "@ppb/tbd-store/actions/navigation";

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
  navigateWithThirdPartyScreenName: jest.fn(),
  ScreenName: {
    GameLaunchScreen: "GameLaunchScreen",
  },
}));

jest.mock("@ppb/tbd-store/create-store", () => {
  const dispatch = jest.fn();

  return {
    getStore: jest.fn(() => ({
      dispatch,
    })),
  };
});

jest.mock("../../../config/app-configuration.native", () => ({
  deeplinkConfiguration: {
    gameLaunchURLPattern: "gameLaunch",
  },
}));

jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
}));

describe("promotion-resolver.native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("promotionOnTapProcessor", () => {
    it("shoulkd do nothing if the viewLink is not provided", () => {
      promotionOnTapProcessor({});

      expect(navigate).not.toHaveBeenCalled();
    });

    it("should dispatch a PUSH action with the viewLink", () => {
      promotionOnTapProcessor({ viewLink: { viewUrn: "test", viewUrl: "test" } });

      expect(navigate).toHaveBeenCalledWith({
        viewDisplayMode: null,
        viewUrn: "test",
        viewUrl: "test",
      });
    });

    it("should use joinNow function if the viewUrl contains register or registration", () => {
      const joinNow = jest.fn();

      promotionOnTapProcessor({
        viewLink: { viewUrn: "ppb:tbd:view:external", viewUrl: "http://www.betfair.com?register=true" },
        joinNow,
      });

      promotionOnTapProcessor({
        viewLink: { viewUrn: "ppb:tbd:view:external", viewUrl: "http://www.betfair.com?registration=true" },
        joinNow,
      });

      expect(joinNow).toHaveBeenCalledWith("http://www.betfair.com?register=true");
      expect(joinNow).toHaveBeenCalledWith("http://www.betfair.com?registration=true");
    });

    it("should use navigateWithThirdPartyScreenName if the viewUrl matches the game launch URL pattern", () => {
      promotionOnTapProcessor({
        viewLink: { viewUrn: "ppb:tbd:view:external", viewUrl: "http://www.betfair.com?gameLaunch=true" },
        urn: "promo urn",
      });
      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: UI__LAUNCH_GAME_FROM_PROMO,
        payload: {
          viewUrl: "http://www.betfair.com?gameLaunch=true",
          urn: "promo urn",
        },
      });
      expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.GameLaunchScreen, {
        viewLink: {
          viewUrn: "ppb:tbd:view:external",
          viewUrl: "http://www.betfair.com?gameLaunch=true",
          viewDisplayMode: null,
        },
      });
    });
  });
});
