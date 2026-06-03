import { navigate, navigateWithThirdPartyScreenName, ScreenName } from "@ppb/tbd-router";
import { quicklinksGridItemOnTapProcessor } from "./quicklinks-grid-resolver.native";
import { getStore } from "@ppb/tbd-store/create-store";
import { BOTTOM_BAR_PUSH } from "@ppb/tbd-store/actions";
import { UI__QUICK_LINK_CLICK } from "@ppb/tbd-store/actions/navigation";

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

describe("quicklinks-grid-resolver.native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("quicklinksGridItemOnTapProcessor", () => {
    describe("on a regular navigation", () => {
      it("should dispatch a UI__QUICK_LINK_CLICK action with the label and urn", () => {
        quicklinksGridItemOnTapProcessor({
          viewLink: { viewUrn: "test", viewUrl: "test" },
          label: "Test",
          urn: "test",
        });

        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: UI__QUICK_LINK_CLICK,
          payload: {
            url: "test",
            label: "Test",
            cardUrn: "test",
          },
        });
      });

      it("should call navigate with the viewLink and label", () => {
        quicklinksGridItemOnTapProcessor({
          viewLink: { viewUrn: "test", viewUrl: "test" },
          label: "Test",
          urn: "test",
        });

        expect(navigate).toHaveBeenCalledWith({ viewUrn: "test", viewUrl: "test" }, "Test");
      });
    });

    describe("on a gaming navigation", () => {
      it("should dispatch a UI__QUICK_LINK_CLICK action with the label and urn", () => {
        quicklinksGridItemOnTapProcessor({
          viewLink: { viewUrn: "ppb:tbd:view:gaming", viewUrl: "test" },
          label: "Gaming Test",
          urn: "test",
        });

        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: UI__QUICK_LINK_CLICK,
          payload: {
            url: "test",
            label: "Gaming Test",
            cardUrn: "test",
          },
        });
      });

      it("should dispatch BOTTOM_BAR_PUSH for gaming links", () => {
        quicklinksGridItemOnTapProcessor({
          viewLink: { viewUrn: "ppb:tbd:view:gaming", viewUrl: "test" },
          label: "Gaming Test",
          urn: "test",
        });

        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: BOTTOM_BAR_PUSH,
          payload: { viewUrn: "ppb:tbd:view:gaming", viewUrl: "test" },
        });
      });
    });

    describe("on a game launch navigation", () => {
      it("should use navigateWithThirdPartyScreenName if the viewUrl matches the game launch URL pattern", () => {
        quicklinksGridItemOnTapProcessor({
          viewLink: { viewUrn: "test", viewUrl: "http://www.betfair.com?gameLaunch=true" },
          label: "Game",
          urn: "test",
        });

        expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.GameLaunchScreen, {
          viewLink: { viewUrn: "test", viewUrl: "http://www.betfair.com?gameLaunch=true" },
        });
      });
    });
  });
});
