import { OddsDisplayPreference } from "@ppb/tbd-store/state";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { ValueIconName } from "@ppb/the-wall-icons";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import {
  formatOddsByPriceType,
  getExpressionInfo,
  getLegsSelectionsName,
  getObbSquadBetSupportingText,
  isForecastLegType,
  getPlayerNameFromMetadata,
  formatObbParticipants,
} from "../helpers/my-bets";
import { getSelectionTypeIcon } from "../helpers/selection-type";

import { createBuildBetLegPartsVM } from "./my-bets-sbk-leg";

const isBrandSettingEnabled = jest.fn();

jest.mock("i18next", () => ({
  t: jest.fn(
    (key, options) =>
      `${key}${
        options ? Object.keys(options).map((optionKey) => ` ${optionKey.toUpperCase()}:${options[optionKey]}`) : ""
      }`,
  ),
}));

jest.mock("@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors", () => ({
  createIsBrandSettingEnabledSelector: jest.fn(() => isBrandSettingEnabled),
}));

const getFixtureBySportEventURN = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createFixtureBySportEventURNSelector: jest.fn(() => getFixtureBySportEventURN),
}));

const getUserPreferencesWithProductSwitcher = jest.fn(() => ({
  sportsbookOddsDisplay: OddsDisplayPreference.decimal,
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getUserPreferencesWithProductSwitcher),
}));

jest.mock("../formatters/runner-formatters", () => ({
  formatRunnerName: jest.fn(() => "Runner name with handicap"),
}));

const FORMATTED_ODDS_MOCK = "FORMATTED_ODDS_MOCK";

jest.mock("../helpers/my-bets", () => ({
  getLegsSelectionsName: jest.fn(() => ["Runner A / Runner B / Runner C"]),
  isForecastLegType: jest.fn(() => false),
  formatOddsByPriceType: jest.fn(),
  getObbPvPBetSubTitle: jest.fn(),
  getObbSquadBetSupportingText: jest.fn(),
  getExpressionInfo: jest.fn(),
  getPlayerNameFromMetadata: jest.fn(),
  formatObbParticipants: jest.fn(),
}));

jest.mock("../helpers/selection-type", () => ({
  getSelectionTypeIcon: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/races/race-selectors", () => ({
  createRaceByURNSelector: jest.fn(() =>
    jest.fn(() => ({
      meeting: "tbd:meeting:1",
    })),
  ),
}));

jest.mock("@ppb/tbd-store/state/entities/meetings/meeting-selectors", () => ({
  createMeetingByURNSelector: jest.fn(() =>
    jest.fn(() => ({
      country: "GB",
    })),
  ),
}));

const DEFAULT_MULTIPLE_BET_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:923378353": {
          urn: "ppb:tbd:card:sbkBet:923378353",
          betURN: "ppb:sbkBet:923378353",
          type: "SPORTSBOOK_BET_CARD",
          navigationLinks: {
            "ppb:marketBet:30088804": {
              viewUrn: "ppb:tbd:view:event:30088804",
              viewUrl: "soccer/portuguese-primeira-liga/pacos-ferreira-v-porto/e-30088804",
            },
            "ppb:marketBet:30086678": {
              viewUrn: "ppb:tbd:view:event:30086678",
              viewUrl: "soccer/english-championship/coventry-v-reading/e-30086678",
            },
            "ppb:marketBet:55677043": {
              viewUrn: "ppb:tbd:view:event:55677043",
              viewUrl: "soccer/english-championship/coventry-v-reading/e-55677043",
            },
            "ppb:marketBet:25677043": {
              viewUrn: "ppb:tbd:view:event:25677043",
              viewUrl: "soccer/english-championship/coventry-v-reading/e-25677043",
            },
            "ppb:marketBet:81282791": {
              viewUrn: "ppb:tbd:view:event:81282791",
              viewUrl: "soccer/english-championship/coventry-v-reading/e-81282791",
            },
            "ppb:marketBet:60088805": {
              viewUrn: "ppb:tbd:view:event:60088805",
              viewUrl: "soccer/portuguese-primeira-liga/porto-v-alverca/e-60088805",
            },
            "ppb:marketBet:80086679": {
              viewUrn: "ppb:tbd:view:event:80086679",
              viewUrl: "soccer/english-premier-league/mancity-v-fulham/e-80086679",
            },
          },
        },
      },
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        isSGM: false,
        betId: 12345,
        currentSize: 0.32,
        profitAndLoss: 1.91,
        numLines: 1,
        edges: [],
        legs: [
          {
            parts: [
              {
                eventMarketDescription: "Match Odds",
                eventUrn: "eventUrn",
                sportId: "1",
                selectionName: "Juventus",
                marketType: "MATCH_ODDS_90",
                price: {
                  decimal: 5.5,
                  fractional: {
                    numerator: 9,
                    denominator: 2,
                  },
                },
                originalPrice: {
                  decimal: 5.5,
                  fractional: {
                    numerator: 9,
                    denominator: 2,
                  },
                },
                marketBetUrn: "ppb:marketBet:30088804",
                outcomeDefinitionExp: "outcomeDefinitionExp",
                outcomeBasedDetails: {
                  expressionInfo: {
                    expressionComponents: "expressionComponents",
                    subExpressionInfos: ["subExpressionInfos  "],
                  },
                },
                rule4Deductions: 0,
                isSuperSub: false,
                raceRunnerKindUrn: "tbd:greyhoundracerunner:1",
              },
            ],
          },
          {
            result: "WON",
            parts: [
              {
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:30086678",
                rule4Deductions: 5,
              },
            ],
          },
          {
            result: "LOST",
            parts: [
              {
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
            result: "PLACED",
            parts: [
              {
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                marketBetUrn: "ppb:marketBet:notMapped",
                rule4Deductions: 0,
                priceType: "GUARANTEED",
              },
            ],
          },
          {
            result: "VOID",
            parts: [
              {
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                result: "VOID",
                priceType: "STARTING",
                rule4Deductions: 0,
              },
            ],
          },
          {
            result: "SETTLED",
            parts: [
              {
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                result: "SETTLED",
                rule4Deductions: 0,
                price: {
                  decimal: 5.5,
                  fractional: {
                    numerator: 9,
                    denominator: 2,
                  },
                },
                originalPrice: {
                  decimal: 2,
                  fractional: {
                    numerator: 1,
                    denominator: 1,
                  },
                },
              },
            ],
          },
          {
            result: "FROZEN",
            parts: [
              {
                eventMarketDescription: "First Goal Scorer",
                selectionName: "André Gomes",
                result: "LOST",
                rule4Deductions: 0,
              },
            ],
          },
        ],
        result: "CASHED_OUT",
      },
    },
  },
  entities: {
    meetings: {
      "tbd:meeting:1": {
        country: "GB",
      },
    },
    races: {
      "tbd:race:1": {
        meeting: "tbd:meeting:1",
      },
    },
    greyhoundracerunners: {
      "tbd:greyhoundracerunner:1": {
        raceURN: "tbd:race:1",
        trap: 3,
      },
    },
    throttles: {
      SHOW_TRAP_ICON: { isActive: true },
    },
    preferences: {},
  },
};

const ANOTHER_MULTIPLE_BET_STATE = {
  layouts: {
    cards: {
      sportsbookbets: {
        "ppb:tbd:card:sbkBet:567789435": {
          urn: "ppb:tbd:card:sbkBet:567789435",
          betURN: "ppb:sbkBet:567789435",
          type: "SPORTSBOOK_BET_CARD",
          navigationLinks: {
            "ppb:marketBet:60088805": {
              viewUrn: "ppb:tbd:view:event:60088805",
              viewUrl: "soccer/portuguese-primeira-liga/porto-v-alverca/e-60088805",
            },
            "ppb:marketBet:80086679": {
              viewUrn: "ppb:tbd:view:event:80086679",
              viewUrl: "soccer/english-premier-league/mancity-v-fulham/e-80086679",
            },
          },
        },
      },
    },
  },
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:567789435": {
        urn: "ppb:sbkBet:567789435",
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        currentSize: 0.62,
        potentialWin: "2.41",
        numLines: 1,
        betId: 123456789,
        edges: [],
        legs: [
          {
            parts: [
              {
                eventMarketDescription: "Match Odds",
                sportId: "1",
                selectionName: "Porto",
                price: "7",
                marketBetUrn: "ppb:marketBet:60088805",
                raceRunnerKindUrn: "tbd:greyhoundracerunner:1",
              },
            ],
          },
          {
            parts: [
              {
                eventMarketDescription: "Match Odds",
                selectionName: "Man City",
                result: "WON",
                marketBetUrn: "ppb:marketBet:80086679",
              },
            ],
          },
        ],
        result: "CASHED_OUT",
      },
    },
  },
  entities: {
    throttles: {
      SHOW_TRAP_ICON: { isActive: true },
    },
    preferences: {},
  },
};

describe("createBuildBetLegPartsVM", () => {
  it("should be a function factory", () => {
    const buildBetLegParts = createBuildBetLegPartsVM();

    expect(buildBetLegParts).toEqual(expect.any(Function));
    expect(buildBetLegParts).not.toBe(createBuildBetLegPartsVM());
  });

  describe("when there is no legs", () => {
    it("should return an empty array", () => {
      const buildBetLegParts = createBuildBetLegPartsVM();
      const result = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, []);

      expect(result).toEqual([]);
    });
  });

  describe("when legs exists with correct data", () => {
    it("should return the correct data", () => {
      formatOddsByPriceType.mockReturnValue(FORMATTED_ODDS_MOCK);

      const buildBetLegParts = createBuildBetLegPartsVM(
        DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        false,
      );
      const result = buildBetLegParts(
        DEFAULT_MULTIPLE_BET_STATE,
        DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
      );

      expect(result).toEqual([
        {
          eventUrn: "eventUrn",
          sportId: "1",
          is90Min: true,
          isLotteries: false,
          odd: FORMATTED_ODDS_MOCK,
          outcomeDefinitionExp: "outcomeDefinitionExp",
          isSuperSub: false,
          title: "Runner name with handicap",
          subtitle: "Match Odds",
          navigationViewLink: {
            viewUrn: "ppb:tbd:view:event:30088804",
            viewUrl: "soccer/portuguese-primeira-liga/pacos-ferreira-v-porto/e-30088804",
          },
          trap: 3,
          meetingCountry: "GB",
          result: undefined,
        },
        {
          is90Min: false,
          title: "Runner name with handicap",
          subtitle: "First Goal Scorer",
          isLotteries: false,
          tertiaryTitle: "I18N.MYBETS.RULE4 RULE4PERCENTAGE:5%",
          odd: FORMATTED_ODDS_MOCK,
          statusLabel: {
            statusLabelSize: StatusLabelSizeType.SMALL,
            statusLabelType: StatusLabelType.WON,
            text: "I18N.MY_BETS.RESULT.WON",
          },
          navigationViewLink: {
            viewUrn: "ppb:tbd:view:event:30086678",
            viewUrl: "soccer/english-championship/coventry-v-reading/e-30086678",
          },
          result: "WON",
        },
        {
          is90Min: false,
          title: "Runner name with handicap",
          subtitle: "First Goal Scorer",
          isLotteries: false,
          tertiaryTitle: "I18N.LABELS.EW_TERMS NUMERATOR:1, DENOMINATOR:15, PLACES:2",
          odd: FORMATTED_ODDS_MOCK,
          statusLabel: {
            statusLabelSize: StatusLabelSizeType.SMALL,
            statusLabelType: StatusLabelType.LOST,
            text: "I18N.MY_BETS.RESULT.LOST",
          },
          navigationViewLink: {
            viewUrn: "ppb:tbd:view:event:55677043",
            viewUrl: "soccer/english-championship/coventry-v-reading/e-55677043",
          },
          result: "LOST",
        },
        {
          is90Min: false,
          title: "Runner name with handicap",
          subtitle: "First Goal Scorer",
          isLotteries: false,
          odd: FORMATTED_ODDS_MOCK,
          statusLabel: {
            statusLabelSize: StatusLabelSizeType.SMALL,
            statusLabelType: StatusLabelType.WON,
            text: "I18N.MY_BETS.RESULT.PLACED",
          },
          racingLabel: "I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED",
          navigationViewLink: undefined,
          result: "PLACED",
        },
        {
          is90Min: false,
          title: "Runner name with handicap",
          subtitle: "First Goal Scorer",
          isLotteries: false,
          odd: FORMATTED_ODDS_MOCK,
          statusLabel: {
            statusLabelSize: StatusLabelSizeType.SMALL,
            statusLabelType: StatusLabelType.NEUTRAL,
            text: "I18N.MY_BETS.RESULT.VOID",
          },
          navigationViewLink: undefined,
          result: "VOID",
        },
        {
          is90Min: false,
          isLotteries: false,
          title: "Runner name with handicap",
          subtitle: "First Goal Scorer",
          odd: FORMATTED_ODDS_MOCK,
          previousOdd: FORMATTED_ODDS_MOCK,
          statusLabel: undefined,
          navigationViewLink: undefined,
          result: "SETTLED",
        },
        {
          is90Min: false,
          isLotteries: false,
          odd: "FORMATTED_ODDS_MOCK",
          statusLabel: {
            iconName: ValueIconName.ACCA_FREEZE,
            statusLabelSize: StatusLabelSizeType.SMALL,
            statusLabelType: StatusLabelType.BRANDED,
            text: "I18N.MY_BETS.BET_LEG.FROZEN_LABEL",
          },
          subtitle: "First Goal Scorer",
          title: "Runner name with handicap",
          result: "FROZEN",
        },
      ]);
    });

    describe("when the leg has a price equal to the original price", () => {
      it("should request formatOddsByPriceType with a true 'withAtLabel", () => {
        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        expect(formatOddsByPriceType).toHaveBeenCalledWith(
          { decimal: 5.5, fractional: { denominator: 2, numerator: 9 } },
          undefined,
          undefined,
          undefined,
          true,
        );
      });
    });

    describe("when a leg has each way", () => {
      it("should return tertiaryTitle with the each way data", () => {
        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        const legs = buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        expect(legs[1].tertiaryTitle).toBeDefined();
        expect(legs[1].tertiaryTitle).toEqual("I18N.MYBETS.RULE4 RULE4PERCENTAGE:5%");
      });
    });

    describe("when a leg has rule4Deductions", () => {
      it("should return tertiaryTitle with the rule4Deductions data", () => {
        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        const legs = buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        expect(legs[1].tertiaryTitle).toBeDefined();
        expect(legs[1].tertiaryTitle).toEqual("I18N.MYBETS.RULE4 RULE4PERCENTAGE:5%");
      });
    });

    describe("when a leg hasn't rule4Deductions", () => {
      it("should not return tertiary title with rule4Deductions data", () => {
        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        const legs = buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        expect(legs[0].tertiaryTitle).toBeUndefined();
      });
    });

    describe("when a leg has eachway", () => {
      it("should return tertiaryTitle with the each way data", () => {
        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        const legs = buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        expect(legs[2].tertiaryTitle).toBe("I18N.LABELS.EW_TERMS NUMERATOR:1, DENOMINATOR:15, PLACES:2");
      });
    });

    describe("when a leg has eachway and rule4Deductions", () => {
      it("should return tertiaryTitle with the each way and rule4 data", () => {
        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        const mockLegs = [...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs];
        mockLegs[2].parts[0].rule4Deductions = 4;

        const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

        expect(legs[2].tertiaryTitle).toBe(
          "I18N.LABELS.EW_TERMS NUMERATOR:1, DENOMINATOR:15, PLACES:2 | I18N.MYBETS.RULE4 RULE4PERCENTAGE:4%",
        );
      });
    });

    describe("when a leg is from forecast type", () => {
      it("should return the correct title and subtitle", () => {
        isForecastLegType.mockResolvedValueOnce(true);

        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );

        const mockLeg = {
          ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs[0],
          type: "FORECAST",
        };
        const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, [mockLeg]);

        expect(getLegsSelectionsName).toHaveBeenCalledWith([mockLeg]);
        expect(isForecastLegType).toHaveBeenCalledWith(mockLeg.type);

        expect(legs[0].title).toEqual("Runner A / Runner B / Runner C");
        expect(legs[0].subtitle).toEqual("I18N.BETSLIP.SBK.CAST.FORECAST");
      });
    });

    describe("when a leg has priceType as GUARANTEED", () => {
      it("should return racingLabel with BOG data", () => {
        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        const legs = buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        expect(legs[3].racingLabel).toBeDefined();
        expect(legs[3].racingLabel).toEqual("I18N.LABELS.BEST_ODDS_GUARANTEED_REDUCED");
      });
    });

    describe("when legs of a SGM exists with correct data", () => {
      it("should return empty odds", () => {
        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
          true,
          false,
        );
        const result = buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        expect(result[0]).toEqual(expect.objectContaining({ odd: "" }));
        expect(result[1]).toEqual(expect.objectContaining({ odd: "" }));
        expect(result[2]).toEqual(expect.objectContaining({ odd: "" }));
        expect(result[3]).toEqual(expect.objectContaining({ odd: "" }));
        expect(result[4]).toEqual(expect.objectContaining({ odd: "" }));
      });
    });

    describe("when legs of a SGM multi exists with correct data", () => {
      it("should return empty odds", () => {
        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
          false,
          true,
        );
        const result = buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        expect(result[0]).toEqual(expect.objectContaining({ odd: "" }));
        expect(result[1]).toEqual(expect.objectContaining({ odd: "" }));
        expect(result[2]).toEqual(expect.objectContaining({ odd: "" }));
        expect(result[3]).toEqual(expect.objectContaining({ odd: "" }));
        expect(result[4]).toEqual(expect.objectContaining({ odd: "" }));
      });
    });

    describe("when legs array is the same", () => {
      it("should return the same instance", () => {
        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );
        buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        expect(buildBetLegParts.recomputations()).toEqual(1);
      });
    });

    describe("when legs array is different", () => {
      it("should return a new instance", () => {
        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs,
        );

        buildBetLegParts(
          DEFAULT_MULTIPLE_BET_STATE,
          ANOTHER_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:567789435"].legs,
        );

        expect(buildBetLegParts.recomputations()).toEqual(2);
      });
    });

    describe("when a leg has a selectionTypeIcon", () => {
      describe("when isBrandSettingEnabled returns false", () => {
        it("should not return an icon", () => {
          isBrandSettingEnabled.mockReturnValueOnce(false);
          getSelectionTypeIcon.mockReturnValueOnce(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);

          const buildBetLegParts = createBuildBetLegPartsVM(
            DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
          );

          const mockLeg = {
            ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs[0],
            selectionTypeIcon: "SOME ICON",
          };
          const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, [mockLeg]);

          expect(legs[0].selectionTypeIcon).toBe(undefined);
        });
      });

      describe("when getSelectionTypeIcon returns an icon", () => {
        it("should return the correct icon", () => {
          isBrandSettingEnabled.mockReturnValueOnce(true);
          getSelectionTypeIcon.mockReturnValueOnce(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);

          const buildBetLegParts = createBuildBetLegPartsVM(
            DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
          );

          const mockLeg = {
            ...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs[0],
            selectionTypeIcon: "SOME ICON",
          };
          const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, [mockLeg]);

          expect(legs[0].selectionTypeIcon).toBe("Value--Two-Up-Early-Payout-Monochrome");
        });
      });
    });

    describe("when a leg has super sub", () => {
      let buildBetLegParts;
      let mockLegs;

      beforeEach(() => {
        buildBetLegParts = createBuildBetLegPartsVM();
        mockLegs = DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs;

        mockLegs[0].parts[0].isSuperSub = true;
      });

      it("should return isSuperSub as true", () => {
        const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

        expect(legs[0].isSuperSub).toBe(true);
      });

      it("should return subtitle correctly", () => {
        const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

        expect(legs[0].subtitle).toBe("I18N.MYBETS.SUPER_SUB.BET_LEG BETLEGDESCRIPTION:Match Odds");
      });

      describe("and participants are not defined", () => {
        it("should return previousTitle as undefined", () => {
          mockLegs[0].parts[0].participants = undefined;

          const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

          expect(legs[0].participantId).toBeUndefined();
          expect(legs[0].previousTitle).toBeUndefined();
        });
      });

      describe("and participants are empty", () => {
        it("should return previousTitle as undefined", () => {
          mockLegs[0].parts[0].participants = [];

          const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

          expect(legs[0].participantId).toBeUndefined();
          expect(legs[0].previousTitle).toBeUndefined();
        });
      });

      describe("and participants are defined", () => {
        describe("and fixture is not defined", () => {
          beforeEach(() => {
            getFixtureBySportEventURN.mockReturnValueOnce(undefined);
          });

          it("should return previousTitle as undefined", () => {
            mockLegs[0].parts[0].participants = [{ participantId: "participantId" }];

            const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

            expect(legs[0].participantId).toBe("participantId");
            expect(legs[0].previousTitle).toBeUndefined();
          });
        });

        describe("and fixture is defined, but doesn't have players", () => {
          beforeEach(() => {
            getFixtureBySportEventURN.mockReturnValueOnce({ players: undefined });
          });

          it("should return previousTitle as undefined", () => {
            mockLegs[0].parts[0].participants = [{ participantId: "participantId" }];

            const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

            expect(legs[0].participantId).toBe("participantId");
            expect(legs[0].previousTitle).toBeUndefined();
          });
        });

        describe("and fixture has players", () => {
          beforeEach(() => {
            getFixtureBySportEventURN.mockReturnValueOnce({
              urn: "fixtureURN",
              typename: "fixtureTypename",
              players: [
                {
                  id: "participantIdWithoutSubs",
                  substitutions: [],
                },
                {
                  id: "participantId",
                  substitutions: [
                    { player: { name: "first sub name" } },
                    { player: { name: "second sub name" } },
                    { player: { name: "last sub name" } },
                  ],
                },
              ],
            });
          });

          it("should return fixtureURN and fixtureTypename correctly", () => {
            const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

            expect(legs[0].fixtureURN).toBe("fixtureURN");
            expect(legs[0].fixtureTypename).toBe("fixtureTypename");
          });

          it("should return previousTitle as undefined for a participant not in the fixture", () => {
            mockLegs[0].parts[0].participants = [{ participantId: "invalidParticipantId" }];

            const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

            expect(legs[0].participantId).toBe("invalidParticipantId");
            expect(legs[0].previousTitle).toBeUndefined();
          });

          it("should return previousTitle as undefined for a participant without subs", () => {
            mockLegs[0].parts[0].participants = [{ participantId: "participantIdWithoutSubs" }];

            const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

            expect(legs[0].participantId).toBe("participantIdWithoutSubs");
            expect(legs[0].previousTitle).toBeUndefined();
          });

          it("should return previousTitle as title and title as the sub name for a participant with subs", () => {
            mockLegs[0].parts[0].participants = [{ participantId: "participantId" }];

            const legs = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

            expect(legs[0].participantId).toBe("participantId");
            expect(legs[0].previousTitle).toBe("Runner name with handicap");
            expect(legs[0].title).toBe("last sub name");
          });
        });
      });
    });

    describe("when a leg has outcomeBasedDetails", () => {
      it("should return the leg correctly for playerVsPlayer", () => {
        getPlayerNameFromMetadata.mockReturnValueOnce("Participant B");
        getPlayerNameFromMetadata.mockReturnValueOnce("Participant A");
        getExpressionInfo.mockReturnValueOnce({
          templateId: "playerVsPlayer",
          params: {
            participantIdB: "participantIdB",
            participantIdA: "participantIdA",
            timePeriodId: "MATCH",
            outcomeId: "GOALS_TIME_ADJUSTED",
          },
          metadata: {
            participants: [
              { id: "participantIdA", name: "Participant A" },
              { id: "participantIdB", name: "Participant B" },
            ],
          },
          result: "WON",
          subExpressionInfos: [],
        });

        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        const mockLegs = [...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs];
        mockLegs[0].outcomeBasedDetails = {
          expressionInfo: {
            templateId: "playerVsPlayer",
            templateVersion: 1,
            params: {
              participantIdB: "participantIdB",
              participantIdA: "participantIdA",
              timePeriodId: "MATCH",
              outcomeId: "GOALS_TIME_ADJUSTED",
            },
            expressionComponents: {
              leftOperand: [
                {
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantId: "participantIdA",
                },
              ],
              operator: ">",
              rightOperand: [
                {
                  outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                  timePeriodId: "MATCH",
                  participantId: "participantIdB",
                },
              ],
            },
            expressionMetadata: {
              participants: [
                { id: "participantIdA", name: "Participant A" },
                { id: "participantIdB", name: "Participant B" },
              ],
            },
            subExpressionInfos: [],
            result: "WON",
          },
        };

        const parts = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

        expect(parts[0]).toEqual({
          subtitle:
            "I18N.OBB.DESCRIPTION.BETSLIP.PVP INCIDENTTYPE:GOALS_TIME_ADJUSTED, OPERATOR:MORE, PLAYERNAME:Participant B, PERIOD:MATCH, COUNT:2",
          title: "Participant A",
          is90Min: false,
          navigationViewLink: {
            viewUrl: "soccer/portuguese-primeira-liga/pacos-ferreira-v-porto/e-30088804",
            viewUrn: "ppb:tbd:view:event:30088804",
          },
          eventUrn: "eventUrn",
          outcomeDefinitionExp: "outcomeDefinitionExp",
          isSuperSub: true,
          trap: 3,
          meetingCountry: "GB",
          expressionComponents: {
            leftOperand: [
              {
                outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                timePeriodId: "MATCH",
                participantId: "participantIdA",
              },
            ],
            operator: ">",
            rightOperand: [
              {
                outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                timePeriodId: "MATCH",
                participantId: "participantIdB",
              },
            ],
          },
          expressionMetadata: {
            participants: [
              { id: "participantIdA", name: "Participant A" },
              { id: "participantIdB", name: "Participant B" },
            ],
          },
          betLegPartType: "playerVsPlayer",
          result: "WON",
          statusLabel: {
            statusLabelSize: "small",
            statusLabelType: "won",
            text: "I18N.MY_BETS.RESULT.WON",
          },
        });
      });

      it("should return the leg correctly for squadBet", () => {
        getObbSquadBetSupportingText.mockReturnValue("Participant A, Participant B & Participant C");
        getExpressionInfo.mockReturnValue({
          templateId: "participantsCombined",
          params: {
            participantIds: ["participantIdA", "participantIdB", "participantIdC"],
            timePeriodId: "MATCH",
            outcomeIds: ["GOALS"],
            quantifier: "AT_LEAST",
            value: 2,
          },
          metadata: {
            participants: [
              { id: "participantIdA", name: "Participant A" },
              { id: "participantIdB", name: "Participant B" },
              { id: "participantIdC", name: "Participant C" },
            ],
          },
          result: "LOST",
          subExpressionInfos: [],
        });

        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        const mockLegs = [...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs];
        mockLegs[0].outcomeBasedDetails = {
          expressionInfo: {
            templateId: "participantsCombined",
            templateVersion: 1,
            params: {
              participantIds: ["participantIdA", "participantIdB", "participantIdC"],
              timePeriodId: "MATCH",
              outcomeIds: ["GOALS"],
              quantifier: "AT_LEAST",
              value: 2,
            },
            result: "LOST",
            expressionMetadata: {
              participants: [
                { id: "participantIdA", name: "Participant A" },
                { id: "participantIdB", name: "Participant B" },
                { id: "participantIdC", name: "Participant C" },
              ],
            },
          },
        };

        const parts = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

        expect(parts[0]).toEqual({
          subtitle: "2+ I18N.OBB.DESCRIPTION.BETSLIP.SQUADBET INCIDENTTYPE:GOALS, COUNT:2",
          title: "Participant A, Participant B & Participant C",
          is90Min: false,
          navigationViewLink: {
            viewUrl: "soccer/portuguese-primeira-liga/pacos-ferreira-v-porto/e-30088804",
            viewUrn: "ppb:tbd:view:event:30088804",
          },
          eventUrn: "eventUrn",
          outcomeDefinitionExp: "outcomeDefinitionExp",
          isSuperSub: true,
          trap: 3,
          meetingCountry: "GB",
          expressionMetadata: {
            participants: [
              { id: "participantIdA", name: "Participant A" },
              { id: "participantIdB", name: "Participant B" },
              { id: "participantIdC", name: "Participant C" },
            ],
          },
          betLegPartType: "participantsCombined",
          statusLabel: {
            statusLabelSize: "small",
            statusLabelType: "lost",
            text: "I18N.MY_BETS.RESULT.LOST",
          },
          result: "LOST",
        });
      });
      it("should return the leg correctly for squadVsSquadBet", () => {
        formatObbParticipants.mockReturnValueOnce("Participant A & Participant B").mockReturnValueOnce("Participant C");
        getExpressionInfo.mockReturnValue({
          templateId: "squadVsSquad",
          params: {
            outcomeIds: ["SHOTS_ON_TARGET_TIME_ADJUSTED"],
            timePeriodId: "MATCH",
            squadAParticipantIds: ["participantIdA", "participantIdB"],
            squadBParticipantIds: ["participantIdC"],
            quantifier: "GREATER_THAN",
          },
          metadata: {
            participants: [
              { id: "participantIdA", name: "Participant A" },
              { id: "participantIdB", name: "Participant B" },
              { id: "participantIdC", name: "Participant C" },
            ],
          },
          subExpressionInfos: [],
        });

        const buildBetLegParts = createBuildBetLegPartsVM(
          DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
        );
        const mockLegs = [...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs];
        mockLegs[0].outcomeBasedDetails = {
          expressionInfo: {
            templateId: "squadVsSquad",
            templateVersion: 1,
            params: {
              outcomeIds: ["SHOTS_ON_TARGET_TIME_ADJUSTED"],
              timePeriodId: "MATCH",
              squadAParticipantIds: ["participantIdA", "participantIdB"],
              squadBParticipantIds: ["participantIdC"],
              quantifier: "GREATER_THAN",
            },
            expressionMetadata: {
              participants: [
                { id: "participantIdA", name: "Participant A" },
                { id: "participantIdB", name: "Participant B" },
                { id: "participantIdC", name: "Participant C" },
              ],
            },
          },
        };

        const parts = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

        expect(parts[0]).toEqual({
          subtitle:
            "I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD INCIDENTTYPE:SHOTS_ON_TARGET_TIME_ADJUSTED, OPERATOR:GREATER_THAN, PLAYERSNAME:Participant C, COUNT:2",
          title: "Participant A & Participant B",
          is90Min: false,
          navigationViewLink: {
            viewUrl: "soccer/portuguese-primeira-liga/pacos-ferreira-v-porto/e-30088804",
            viewUrn: "ppb:tbd:view:event:30088804",
          },
          eventUrn: "eventUrn",
          odd: undefined,
          outcomeDefinitionExp: "outcomeDefinitionExp",
          meetingCountry: "GB",
          trap: 3,
          isSuperSub: true,
          expressionMetadata: {
            participants: [
              { id: "participantIdA", name: "Participant A" },
              { id: "participantIdB", name: "Participant B" },
              { id: "participantIdC", name: "Participant C" },
            ],
          },
          betLegPartType: "squadVsSquad",
        });
      });

      describe("when the leg in an xOfN", () => {
        it("should return the leg correctly for playerVsPLayer base legs", () => {
          getPlayerNameFromMetadata.mockReturnValueOnce("Participant B");
          getPlayerNameFromMetadata.mockReturnValueOnce("Participant A");
          getPlayerNameFromMetadata.mockReturnValueOnce(null);
          getPlayerNameFromMetadata.mockReturnValueOnce(null);
          getExpressionInfo.mockReturnValueOnce({
            templateId: "xOfN",
            params: {
              x: 2,
            },
            metadata: null,
            subExpressionInfos: [
              {
                templateId: "playerVsPlayer",
                params: {
                  participantIdB: "participantIdB",
                  participantIdA: "participantIdA",
                  timePeriodId: "MATCH",
                  outcomeId: "GOALS_TIME_ADJUSTED",
                },
                expressionMetadata: {
                  participants: [
                    { id: "participantIdA", name: "Participant A" },
                    { id: "participantIdB", name: "Participant B" },
                  ],
                },
                result: "VOID",
              },
              {
                templateId: "playerVsPlayer",
                params: {
                  participantIdA: "participantIdD",
                  participantIdB: "participantIdC",
                  timePeriodId: "MATCH",
                  outcomeId: "GOALS_TIME_ADJUSTED",
                },
                expressionMetadata: {
                  participants: [
                    { id: "participantIdC", name: null },
                    { id: "participantIdD", name: null },
                  ],
                },
                result: "VOID",
              },
            ],
          });
          getExpressionInfo.mockReturnValueOnce({
            templateId: "playerVsPlayer",
            params: {
              participantIdB: "participantIdB",
              participantIdA: "participantIdA",
              timePeriodId: "MATCH",
              outcomeId: "GOALS_TIME_ADJUSTED",
            },
            expressionMetadata: {
              participants: [
                { id: "participantIdA", name: "Participant A" },
                { id: "participantIdB", name: "Participant B" },
              ],
            },
            result: "VOID",
          });
          getExpressionInfo.mockReturnValueOnce({
            templateId: "playerVsPlayer",
            params: {
              participantIdB: "participantIdC",
              participantIdA: "participantIdD",
              timePeriodId: "MATCH",
              outcomeId: "GOALS_TIME_ADJUSTED",
            },
            expressionMetadata: {
              participants: [
                { id: "participantIdC", name: null },
                { id: "participantIdD", name: null },
              ],
            },
            result: "VOID",
          });

          const buildBetLegParts = createBuildBetLegPartsVM(
            DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
          );
          const mockLegs = [...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs];
          mockLegs[0].parts[0].selectionName =
            "Participant D to score more goals than Participant C during regular time";
          mockLegs[0].outcomeBasedDetails = {
            expressionInfo: {
              templateId: "xOfN",
              templateVersion: 1,
              params: {
                x: 2,
              },
              expressionComponents: null,
              expressionMetadata: null,
              subExpressionInfos: [
                {
                  templateId: "playerVsPlayer",
                  templateVersion: 1,
                  params: {
                    participantIdB: "participantIdB",
                    participantIdA: "participantIdA",
                    timePeriodId: "MATCH",
                    outcomeId: "GOALS_TIME_ADJUSTED",
                  },
                  expressionMetadata: {
                    participants: [
                      { id: "participantIdA", name: "Participant A" },
                      { id: "participantIdB", name: "Participant B" },
                    ],
                  },
                  result: "VOID",
                },
                {
                  templateId: "playerVsPlayer",
                  templateVersion: 1,
                  params: {
                    participantIdA: "participantIdD",
                    participantIdB: "participantIdC",
                    timePeriodId: "MATCH",
                    outcomeId: "GOALS_TIME_ADJUSTED",
                  },
                  expressionMetadata: {
                    participants: [
                      { id: "participantIdC", name: null },
                      { id: "participantIdD", name: null },
                    ],
                  },
                  result: "VOID",
                },
              ],
            },
          };

          const parts = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

          expect(parts[0]).toEqual({
            subtitle:
              "I18N.OBB.DESCRIPTION.BETSLIP.PVP INCIDENTTYPE:GOALS_TIME_ADJUSTED, OPERATOR:MORE, PLAYERNAME:Participant B, PERIOD:MATCH, COUNT:2",
            title: "Participant A",
            is90Min: false,
            navigationViewLink: {
              viewUrl: "soccer/portuguese-primeira-liga/pacos-ferreira-v-porto/e-30088804",
              viewUrn: "ppb:tbd:view:event:30088804",
            },
            eventUrn: "eventUrn",
            outcomeDefinitionExp: "outcomeDefinitionExp",
            isSuperSub: true,
            trap: 3,
            meetingCountry: "GB",
            expressionMetadata: {
              participants: [
                { id: "participantIdA", name: "Participant A" },
                { id: "participantIdB", name: "Participant B" },
              ],
            },
            betLegPartType: "xOfN",
            result: "VOID",
            statusLabel: {
              statusLabelSize: "small",
              statusLabelType: "neutral",
              text: "I18N.MY_BETS.RESULT.VOID",
            },
          });

          expect(parts[1]).toEqual({
            subtitle: "Participant D to score more goals than Participant C during regular time",
            title: "",
            is90Min: false,
            navigationViewLink: {
              viewUrl: "soccer/portuguese-primeira-liga/pacos-ferreira-v-porto/e-30088804",
              viewUrn: "ppb:tbd:view:event:30088804",
            },
            eventUrn: "eventUrn",
            outcomeDefinitionExp: "outcomeDefinitionExp",
            isSuperSub: true,
            trap: 3,
            meetingCountry: "GB",
            expressionMetadata: {
              participants: [
                { id: "participantIdC", name: null },
                { id: "participantIdD", name: null },
              ],
            },
            betLegPartType: "xOfN",
            result: "VOID",
            statusLabel: {
              statusLabelSize: "small",
              statusLabelType: "neutral",
              text: "I18N.MY_BETS.RESULT.VOID",
            },
          });
        });

        it("should return the leg correctly for squadBet base legs", () => {
          getObbSquadBetSupportingText.mockReturnValue("Participant A, Participant B & Participant C");
          getExpressionInfo.mockReturnValueOnce({
            templateId: "xOfN",
            params: {
              x: 2,
            },
            metadata: null,
            subExpressionInfos: [
              {
                templateId: "participantsCombined",
                params: {
                  participantIds: ["participantIdA", "participantIdB", "participantIdC"],
                  timePeriodId: "MATCH",
                  outcomeIds: ["GOALS"],
                  quantifier: "AT_LEAST",
                  value: 2,
                },
                expressionMetadata: {
                  participants: [
                    { id: "participantIdA", name: "Participant A" },
                    { id: "participantIdB", name: "Participant B" },
                    { id: "participantIdC", name: "Participant C" },
                  ],
                },
              },
              {
                templateId: "participantsCombined",
                params: {
                  participantIds: ["participantIdA", "participantIdB", "participantIdC"],
                  timePeriodId: "MATCH",
                  outcomeIds: ["SHOTS"],
                  quantifier: "AT_LEAST",
                  value: 2,
                },
                expressionMetadata: {
                  participants: [
                    { id: "participantIdA", name: "Participant A" },
                    { id: "participantIdB", name: "Participant B" },
                    { id: "participantIdC", name: "Participant C" },
                  ],
                },
              },
            ],
          });
          getExpressionInfo.mockReturnValueOnce({
            templateId: "participantsCombined",
            params: {
              participantIds: ["participantIdA", "participantIdB", "participantIdC"],
              timePeriodId: "MATCH",
              outcomeIds: ["GOALS"],
              quantifier: "AT_LEAST",
              value: 2,
            },
            expressionMetadata: {
              participants: [
                { id: "participantIdA", name: "Participant A" },
                { id: "participantIdB", name: "Participant B" },
                { id: "participantIdC", name: "Participant C" },
              ],
            },
          });
          getExpressionInfo.mockReturnValueOnce({
            templateId: "participantsCombined",
            params: {
              participantIds: ["participantIdA", "participantIdB", "participantIdC"],
              timePeriodId: "MATCH",
              outcomeIds: ["SHOTS"],
              quantifier: "AT_LEAST",
              value: 2,
            },
            expressionMetadata: {
              participants: [
                { id: "participantIdA", name: "Participant A" },
                { id: "participantIdB", name: "Participant B" },
                { id: "participantIdC", name: "Participant C" },
              ],
            },
          });

          const buildBetLegParts = createBuildBetLegPartsVM(
            DEFAULT_MULTIPLE_BET_STATE.layouts.cards.sportsbookbets["ppb:tbd:card:sbkBet:923378353"].navigationLinks,
          );
          const mockLegs = [...DEFAULT_MULTIPLE_BET_STATE.betting.sportsbookbets["ppb:sbkBet:923378353"].legs];

          mockLegs[0].outcomeBasedDetails = {
            expressionInfo: {
              templateId: "xOfN",
              params: {
                x: 2,
              },
              subExpressionInfos: [
                {
                  templateId: "participantsCombined",
                  params: {
                    participantIds: ["participantIdA", "participantIdB", "participantIdC"],
                    timePeriodId: "MATCH",
                    outcomeIds: ["GOALS"],
                    quantifier: "AT_LEAST",
                    value: 2,
                  },
                  expressionMetadata: {
                    participants: [
                      { id: "participantIdA", name: "Participant A" },
                      { id: "participantIdB", name: "Participant B" },
                      { id: "participantIdC", name: "Participant C" },
                    ],
                  },
                },
                {
                  templateId: "participantsCombined",
                  params: {
                    participantIds: ["participantIdA", "participantIdB", "participantIdC"],
                    timePeriodId: "MATCH",
                    outcomeIds: ["SHOTS"],
                    quantifier: "AT_LEAST",
                    value: 2,
                  },
                  expressionMetadata: {
                    participants: [
                      { id: "participantIdA", name: "Participant A" },
                      { id: "participantIdB", name: "Participant B" },
                      { id: "participantIdC", name: "Participant C" },
                    ],
                  },
                },
              ],
            },
          };

          const parts = buildBetLegParts(DEFAULT_MULTIPLE_BET_STATE, mockLegs);

          expect(parts[0]).toEqual({
            subtitle: "2+ I18N.OBB.DESCRIPTION.BETSLIP.SQUADBET INCIDENTTYPE:GOALS, COUNT:2",
            title: "Participant A, Participant B & Participant C",
            is90Min: false,
            navigationViewLink: {
              viewUrl: "soccer/portuguese-primeira-liga/pacos-ferreira-v-porto/e-30088804",
              viewUrn: "ppb:tbd:view:event:30088804",
            },
            eventUrn: "eventUrn",
            outcomeDefinitionExp: "outcomeDefinitionExp",
            isSuperSub: true,
            trap: 3,
            meetingCountry: "GB",
            expressionMetadata: {
              participants: [
                { id: "participantIdA", name: "Participant A" },
                { id: "participantIdB", name: "Participant B" },
                { id: "participantIdC", name: "Participant C" },
              ],
            },
            betLegPartType: "xOfN",
          });

          expect(parts[1]).toEqual({
            subtitle: "2+ I18N.OBB.DESCRIPTION.BETSLIP.SQUADBET INCIDENTTYPE:SHOTS, COUNT:2",
            title: "Participant A, Participant B & Participant C",
            is90Min: false,
            navigationViewLink: {
              viewUrl: "soccer/portuguese-primeira-liga/pacos-ferreira-v-porto/e-30088804",
              viewUrn: "ppb:tbd:view:event:30088804",
            },
            eventUrn: "eventUrn",
            outcomeDefinitionExp: "outcomeDefinitionExp",
            isSuperSub: true,
            trap: 3,
            meetingCountry: "GB",
            expressionMetadata: {
              participants: [
                { id: "participantIdA", name: "Participant A" },
                { id: "participantIdB", name: "Participant B" },
                { id: "participantIdC", name: "Participant C" },
              ],
            },
            betLegPartType: "xOfN",
          });
        });
      });
    });
  });
});
