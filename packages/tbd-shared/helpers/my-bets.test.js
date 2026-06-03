import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { BetEdgeEnum } from "@ppb/tbd-store/state/betting/sportsbook-bets/SportsbookBet.types";
import { LegType, Result, BetType } from "@ppb/tbd-store/state/constants";
import { ResultType } from "@ppb/tbd-store/clients/blh/bet-live-hypotheticals-response-types";
import { SportsbookRunnerPriceType } from "@ppb/tbd-store/state/entities/sportsbook-runners/SportsbookRunner.types";
import { OddsDisplayPreference } from "@ppb/tbd-store";
import { StatusLabelType } from "@ppb/the-wall-common/types";
import { formatRunnerName } from "../formatters/runner-formatters";

import {
  formatObbParticipants,
  formatOddsByPriceType,
  getBetStatusLabel,
  getBetSupportingText,
  getBetTitle,
  getLegsSelectionsName,
  getObbBetSubTitle,
  getObbBetSupportingText,
  getObbSquadBetSupportingText,
  getPlacedReturns,
  getPlayerNameFromMetadata,
  isAccaInsuranceSelected,
  isForecastLegType,
  isMultipleBetType,
  isObbMultiple,
  isStraightLineOrStraightLineEachWay,
} from "./my-bets";

jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn(),
}));

let mockIsPast = true;
jest.mock("./dates", () => ({
  isPast: jest.fn(() => mockIsPast),
  formatStartDateWithTodayOrTomorrow: jest.fn(() => "1/1/22"),
}));

jest.mock("../formatters/runner-formatters", () => ({
  formatRunnerName: jest.fn((name, handicap) => (handicap ? `${name} ${handicap}` : name)),
}));

jest.mock("./i18n", () => ({
  i18n: jest.fn(
    ({ key, interpolationValues }) =>
      `${key}${
        interpolationValues
          ? Object.keys(interpolationValues).map(
              (interpolationValuesKey) =>
                ` ${interpolationValuesKey.toUpperCase()}:${interpolationValues[interpolationValuesKey]}`,
            )
          : ""
      }`,
  ),
}));

const SINGLE_BET = {
  urn: "ppb:sbkBet:923378353",
  betReceiptId: "O/10221904/0000164",
  betType: BetType.SGL,
  betId: "1",
  isSGM: false,
  currentSize: 0.11,
  profitAndLoss: 0.91,
  result: Result.CASHED_OUT,
  lowestEventStartTime: "lowestEventStartTimeMock",
  numLines: 1,
  isEachWay: false,
  edges: [],
  legs: [
    {
      result: Result.WON,
      parts: [
        {
          eventDescription: "Juventus v Lazio",
          eventMarketDescription: "Match Odds",
          selectionName: "Juventus",
          marketBetUrn: "ppb:marketBet:924.254694341",
          originalPrice: "2.2",
          priceType: "pricetypemock",
          price: {
            decimal: 2.2,
            fractional: { numerator: 11, denominator: 5 },
          },
        },
      ],
    },
  ],
};

const SINGLE_BET_WITH_LEG_TYPE_FORECAST = {
  ...SINGLE_BET,
  legs: [
    {
      type: LegType.SF,
      result: Result.WON,
      parts: [
        {
          eventDescription: "15:37 FLAT 2m 0f 11y",
          eventMarketDescription: "Win",
          marketBetUrn: "ppb:marketBet:924.258298150",
          price: { decimal: 2.25, fractional: { numerator: 5, denominator: 4 } },
          priceType: "DIVIDEND",
          selectionName: "Becky The Boo",
          startTime: "2021-03-25T15:37:00.000Z",
        },
        {
          eventDescription: "15:37 FLAT 2m 0f 11y",
          eventMarketDescription: "Win",
          marketBetUrn: "ppb:marketBet:924.258298150",
          price: { decimal: 3.5, fractional: { numerator: 5, denominator: 2 } },
          priceType: "DIVIDEND",
          selectionName: "Moonamacaroona",
          startTime: "2021-03-25T15:37:00.000Z",
        },
      ],
    },
  ],
};

const MULTIPLE_BET = {
  urn: "ppb:sbkBet:923378353",
  betReceiptId: "O/10221904/0000164",
  lowestEventStartTime: "lowestEventStartTimeMock",
  betType: BetType.DBL,
  isSGM: false,
  betId: "12345",
  currentSize: 0.32,
  profitAndLoss: 1.91,
  numLines: 1,
  edges: [],
  legs: [
    {
      result: Result.WON,
      parts: [
        {
          eventDescription: "Man Utd v Everton",
          eventMarketDescription: "First Goal Scorer",
          selectionName: "André Gomes",
          marketBetUrn: "ppb:marketBet:30086678",
          rule4Deductions: 5,
        },
      ],
    },
    {
      result: Result.LOST,
      parts: [
        {
          eventDescription: "Man Utd v Everton",
          eventMarketDescription: "First Goal Scorer",
          selectionName: "André Gomes",
          marketBetUrn: "ppb:marketBet:55677043",
          eachwayPlaces: 2,
          eachwayFactor: {
            numerator: 1,
            denominator: 15,
          },
          rule4Deductions: 0,
        },
      ],
    },
    {
      result: Result.PLACED,
      parts: [
        {
          eventDescription: "Man Utd v Everton",
          eventMarketDescription: "First Goal Scorer",
          selectionName: "André Gomes",
          marketBetUrn: "ppb:marketBet:notMapped",
          rule4Deductions: 0,
        },
      ],
    },
    {
      result: Result.VOID,
      parts: [
        {
          eventDescription: "Man Utd v Everton",
          eventMarketDescription: "First Goal Scorer",
          selectionName: "André Gomes",
          result: Result.VOID,
          rule4Deductions: 0,
        },
      ],
    },
  ],
  result: Result.CASHED_OUT,
};

const OBB_MULTIPLE_BET = {
  urn: "ppb:sbkBet:923378353",
  betReceiptId: "O/10221904/0000164",
  lowestEventStartTime: "lowestEventStartTimeMock",
  betType: BetType.DBL,
  isSGM: false,
  betId: "12345",
  currentSize: 0.32,
  profitAndLoss: 1.91,
  numLines: 1,
  edges: [],
  product: "OUTCOME_BASED_BETTING",
  legs: [
    {
      result: Result.WON,
      parts: [
        {
          eventDescription: "Man Utd v Everton",
          eventMarketDescription: "First Goal Scorer",
          selectionName: "André Gomes",
          marketBetUrn: "ppb:marketBet:30086678",
          rule4Deductions: 5,
        },
      ],
      outcomeBasedDetails: {
        expressionInfo: {
          templateId: "xOfN",
          templateVersion: 1,
          params: {
            x: 2,
          },
          expressionComponents: null,
          expressionMetadata: null,
          subExpressionInfos: [],
        },
      },
    },
  ],
  result: Result.CASHED_OUT,
};

const OBB_SINGLE_BET = {
  urn: "ppb:sbkBet:923378353",
  betReceiptId: "O/10221904/0000164",
  lowestEventStartTime: "lowestEventStartTimeMock",
  betType: BetType.DBL,
  isSGM: false,
  betId: "12345",
  currentSize: 0.32,
  profitAndLoss: 1.91,
  numLines: 1,
  edges: [],
  product: "OUTCOME_BASED_BETTING",
  legs: [
    {
      result: Result.WON,
      parts: [
        {
          eventDescription: "Man Utd v Everton",
          eventMarketDescription: "First Goal Scorer",
          selectionName: "André Gomes",
          marketBetUrn: "ppb:marketBet:30086678",
          rule4Deductions: 5,
        },
      ],
      outcomeBasedDetails: {
        expressionInfo: {
          templateId: "participantsCombined",
          templateVersion: 1,
          params: {
            x: 2,
          },
          expressionComponents: null,
          expressionMetadata: null,
          subExpressionInfos: [],
        },
      },
    },
  ],
  result: Result.CASHED_OUT,
};

const SPORTSBOOK_ODDS_DISPLAY = OddsDisplayPreference.Decimal;

describe("my-bets - helper", () => {
  beforeEach(jest.clearAllMocks);
  describe("isForecastLegType", () => {
    it.each([
      [false, LegType.SS],
      [true, LegType.SF],
      [true, LegType.RF],
      [true, LegType.CF],
      [true, LegType.TC],
      [true, LegType.CT],
      [false, LegType.SC],
      [false, LegType.MH],
      [false, LegType.WH],
      [false, LegType.SL],
      [false, LegType.HL],
      [false, LegType.FW],
      [false, LegType.LW],
      [false, LegType.AW],
    ])("should return `%s` for the legType `%s`", (result, legType) => {
      expect(isForecastLegType(legType)).toEqual(result);
    });
  });

  describe("isMultipleBetType", () => {
    it("should return true when the bet is multiple", () => {
      expect(isMultipleBetType(MULTIPLE_BET.betType)).toEqual(true);
    });

    it("should return false when the bet is not multiple", () => {
      expect(isMultipleBetType(SINGLE_BET.betType)).toEqual(false);
    });
  });

  describe("isObbMultiple", () => {
    it("should return true when the obb bet is multiple", () => {
      expect(isObbMultiple(OBB_MULTIPLE_BET.legs[0], OBB_MULTIPLE_BET.product)).toEqual(true);
    });

    it("should return false when the obb bet is single", () => {
      expect(isObbMultiple(OBB_SINGLE_BET.legs[0], OBB_MULTIPLE_BET.product)).toEqual(false);
    });
  });

  describe("isStraightLineOrStraightLineEachWay", () => {
    it("should return true for a straight line bet", () => {
      expect(isStraightLineOrStraightLineEachWay(1, false)).toEqual(true);
    });

    it("should return true for a straight each way bet", () => {
      expect(isStraightLineOrStraightLineEachWay(2, true)).toEqual(true);
    });

    it("should return false for a multiline bet", () => {
      expect(isStraightLineOrStraightLineEachWay(2, false)).toEqual(false);
    });

    it("should return false for a multi each way bet", () => {
      expect(isStraightLineOrStraightLineEachWay(4, true)).toEqual(false);
    });
  });

  describe("isAccaInsuranceSelected", () => {
    it("should return true when at least one edge of a multiple bet has ACCA_INSURANCE", () => {
      expect(isAccaInsuranceSelected({ ...MULTIPLE_BET, edges: [{ reason: BetEdgeEnum.ACCA_INSURANCE }] })).toEqual(
        true,
      );
    });

    it("should return false when no edge of a multiple bet has ACCA_INSURANCE", () => {
      expect(isAccaInsuranceSelected({ ...MULTIPLE_BET, edges: [{ reason: BetEdgeEnum.EACHWAY }] })).toEqual(false);
    });

    it("should return false for single bets", () => {
      expect(isAccaInsuranceSelected(SINGLE_BET)).toEqual(false);
    });
  });

  describe("formatOddsByPriceType", () => {
    describe("when the price is defined and is not SPB", () => {
      it("should format the odds according to its PriceType", () => {
        const odds = {
          decimal: 1,
          fractional: {
            numerator: 1,
            denominator: 2,
          },
        };

        formatOdds.mockReturnValue(1);

        expect(formatOddsByPriceType(odds, SportsbookRunnerPriceType.Live, SPORTSBOOK_ODDS_DISPLAY)).toEqual(1);
      });
    });

    describe("formatOddsByPriceType", () => {
      describe("when the price is defined and is not SPB", () => {
        it("should format the odds according to its PriceType", () => {
          const odds = {
            decimal: 1.5,
            fractional: {
              numerator: 1,
              denominator: 2,
            },
          };

          formatOdds.mockReturnValue(1);

          expect(formatOddsByPriceType(odds, SportsbookRunnerPriceType.Live, SPORTSBOOK_ODDS_DISPLAY)).toEqual(1);
        });

        it("should format the odds according to its PriceType when isOddsBoosted is true", () => {
          const odds = {
            decimal: 1.5,
            fractional: {
              numerator: 1,
              denominator: 2,
            },
          };

          formatOdds.mockReturnValue(1);

          expect(formatOddsByPriceType(odds, SportsbookRunnerPriceType.Live, SPORTSBOOK_ODDS_DISPLAY, true)).toEqual(1);
        });
      });

      describe("when the oddsDisplayPreference is FRACTIONAL", () => {
        it("should format the odds as a fraction", () => {
          const odds = {
            decimal: 1.5,
            fractional: {
              numerator: 1,
              denominator: 2,
            },
          };

          formatOdds.mockReturnValue("0.5/1");

          expect(formatOddsByPriceType(odds, SportsbookRunnerPriceType.Live, "FRACTIONAL", true)).toEqual("0.5/1");
        });
      });

      describe("when withAtLabel is true", () => {
        it("should prefix the odds with @ label", () => {
          const odds = {
            decimal: 1.5,
            fractional: {
              numerator: 1,
              denominator: 2,
            },
          };

          formatOdds.mockReturnValue("1.5");

          expect(
            formatOddsByPriceType(odds, SportsbookRunnerPriceType.Live, OddsDisplayPreference.Decimal, false, true),
          ).toEqual("@ 1.5");
        });
      });

      describe("when withAtLabel is false", () => {
        it("should not prefix the odds with @ label", () => {
          const odds = {
            decimal: 1.5,
            fractional: {
              numerator: 1,
              denominator: 2,
            },
          };

          formatOdds.mockReturnValue("1.5");

          const result = formatOddsByPriceType(
            odds,
            SportsbookRunnerPriceType.Live,
            OddsDisplayPreference.Decimal,
            false,
            false,
          );

          expect(result).toEqual("1.5");
        });
      });
    });

    describe("when the price is not defined and is SPB", () => {
      it("should return the SPB label", () => {
        expect(formatOddsByPriceType(undefined, SportsbookRunnerPriceType.Starting, SPORTSBOOK_ODDS_DISPLAY)).toEqual(
          "I18N.HORSE_RACING.SP",
        );
      });
    });

    describe("when the price is not defined and is not SPB", () => {
      it("should return an empty string", () => {
        expect(formatOddsByPriceType(undefined, SportsbookRunnerPriceType.Live, SPORTSBOOK_ODDS_DISPLAY)).toEqual("");
      });
    });
  });

  describe("getBetTitle", () => {
    describe("when legPart has type defined and is forecast", () => {
      it("should return title with leg type combination", () => {
        const title = getBetTitle(
          SINGLE_BET_WITH_LEG_TYPE_FORECAST,
          SINGLE_BET_WITH_LEG_TYPE_FORECAST.legs,
          SPORTSBOOK_ODDS_DISPLAY,
        );

        expect(title).toEqual("I18N.MY_BETS.SBK.MULTIPLE.SINGLE_LINES @ 1 I18N.MY_BETS.SBK.MULTIPLE.LINES");
      });
    });

    describe("when legPart has type defined and is multiple with more than 1 line", () => {
      it("should return title with leg type combination", () => {
        const title = getBetTitle({ ...MULTIPLE_BET, numLines: 2 }, MULTIPLE_BET.legs, SPORTSBOOK_ODDS_DISPLAY);

        expect(title).toEqual("I18N.MY_BETS.SBK.MULTIPLE.DOUBLE_LINES @ 2 I18N.MY_BETS.SBK.MULTIPLE.LINES");
      });
    });

    describe("when AccaInsurance is selected", () => {
      it("should return the correct title", () => {
        const title = getBetTitle(
          { ...MULTIPLE_BET, edges: [{ reason: BetEdgeEnum.ACCA_INSURANCE }] },
          MULTIPLE_BET.legs,
          SPORTSBOOK_ODDS_DISPLAY,
        );

        expect(title).toEqual("I18N.MY_BETS.SBK.MULTIPLE.DOUBLE_LINES");
      });
    });

    describe("when multiple is not SGM", () => {
      it("should return multiple type translated as title", () => {
        const title = getBetTitle(MULTIPLE_BET, MULTIPLE_BET.legs, SPORTSBOOK_ODDS_DISPLAY);

        expect(title).toEqual("I18N.MY_BETS.SBK.MULTIPLE.DOUBLE_LINES");
      });
    });

    describe("when multiple is SGM", () => {
      it("should return multiple type translated as title along with Bet Builder", () => {
        const bet = { ...MULTIPLE_BET, isSGM: true };
        const title = getBetTitle(bet, MULTIPLE_BET.legs, SPORTSBOOK_ODDS_DISPLAY);

        expect(title).toEqual("I18N.MY_BETS.SBK.MULTIPLE.DOUBLE_LINES - I18N.DESCRIPTION.BET_BUILDER");
      });
    });

    describe("when multiple is SGM Multi", () => {
      it("should return multiple type translated as title along with Bet Builder", () => {
        const bet = { ...MULTIPLE_BET, isSGMMulti: true };
        const title = getBetTitle(bet, MULTIPLE_BET.legs, SPORTSBOOK_ODDS_DISPLAY);

        expect(title).toEqual("I18N.MY_BETS.SBK.MULTIPLE.DOUBLE_LINES - I18N.BETSLIP.BET_BUILDER_MULTIS");
      });
    });

    describe("when multiple and betPrice available", () => {
      it("should return title with formatted odds", () => {
        const bet = {
          ...MULTIPLE_BET,
          betPrice: "BET_PRICE",
          edges: [],
          result: Result.WON,
        };

        formatOdds.mockReturnValue(10);
        const title = getBetTitle(bet, MULTIPLE_BET.legs, SPORTSBOOK_ODDS_DISPLAY);

        expect(title).toEqual("I18N.MY_BETS.SBK.MULTIPLE.DOUBLE_LINES @ 10");
      });
    });

    describe("when is a EachWay bet", () => {
      it("should return title with Each Way signposting", () => {
        const bet = { ...SINGLE_BET_WITH_LEG_TYPE_FORECAST, isEachWay: true };
        const title = getBetTitle(bet, SINGLE_BET.legs, SPORTSBOOK_ODDS_DISPLAY);

        expect(title).toEqual("(I18N.BETSLIP.EACHWAY) I18N.MY_BETS.SBK.MULTIPLE.SINGLE_LINES @ 10");
      });
    });

    describe("when is an OBB bet", () => {
      it("should return the correct title", () => {
        const bet = {
          ...SINGLE_BET,
          product: "OUTCOME_BASED_BETTING",
          legs: [
            {
              ...SINGLE_BET.legs[0],
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "playerVsPlayer",
                },
              },
            },
          ],
        };
        const title = getBetTitle(bet, bet.legs, SPORTSBOOK_ODDS_DISPLAY);

        expect(title).toEqual("I18N.MY_BETS.OBB.BETTYPE.playerVsPlayer @10");
      });
    });

    describe("when is a Lottery bet", () => {
      formatOdds.mockReturnValue(10);

      it("should return the correct title", () => {
        const bet = {
          ...SINGLE_BET,
          product: "OUTCOME_BASED_BETTING",
          legs: [
            {
              ...SINGLE_BET.legs[0],
            },
          ],
          isLotteries: true,
          betPrice: "BET_PRICE",
        };
        const title = getBetTitle(bet, bet.legs, SPORTSBOOK_ODDS_DISPLAY);

        expect(title).toEqual("I18N.MY_BETS.SBK.MULTIPLE.SINGLE_LINES @ 10");
      });
    });
  });

  describe("getLegsSelectionsName", () => {
    it("should return a mapped selection name array taking into consideration their parts and handicap", () => {
      const result = getLegsSelectionsName([
        {
          parts: [{ handicap: 1.2, selectionName: "Selection1" }],
        },
        {
          parts: [
            { handicap: 0, selectionName: "Selection2" },
            { handicap: 0, selectionName: "Selection3" },
            { handicap: 0, selectionName: "Selection4" },
          ],
        },
      ]);

      expect(formatRunnerName).toHaveBeenCalledTimes(4);
      expect(formatRunnerName).toHaveBeenCalledWith("Selection1", 1.2, false);
      expect(formatRunnerName).toHaveBeenCalledWith("Selection2", 0, false);
      expect(formatRunnerName).toHaveBeenCalledWith("Selection3", 0, false);
      expect(formatRunnerName).toHaveBeenCalledWith("Selection4", 0, false);

      expect(result).toEqual(["Selection1 1.2", "Selection2 / Selection3 / Selection4"]);
    });
  });

  describe("getObbPvPBetSubTitle", () => {
    describe("when the metadata contains a participant with the given id", () => {
      it("should return a the name of the player", () => {
        const metadata = { participants: [{ id: "123", name: "Participant A" }] };

        expect(getPlayerNameFromMetadata(metadata, "123")).toBe("Participant A");
      });
    });

    describe("when the metadata does not contains a participant with the given id", () => {
      it("should return null", () => {
        const metadata = { participants: [{ id: "123", name: null }] };

        expect(getPlayerNameFromMetadata(metadata, "123")).toBeNull();
      });
    });
  });

  describe("getObbSquadBetSupportingText", () => {
    it("should return the correct subtitle for SquadBet bet", () => {
      const metadata = {
        participants: [
          { id: "123", name: "Player A" },
          { id: "456", name: "Player B" },
          { id: "789", name: "Player C" },
        ],
      };

      const templateParams = {
        outcomeIds: ["SHOTS_ON_TARGET_TIME_ADJUSTED"],
        timePeriodId: "MATCH",
        participantIds: ["123", "456", "789"],
        quantifier: "AT_LEAST",
        value: 2,
      };
      expect(getObbSquadBetSupportingText(metadata, templateParams)).toBe("Player A, Player B & Player C");
    });
  });

  describe("formatObbParticipants", () => {
    it("should return the correct subtitle for SquadBet bet", () => {
      const metadata = {
        participants: [
          { id: "123", name: "Player A" },
          { id: "456", name: "Player B" },
          { id: "789", name: "Player C" },
        ],
      };

      const participantIds = ["123", "456", "789"];
      expect(formatObbParticipants(metadata, participantIds)).toBe("Player A, Player B & Player C");
    });
  });

  describe("getObbBetSupportingText", () => {
    it("should return the correct subtitle for playerVsPlayer OBB bets", () => {
      const legs = [
        {
          outcomeBasedDetails: {
            expressionInfo: {
              templateId: "playerVsPlayer",
              params: {
                participantIdA: "12345",
                participantIdB: "67890",
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
              },
              expressionMetadata: {
                participants: [
                  { id: "12345", name: "Player 12345" },
                  { id: "67890", name: "Player 67890" },
                ],
              },
            },
          },
        },
      ];

      const supportingText = getObbBetSupportingText(legs);

      expect(supportingText).toEqual("Player 12345");
    });

    it("should return the correct subtitle for xOfN OBB bets", () => {
      const legs = [
        {
          outcomeBasedDetails: {
            expressionInfo: {
              templateId: "xOfN",
              params: {
                x: 2,
              },
              subExpressionInfos: [
                {
                  templateId: "playerVsPlayer",
                  params: {
                    participantIdA: "67890",
                    participantIdB: "12345",
                    outcomeId: "GOALS_TIME_ADJUSTED",
                    timePeriodId: "MATCH",
                  },
                  expressionMetadata: {
                    participants: [
                      { id: "12345", name: "Player 12345" },
                      { id: "67890", name: "Player 67890" },
                    ],
                  },
                },
                {
                  templateId: "playerVsPlayer",
                  params: {
                    participantIdA: "54321",
                    participantIdB: "09876",
                    outcomeId: "GOALS_TIME_ADJUSTED",
                    timePeriodId: "MATCH",
                  },
                  expressionMetadata: {
                    participants: [
                      { id: "54321", name: "Player 54321" },
                      { id: "09876", name: "Player 09876" },
                    ],
                  },
                },
                {
                  templateId: "squadVsSquad",
                  params: {
                    outcomeIds: ["SHOTS_ON_TARGET_TIME_ADJUSTED"],
                    timePeriodId: "MATCH",
                    squadAParticipantIds: ["123", "456"],
                    squadBParticipantIds: ["789"],
                    quantifier: "LESS_THAN",
                  },
                  expressionMetadata: {
                    participants: [
                      { id: "123", name: "Player A" },
                      { id: "456", name: "Player B" },
                      { id: "789", name: "Player C" },
                    ],
                  },
                },
              ],
            },
          },
        },
      ];

      const supportingText = getObbBetSupportingText(legs);

      expect(supportingText).toEqual(
        "Player 67890 | Player 54321 | Player C I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD INCIDENTTYPE:SHOTS_ON_TARGET_TIME_ADJUSTED, OPERATOR:GREATER_THAN, PLAYERSNAME:Player A & Player B, COUNT:2",
      );
    });

    describe("when templateId is SquadVsSquad", () => {
      describe("when quantifier is GREATER_THAN", () => {
        it("should return the correct subtitle", () => {
          const legs = [
            {
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "squadVsSquad",
                  params: {
                    outcomeIds: ["SHOTS_ON_TARGET_TIME_ADJUSTED"],
                    timePeriodId: "MATCH",
                    squadAParticipantIds: ["123", "456"],
                    squadBParticipantIds: ["789"],
                    quantifier: "GREATER_THAN",
                  },
                  expressionMetadata: {
                    participants: [
                      { id: "123", name: "Player A" },
                      { id: "456", name: "Player B" },
                      { id: "789", name: "Player C" },
                    ],
                  },
                },
              },
            },
          ];

          expect(getObbBetSupportingText(legs)).toBe(
            "Player A & Player B I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD INCIDENTTYPE:SHOTS_ON_TARGET_TIME_ADJUSTED, OPERATOR:GREATER_THAN, PLAYERSNAME:Player C, COUNT:2",
          );
        });
      });
      describe("when quantifier is LESS_THAN", () => {
        it("should return the correct subtitle", () => {
          const legs = [
            {
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "squadVsSquad",
                  params: {
                    outcomeIds: ["SHOTS_ON_TARGET_TIME_ADJUSTED"],
                    timePeriodId: "MATCH",
                    squadAParticipantIds: ["123", "456"],
                    squadBParticipantIds: ["789"],
                    quantifier: "LESS_THAN",
                  },
                  expressionMetadata: {
                    participants: [
                      { id: "123", name: "Player A" },
                      { id: "456", name: "Player B" },
                      { id: "789", name: "Player C" },
                    ],
                  },
                },
              },
            },
          ];
          expect(getObbBetSupportingText(legs)).toBe(
            "Player C I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD INCIDENTTYPE:SHOTS_ON_TARGET_TIME_ADJUSTED, OPERATOR:GREATER_THAN, PLAYERSNAME:Player A & Player B, COUNT:2",
          );
        });
      });
    });

    it("should return the correct subtitle if the participant names are not available", () => {
      const legs = [
        {
          parts: [
            {
              handicap: 0,
              selectionName: "Player 12345 To Score more Goals Than Player 67890",
            },
          ],
          outcomeBasedDetails: {
            expressionInfo: {
              templateId: "playerVsPlayer",
              params: {
                participantIdA: "12345",
                participantIdB: "67890",
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
              },
              expressionMetadata: {
                participants: [{ id: "12345" }, { id: "67890" }],
              },
            },
          },
        },
      ];

      const supportingText = getObbBetSupportingText(legs);

      expect(supportingText).toEqual("Player 12345 To Score more Goals Than Player 67890");
    });
  });

  describe("getObbBetSubTitle", () => {
    it("should return null when leg is null", () => {
      expect(getObbBetSubTitle(null)).toBeNull();
    });

    it("should return null when no leg has outcomeBasedDetails.expressionInfo", () => {
      const leg = {
        ...OBB_MULTIPLE_BET.legs[0],
        outcomeBasedDetails: {},
      };
      expect(getObbBetSubTitle(leg)).toBeNull();
    });

    it("should return correctly the subtitle for xOfN", () => {
      const leg = {
        ...OBB_MULTIPLE_BET.legs[0],
        outcomeBasedDetails: {
          expressionInfo: {
            ...OBB_MULTIPLE_BET.legs[0].outcomeBasedDetails.expressionInfo,
            params: {
              x: 2,
            },
            subExpressionInfos: [{}, {}, {}],
          },
        },
      };

      const subtitle = getObbBetSubTitle(leg);
      expect(subtitle).toEqual("I18N.BETSLIP.OBB.X_OF_N.SELECTIONS_TO_WIN X:2, N:3");
    });
  });

  describe("getBetSupportingText", () => {
    describe("when there are multiple legs available", () => {
      it("should set the subTitle with all selection parts concatenated with ' | '", () => {
        const legs = [
          {
            parts: [{ handicap: 9, selectionName: "Selection1" }],
          },
          {
            parts: [
              { handicap: 0, selectionName: "Selection2" },
              { handicap: 0, selectionName: "Selection3" },
              { handicap: 0, selectionName: "Selection4" },
            ],
          },
        ];

        const supportingText = getBetSupportingText(legs);

        expect(supportingText).toEqual("Selection1 9 | Selection2 / Selection3 / Selection4");
      });
    });

    describe("when there are legs with outcomeBasedDetails", () => {
      it("should return the correct subtitle for OBB bets", () => {
        const legs = [
          {
            outcomeBasedDetails: {
              expressionInfo: {
                templateId: "playerVsPlayer",
                params: {
                  participantIdA: "12345",
                  participantIdB: "67890",
                  outcomeId: "GOALS_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                },
                expressionMetadata: {
                  participants: [
                    { id: "12345", name: "Player 12345" },
                    { id: "67890", name: "Player 67890" },
                  ],
                },
              },
            },
          },
        ];

        const supportingText = getBetSupportingText(legs);

        expect(supportingText).toEqual("Player 12345");
      });
    });
  });

  describe("getBetStatusLabel", () => {
    describe("when bet is SINGLE and not Cashed Out nor Settled", () => {
      describe("when the resultType is CONFIRMED", () => {
        it("should return the result according to the leg result", () => {
          const bet = {
            ...SINGLE_BET,
            result: Result.LOST,
            resultType: ResultType.CONFIRMED,
            legs: [
              {
                result: Result.WON,
              },
            ],
          };

          const { text, type } = getBetStatusLabel(bet, bet.legs);

          expect(text).toEqual("I18N.MY_BETS.RESULT.WON");
          expect(type).toEqual(StatusLabelType.WON);
        });
      });
      describe("when the resultType is not CONFIRMED", () => {
        it("should return the result according to the bet result", () => {
          const bet = {
            ...SINGLE_BET,
            result: Result.LOSING,
            resultType: ResultType.POTENTIAL,
            legs: [
              {
                result: Result.WON,
              },
            ],
          };

          const { text, type } = getBetStatusLabel(bet, bet.legs);

          expect(text).toEqual("I18N.MYBETS.LOSING");
          expect(type).toEqual(StatusLabelType.LOST);
        });
      });
    });
    describe("when result is WON", () => {
      it("should return statusLabelText, statusLabelIcon and statusLabelType", () => {
        const bet = {
          ...SINGLE_BET,
          result: Result.WON,
          resultType: ResultType.CONFIRMED,
          legs: [
            {
              result: Result.WON,
            },
          ],
        };

        const { text, type } = getBetStatusLabel(bet, bet.legs);

        expect(text).toEqual("I18N.MY_BETS.RESULT.WON");
        expect(type).toEqual(StatusLabelType.WON);
      });
    });

    describe("when bet is multiple and result is LOST", () => {
      it("should return statusLabelText and statusLabelType with correct props", () => {
        const bet = {
          ...MULTIPLE_BET,
          result: Result.LOST,
          resultType: ResultType.CONFIRMED,
        };

        const { text, icon, type } = getBetStatusLabel(bet, bet.legs);

        expect(text).toEqual("I18N.MY_BETS.RESULT.LOST");
        expect(icon).toEqual(undefined);
        expect(type).toEqual(StatusLabelType.LOST);
      });

      describe("when resultType is not CONFIRMED and the only LOST leg is frozen", () => {
        it("should return statusLabelText, statusLabelIcon and statusLabelType for WON", () => {
          const bet = {
            ...MULTIPLE_BET,
            result: Result.LOST,
            resultType: ResultType.POTENTIAL,
            legs: [
              { result: Result.WON },
              { result: Result.WON },
              { result: Result.WON },
              { result: Result.WON },
              { result: Result.LOST, mutations: { details: [{ freezeDetails: true }] } },
            ],
          };

          const { text, type } = getBetStatusLabel(bet, bet.legs);

          expect(text).toEqual("I18N.MY_BETS.RESULT.WON");
          expect(type).toEqual(StatusLabelType.WON);
        });
      });

      describe("when resultType is not CONFIRMED and a frozen leg is one of multiple LOST legs", () => {
        it("should return statusLabelText, statusLabelIcon and statusLabelType for LOST", () => {
          const bet = {
            ...MULTIPLE_BET,
            result: Result.LOST,
            resultType: ResultType.POTENTIAL,
            legs: [
              { result: Result.WON },
              { result: Result.WON },
              { result: Result.WON },
              { result: Result.LOST },
              { result: Result.LOST, mutations: { details: [{ freezeDetails: true }] } },
            ],
          };

          const { text, icon, type } = getBetStatusLabel(bet, bet.legs);

          expect(text).toEqual("I18N.MY_BETS.RESULT.LOST");
          expect(icon).toEqual(undefined);
          expect(type).toEqual(StatusLabelType.LOST);
        });
      });
    });

    describe("when bet is multiple and result is VOID", () => {
      it("should return statusLabelText and statusLabelType with correct props", () => {
        const bet = {
          ...MULTIPLE_BET,
          result: Result.VOID,
          resultType: ResultType.CONFIRMED,
        };

        const { text, icon, type } = getBetStatusLabel(bet, bet.legs);

        expect(text).toEqual("I18N.MY_BETS.RESULT.VOID");
        expect(icon).toEqual(undefined);
        expect(type).toEqual(StatusLabelType.NEUTRAL);
      });
    });

    describe("when bet is multiple and result is PLACED", () => {
      it("should return statusLabelText and statusLabelType with correct props", () => {
        const bet = {
          ...MULTIPLE_BET,
          result: Result.PLACED,
          resultType: ResultType.CONFIRMED,
        };

        const { text, icon, type } = getBetStatusLabel(bet, bet.legs);

        expect(text).toEqual("I18N.MY_BETS.RESULT.PLACED");
        expect(icon).toEqual(undefined);
        expect(type).toEqual(StatusLabelType.WON);
      });
    });

    describe("when bet is heritage and result is WON", () => {
      it("should return statusLabelText and statusLabelType with correct props", () => {
        const bet = {
          ...SINGLE_BET,
          result: Result.WON,
          legs: [
            {
              result: Result.LOST,
            },
          ],
        };

        const { text, type } = getBetStatusLabel(bet, bet.legs, { isHeritageView: true });

        expect(text).toEqual("I18N.MY_BETS.RESULT.WON");
        expect(type).toEqual(StatusLabelType.WON);
      });
    });

    describe("when bet is heritage and result is LOST", () => {
      it("should return statusLabelText and statusLabelType with correct props", () => {
        const bet = {
          ...SINGLE_BET,
          result: Result.LOST,
          legs: [
            {
              result: Result.LOST,
            },
          ],
        };

        const { text, icon, type } = getBetStatusLabel(bet, bet.legs, { isHeritageView: true });

        expect(text).toEqual("I18N.MY_BETS.RESULT.LOST");
        expect(icon).toEqual(undefined);
        expect(type).toEqual(StatusLabelType.LOST);
      });
    });

    describe("when bet is heritage and result is VOID", () => {
      it("should return statusLabelText and statusLabelType with correct props", () => {
        const bet = {
          ...SINGLE_BET,
          result: Result.VOID,
          legs: [
            {
              result: Result.LOST,
            },
          ],
        };

        const { text, icon, type } = getBetStatusLabel(bet, bet.legs, { isHeritageView: true });

        expect(text).toEqual("I18N.MY_BETS.RESULT.VOID");
        expect(icon).toEqual(undefined);
        expect(type).toEqual(StatusLabelType.NEUTRAL);
      });
    });

    describe("when result is CASHED_OUT", () => {
      it("should return statusLabelText and statusLabelType with correct props", () => {
        const bet = {
          ...SINGLE_BET,
          result: Result.CASHED_OUT,
          resultType: ResultType.CONFIRMED,
        };

        const { text, icon, type } = getBetStatusLabel(bet, bet.legs);

        expect(text).toEqual("I18N.MY_BETS.RESULT.SBK.CASHED_OUT");
        expect(icon).toEqual(undefined);
        expect(type).toEqual(StatusLabelType.BRANDED);
      });
    });

    describe("when result is SETTLED", () => {
      describe("and bet is single with placed legs", () => {
        it("should return statusLabelText and statusLabelType with PLACED props", () => {
          const bet = {
            ...SINGLE_BET,
            result: Result.SETTLED,
            resultType: ResultType.CONFIRMED,
            legs: [
              {
                result: Result.PLACED,
              },
            ],
          };

          const { text, icon, type } = getBetStatusLabel(bet, bet.legs);

          expect(text).toEqual("I18N.MY_BETS.RESULT.PLACED");
          expect(icon).toEqual(undefined);
          expect(type).toEqual(StatusLabelType.WON);
        });
      });
      it("should return statusLabelText and statusLabelType with correct props", () => {
        const bet = {
          ...SINGLE_BET,
          result: Result.SETTLED,
          resultType: ResultType.CONFIRMED,
        };

        const BetStatusLabel = getBetStatusLabel(bet, bet.legs);

        expect(BetStatusLabel).toEqual(undefined);
      });
    });

    describe("when result is WINNING", () => {
      it("should return statusLabelText and statusLabelType", () => {
        const bet = {
          ...SINGLE_BET,
          result: Result.WINNING,
          resultType: ResultType.POTENTIAL,
          legs: [
            {
              result: Result.WINNING,
            },
          ],
        };

        const { text, type } = getBetStatusLabel(bet, bet.legs);

        expect(text).toEqual("I18N.MYBETS.WINNING");
        expect(type).toEqual(StatusLabelType.WON);
      });
    });

    describe("when result is LOSING", () => {
      it("should return statusLabelText and statusLabelType", () => {
        const bet = {
          ...SINGLE_BET,
          result: Result.LOSING,
          resultType: ResultType.POTENTIAL,
          legs: [
            {
              result: Result.LOSING,
            },
          ],
        };

        const { text, type } = getBetStatusLabel(bet, bet.legs);

        expect(text).toEqual("I18N.MYBETS.LOSING");
        expect(type).toEqual(StatusLabelType.LOST);
      });
    });

    describe("when result is undefined", () => {
      describe("and bet is multiple", () => {
        it("should return undefined", () => {
          const bet = {
            ...MULTIPLE_BET,
            result: undefined,
          };

          const statusLabel = getBetStatusLabel(bet, bet.legs);

          expect(statusLabel).toEqual(undefined);
        });
      });

      describe("and betLegs result is undefined", () => {
        it("should return undefined", () => {
          const bet = {
            ...SINGLE_BET,
            result: undefined,
            legs: [
              {
                result: undefined,
              },
            ],
          };

          const statusLabel = getBetStatusLabel(bet, bet.legs);

          expect(statusLabel).toEqual(undefined);
        });
      });

      describe("and bet is heritage and settled", () => {
        it("should return undefined", () => {
          const bet = {
            ...SINGLE_BET,
            result: undefined,
            isSettled: true,
          };

          const statusLabel = getBetStatusLabel(bet, bet.legs, {
            isHeritageView: true,
          });

          expect(statusLabel).toEqual(undefined);
        });

        describe("and showWinLoseVoidFeature is true", () => {
          it("should return undefined", () => {
            const bet = {
              ...SINGLE_BET,
              result: undefined,
              isSettled: true,
            };

            const getBetStatusLabelOptions = {
              locale: "foo",
              timezone: "Europe/London",
              showWinLoseVoidFeature: true,
              isHeritageView: true,
            };

            const statusLabel = getBetStatusLabel(bet, bet.legs, getBetStatusLabelOptions);

            expect(statusLabel).toEqual(undefined);
          });
        });
      });

      describe("and showWinLoseVoidFeature is false", () => {
        it("should return undefined", () => {
          const bet = {
            ...MULTIPLE_BET,
            result: undefined,
          };

          const getBetStatusLabelOptions = {
            locale: "foo",
            timezone: "Europe/London",
            showWinLoseVoidFeature: false,
          };

          const statusLabel = getBetStatusLabel(bet, bet.legs, getBetStatusLabelOptions);

          expect(statusLabel).toEqual(undefined);
        });
      });

      describe("and lowestEventStartTime is undefined", () => {
        it("should return undefined", () => {
          const bet = {
            ...MULTIPLE_BET,
            lowestEventStartTime: undefined,
            result: undefined,
          };

          const getBetStatusLabelOptions = {
            locale: "foo",
            timezone: "Europe/London",
            showWinLoseVoidFeature: false,
          };

          const statusLabel = getBetStatusLabel(bet, bet.legs, getBetStatusLabelOptions);

          expect(statusLabel).toEqual(undefined);
        });
      });

      describe("and lowestEventStartTime has occurred", () => {
        it("should return undefined", () => {
          const bet = {
            ...MULTIPLE_BET,
            lowestEventStartTime: "2019-01-01T12:15:00Z",
            result: undefined,
          };

          const getBetStatusLabelOptions = {
            locale: "foo",
            timezone: "Europe/London",
            showWinLoseVoidFeature: true,
          };

          const { text, icon, type } = getBetStatusLabel(bet, bet.legs, getBetStatusLabelOptions);

          expect(text).toEqual("I18N.MYBETS.IN_PROGRESS");
          expect(icon).toEqual(undefined);
          expect(type).toEqual(StatusLabelType.BRANDED);
        });
      });

      describe("and lowestEventStartTime has not occurred but is defined", () => {
        it("should return formattedDate", () => {
          mockIsPast = false;

          const bet = {
            ...SINGLE_BET,
            result: undefined,
            legs: [
              {
                result: undefined,
              },
            ],
          };

          const getBetStatusLabelOptions = {
            locale: "foo",
            timezone: "Europe/London",
            showWinLoseVoidFeature: true,
          };

          const { text, icon, type } = getBetStatusLabel(bet, bet.legs, getBetStatusLabelOptions);

          expect(text).toEqual("1/1/22");
          expect(icon).toEqual(undefined);
          expect(type).toEqual(StatusLabelType.NEUTRAL);
        });
      });
    });

    describe("when bet is a obb multiple", () => {
      describe("and bet is multiple", () => {
        it("should return undefined", () => {
          const bet = {
            ...OBB_MULTIPLE_BET,
            result: undefined,
          };

          const statusLabel = getBetStatusLabel(bet, bet.legs);

          expect(statusLabel).toEqual(undefined);
        });
      });

      describe("and bet result is WON", () => {
        it("should return undefined", () => {
          const bet = {
            ...OBB_MULTIPLE_BET,
            result: Result.WON,
            legs: [
              {
                result: undefined,
              },
            ],
          };

          const statusLabel = getBetStatusLabel(bet, bet.legs);

          expect(statusLabel).toEqual({ text: "I18N.MY_BETS.RESULT.WON", type: "won" });
        });
      });

      describe("and bet result is VOID", () => {
        it("should return undefined", () => {
          const bet = {
            ...OBB_MULTIPLE_BET,
            result: Result.VOID,
            legs: [
              {
                result: "WON",
              },
            ],
          };

          const statusLabel = getBetStatusLabel(bet, bet.legs);

          expect(statusLabel).toEqual({ text: "I18N.MY_BETS.RESULT.VOID", type: "neutral" });
        });
      });
    });
  });

  describe("getPlacedReturns", () => {
    describe("when bet is settled", () => {
      it("should return an empty string", () => {
        const text = getPlacedReturns(true, undefined);

        expect(text).toEqual("");
      });
    });

    describe("when bet is not settled", () => {
      describe("and bet does not have each way places", () => {
        it("should return an empty string", () => {
          const text = getPlacedReturns(false, undefined);

          expect(text).toEqual("");
        });
      });

      describe("and bet has 1 each way place", () => {
        it("should return label with correct format", () => {
          const text = getPlacedReturns(false, 1);

          expect(text).toEqual("I18N.MYBETS.PLACED_RETURNS");
        });
      });

      describe("and bet has 2 each way places", () => {
        it("should return label with correct format", () => {
          const text = getPlacedReturns(false, 2);

          expect(text).toEqual("I18N.MYBETS.PLACED_RETURNS");
        });
      });

      describe("and bet has 3 each way places", () => {
        it("should return label with correct format", () => {
          const text = getPlacedReturns(false, 3);

          expect(text).toEqual("I18N.MYBETS.PLACED_RETURNS SEPARATOR: - , TOPLACES:3I18N.MYBETS.PLACED_THIRD");
        });
      });

      describe("and bet has 4 each way places", () => {
        it("should return label with correct format", () => {
          const text = getPlacedReturns(false, 4);

          expect(text).toEqual("I18N.MYBETS.PLACED_RETURNS SEPARATOR: - , TOPLACES:4I18N.MYBETS.PLACED_OTHER");
        });
      });
    });
  });
});
