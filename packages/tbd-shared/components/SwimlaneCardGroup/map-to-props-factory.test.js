import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { UI__CARDGROUP_VIEW_ALL_LINK_TAP } from "@ppb/tbd-store/actions/navigation";
import { getBetslipExchangeContext } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { BETTING__REMOVE_POTENTIAL_BET_ACTION } from "@ppb/tbd-store/actions/betting";
import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { ViewItemTheme } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

const swimlaneIndexedCardGroupMock = {
  title: "meeting name",
  typename: "SwimlaneIndexedCardGroup",
  displayMode: "SCROLLABLE",
  hint: 2,
  items: [
    { urn: "urn1", typename: "RaceByTimeRangeCard" },
    { urn: "urn2", typename: "RaceByTimeRangeCard" },
    { urn: "urn3", typename: "RaceByTimeRangeCard" },
    { urn: "urn4", typename: "RaceByTimeRangeCard" },
    { urn: "urn5", typename: "RaceByTimeRangeCard" },
  ],
};

const getSwimlaneCardGroupByURN = jest.fn();
const getSwimlaneIndexedCardGroupByURN = jest.fn();

const stateMock = {
  layouts: {
    cardgroups: {
      swimlanecardgroups: {
        fakeGamingCardGroupUrn: {
          urn: "fakeGamingCardGroupUrn",
        },
      },
    },
  },
  modules: {
    excBetting: false,
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createCardGroupByURNSelector
      .mockImplementationOnce(() => getSwimlaneCardGroupByURN)
      .mockImplementationOnce(() => getSwimlaneIndexedCardGroupByURN);
  });

  describe("mapStateToProps", () => {
    describe("when provided a swimlane card group URN", () => {
      it("should call getSwimlaneCardGroupByURN with params", () => {
        const mapStateToProps = makeMapStateToProps();
        mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

        expect(getSwimlaneCardGroupByURN).toHaveBeenCalledWith(
          {
            fakeGamingCardGroupUrn: {
              urn: "fakeGamingCardGroupUrn",
            },
          },
          "fakeGamingCardGroupUrn",
        );
      });

      it("should return swimlaneCardGroups", () => {
        getSwimlaneCardGroupByURN.mockReturnValue({
          displayMode: "fakeDisplayMode",
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          titleImage: "ODDSBOOST",
          type: "fakeType",
          urn: "fakeGamingCardGroupUrn",
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
          titleImage: "ODDSBOOST",
          cardgroupURN: "fakeGamingCardGroupUrn",
          segmentedCardGroupUrn: "segmentedCardGroupURN",
          isHighlighted: false,
        });
      });

      it("should return the title when the isTitleHidden is set to false", () => {
        getSwimlaneCardGroupByURN.mockReturnValue({
          displayMode: "fakeDisplayMode",
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          type: "fakeType",
          urn: "fakeGamingCardGroupUrn",
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn", isTitleHidden: false });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          displayMode: "fakeDisplayMode",
          title: "fakeTitle",
          cardgroupURN: "fakeGamingCardGroupUrn",
          segmentedCardGroupUrn: "",
          isHighlighted: false,
        });
      });

      it("should return empty title when the isTitleHidden is set to true", () => {
        getSwimlaneCardGroupByURN.mockReturnValue({
          displayMode: "fakeDisplayMode",
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          type: "fakeType",
          urn: "fakeGamingCardGroupUrn",
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn", isTitleHidden: true });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          displayMode: "fakeDisplayMode",
          title: "",
          cardgroupURN: "fakeGamingCardGroupUrn",
          segmentedCardGroupUrn: "",
          isHighlighted: false,
        });
      });

      it("should return empty object when there are no swimlaneCardGroups", () => {
        getSwimlaneCardGroupByURN.mockReturnValue(null);
        getSwimlaneIndexedCardGroupByURN.mockReturnValue(null);

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

        expect(result).toEqual({});
      });
    });

    describe("when provided a swimlane indexerd card group URN", () => {
      it("should call getSwimlaneIndexedCardGroupByURN with params", () => {
        const mapStateToProps = makeMapStateToProps();
        mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

        expect(getSwimlaneCardGroupByURN).toHaveBeenCalledWith(
          {
            fakeGamingCardGroupUrn: {
              urn: "fakeGamingCardGroupUrn",
            },
          },
          "fakeGamingCardGroupUrn",
        );
      });

      it("should return swimlaneIndexedCardgroup", () => {
        getSwimlaneCardGroupByURN.mockReturnValue(undefined);
        getSwimlaneIndexedCardGroupByURN.mockReturnValue(swimlaneIndexedCardGroupMock);

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, {
          urn: "fakeGamingCardGroupUrn",
          segmentedCardGroupUrn: "segmentedCardGroupURN",
        });

        expect(result).toEqual({
          cardgroupURN: "fakeGamingCardGroupUrn",
          title: "meeting name",
          displayMode: "SCROLLABLE",
          scrollIntoIndex: 2,
          items: [
            { urn: "urn1", typename: "RaceByTimeRangeCard" },
            { urn: "urn2", typename: "RaceByTimeRangeCard" },
            { urn: "urn3", typename: "RaceByTimeRangeCard" },
            { urn: "urn4", typename: "RaceByTimeRangeCard" },
            { urn: "urn5", typename: "RaceByTimeRangeCard" },
          ],
          segmentedCardGroupUrn: "segmentedCardGroupURN",
          isHighlighted: false,
        });
      });
    });

    describe("when excBetting module is available", () => {
      it("should return the current exchange context", () => {
        getBetslipExchangeContext.mockReturnValue({ runner: "runner:urn", side: ExchangeSide.BACK });

        const mapStateToProps = makeMapStateToProps();

        const mappedState = mapStateToProps(
          { ...stateMock, modules: { excBetting: true } },
          { urn: "fakeGamingCardGroupUrn" },
        );

        expect(mappedState).toEqual(
          expect.objectContaining({ currentRunner: "runner:urn", currentSide: ExchangeSide.BACK }),
        );
      });
    });

    describe("when excBetting module is unavailable", () => {
      it("should not return the current exchange context", () => {
        getBetslipExchangeContext.mockReturnValue({ runner: "runner:urn", side: ExchangeSide.BACK });

        const mapStateToProps = makeMapStateToProps();

        const mappedState = mapStateToProps(
          { ...stateMock, modules: { excBetting: false } },
          { urn: "fakeGamingCardGroupUrn" },
        );

        expect(mappedState).toEqual(expect.objectContaining({ currentRunner: undefined, currentSide: undefined }));
      });
    });

    describe("when theme is highlighted", () => {
      it("should return isHighlighted as true", () => {
        const mapStateToProps = makeMapStateToProps();

        const mappedState = mapStateToProps(
          { ...stateMock, modules: { excBetting: false } },
          { urn: "fakeGamingCardGroupUrn", theme: ViewItemTheme.Highlighted },
        );

        expect(mappedState.isHighlighted).toBe(true);
      });
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

    describe("clearBetting", () => {
      it("should dispatch remove potential bet action", () => {
        const { dispatchClearBetting } = mapDispatchToProps;

        expect(dispatchClearBetting("URN", ExchangeSide.BACK)).toEqual({
          type: BETTING__REMOVE_POTENTIAL_BET_ACTION,
          payload: {
            runner: "URN",
            side: ExchangeSide.BACK,
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
  });
});
