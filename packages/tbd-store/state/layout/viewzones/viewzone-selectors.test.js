import { codecs } from "@ppb/tbd-urn-codecs";
import { getViewZoneByItemUrn, getViewZones } from "./viewzone-selectors";
import { getViewbyURN } from "../views/event-view/event-view-selectors";

jest.mock("../views/event-view/event-view-selectors");
jest.mock("../views/view-selectors");

const stateMock = {
  layouts: {
    views: {
      gaming: {
        "ppb:tbd:view:gaming:1": {
          urn: "ppb:tbd:view:gaming:1",
          url: "casino/gm-1",
          type: "GAMING_VIEW",
          items: [
            { urn: "ppb:tbd:gaming:masterConfigElement:multifunctional_module/1", typename: "ViewZone" },
            { urn: "ppb:tbd:card:group:curatedGames:arcade", typename: "SwimlaneCardGroup" },
            { urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0", typename: "ViewZone" },
          ],
        },
      },
    },
    cards: {
      games: {
        "game:1": { urn: "game:1", type: "GAME_CARD", game: "game:1" },
      },
      gamingjackpots: {
        "ppb:tbd:card:gaming:jackpot:id/Xs4zYhIAACMAesQk": {
          urn: "ppb:tbd:card:gaming:jackpot:id/Xs4zYhIAACMAesQk",
          typename: "GamingJackpotCard",
          name: "X-Sell Exchange BluePrint Jackpot King Zone",
          logo: "https://images.prismic.io/betfair-com/ce4b66455e3956a4ab201d197a2362a51b73d441_jm-jackpotking-logo2.png?auto=compress,format",
          jackpots: [
            "ppb:gaming:jackpot:id/W8b5yhQAAC0AwGC9",
            "ppb:gaming:jackpot:id/W8b3tBQAACoAwFcP",
            "ppb:gaming:jackpot:id/W8b4ehQAACwAwFuO",
          ],
        },
      },
    },
    swimlanecardgroups: {
      "ppb:tbd:card:group:curatedGames:arcade": {
        urn: "ppb:tbd:card:group:curatedGames:arcade",
        type: "GAMES_CARDGROUP",
        title: "Arcade Games",
        defaultLayout: "CARD_LIST",
        items: [{ urn: "game:1", typename: "GameCard" }],
      },
      "ppb:tbd:card:group:curatedGames:recently": {
        urn: "ppb:tbd:card:group:curatedGames:recently",
        type: "GAMES_CARDGROUP",
        title: "Arcade Games",
        defaultLayout: "CARD_LIST",
        items: [{ urn: "game:1", typename: "GameCard" }],
      },
    },
    segmentedcardgroups: {
      "ppb:tbd:segmented:card:group:test1": {
        urn: "ppb:tbd:segmented:card:group:test1",
        type: "SEGMENTED_CARDGROUP",
        items: ["ppb:tbd:card:group:curatedGames:arcade"],
      },
    },
    viewzones: {
      "ppb:tbd:gaming:masterConfigElement:multifunctional_module/1": {
        urn: "ppb:tbd:gaming:masterConfigElement:multifunctional_module/1",
        type: "VIEW_ZONE",
        title: "Casino",
        items: [
          { typename: "SegmentedCardGroup", urn: "ppb:tbd:segmented:card:group:test1" },
          { typename: "SwimlaneCardGroup", urn: "ppb:tbd:card:group:curatedGames:recently" },
        ],
      },
      "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0": {
        urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0",
        typename: "ViewZone",
        title: "Red Tiger Daily Jackpot",
        items: [{ typename: "GamingJackpotCard", urn: "ppb:tbd:card:gaming:jackpot:id/Xs4zYhIAACMAesQk" }],
      },
    },
  },
  router: {
    currentView: "current:view",
    currentUrn: "current:view:urn",
  },
};

describe("viewzones selectors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getViewZones", () => {
    it("should return the viewzones", () => {
      const state = {
        layouts: {
          viewzones: ["1", "2"],
        },
      };

      expect(getViewZones(state)).toEqual(["1", "2"]);
    });
  });

  describe("getViewZoneByItemUrn selector", () => {
    const setup = () => {
      jest.mock("./viewzone-selectors", () => ({
        getViewZones: jest.fn().mockReturnValue({
          "ppb:tbd:gaming:masterConfigElement:multifunctional_module/1": {
            title: "World Of Casino",
            type: "VIEW_ZONE",
            urn: "ppb:tbd:gaming:masterConfigElement:multifunctional_module/1",
            items: [
              { typename: "SegmentedCardGroup", urn: "ppb:tbd:segmented:card:group:curated" },
              { typename: "SwimlaneCardGroup", urn: "ppb:tbd:card:group:recently" },
            ],
          },
        }),
        getViewZoneByItemUrn: jest.fn(),
        createViewZoneByURNSelector: jest.fn().mockReturnValue(
          jest.fn(() => ({
            title: "World Of Casino",
            type: "VIEW_ZONE",
            urn: "ppb:tbd:gaming:masterConfigElement:multifunctional_module/1",
            items: [
              { typename: "SegmentedCardGroup", urn: "ppb:tbd:segmented:card:group:curated" },
              { typename: "SwimlaneCardGroup", urn: "ppb:tbd:card:group:recently" },
            ],
          })),
        ),
      }));
      getViewbyURN.mockReturnValue({
        urn: "ppb:tbd:view:gaming:1",
        url: "casino/gm-1",
        type: "GAMING_VIEW",
        items: [{ urn: "ppb:tbd:gaming:masterConfigElement:multifunctional_module/1", typename: "ViewZone" }],
      });
      codecs.browseView.encode = jest.fn().mockReturnValue({ uid: "uid" });
    };

    describe("when current view is different than browse view", () => {
      it("should call getCurrentViewURN method", () => {
        setup();
        getViewZoneByItemUrn(stateMock, { urn: "ppb:tbd:segmented:card:group:test1" });
        expect(codecs.browseView.encode).toHaveBeenCalledTimes(0);
      });
    });

    describe("when current view is browse", () => {
      it("should call codecs.browseView.encode", () => {
        setup();
        getViewZoneByItemUrn(
          { ...stateMock, router: { currentView: "ppb:tbd:view:browse" } },
          { urn: "ppb:tbd:segmented:card:group:test1" },
        );
        expect(codecs.browseView.encode).toHaveBeenCalledTimes(1);
        expect(codecs.browseView.encode).toHaveBeenCalledWith("gaming");
      });
    });

    describe("when no items exist in view", () => {
      it("should return viewZone as undefined", () => {
        setup();

        getViewbyURN.mockReturnValue({ items: [] });

        const viewZone = getViewZoneByItemUrn(stateMock, { urn: "ppb:tbd:segmented:card:group:test1" });
        expect(viewZone).toEqual({ viewZone: undefined });
      });
    });

    describe("when no currentViewUrn exists", () => {
      it("should return viewZone as undefined", () => {
        setup();

        const viewZone = getViewZoneByItemUrn(stateMock, { urn: "ppb:tbd:segmented:card:group:test1" });
        expect(viewZone).toEqual({ viewZone: undefined });
      });
    });

    describe("when there is a multifunctional viewzone with an existent item urn", () => {
      it("should return multifunctional viewzone", () => {
        setup();
        const viewZone = getViewZoneByItemUrn(stateMock, "ppb:tbd:segmented:card:group:test1");
        expect(viewZone).toEqual({
          viewZone: {
            items: [
              {
                typename: "SegmentedCardGroup",
                urn: "ppb:tbd:segmented:card:group:test1",
              },
              {
                typename: "SwimlaneCardGroup",
                urn: "ppb:tbd:card:group:curatedGames:recently",
              },
            ],
            title: "Casino",
            type: "VIEW_ZONE",
            urn: "ppb:tbd:gaming:masterConfigElement:multifunctional_module/1",
          },
        });
      });
    });

    describe("when there is a jackpot merchandising viewzone with an existent item urn", () => {
      it("should return jackpot merchandising viewzone", () => {
        setup();
        jest.mock("./viewzone-selectors", () => ({
          createViewZoneByURNSelector: jest.fn().mockReturnValue(
            jest.fn(() => ({
              urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0",
              typename: "ViewZone",
              title: "Red Tiger Daily Jackpot",
              items: [{ typename: "GamingJackpotCard", urn: "ppb:tbd:card:gaming:jackpot:id/Xs4zYhIAACMAesQk" }],
            })),
          ),
        }));
        getViewbyURN.mockReturnValue({
          urn: "ppb:tbd:view:gaming:1",
          url: "casino/gm-1",
          type: "GAMING_VIEW",
          items: [{ urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0", typename: "ViewZone" }],
        });

        const viewZone = getViewZoneByItemUrn(stateMock, "ppb:tbd:card:gaming:jackpot:id/Xs4zYhIAACMAesQk");
        expect(viewZone).toEqual({
          viewZone: {
            urn: "ppb:tbd:gaming:masterConfigElement:jackpot_merchandising/0",
            typename: "ViewZone",
            title: "Red Tiger Daily Jackpot",
            items: [{ typename: "GamingJackpotCard", urn: "ppb:tbd:card:gaming:jackpot:id/Xs4zYhIAACMAesQk" }],
          },
        });
      });
    });

    describe("when there is a viewzone with a non-existent item urn", () => {
      it("should return empty array", () => {
        setup();
        const viewZone = getViewZoneByItemUrn(stateMock, "ppb:tbd:segmented:card:group:nonExistent");
        expect(viewZone).toEqual({});
      });
    });

    describe("when there is no viewzone in the current view", () => {
      it("should return empty array", () => {
        jest.mock("./viewzone-selectors", () => ({
          getViewZones: jest.fn().mockReturnValue({
            "ppb:tbd:gaming:master:config:element:multifunctional_module/1": {
              title: "World Of Casino",
              type: "VIEW_ZONE",
              urn: "ppb:tbd:gaming:master:config:element:multifunctional_module/1",
              items: [
                { typename: "SegmentedCardGroup", urn: "ppb:tbd:segmented:card:group:curated" },
                { typename: "SwimlaneCardGroup", urn: "ppb:tbd:card:group:recently" },
              ],
            },
          }),
          getViewZoneByItemUrn: jest.fn(),
        }));

        getViewbyURN.mockReturnValue({
          items: [{ typename: "ViewZone", urn: "ppb:tbd:fake:urn:multifunctionalModule:test-zone" }],
        });
        const viewZone = getViewZoneByItemUrn(stateMock, "ppb:tbd:segmented:card:group:nonExistent");
        expect(viewZone).toEqual({});
      });
    });
  });
});
