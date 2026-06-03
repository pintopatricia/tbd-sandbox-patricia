import { PUSH } from "@ppb/tbd-store/actions/router";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createHasEventMarketCardByCompetitionURNSelector } from "@ppb/tbd-store/state/layout/cards/event-market/event-market-cards-selectors";
import { i18n } from "../../helpers/i18n";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getCouponHeaderCardMock = jest.fn();
const hasEventMarketCardByCompetitionURNMock = jest.fn();
const competitionSelectorByURNMock = jest.fn();

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getCouponHeaderCardMock),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/event-market/event-market-cards-selectors", () => ({
  createHasEventMarketCardByCompetitionURNSelector: jest.fn(() => hasEventMarketCardByCompetitionURNMock),
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  createCompetitionSelector: jest.fn(() => competitionSelectorByURNMock),
}));

const competitionViewLink = {
  viewUrl: "/football/thai-league-cup/c-1",
  viewUrn: "tbd:competition:1",
};
const stateMock = {
  entities: {
    competitions: {
      "ppb:tbd:competition:1": {
        urn: "ppb:tbd:competition:1",
        name: "Thai League Cup",
      },
    },
  },
  layouts: {
    cards: {
      couponheaders: {
        "ppb:tbd:card:couponheader:mockedCouponHeader": {
          urn: "ppb:tbd:card:couponheader:mockedCouponHeader",
          competition: "ppb:tbd:competition:1",
          competitionViewLink,
        },
      },
      eventmarkets: {
        "ppb:tbd:card:eventmarket:mock1": {
          urn: "ppb:tbd:card:eventmarket:mock1",
        },
      },
    },
  },
};
const urnMock = "ppb:tbd:card:couponheader:mockedCouponHeader";

const setupMapStateToProps = ({ state = stateMock, urn = urnMock, product } = {}) =>
  makeMapStateToProps()(state, { urn, product });

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create the selectors", () => {
    setupMapStateToProps();

    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
    expect(createCardByURNSelector).toHaveBeenCalledWith();
    expect(createHasEventMarketCardByCompetitionURNSelector).toHaveBeenCalledTimes(1);
    expect(createHasEventMarketCardByCompetitionURNSelector).toHaveBeenCalledWith();
    expect(createCompetitionSelector).toHaveBeenCalledTimes(1);
    expect(createCompetitionSelector).toHaveBeenCalledWith();
  });

  it("should return the mapStateToProps function", () => {
    const mapStateToProps = makeMapStateToProps();

    expect(mapStateToProps).toEqual(expect.any(Function));
  });

  describe("mapStateToProps", () => {
    it("should get the coupon header card by URN", () => {
      setupMapStateToProps();

      expect(getCouponHeaderCardMock).toHaveBeenCalledTimes(1);
      expect(getCouponHeaderCardMock).toHaveBeenCalledWith(stateMock.layouts.cards.couponheaders, urnMock);
    });

    describe("when coupon header card is undefined", () => {
      it("should return empty object", () => {
        getCouponHeaderCardMock.mockReturnValueOnce(undefined);

        expect(setupMapStateToProps()).toEqual({});
      });
    });

    describe("when coupon header card is defined", () => {
      it("should call has event market cards by competition URN selector", () => {
        getCouponHeaderCardMock.mockReturnValueOnce({
          columns: ["1", "X", "2"],
          competition: "ppb:tbd:myCompetition",
        });

        setupMapStateToProps({ product: "MyProduct" });

        expect(hasEventMarketCardByCompetitionURNMock).toHaveBeenCalledTimes(1);
        expect(hasEventMarketCardByCompetitionURNMock).toHaveBeenCalledWith(
          stateMock.layouts.cards.eventmarkets,
          "ppb:tbd:myCompetition",
          "MyProduct",
        );
      });

      it("should call get competition by URN selector", () => {
        getCouponHeaderCardMock.mockReturnValueOnce({
          columns: ["1", "X", "2"],
          competition: "ppb:tbd:myCompetition",
        });

        setupMapStateToProps({ product: "MyProduct" });

        expect(competitionSelectorByURNMock).toHaveBeenCalledTimes(1);
        expect(competitionSelectorByURNMock).toHaveBeenCalledWith(
          stateMock.entities.competitions,
          "ppb:tbd:myCompetition",
        );
      });

      describe("when has an EventMarketCard for competition", () => {
        it("should return props correctly", () => {
          getCouponHeaderCardMock.mockReturnValueOnce({
            columns: ["1", "X", "2"],
          });
          competitionSelectorByURNMock.mockReturnValueOnce(stateMock.entities.competitions["ppb:tbd:competition:1"]);
          hasEventMarketCardByCompetitionURNMock.mockReturnValueOnce(true);

          expect(setupMapStateToProps()).toEqual({
            title: "Thai League Cup",
            columns: ["1", "X", "2"],
            showComponent: true,
          });
        });
      });

      describe("when doesn't have an EventMarketCard for competition", () => {
        it("should return props correctly", () => {
          getCouponHeaderCardMock.mockReturnValueOnce({
            columns: ["1", "X", "2"],
          });
          competitionSelectorByURNMock.mockReturnValueOnce(undefined);
          hasEventMarketCardByCompetitionURNMock.mockReturnValueOnce(false);

          expect(setupMapStateToProps()).toEqual({
            title: "",
            columns: ["1", "X", "2"],
            showComponent: false,
          });
        });
      });

      describe("when has a competitionViewLink", () => {
        it("should return props correctly", () => {
          getCouponHeaderCardMock.mockReturnValueOnce({ competitionViewLink, columns: [] });

          expect(setupMapStateToProps()).toEqual({
            columns: [],
            title: "",
            titleLink: competitionViewLink,
          });
        });
      });

      describe("when hasStats is true", () => {
        it("should use it to add a key and call i18n to translate", () => {
          getCouponHeaderCardMock.mockReturnValueOnce({
            competitionViewLink,
            columns: ["FIRST", "SECOND", "THIRD"],
            hasStats: true,
          });

          expect(setupMapStateToProps()).toEqual({
            columns: ["FIRST", "SECOND", "THIRD", "I18N.COUPON.STATS"],
            title: "",
            titleLink: competitionViewLink,
            hasStats: true,
          });

          expect(i18n).toHaveBeenCalledTimes(1);
          expect(i18n).toHaveBeenCalledWith({ key: "I18N.COUPON.STATS" });
        });
      });

      describe("columns memoization", () => {
        beforeEach(() => {
          getCouponHeaderCardMock.mockReset();
          hasEventMarketCardByCompetitionURNMock.mockReset();
          competitionSelectorByURNMock.mockReset();
        });

        it("should return the same columns reference across calls when inputs are unchanged (hasStats=true)", () => {
          getCouponHeaderCardMock.mockReturnValue({
            columns: ["FIRST", "SECOND"],
            hasStats: true,
          });

          const mapStateToProps = makeMapStateToProps();
          const first = mapStateToProps(stateMock, { urn: urnMock });
          const second = mapStateToProps(stateMock, { urn: urnMock });

          expect(second.columns).toBe(first.columns);
        });

        it("should return the same columns reference across calls when column contents match but ref changes (hasStats=true)", () => {
          getCouponHeaderCardMock
            .mockReturnValueOnce({ columns: ["FIRST", "SECOND"], hasStats: true })
            .mockReturnValueOnce({ columns: ["FIRST", "SECOND"], hasStats: true });

          const mapStateToProps = makeMapStateToProps();
          const first = mapStateToProps(stateMock, { urn: urnMock });
          const second = mapStateToProps(stateMock, { urn: urnMock });

          expect(second.columns).toBe(first.columns);
        });

        it("should pass through the source columns reference when hasStats is false", () => {
          const sourceColumns = ["FIRST", "SECOND"];
          getCouponHeaderCardMock.mockReturnValue({ columns: sourceColumns, hasStats: false });

          const { columns } = makeMapStateToProps()(stateMock, { urn: urnMock });

          expect(columns).toBe(sourceColumns);
        });

        it("should return a new columns reference when hasStats toggles", () => {
          getCouponHeaderCardMock
            .mockReturnValueOnce({ columns: ["FIRST", "SECOND"], hasStats: false })
            .mockReturnValueOnce({ columns: ["FIRST", "SECOND"], hasStats: true });

          const mapStateToProps = makeMapStateToProps();
          const first = mapStateToProps(stateMock, { urn: urnMock });
          const second = mapStateToProps(stateMock, { urn: urnMock });

          expect(second.columns).not.toBe(first.columns);
        });

        it("should return a new columns reference when columns content changes", () => {
          getCouponHeaderCardMock
            .mockReturnValueOnce({ columns: ["FIRST", "SECOND"], hasStats: true })
            .mockReturnValueOnce({ columns: ["FIRST", "SECOND", "THIRD"], hasStats: true });

          const mapStateToProps = makeMapStateToProps();
          const first = mapStateToProps(stateMock, { urn: urnMock });
          const second = mapStateToProps(stateMock, { urn: urnMock });

          expect(second.columns).not.toBe(first.columns);
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchRouterPushAction", () => {
      it("should dispatch the PUSH action", () => {
        const { dispatchRouterPushAction } = mapDispatchToProps;

        expect(dispatchRouterPushAction(competitionViewLink)).toEqual({
          type: PUSH,
          payload: competitionViewLink,
        });
      });
    });
  });
});
