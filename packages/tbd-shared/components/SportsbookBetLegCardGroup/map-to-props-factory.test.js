import {
  SUBSCRIBE_BET_RESULT,
  UNSUBSCRIBE_BET_RESULT,
  SUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY,
} from "@ppb/tbd-store/actions/my-bets";
import { codecs } from "@ppb/tbd-urn-codecs";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getSportsbookBetLegCardGroupByURN = jest.fn(() => undefined);
const getSportsbookBetByURN = jest.fn(() => undefined);

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(() => getSportsbookBetLegCardGroupByURN),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-bets/sportsbook-bets-selectors", () => ({
  createSportsbookBetSelector: jest.fn(() => getSportsbookBetByURN),
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  codecs: {
    stats: {
      cardGroup: {
        pebble: {
          isValid: jest.fn(() => true),
        },
      },
    },
    cardGroup: {
      sportsbookBetLeg: {
        decode: jest.fn(),
      },
    },
    sportsbookBet: {
      encode: jest.fn(),
    },
    parse: jest.fn(() => "urn"),
  },
}));

const DEFAULT_STATE = {
  layouts: {
    cardgroups: {
      sportsbookbetlegcardgroups: "sportsbookbetlegcardgroups",
    },
  },
  betting: {
    sportsbookbets: "sportsbookbets",
  },
};

function setup() {
  return makeMapStateToProps()(DEFAULT_STATE, { urn: "betLegCardGroupURN" });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("makeMapStateToProps", () => {
  describe("when getSportsbookBetLegCardGroupByURN doesn't return the bet leg card group", () => {
    it("should try to fetch the bet leg group", () => {
      setup();

      expect(getSportsbookBetLegCardGroupByURN).toHaveBeenCalledWith(
        DEFAULT_STATE.layouts.cardgroups.sportsbookbetlegcardgroups,
        "betLegCardGroupURN",
      );
    });

    it("should return an empty array of cards", () => {
      expect(setup()).toEqual({ cards: [], isMutationEligible: false, statsSupportingContentButtonsUrn: undefined });
    });
  });

  describe("when getSportsbookBetLegCardGroupByURN returns the bet leg card group", () => {
    const mockBetId = "foo/1";
    const mockBetURN = "bar";

    beforeEach(() => {
      getSportsbookBetLegCardGroupByURN.mockReturnValueOnce({
        items: [
          {
            typename: "FixtureCard",
            urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
          },
          {
            typename: "BetLegCard",
            urn: "ppb:tbd:card:sbkBetLeg:1175702671/0",
          },
        ],
      });
      getSportsbookBetByURN.mockReturnValue({
        isSettled: true,
      });
      codecs.cardGroup.sportsbookBetLeg.decode.mockReturnValueOnce(mockBetId);
      codecs.sportsbookBet.encode.mockReturnValueOnce({ uid: mockBetURN });
    });

    it("should return an array of partial cards, betURN and isSettled", () => {
      expect(setup()).toEqual({
        cards: [
          {
            typename: "FixtureCard",
            urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
          },
          {
            typename: "BetLegCard",
            urn: "ppb:tbd:card:sbkBetLeg:1175702671/0",
          },
        ],
        betURN: mockBetURN,
        isSettled: true,
        isMutationEligible: false,
        statsSupportingContentButtonsUrn: undefined,
      });
    });

    describe("when getSportsbookBetByURN returns a bet with eligible mutations", () => {
      it("should return isMutationEligible as true", () => {
        getSportsbookBetByURN.mockReturnValue({
          isSettled: true,
          mutations: {
            eligibility: ["AccaFreeze"],
          },
        });

        expect(setup()).toHaveProperty("isMutationEligible", true);
      });
    });
  });

  describe("when getSportsbookBetLegCardGroupByURN returns the stats pebble card group", () => {
    const mockBetId = "foo/1";
    const mockBetURN = "bar";
    const statsSupportingContentButtonsUrn = "ppb:tbd:stats:cardGroup:supportingcontentbuttons:1175702671|my-bets";

    beforeEach(() => {
      getSportsbookBetLegCardGroupByURN.mockReturnValueOnce({
        items: [
          {
            typename: "FixtureCard",
            urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
          },
          {
            typename: "BetLegCard",
            urn: "ppb:tbd:card:sbkBetLeg:1175702671/0",
          },
          {
            typename: "StatsSupportingContentButtonsCardGroup",
            urn: statsSupportingContentButtonsUrn,
          },
        ],
      });
      getSportsbookBetByURN.mockReturnValue({
        isSettled: true,
      });
      codecs.cardGroup.sportsbookBetLeg.decode.mockReturnValueOnce(mockBetId);
      codecs.sportsbookBet.encode.mockReturnValueOnce({ uid: mockBetURN });
    });

    it("should return an array of partial cards, betURN and isSettled", () => {
      expect(setup()).toEqual({
        cards: [
          {
            typename: "FixtureCard",
            urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
          },
          {
            typename: "BetLegCard",
            urn: "ppb:tbd:card:sbkBetLeg:1175702671/0",
          },
          {
            typename: "StatsSupportingContentButtonsCardGroup",
            urn: statsSupportingContentButtonsUrn,
          },
        ],
        betURN: mockBetURN,
        isSettled: true,
        isMutationEligible: false,
        statsSupportingContentButtonsUrn,
      });
    });

    describe("when getSportsbookBetByURN returns a bet with eligible mutations", () => {
      it("should return isMutationEligible as true", () => {
        getSportsbookBetByURN.mockReturnValue({
          isSettled: true,
          mutations: {
            eligibility: ["AccaFreeze"],
          },
        });

        expect(setup()).toHaveProperty("isMutationEligible", true);
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  const {
    dispatchSubscribeBlhResult,
    dispatchUnsubscribeBlhResult,
    dispatchSubscribeBmeResult,
    dispatchUnsubscribeBmeResult,
  } = mapDispatchToProps;

  describe.each([
    ["dispatchSubscribeBlhResult", dispatchSubscribeBlhResult, SUBSCRIBE_BET_RESULT],
    ["dispatchUnsubscribeBlhResult", dispatchUnsubscribeBlhResult, UNSUBSCRIBE_BET_RESULT],
    ["dispatchSubscribeBmeResult", dispatchSubscribeBmeResult, SUBSCRIBE_BET_MUTATION_ELIGIBILITY],
    ["dispatchUnsubscribeBmeResult", dispatchUnsubscribeBmeResult, UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY],
  ])("%s", (_, actionFn, type) => {
    it(`should dispatch a ${type} when it's called`, () => {
      expect(actionFn("mockSbkBetURN")).toEqual({
        type,
        payload: {
          urn: "mockSbkBetURN",
        },
      });
    });
  });
});
