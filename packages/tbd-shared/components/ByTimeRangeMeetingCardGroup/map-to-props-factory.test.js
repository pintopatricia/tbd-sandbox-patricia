import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { UI__CARDGROUP_VIEW_ALL_LINK_TAP } from "@ppb/tbd-store/actions/navigation";
import { BETTING__REMOVE_POTENTIAL_BET_ACTION } from "@ppb/tbd-store/actions/betting";
import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

const getByTimeRangeMeetingCardGroupByURN = jest.fn();
const mockFakeCardGroupUrn = "fakeCardGroupUrn";

const stateMock = {
  layouts: {
    cardgroups: {
      bytimerangemeetingcardgroup: {
        fakeCardGroupUrn: {
          urn: mockFakeCardGroupUrn,
        },
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    createCardGroupByURNSelector.mockImplementation(() => getByTimeRangeMeetingCardGroupByURN);
  });

  describe("mapStateToProps", () => {
    describe("when provided a by time range meeting card group URN", () => {
      it("should call getByTimeRangeMeetingCardGroupByURN with params", () => {
        const mapStateToProps = makeMapStateToProps();
        mapStateToProps(stateMock, { urn: mockFakeCardGroupUrn });

        expect(getByTimeRangeMeetingCardGroupByURN).toHaveBeenCalledWith(
          stateMock.layouts.cardgroups.bytimerangemeetingcardgroup,
          mockFakeCardGroupUrn,
        );
      });

      it("should return ByTimeRangeMeetingCardsGroup", () => {
        getByTimeRangeMeetingCardGroupByURN.mockReturnValue({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          type: "fakeType",
          urn: mockFakeCardGroupUrn,
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, {
          urn: mockFakeCardGroupUrn,
          isTitleHidden: false,
        });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          cardgroupURN: mockFakeCardGroupUrn,
          icon: undefined,
        });
      });

      it("should return empty title when the isTitleHidden is set to true", () => {
        getByTimeRangeMeetingCardGroupByURN.mockReturnValue({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          title: "fakeTitle",
          type: "fakeType",
          urn: mockFakeCardGroupUrn,
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, {
          urn: mockFakeCardGroupUrn,
          isTitleHidden: true,
        });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          cardgroupURN: mockFakeCardGroupUrn,
          icon: undefined,
          title: "",
        });
      });

      it("should return empty object when there are no ByTimeRangeMeetingCardsGroup", () => {
        getByTimeRangeMeetingCardGroupByURN.mockReturnValue(null);

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, { urn: mockFakeCardGroupUrn });

        expect(result).toEqual({});
      });

      it("should return translations key as title", () => {
        getByTimeRangeMeetingCardGroupByURN.mockReturnValue({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          type: "fakeType",
          urn: mockFakeCardGroupUrn,
          displayName: { translationKey: "translationKey" },
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, {
          urn: mockFakeCardGroupUrn,
          isTitleHidden: false,
        });

        expect(result).toEqual({
          items: [{ urn: "urn:1" }, { urn: "urn:2" }],
          cardgroupURN: mockFakeCardGroupUrn,
          icon: undefined,
          title: "translationKey",
        });
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

    describe("dispatchClearBetting", () => {
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
