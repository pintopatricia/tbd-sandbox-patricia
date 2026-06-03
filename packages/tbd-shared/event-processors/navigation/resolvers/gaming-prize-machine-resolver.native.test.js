import { navigate, navigateWithThirdPartyScreenName, ScreenName } from "@ppb/tbd-router";
import {
  gamingPrizeMachinePlayProcessor,
  gamingPrizeMachineNavigateProcessor,
} from "./gaming-prize-machine-resolver.native";

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
  navigateWithThirdPartyScreenName: jest.fn(),
  ScreenName: {
    GameLaunchScreen: "GameLaunchScreen",
  },
}));

describe("gaming-prize-machine-resolver.native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("gamingPrizeMachineNavigateProcessor", () => {
    it("should call navigate with the converted viewLink", () => {
      gamingPrizeMachineNavigateProcessor({
        urn: "test-urn",
        viewLink: { viewUrn: "test", viewUrl: "test", viewDisplayMode: null },
      });

      expect(navigate).toHaveBeenCalledWith({
        viewUrn: "test",
        viewUrl: "test",
        viewDisplayMode: null,
      });
    });

    it("should pass viewDisplayMode through when provided", () => {
      gamingPrizeMachineNavigateProcessor({
        urn: "test-urn",
        viewLink: { viewUrn: "test", viewUrl: "http://example.com", viewDisplayMode: "SELF_BROWSER" },
      });

      expect(navigate).toHaveBeenCalledWith({
        viewUrn: "test",
        viewUrl: "http://example.com",
        viewDisplayMode: "SELF_BROWSER",
      });
    });
  });
});
