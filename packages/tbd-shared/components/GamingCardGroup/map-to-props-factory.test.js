import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { UI__CARDGROUP_VIEW_ALL_LINK_TAP } from "@ppb/tbd-store/actions/navigation";
import { UI__PAGE_CONTENT_LOADED } from "@ppb/tbd-store/actions/game-interactions";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import {
  getBetslipExchangeContext,
  getSportsbookPlacedCombinations,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createSimpleSelectionsCounterSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn(),
  getSportsbookPlacedCombinations: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createSimpleSelectionsCounterSelector: jest.fn(),
}));

const getGamingCardGroupByURN = jest.fn(() => [{ urn: "urn:1" }, { urn: "urn:2" }]);
const getSportsbookSimpleSelectionsCounter = jest.fn(() => 0);

createCardGroupByURNSelector.mockImplementation(() => getGamingCardGroupByURN);
createSimpleSelectionsCounterSelector.mockImplementation(() => getSportsbookSimpleSelectionsCounter);

const stateMock = {
  layouts: {
    cardgroups: {
      gamingcardgroups: {
        fakeGamingCardGroupUrn: {
          urn: "fakeGamingCardGroupUrn",
        },
      },
    },
  },
  entities: {
    throttles: { PIN_GAMING_RIBBON_NAV: { isActive: true } },
    brandSettings: { HIGHLIGHTED_SPORTS_RIBBON: true },
  },
  betslip: {},
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getBetslipExchangeContext.mockReturnValue(null);
    getSportsbookPlacedCombinations.mockReturnValue(null);
    getSportsbookSimpleSelectionsCounter.mockReturnValue(0);
  });

  describe("mapStateToProps", () => {
    describe("card group", () => {
      it("should call getCardGroupByURN with params", () => {
        const mapStateToProps = makeMapStateToProps();
        mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

        expect(getGamingCardGroupByURN).toHaveBeenCalledWith(
          {
            fakeGamingCardGroupUrn: {
              urn: "fakeGamingCardGroupUrn",
            },
          },
          "fakeGamingCardGroupUrn",
        );
      });

      it("should return cardGroups", () => {
        getGamingCardGroupByURN.mockReturnValue({
          defaultLayout: "fakeLayout",
          displayMode: "fakeDisplayMode",
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          urn: "fakeGamingCardGroupUrn",
          type: undefined,
          decoration: undefined,
          gameTileSize: undefined,
          viewAll: undefined,
          pinGamingRibbonNav: true,
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, {
          urn: "fakeGamingCardGroupUrn",
          segmentedCardGroupUrn: "segmentedCardGroupURN",
        });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          displayMode: "fakeDisplayMode",
          title: "fakeTitle",
          cardgroupURN: "fakeGamingCardGroupUrn",
          segmentedCardGroupUrn: "segmentedCardGroupURN",
          defaultLayout: "fakeLayout",
          type: undefined,
          decoration: undefined,
          gameTileSize: undefined,
          viewAll: undefined,
          pinGamingRibbonNav: true,
          isGameTileRefined: false,
          isGamesRibbonHighlighted: true,
          isBetslipContainerDisplayed: false,
          isXmallGameTile: false,
        });
      });

      it("should return cardGroups with decoration", () => {
        getGamingCardGroupByURN.mockReturnValue({
          defaultLayout: "fakeLayout",
          displayMode: "fakeDisplayMode",
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          urn: "fakeGamingCardGroupUrn",
          decoration: "BF Black",
          type: undefined,
          viewAll: undefined,
          gameTileSize: undefined,
          pinGamingRibbonNav: true,
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, {
          urn: "fakeGamingCardGroupUrn",
          segmentedCardGroupUrn: "segmentedCardGroupURN",
        });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          displayMode: "fakeDisplayMode",
          title: "fakeTitle",
          cardgroupURN: "fakeGamingCardGroupUrn",
          segmentedCardGroupUrn: "segmentedCardGroupURN",
          defaultLayout: "fakeLayout",
          decoration: "BF Black",
          type: undefined,
          viewAll: undefined,
          gameTileSize: undefined,
          pinGamingRibbonNav: true,
          isGameTileRefined: false,
          isGamesRibbonHighlighted: true,
          isBetslipContainerDisplayed: false,
          isXmallGameTile: false,
        });
      });

      it("should return cardGroups with gameTileSize", () => {
        getGamingCardGroupByURN.mockReturnValue({
          defaultLayout: "fakeLayout",
          displayMode: "fakeDisplayMode",
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          urn: "fakeGamingCardGroupUrn",
          gameTileSize: "Small",
          type: undefined,
          pinGamingRibbonNav: true,
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, {
          urn: "fakeGamingCardGroupUrn",
          segmentedCardGroupUrn: "segmentedCardGroupURN",
        });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          displayMode: "fakeDisplayMode",
          title: "fakeTitle",
          cardgroupURN: "fakeGamingCardGroupUrn",
          segmentedCardGroupUrn: "segmentedCardGroupURN",
          defaultLayout: "fakeLayout",
          decoration: undefined,
          gameTileSize: "Small",
          type: undefined,
          viewAll: undefined,
          pinGamingRibbonNav: true,
          isGameTileRefined: false,
          isGamesRibbonHighlighted: true,
          isBetslipContainerDisplayed: false,
          isXmallGameTile: false,
        });
      });

      it("should return the title when the isTitleHidden is set to false", () => {
        getGamingCardGroupByURN.mockReturnValue({
          defaultLayout: "fakeLayout",
          displayMode: "fakeDisplayMode",
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          urn: "fakeGamingCardGroupUrn",
          type: undefined,
          pinGamingRibbonNav: true,
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn", isTitleHidden: false });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          displayMode: "fakeDisplayMode",
          title: "fakeTitle",
          cardgroupURN: "fakeGamingCardGroupUrn",
          defaultLayout: "fakeLayout",
          segmentedCardGroupUrn: "",
          decoration: undefined,
          gameTileSize: undefined,
          viewAll: undefined,
          type: undefined,
          pinGamingRibbonNav: true,
          isGameTileRefined: false,
          isGamesRibbonHighlighted: true,
          isBetslipContainerDisplayed: false,
          isXmallGameTile: false,
        });
      });

      it("should return empty title when the isTitleHidden is set to true", () => {
        getGamingCardGroupByURN.mockReturnValue({
          defaultLayout: "fakeLayout",
          displayMode: "fakeDisplayMode",
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          urn: "fakeGamingCardGroupUrn",
          type: undefined,
          pinGamingRibbonNav: true,
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn", isTitleHidden: true });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          displayMode: "fakeDisplayMode",
          title: "",
          cardgroupURN: "fakeGamingCardGroupUrn",
          defaultLayout: "fakeLayout",
          segmentedCardGroupUrn: "",
          decoration: undefined,
          gameTileSize: undefined,
          viewAll: undefined,
          type: undefined,
          pinGamingRibbonNav: true,
          isGameTileRefined: false,
          isGamesRibbonHighlighted: true,
          isBetslipContainerDisplayed: false,
          isXmallGameTile: false,
        });
      });

      it("should return empty object when there are no cardGroups", () => {
        getGamingCardGroupByURN.mockReturnValue(null);

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

        expect(result).toEqual({});
      });
    });
  });

  describe("isBetslipContainerDisplayed", () => {
    beforeEach(() => {
      getGamingCardGroupByURN.mockReturnValue({
        defaultLayout: "fakeLayout",
        displayMode: "fakeDisplayMode",
        items: [{ urn: "urn:1" }],
        title: "fakeTitle",
        urn: "fakeGamingCardGroupUrn",
      });
    });

    it("should return true when betslip has exchange context", () => {
      getBetslipExchangeContext.mockReturnValue({ someContext: true });
      getSportsbookPlacedCombinations.mockReturnValue(null);
      getSportsbookSimpleSelectionsCounter.mockReturnValue(0);

      const mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

      expect(result.isBetslipContainerDisplayed).toBe(true);
    });

    it("should return true when there are placed combinations", () => {
      getBetslipExchangeContext.mockReturnValue(null);
      getSportsbookPlacedCombinations.mockReturnValue([{ id: 1 }]);
      getSportsbookSimpleSelectionsCounter.mockReturnValue(0);

      const mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

      expect(result.isBetslipContainerDisplayed).toBe(true);
    });

    it("should return true when there are sportsbook selections", () => {
      getBetslipExchangeContext.mockReturnValue(null);
      getSportsbookPlacedCombinations.mockReturnValue(null);
      getSportsbookSimpleSelectionsCounter.mockReturnValue(3);

      const mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

      expect(result.isBetslipContainerDisplayed).toBe(true);
    });

    it("should return false when betslip has no selections, combinations, or exchange context", () => {
      getBetslipExchangeContext.mockReturnValue(null);
      getSportsbookPlacedCombinations.mockReturnValue(null);
      getSportsbookSimpleSelectionsCounter.mockReturnValue(0);

      const mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

      expect(result.isBetslipContainerDisplayed).toBe(false);
    });

    it("should return true when multiple conditions are met", () => {
      getBetslipExchangeContext.mockReturnValue({ someContext: true });
      getSportsbookPlacedCombinations.mockReturnValue([{ id: 1 }]);
      getSportsbookSimpleSelectionsCounter.mockReturnValue(2);

      const mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

      expect(result.isBetslipContainerDisplayed).toBe(true);
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchFetchCards", () => {
      it("should dispatch fetch cards action", () => {
        const { dispatchFetchCards } = mapDispatchToProps;

        expect(dispatchFetchCards("URN", [])).toEqual({
          type: FETCH_CARDS_FROM_LIST,
          payload: {
            partials: [],
            urn: "URN",
          },
        });
      });
    });

    describe("dispatchPushAction", () => {
      it("should dispatch push action", () => {
        const { dispatchPushAction } = mapDispatchToProps;

        expect(dispatchPushAction({})).toEqual({
          type: PUSH,
          payload: {},
        });
      });
    });

    describe("dispatchViewAllTap", () => {
      it("should dispatch ViewAll tap action", () => {
        const { dispatchViewAllTap } = mapDispatchToProps;
        expect(dispatchViewAllTap("title", {}, "URN")).toEqual({
          type: UI__CARDGROUP_VIEW_ALL_LINK_TAP,
          payload: {
            cardgroupURN: "URN",
            title: "title",
            viewAllLink: {},
          },
        });
      });
    });

    describe("dispatchLoadedPageContent", () => {
      it("should dispatch LoadedPageContent", () => {
        const { dispatchLoadedContent } = mapDispatchToProps;
        expect(dispatchLoadedContent("URN", "title")).toEqual({
          type: UI__PAGE_CONTENT_LOADED,
          payload: {
            urn: "URN",
            title: "title",
          },
        });
      });
    });
  });
});
