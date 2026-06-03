import { OddsDisplayFormat } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { NETWORK__FREEZE_BET } from "@ppb/tbd-store/actions/bet-mutation";
import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";
import { FreezeCardStates } from "../../Card/snowflakes/FreezeCard/shared";
import { i18n } from "../../../helpers/i18n";

const getSportsbookBetByURN = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useMemo: jest.fn((fn) => fn()),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-bets/sportsbook-bets-selectors", () => ({
  createSportsbookBetSelector: jest.fn(() => getSportsbookBetByURN),
}));

const getSportsbookBetLegsByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors", () => ({
  createSportsbookBetLegsSelector: jest.fn(() => getSportsbookBetLegsByURN),
}));

const getUserPreferencesWithProductSwitcher = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getUserPreferencesWithProductSwitcher),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => ({ key, interpolationValues })),
}));

const DEFAULT_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:8033": {
          urn: "ppb:tbd:card:sbkBet:8033",
          betURN: "ppb:sbkBet:8033",
          type: "SPORTSBOOK_BET_CARD",
        },
      },
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:8033": {
        urn: "ppb:sbkBet:8033",
        typename: "SportsbookBet",
        betId: "8033",
        betReceiptId: "O/0783073/0000048",
        isSettled: false,
        betType: "SINGLE",
        isEachWay: false,
        isSGM: false,
        isSGMMulti: false,
        has90MinBet: false,
        currentSize: 0.05,
        isOddsBoosted: false,
        profitAndLoss: 9.82,
        betPrice: {
          decimal: 196.42,
          fractional: {
            numerator: 9771,
            denominator: 50,
            __typename: "FractionalOdds",
          },
        },
        numLines: 1,
        currentSizePerLine: 0.05,
        legs: ["ppb:sbkBetLeg:8033/0"],
        cashoutQuoteURN: "ppb:sbkCashoutQuote:8033",
        bonus: 0,
        product: "SPORTSBOOK",
        edges: [],
        lowestEventStartTime: "2025-01-28T12:00:00.000Z",
        mutations: {
          eligibility: [
            {
              mutation: "AccaFreeze",
              __typename: "BetMutationEligibility",
            },
          ],
          __typename: "BetMutation",
        },
        resultType: "POTENTIAL",
      },
    },
  },
  entities: {
    preferences: {},
    throttles: {},
    footballfixtures: {
      "ppb:fixture:34624705": {
        urn: "ppb:fixture:34624705",
        typename: "FootballFixture",
        home: {
          name: "Ajax Amsterdam",
        },
        away: {
          name: "Maccabi Tel Aviv FC",
        },
        scheduledAt: "2024-11-07T20:00:00.000Z",
        isAmericanFormat: false,
        runnerNames: {
          home: "Ajax",
          away: "Maccabi Tel Aviv",
          __typename: "FixtureRunnerNames",
        },
        score: {
          home: 5,
          away: 0,
        },
        fixtureStatus: "UNKNOWN",
        incidents: [],
        stats: [
          {
            __typename: "FootballStats",
            periodStatus: "FULL",
            home: {
              __typename: "FootballGameStats",
              corners: 4,
              yellowCards: 3,
              redCards: 0,
              totalCards: 3,
              offsides: 0,
              fouls: 0,
              throwIns: 11,
              freeKicks: 16,
              goalKicks: 2,
              blockedShots: 4,
              shotsOnTarget: 9,
              shotsOffTarget: 8,
              totalShots: 17,
              goals: 5,
            },
            away: {
              __typename: "FootballGameStats",
              corners: 2,
              yellowCards: 3,
              redCards: 0,
              totalCards: 3,
              offsides: 0,
              fouls: 0,
              throwIns: 15,
              freeKicks: 25,
              goalKicks: 6,
              blockedShots: 4,
              shotsOnTarget: 3,
              shotsOffTarget: 6,
              totalShots: 9,
              goals: 0,
            },
            both: {
              __typename: "FootballGameStats",
              corners: 6,
              yellowCards: 6,
              redCards: 0,
              totalCards: 6,
              offsides: 0,
              fouls: 0,
              throwIns: 26,
              freeKicks: 41,
              goalKicks: 8,
              blockedShots: 8,
              attacks: 0,
              shotsOnTarget: 12,
              shotsOffTarget: 14,
              totalShots: 26,
              goals: 5,
            },
          },
          {
            __typename: "FootballStats",
            periodStatus: "INPLAY_FIRST_HALF",
            period: "EXTRA",
          },
          {
            __typename: "FootballStats",
            periodStatus: "INPLAY_SECOND_HALF",
            period: "EXTRA",
          },
          {
            __typename: "FootballStats",
            periodStatus: "FULL",
            period: "REGULAR",
            home: {
              __typename: "FootballGameStats",
              corners: 4,
              yellowCards: 3,
              redCards: 0,
              totalCards: 3,
              offsides: 0,
              fouls: 0,
              throwIns: 11,
              freeKicks: 16,
              goalKicks: 2,
              blockedShots: 4,
              shotsOnTarget: 9,
              shotsOffTarget: 8,
              totalShots: 17,
              goals: 5,
            },
            away: {
              __typename: "FootballGameStats",
              corners: 2,
              yellowCards: 3,
              redCards: 0,
              totalCards: 3,
              offsides: 0,
              fouls: 0,
              throwIns: 15,
              freeKicks: 25,
              goalKicks: 6,
              blockedShots: 4,
              shotsOnTarget: 3,
              shotsOffTarget: 6,
              totalShots: 9,
              goals: 0,
            },
            both: {
              __typename: "FootballGameStats",
              corners: 6,
              yellowCards: 6,
              redCards: 0,
              totalCards: 6,
              offsides: 0,
              fouls: 0,
              throwIns: 26,
              freeKicks: 41,
              goalKicks: 8,
              blockedShots: 8,
              attacks: 0,
              shotsOnTarget: 12,
              shotsOffTarget: 14,
              totalShots: 26,
              goals: 5,
            },
          },
          {
            __typename: "FootballStats",
            periodStatus: "INPLAY_FIRST_HALF",
            period: "REGULAR",
            home: {
              __typename: "FootballGameStats",
              corners: 2,
              yellowCards: 1,
              redCards: 0,
              totalCards: 1,
              offsides: 0,
              fouls: 0,
              throwIns: 6,
              freeKicks: 8,
              goalKicks: 2,
              blockedShots: 2,
              shotsOnTarget: 6,
              shotsOffTarget: 5,
              totalShots: 11,
              goals: 3,
            },
            away: {
              __typename: "FootballGameStats",
              corners: 2,
              yellowCards: 1,
              redCards: 0,
              totalCards: 1,
              offsides: 0,
              fouls: 0,
              throwIns: 4,
              freeKicks: 10,
              goalKicks: 3,
              blockedShots: 3,
              shotsOnTarget: 0,
              shotsOffTarget: 5,
              totalShots: 5,
              goals: 0,
            },
            both: {
              __typename: "FootballGameStats",
              corners: 4,
              yellowCards: 2,
              redCards: 0,
              totalCards: 2,
              offsides: 0,
              fouls: 0,
              throwIns: 10,
              freeKicks: 18,
              goalKicks: 5,
              blockedShots: 5,
              attacks: 0,
              shotsOnTarget: 6,
              shotsOffTarget: 10,
              totalShots: 16,
              goals: 3,
            },
          },
          {
            __typename: "FootballStats",
            periodStatus: "INPLAY_SECOND_HALF",
            period: "REGULAR",
            home: {
              __typename: "FootballGameStats",
              corners: 2,
              yellowCards: 2,
              redCards: 0,
              totalCards: 2,
              offsides: 0,
              fouls: 0,
              throwIns: 5,
              freeKicks: 8,
              goalKicks: 0,
              blockedShots: 2,
              shotsOnTarget: 3,
              shotsOffTarget: 3,
              totalShots: 6,
              goals: 2,
            },
            away: {
              __typename: "FootballGameStats",
              corners: 0,
              yellowCards: 2,
              redCards: 0,
              totalCards: 2,
              offsides: 0,
              fouls: 0,
              throwIns: 11,
              freeKicks: 15,
              goalKicks: 3,
              blockedShots: 1,
              shotsOnTarget: 3,
              shotsOffTarget: 1,
              totalShots: 4,
              goals: 0,
            },
            both: {
              __typename: "FootballGameStats",
              corners: 2,
              yellowCards: 4,
              redCards: 0,
              totalCards: 4,
              offsides: 0,
              fouls: 0,
              throwIns: 16,
              freeKicks: 23,
              goalKicks: 3,
              blockedShots: 3,
              attacks: 0,
              shotsOnTarget: 6,
              shotsOffTarget: 4,
              totalShots: 10,
              goals: 2,
            },
          },
        ],
      },
    },
    sportsbookbetlegs: {
      "ppb:sbkBetLeg:8033/0": {
        urn: "ppb:sbkBetLeg:8033/0",
        typename: "BetLeg",
        type: "SIMPLE_SELECTION",
        legNumber: 1,
        mutations: {
          eligibility: [
            {
              mutation: "AccaFreeze",
              mutationAvailability: "Available",
              details: null,
              __typename: "BetLegMutationEligibility",
            },
          ],
          details: [],
          __typename: "BetLegMutation",
        },
        parts: [
          {
            marketBetUrn: "ppb:marketBet:930.183642598",
            marketId: "930.183642598",
            sportId: "1",
            eventUrn: "ppb:event:34624705",
            eventDescription: "Ajax v Maccabi Tel Aviv",
            eventMarketDescription: "Match Odds",
            marketType: "MATCH_ODDS",
            selectionId: 2685,
            selectionName: "Ajax",
            price: {
              decimal: 2.88,
              fractional: {
                numerator: 15,
                denominator: 8,
                __typename: "FractionalOdds",
              },
            },
            originalPrice: {
              decimal: 2.88,
              fractional: {
                numerator: 15,
                denominator: 8,
                __typename: "FractionalOdds",
              },
            },
            priceType: "LIVE",
            rule4Deductions: 0,
            deadHeatWinDeductions: 0,
            deadHeatEachwayDeductions: 0,
          },
        ],
        resultType: "POTENTIAL",
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should return betLegs and betId", () => {
    getSportsbookBetByURN.mockReturnValueOnce(DEFAULT_STATE.betting.sportsbookbets["ppb:sbkBet:8033"]);
    getSportsbookBetLegsByURN.mockReturnValueOnce(Object.values(DEFAULT_STATE.entities.sportsbookbetlegs));
    getUserPreferencesWithProductSwitcher.mockReturnValueOnce({ sportsbookOddsDisplay: OddsDisplayFormat.Fractional });
    const { betLegFreezeInfos, betId } = makeMapStateToProps()(DEFAULT_STATE, { urn: "ppb:tbd:card:sbkBet:8033" });

    expect(betLegFreezeInfos.length).toEqual(DEFAULT_STATE.betting.sportsbookbets["ppb:sbkBet:8033"].legs.length);
    expect(betId).toEqual("8033");
  });

  it("should return freezeCardState Active when mutation state Available", () => {
    getSportsbookBetByURN.mockReturnValueOnce(DEFAULT_STATE.betting.sportsbookbets["ppb:sbkBet:8033"]);
    getSportsbookBetLegsByURN.mockReturnValueOnce(Object.values(DEFAULT_STATE.entities.sportsbookbetlegs));
    getUserPreferencesWithProductSwitcher.mockReturnValueOnce({ sportsbookOddsDisplay: OddsDisplayFormat.Fractional });
    const { betLegFreezeInfos } = makeMapStateToProps()(DEFAULT_STATE, { urn: "ppb:tbd:card:sbkBet:8033" });

    expect(betLegFreezeInfos[0].freezeEligibility).toEqual(FreezeCardStates.ACTIVE);
  });

  it("should return freezeCardState Suspended when mutation state Suspended", () => {
    DEFAULT_STATE.entities.sportsbookbetlegs["ppb:sbkBetLeg:8033/0"].mutations.eligibility[0].mutationAvailability =
      "Suspended";
    getSportsbookBetByURN.mockReturnValueOnce(DEFAULT_STATE.betting.sportsbookbets["ppb:sbkBet:8033"]);
    getSportsbookBetLegsByURN.mockReturnValueOnce(Object.values(DEFAULT_STATE.entities.sportsbookbetlegs));
    getUserPreferencesWithProductSwitcher.mockReturnValueOnce({ sportsbookOddsDisplay: OddsDisplayFormat.Fractional });
    const { betLegFreezeInfos } = makeMapStateToProps()(DEFAULT_STATE, { urn: "ppb:tbd:card:sbkBet:8033" });

    expect(betLegFreezeInfos[0].freezeEligibility).toEqual(FreezeCardStates.SUSPENDED);
  });

  it("should return freezeCardState Ineligible when mutation state Unavailable", () => {
    DEFAULT_STATE.entities.sportsbookbetlegs["ppb:sbkBetLeg:8033/0"].mutations.eligibility[0].mutationAvailability =
      "Unavailable";
    getSportsbookBetByURN.mockReturnValueOnce(DEFAULT_STATE.betting.sportsbookbets["ppb:sbkBet:8033"]);
    getSportsbookBetLegsByURN.mockReturnValueOnce(Object.values(DEFAULT_STATE.entities.sportsbookbetlegs));
    getUserPreferencesWithProductSwitcher.mockReturnValueOnce({ sportsbookOddsDisplay: OddsDisplayFormat.Fractional });
    const { betLegFreezeInfos } = makeMapStateToProps()(DEFAULT_STATE, { urn: "ppb:tbd:card:sbkBet:8033" });

    expect(betLegFreezeInfos[0].freezeEligibility).toEqual(FreezeCardStates.INELIGIBLE);
  });

  it("should return  'Freeze SelectionName' freezeCardText when active", () => {
    DEFAULT_STATE.entities.sportsbookbetlegs["ppb:sbkBetLeg:8033/0"].mutations.eligibility[0].mutationAvailability =
      "Available";
    getSportsbookBetByURN.mockReturnValueOnce(DEFAULT_STATE.betting.sportsbookbets["ppb:sbkBet:8033"]);
    getSportsbookBetLegsByURN.mockReturnValueOnce(Object.values(DEFAULT_STATE.entities.sportsbookbetlegs));
    getUserPreferencesWithProductSwitcher.mockReturnValueOnce({ sportsbookOddsDisplay: OddsDisplayFormat.Fractional });
    const { betLegFreezeInfos } = makeMapStateToProps()(DEFAULT_STATE, { urn: "ppb:tbd:card:sbkBet:8033" });

    expect(i18n).toHaveBeenCalledWith({
      key: "I18N.FREEZE_SELECTION.BOTTOM_SHEET.FREEZE_LABEL",
      interpolationValues: { selection: "Ajax" },
    });
    expect(betLegFreezeInfos[0].freezeCardText).toEqual({
      interpolationValues: { selection: "Ajax" },
      key: "I18N.FREEZE_SELECTION.BOTTOM_SHEET.FREEZE_LABEL",
    });
  });

  it("should return 'Ajax' freezeCardText when not active", () => {
    DEFAULT_STATE.entities.sportsbookbetlegs["ppb:sbkBetLeg:8033/0"].mutations.eligibility[0].mutationAvailability =
      "Suspended";
    getSportsbookBetByURN.mockReturnValueOnce(DEFAULT_STATE.betting.sportsbookbets["ppb:sbkBet:8033"]);
    getSportsbookBetLegsByURN.mockReturnValueOnce(Object.values(DEFAULT_STATE.entities.sportsbookbetlegs));
    getUserPreferencesWithProductSwitcher.mockReturnValueOnce({ sportsbookOddsDisplay: OddsDisplayFormat.Fractional });
    const { betLegFreezeInfos } = makeMapStateToProps()(DEFAULT_STATE, {
      urn: "ppb:tbd:card:sbkBet:8033",
    });

    expect(i18n).toHaveBeenCalledTimes(0);
    expect(betLegFreezeInfos[0].freezeCardText).toEqual("Ajax");
  });

  it("should call getSportsbookBetByURN with correct urn", () => {
    getSportsbookBetByURN.mockReturnValueOnce(DEFAULT_STATE.betting.sportsbookbets["ppb:sbkBet:8033"]);
    getSportsbookBetLegsByURN.mockReturnValueOnce(Object.values(DEFAULT_STATE.entities.sportsbookbetlegs));
    getUserPreferencesWithProductSwitcher.mockReturnValueOnce({ sportsbookOddsDisplay: OddsDisplayFormat.Fractional });
    makeMapStateToProps()(DEFAULT_STATE, {
      urn: "ppb:tbd:card:sbkBet:8033",
    });

    expect(getSportsbookBetByURN).toHaveBeenCalledWith(
      DEFAULT_STATE.betting.sportsbookbets,
      "ppb:tbd:card:sbkBet:8033",
    );
  });

  it("should call getUserPreferencesWithProductSwitcher", () => {
    getSportsbookBetByURN.mockReturnValueOnce(DEFAULT_STATE.betting.sportsbookbets["ppb:sbkBet:8033"]);
    getSportsbookBetLegsByURN.mockReturnValueOnce(Object.values(DEFAULT_STATE.entities.sportsbookbetlegs));
    getUserPreferencesWithProductSwitcher.mockReturnValueOnce({ sportsbookOddsDisplay: OddsDisplayFormat.Fractional });
    makeMapStateToProps()(DEFAULT_STATE, {
      urn: "ppb:tbd:card:sbkBet:8033",
    });

    expect(getUserPreferencesWithProductSwitcher).toHaveBeenCalledWith({});
  });
});

describe("makeMapDispatchToProps", () => {
  function setupMakeMapDispatchToProps({ dispatch = jest.fn() } = {}) {
    return makeMapDispatchToProps(dispatch);
  }

  describe("dispatchOnFreezeLeg", () => {
    it("should dispatch NETWORK__FREEZE_LEG", () => {
      const dispatch = jest.fn();
      const { dispatchOnFreezeLeg } = setupMakeMapDispatchToProps({ dispatch });

      dispatchOnFreezeLeg("1", {
        legNumber: 1,
        parts: [
          {
            eventDescription: "Team A vs Team B",
          },
        ],
        mutations: {
          eligibility: [
            {
              mutation: "AccaFreeze",
              details: {
                gameDetails: {
                  homeTeamScore: 2,
                  awayTeamScore: 1,
                  minute: 45,
                },
              },
            },
          ],
        },
      });

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        type: NETWORK__FREEZE_BET,
        payload: {
          betId: "1",
          legRef: 1,
          eventName: "Team A vs Team B",
          matchScore: "2 - 1",
          timeFrozen: "45",
        },
      });
    });
  });
});
