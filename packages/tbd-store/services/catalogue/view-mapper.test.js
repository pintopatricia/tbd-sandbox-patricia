import { EntityType } from "@ppb/tbd-urn-codecs";
import { buildViewResult } from "./view-mapper";
import { normalizerEngine } from "./normalizer/normalizer-engine";

jest.mock("./normalizer/normalizer-engine", () => ({
  normalizerEngine: jest.fn(() => ({
    BottomBar: [{ tiles: [] }],
  })),
}));

jest.mock("../../config/apollo-cache-feeder", () => ({
  getApolloCacheFeeder: jest.fn(() => jest.fn()),
}));

describe("ViewMapper", () => {
  beforeEach(jest.clearAllMocks);

  describe.each([
    "GenericView",
    "AllCompetitionsView",
    "AllMarketsView",
    "EventView",
    "GamingView",
    "ImsPromotionView",
    "MarketView",
    "RaceView",
    "RunnerView",
    "PromotionsView",
    "SettingsView",
    "SportView",
    "CompetitionView",
    "GameView",
    "GamingCategoryView",
    "BrowseView",
    "MaintenanceView",
    "MyBetsView",
    "MyAccountView",
  ])("%s", (typeName) => {
    it(`should use normalizer engine when View is an ${typeName}`, () => {
      buildViewResult({
        View: {
          __typename: typeName,
          urn: "urn:1",
          url: "random/url/urn:1",
          items: [],
        },
      });

      expect(normalizerEngine).toHaveBeenCalledWith({
        __typename: typeName,
        urn: "urn:1",
        url: "random/url/urn:1",
        items: [],
      });
    });

    it(`should merge the result of both normalizer and mapper`, () => {
      const result = buildViewResult({
        View: {
          __typename: typeName,
          category: "MODAL",
          urn: "urn:1",
          url: "random/url/urn:1",
          items: [],
        },
      });

      expect(result).toEqual({
        data: {
          BottomBar: [
            {
              tiles: [],
            },
          ],
        },
        router: {
          category: "MODAL",
          currentUrl: "random/url/urn:1",
          currentUrn: "urn:1",
          currentView: EntityType[typeName],
        },
      });
    });
  });

  it("should default to empty layout if View is not supported", () => {
    const result = buildViewResult({});

    expect(result).toEqual({ data: {} });
  });
});
