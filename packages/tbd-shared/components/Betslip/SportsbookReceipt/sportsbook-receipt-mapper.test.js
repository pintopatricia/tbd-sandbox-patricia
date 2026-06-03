import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { FallbackIconType } from "@ppb/the-wall-common/types";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import {
  isCast,
  isMultiple,
  isBoostedMultiple,
  isSingle,
  isLotteries,
  isBetBuilder,
  isMultiBetBuilder,
} from "@ppb/tbd-store/helpers/sportsbook-betting";
import { BET_TYPES, LEG_TYPES } from "@ppb/betslip-core";
import { RacingSport } from "@ppb/tbd-store";
import { currencyFormatWithDecimalPlaces } from "../../../formatters/currency-formatters";
import {
  createSelectionsBuilder,
  createMultiplesBuilder,
  createBoostedMultiplesBuilder,
  createSinglesBuilder,
  createCastsBuilder,
  createBetBuildersBuilder,
  createMultiBetBuilder,
  createMultiBetBuilderGroups,
  createOneLineBetsBuilder,
} from "./sportsbook-receipt-mapper";
import {
  buildSportsbookFreeBetsLabel,
  buildOriginalPotentialReturns,
  buildPotentialReturns,
  getCastOrdinal,
  buildOdds,
} from "../betslip-formatters";
import { buildSelection, buildMultiBetBuilderGroup } from "../connected-sportsbook-betslip-mapper";
import { i18n } from "../../../helpers/i18n";
import { buildFreeBetsAlertMessage, getGenerosityReceiptAlertData } from "../../../helpers/generosity-wallets";
import { getSelectionTypeIcon } from "../../../helpers/selection-type";
import { getBoostedInfo } from "../../../helpers/boosted-info";

const getUserDetails = jest.fn();
const isBrandSettingEnabled = jest.fn();

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting");
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn().mockReturnValue("Formatted Display Odds"),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getSportsbookReport: jest.fn().mockReturnValue({ result: {} }),
}));
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));
jest.mock("@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors", () => ({
  createIsBrandSettingEnabledSelector: jest.fn(() => isBrandSettingEnabled),
}));

jest.mock("reselect", () => ({
  createSelector: jest.fn((_deps, selector) => selector),
  createSelectorCreator: jest.fn(() => jest.fn((selector) => selector)),
}));
jest.mock("../../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("Formatted Currency"),
}));
jest.mock("../../../helpers/dates", () => ({
  formatTime: jest.fn((n) => n),
}));
jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("../../../helpers/generosity-wallets", () => ({
  getGenerosityReceiptAlertData: jest
    .fn()
    .mockReturnValue({ message: "generosity alert message mock", icon: "generosity icon mock" }),
  sumWalletsAmounts: jest.fn((a = 0, b = 0) => a + b),
  buildFreeBetsAlertMessage: jest.fn().mockReturnValue("free bets alert message mock"),
}));
jest.mock("../../../helpers/selection-type", () => ({
  getSelectionTypeIcon: jest.fn(),
}));

jest.mock("../../../helpers/boosted-info", () => ({
  getBoostedInfo: jest.fn(),
}));

jest.mock("../betslip-formatters", () => ({
  buildSportsbookFreeBetsLabel: jest.fn().mockReturnValue("some freeBetsLabel"),
  buildOriginalPotentialReturns: jest.fn().mockReturnValue("some originalPotentialReturns"),
  buildPotentialReturns: jest.fn().mockReturnValue("some potentialReturns"),
  getCastOrdinal: jest.fn().mockReturnValue("ordinal"),
  buildRacingTitle: jest.fn().mockReturnValue("Racing title"),
  buildOdds: jest.fn(),
}));
jest.mock("../connected-sportsbook-betslip-mapper", () => ({
  buildSelection: jest.fn().mockReturnValue({
    title: "Title",
    subtitle: "Subtitle",
    icon: "Icon",
    silkFallbackType: FallbackIconType.HorseRacing,
    racingSport: RacingSport.HORSE_RACING,
    trap: 2,
    meetingCountry: "UK",
    eventId: "1",
    eventUrn: "ppb:event:1",
  }),
  buildMultiBetBuilderGroup: jest.fn(() => ({
    groupUrn: "urn:group",
    groupTitle: "some title",
  })),
}));

describe("Sportsbook Receipt Mapper", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createSelectionsBuilder", () => {
    describe("when there is no report", () => {
      it("should return no selections", () => {
        expect(createSelectionsBuilder()(undefined, {}, {}, [])).toEqual([]);
      });
    });

    describe("when there is a report", () => {
      describe("when there is a leg without odds", () => {
        it("should build the selection with SP", () => {
          buildOdds.mockReturnValue("SP");
          expect(
            createSelectionsBuilder()(
              {
                result: {
                  legs: { "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"], legType: LEG_TYPES.SIMPLE_SELECTION } },
                  relations: {
                    legsRunners: {
                      "LEG:1": {
                        "RUNNER:1": {
                          handicap: 3.5,
                        },
                      },
                    },
                  },
                },
                metadata: {
                  "RUNNER:1": {
                    runnerUrn: "RUNNER:1",
                    runnerName: "R",
                    marketName: "M",
                    eventName: "E",
                    type: "GENERIC",
                    eventUrn: "ppb:event:1",
                  },
                },
              },
              {},
              {},
              [],
              {
                sportevents: {
                  "ppb:event:1": {
                    urn: "ppb:event:1",
                    eventId: 1,
                  },
                },
              },
            ),
          ).toEqual([
            {
              urn: "RUNNER:1",
              id: "LEG:1",
              odd: "SP",
              subtitle: "Subtitle",
              icon: "Icon",
              silkFallbackType: FallbackIconType.HorseRacing,
              racingSport: 7,
              trap: 2,
              meetingCountry: "UK",
              action: "I18N.BETSLIP.REMOVE",
              title: "Title",
              isPushNotificationsUnavailable: false,
            },
          ]);
        });
      });

      describe("when there is a leg other than SIMPLE_SELECTION", () => {
        it("should not build the selection", () => {
          buildOdds.mockReturnValueOnce("10.2");
          expect(
            createSelectionsBuilder()(
              {
                result: {
                  legs: { "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"], legType: LEG_TYPES.FORECAST } },
                  relations: {
                    legsRunners: {
                      "LEG:1": {
                        "RUNNER:1": {
                          handicap: 3.5,
                        },
                      },
                    },
                  },
                },
                metadata: {
                  "RUNNER:1": {
                    runnerUrn: "RUNNER:1",
                    runnerName: "R",
                    marketName: "M",
                    eventName: "E",
                  },
                },
              },
              {},
              {},
              [],
              {
                sportevents: {
                  "ppb:event:1": {
                    urn: "ppb:event:1",
                    eventId: 1,
                  },
                },
              },
            ),
          ).toEqual([]);
        });
      });

      describe("when there is a leg with originalDisplayOdds", () => {
        it("should build the selection with those odds", () => {
          createSelectionsBuilder()(
            {
              result: {
                legs: {
                  "LEG:1": {
                    id: "LEG:1",
                    runners: ["RUNNER:1"],
                    originalDisplayOdds: 3,
                    legType: LEG_TYPES.SIMPLE_SELECTION,
                  },
                },
                relations: {
                  legsRunners: {
                    "LEG:1": {
                      "RUNNER:1": {
                        handicap: 3.5,
                      },
                    },
                  },
                },
              },
              metadata: {
                "RUNNER:1": {
                  runnerUrn: "RUNNER:1",
                  runnerName: "R",
                  marketName: "M",
                  eventName: "E",
                },
              },
            },
            {},
            {},
            [],
            {
              sportevents: {
                "ppb:event:1": {
                  urn: "ppb:event:1",
                  eventId: 1,
                },
              },
            },
          );
          expect(buildOdds).toHaveBeenCalledWith(3, undefined, undefined);
        });
      });

      describe("when there is a leg without originalDisplayOdds", () => {
        it("should build the selection with displayOdds", () => {
          createSelectionsBuilder()(
            {
              result: {
                legs: {
                  "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"], displayOdds: 3, legType: LEG_TYPES.SIMPLE_SELECTION },
                },
                relations: {
                  legsRunners: {
                    "LEG:1": {
                      "RUNNER:1": {
                        handicap: 3.5,
                      },
                    },
                  },
                },
              },
              metadata: {
                "RUNNER:1": {
                  runnerUrn: "RUNNER:1",
                  runnerName: "R",
                  marketName: "M",
                  eventName: "E",
                },
              },
            },
            {},
            {},
            [],
            {
              sportevents: {
                "ppb:event:1": {
                  urn: "ppb:event:1",
                  eventId: 1,
                },
              },
            },
          );
          expect(buildOdds).toHaveBeenCalledWith(3, undefined, undefined);
        });
      });

      describe("when there is all information", () => {
        function setupSeveralSelections() {
          formatOdds.mockReturnValue("Formatted Display Odds");
          return createSelectionsBuilder()(
            {
              result: {
                legs: {
                  "LEG:1": {
                    id: "LEG:1",
                    runners: ["RUNNER:1"],
                    displayOdds: "displayOdds",
                    legType: LEG_TYPES.SIMPLE_SELECTION,
                  },
                  "LEG:2": {
                    id: "LEG:2",
                    runners: ["RUNNER:2"],
                    displayOdds: "displayOdds 2",
                    legType: LEG_TYPES.SIMPLE_SELECTION,
                  },
                },
                relations: {
                  legsRunners: {
                    "LEG:1": {
                      "RUNNER:1": {
                        handicap: 3.5,
                      },
                    },
                    "LEG:2": {
                      "RUNNER:2": {
                        handicap: -3.5,
                      },
                    },
                  },
                },
              },
              metadata: {
                "RUNNER:1": {
                  runnerUrn: "RUNNER:1",
                  runnerName: "R",
                  marketName: "M",
                  eventName: "E",
                  is90Min: true,
                  marketType: "MARKET_TYPE_1",
                },
                "RUNNER:2": {
                  runnerUrn: "RUNNER:2",
                  runnerName: "R 2",
                  marketName: "M 2",
                  eventName: "E 2",
                  marketType: "MARKET_TYPE_2",
                },
              },
            },
            {},
            {},
            [],
            {
              sportevents: {
                "ppb:event:1": {
                  urn: "ppb:event:1",
                  eventId: 1,
                },
              },
            },
            {},
            true,
          );
        }

        it("should build all the selections", () => {
          buildOdds.mockReturnValueOnce("Formatted Display Odds 1");
          buildOdds.mockReturnValueOnce("Formatted Display Odds 2");
          getSelectionTypeIcon.mockReturnValueOnce(undefined);
          getSelectionTypeIcon.mockReturnValueOnce(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);
          const selections = setupSeveralSelections();

          expect(selections).toEqual([
            {
              urn: "RUNNER:1",
              id: "LEG:1",
              odd: "Formatted Display Odds 1",
              subtitle: "Subtitle",
              icon: "Icon",
              silkFallbackType: FallbackIconType.HorseRacing,
              racingSport: RacingSport.HORSE_RACING,
              meetingCountry: "UK",
              trap: 2,
              action: "I18N.BETSLIP.REMOVE",
              title: "Title",
              is90Min: true,
              selectionTypeIcon: undefined,
              isPushNotificationsUnavailable: false,
            },
            {
              urn: "RUNNER:2",
              id: "LEG:2",
              odd: "Formatted Display Odds 2",
              subtitle: "Subtitle",
              icon: "Icon",
              racingSport: 7,
              meetingCountry: "UK",
              trap: 2,
              silkFallbackType: FallbackIconType.HorseRacing,
              action: "I18N.BETSLIP.REMOVE",
              title: "Title",
              selectionTypeIcon: IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME,
              isPushNotificationsUnavailable: false,
            },
          ]);
        });

        it("should call buildSelection for each selection", () => {
          setupSeveralSelections();

          expect(buildSelection).toHaveBeenCalledTimes(2);
        });

        it("should call buildOdds for each selection", () => {
          setupSeveralSelections();

          expect(buildOdds).toHaveBeenCalledTimes(2);
        });
      });

      describe("when selections have no eventUrn", () => {
        it("should build the selection with a truthy isPushNotificationsUnavailable", () => {
          buildOdds.mockReturnValue("SP");
          expect(
            createSelectionsBuilder()(
              {
                result: {
                  legs: { "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"], legType: LEG_TYPES.SIMPLE_SELECTION } },
                  relations: {
                    legsRunners: {
                      "LEG:1": {
                        "RUNNER:1": {
                          handicap: 3.5,
                        },
                      },
                    },
                  },
                },
                metadata: {
                  "RUNNER:1": {
                    runnerUrn: "RUNNER:1",
                    runnerName: "R",
                    marketName: "M",
                    eventName: "E",
                    sportId: "1",
                  },
                },
              },
              {},
              {},
              ["1"],
              {
                sportevents: {},
              },
            ),
          ).toEqual([
            {
              urn: "RUNNER:1",
              id: "LEG:1",
              odd: "SP",
              subtitle: "Subtitle",
              icon: "Icon",
              silkFallbackType: FallbackIconType.HorseRacing,
              racingSport: 7,
              meetingCountry: "UK",
              trap: 2,
              action: "I18N.BETSLIP.REMOVE",
              title: "Title",
              isPushNotificationsUnavailable: true,
            },
          ]);
        });
      });

      describe("when there are no notifications", () => {
        it("should build the selection with a truthy isPushNotificationsUnavailable", () => {
          buildOdds.mockReturnValue("SP");
          expect(
            createSelectionsBuilder()(
              {
                result: {
                  legs: { "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"], legType: LEG_TYPES.SIMPLE_SELECTION } },
                  relations: {
                    legsRunners: {
                      "LEG:1": {
                        "RUNNER:1": {
                          handicap: 3.5,
                        },
                      },
                    },
                  },
                },
                metadata: {
                  "RUNNER:1": {
                    runnerUrn: "RUNNER:1",
                    runnerName: "R",
                    marketName: "M",
                    eventName: "E",
                    eventUrn: "ppb:event:1",
                    sportId: "1",
                  },
                },
              },
              {},
              {},
              ["1"],
              {
                sportevents: {
                  "ppb:event:1": {
                    urn: "ppb:event:1",
                    eventId: 1,
                  },
                },
              },
            ),
          ).toEqual([
            {
              urn: "RUNNER:1",
              id: "LEG:1",
              odd: "SP",
              subtitle: "Subtitle",
              icon: "Icon",
              silkFallbackType: FallbackIconType.HorseRacing,
              racingSport: 7,
              meetingCountry: "UK",
              trap: 2,
              action: "I18N.BETSLIP.REMOVE",
              title: "Title",
              isPushNotificationsUnavailable: true,
            },
          ]);
        });
      });

      describe("when metadata sportId is not supported by push notifications", () => {
        it("should build the selection with a falsy isPushNotificationsUnavailable", () => {
          buildOdds.mockReturnValue("SP");
          expect(
            createSelectionsBuilder()(
              {
                result: {
                  legs: { "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"], legType: LEG_TYPES.SIMPLE_SELECTION } },
                  relations: {
                    legsRunners: {
                      "LEG:1": {
                        "RUNNER:1": {
                          handicap: 3.5,
                        },
                      },
                    },
                  },
                },
                metadata: {
                  "RUNNER:1": {
                    runnerUrn: "RUNNER:1",
                    runnerName: "R",
                    marketName: "M",
                    eventName: "E",
                    eventUrn: "ppb:event:1",
                    sportId: "1",
                  },
                },
              },
              {},
              {},
              [],
              {
                sportevents: {
                  "ppb:event:1": {
                    urn: "ppb:event:1",
                    eventId: 1,
                  },
                },
              },
            ),
          ).toEqual([
            {
              urn: "RUNNER:1",
              id: "LEG:1",
              odd: "SP",
              subtitle: "Subtitle",
              icon: "Icon",
              silkFallbackType: FallbackIconType.HorseRacing,
              racingSport: 7,
              meetingCountry: "UK",
              trap: 2,
              action: "I18N.BETSLIP.REMOVE",
              title: "Title",
              isPushNotificationsUnavailable: false,
            },
          ]);
        });
      });

      describe("when all events sport types are unsupported", () => {
        it("should build the selections with a falsy isPushNotificationsUnavailable", () => {
          buildOdds.mockReturnValue("SP");
          expect(
            createSelectionsBuilder()(
              {
                result: {
                  legs: {
                    "LEG:1": { id: "LEG:1", runners: ["RUNNER:1"], legType: LEG_TYPES.SIMPLE_SELECTION },
                    "LEG:2": { id: "LEG:2", runners: ["RUNNER:2"], legType: LEG_TYPES.SIMPLE_SELECTION },
                  },
                  relations: {
                    legsRunners: {
                      "LEG:1": {
                        "RUNNER:1": {
                          handicap: 3.5,
                        },
                      },
                      "LEG:2": {
                        "RUNNER:2": {
                          handicap: 3.5,
                        },
                      },
                    },
                  },
                },
                metadata: {
                  "RUNNER:1": {
                    runnerUrn: "RUNNER:1",
                    runnerName: "R",
                    marketName: "M",
                    eventName: "E",
                    eventUrn: "ppb:event:1",
                    sportId: "4339",
                  },
                  "RUNNER:2": {
                    runnerUrn: "RUNNER:2",
                    runnerName: "R",
                    marketName: "M",
                    eventName: "E",
                    eventUrn: "ppb:event:2",
                    sportId: "4",
                  },
                },
              },
              {},
              {},
              ["1"],
              {
                sportevents: {
                  "ppb:event:1": {
                    urn: "ppb:event:1",
                    eventId: 1,
                  },
                },
              },
            ),
          ).toEqual([
            {
              urn: "RUNNER:1",
              id: "LEG:1",
              odd: "SP",
              subtitle: "Subtitle",
              icon: "Icon",
              silkFallbackType: FallbackIconType.HorseRacing,
              racingSport: 7,
              meetingCountry: "UK",
              trap: 2,
              action: "I18N.BETSLIP.REMOVE",
              title: "Title",
              isPushNotificationsUnavailable: false,
            },
            {
              urn: "RUNNER:2",
              id: "LEG:2",
              odd: "SP",
              subtitle: "Subtitle",
              icon: "Icon",
              silkFallbackType: FallbackIconType.HorseRacing,
              racingSport: 7,
              meetingCountry: "UK",
              trap: 2,
              action: "I18N.BETSLIP.REMOVE",
              title: "Title",
              isPushNotificationsUnavailable: false,
            },
          ]);
        });
      });
    });
  });

  describe("createMultiplesBuilder", () => {
    describe("when there is no report", () => {
      it("should return no summaries", () => {
        expect(createMultiplesBuilder()(undefined, {}, {})).toEqual([]);
      });
    });

    describe("when there are only singles", () => {
      function setupSinglesReport() {
        isMultiple.mockReturnValue(false);
        formatOdds.mockReturnValue("Formatted Display Odds");

        return createMultiplesBuilder()(
          {
            result: {
              combinations: {
                "COMBINATION:1": { id: "COMBINATION:1", betType: "SINGLE" },
              },
            },
            metadata: {
              "RUNNER:1": { runnerName: "R", marketName: "M", eventName: "E" },
            },
          },
          {},
        );
      }

      it("should return no summaries", () => {
        const summaries = setupSinglesReport();

        expect(summaries).toEqual([]);
      });
    });

    describe("when there are multiples", () => {
      function setupMultiplesReport(combinations = {}, hasGenerosityWallets = false) {
        isMultiple.mockReturnValue(true);
        formatOdds.mockReturnValue("Formatted Display Odds");

        return createMultiplesBuilder()(
          {
            result: {
              combinations: {
                "COMBINATION:1": {
                  id: "COMBINATION:1",
                  betType: "DOUBLE",
                  lines: 3,
                  isEachWaySelected: false,
                  isAccaInsured: false,
                  betReceiptId: "123",
                  regulatorId: "x-123",
                },
                "COMBINATION:2": {
                  id: "COMBINATION:2",
                  betType: "TREBLE",
                  lines: 1,
                  displayOdds: 1,
                  totalStake: 1.23,
                  originalTotalPotentialReturns: 2,
                  totalPotentialReturns: 3,
                  totalBonusUsed: 1,
                  hasBonusUsed: true,
                  isEachWaySelected: true,
                  isAccaInsured: true,
                  betReceiptId: "124",
                  regulatorId: "x-124",
                },
                "COMBINATION:3": {
                  id: "COMBINATION:3",
                  betType: "TREBLE",
                  lines: 1,
                  displayOdds: 1,
                  totalStake: 1.23,
                  totalPotentialReturns: 3,
                  totalBonusUsed: 1,
                  hasBonusUsed: true,
                  isEachWaySelected: true,
                  isAccaInsured: true,
                  isAccaInsuredToken: true,
                  isPriceBoosted: true,
                  betReceiptId: "125",
                  regulatorId: "x-125",
                },
                ...combinations,
              },
            },
            metadata: {
              "RUNNER:1": { runnerName: "R", marketName: "M", eventName: "E" },
            },
            isFreeBetsSelected: true,
          },
          {
            sportsbookOddsDisplay: "pref",
          },
          { details: "details" },
          hasGenerosityWallets,
        );
      }

      it("should call buildOdds with displayOdds", () => {
        setupMultiplesReport();

        expect(buildOdds).toHaveBeenCalledWith(1, "pref");
      });

      it("should call currencyFormatWithDecimalPlaces for the stake", () => {
        setupMultiplesReport();

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          details: "details",
          value: 1.23,
        });
      });

      it("should call buildOriginalPotentialReturns for the returns", () => {
        setupMultiplesReport({
          "COMBINATION:4": {
            id: "COMBINATION:4",
            betType: "TREBLE",
            lines: 1,
            displayOdds: 1,
            totalStake: 1.23,
            totalPotentialReturns: 3,
            totalBonusUsed: 1,
            hasBonusUsed: true,
            isEachWaySelected: true,
            isAccaInsured: false,
            isPriceBoosted: true,
            betReceiptId: "126",
            regulatorId: "x-125",
            originalTotalPotentialReturns: 2,
            originalDisplayOdds: {
              decimalOdds: 1.0,
              fractionalOdds: "1/1",
            },
          },
        });

        expect(buildOriginalPotentialReturns).toHaveBeenCalledWith(1.23, 2, { details: "details" });
      });

      it("should call formatOdds once for the returns", () => {
        setupMultiplesReport({
          "COMBINATION:4": {
            id: "COMBINATION:4",
            betType: "TREBLE",
            lines: 1,
            displayOdds: 1,
            totalStake: 1.23,
            totalPotentialReturns: 3,
            totalBonusUsed: 1,
            hasBonusUsed: true,
            isEachWaySelected: true,
            isAccaInsured: false,
            isPriceBoosted: true,
            betReceiptId: "126",
            regulatorId: "x-125",
            originalTotalPotentialReturns: 2,
            originalDisplayOdds: {
              decimalOdds: 1.0,
              fractionalOdds: "1/1",
            },
          },
        });

        expect(formatOdds).toHaveBeenNthCalledWith(1, { decimalOdds: 1.0, fractionalOdds: "1/1" }, "pref");
      });

      it("should call buildPotentialReturns for the returns", () => {
        setupMultiplesReport();

        expect(buildPotentialReturns).toHaveBeenCalledWith(1.23, 3, { details: "details" });
      });

      it("should call buildSportsbookFreeBetsLabel the same number as multiples in combinations", () => {
        setupMultiplesReport();

        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledTimes(3);
      });

      it("should return the summaries ordered by lines", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[0].title).toEqual("I18N.BETSLIP.SBK.MULTIPLE.TREBLE_LINES");
        expect(summaries[1].title).toEqual("I18N.BETSLIP.SBK.MULTIPLE.TREBLE_LINES");
        expect(summaries[2].title).toEqual("I18N.BETSLIP.SBK.MULTIPLE.DOUBLE_LINES");
      });

      it("should build summaries with and without odds", () => {
        buildOdds.mockReturnValueOnce("Formatted Display Odds");
        buildOdds.mockReturnValueOnce("I18N.BETSLIP.STARTING_PRICE");
        const summaries = setupMultiplesReport();

        expect(summaries[0].odds).toEqual("Formatted Display Odds");
        expect(summaries[1].odds).toEqual("I18N.BETSLIP.STARTING_PRICE");
      });

      it("should build summaries with returns", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[0].returns).toEqual("some potentialReturns");
        expect(summaries[1].returns).toEqual("some potentialReturns");
      });

      it("should build summaries with formatted stake", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[0].stake).toEqual("Formatted Currency");
        expect(summaries[1].stake).toEqual("Formatted Currency");
      });

      it("should build summaries with and without hasBonusUsed", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[0].hasBonusUsed).toEqual(true);
        expect(summaries[1].hasBonusUsed).toEqual(true);
        expect(summaries[2].hasBonusUsed).toEqual(undefined);
      });

      it("should build summaries with buildSportsbookFreeBetsLabel", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[0]).toEqual(
          expect.objectContaining({
            freeBetsLabel: "some freeBetsLabel",
            generosityAlertMessage: "generosity alert message mock",
          }),
        );
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledTimes(3);
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(
          undefined,
          { details: "details" },
          "I18N.BETSLIP.USED_BONUS",
        );
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(1, { details: "details" }, "I18N.BETSLIP.USED_BONUS");
      });

      it("should return the number of lines in each summary", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[0].lines).toEqual(1);
        expect(summaries[1].lines).toEqual(1);
        expect(summaries[2].lines).toEqual(3);
      });

      it("should build summaries with hasEachWay", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[0].hasEachWay).toBe(true);
        expect(summaries[1].hasEachWay).toBe(true);
        expect(summaries[2].hasEachWay).toBe(false);
      });

      it("should build first summary with hasAccaInsurance", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[0].hasAccaInsurance).toBe(true);
      });

      it("should build second summary with hasAccaInsurance", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[1].hasAccaInsurance).toBe(false);
      });

      it("should build third summary without hasAccaInsurance", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[2].hasAccaInsurance).toBe(false);
      });

      it("should build first summary with no oddsboost", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[0].hasMyOddsBoost).toBe(undefined);
      });

      it("should build third summary with no oddsboost", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[2].hasMyOddsBoost).toBe(undefined);
      });

      it("should build second summary with oddsboost", () => {
        const summaries = setupMultiplesReport();

        expect(summaries[1].hasMyOddsBoost).toBe(true);
      });

      describe("when hasGenerosityWallets is true", () => {
        it("should call getGenerosityReceiptAlertData with the correct props", () => {
          setupMultiplesReport({}, true);

          expect(getGenerosityReceiptAlertData).toHaveBeenCalledTimes(3);
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(1, {
            combination: expect.objectContaining({
              id: "COMBINATION:2",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: true,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(2, {
            combination: expect.objectContaining({
              id: "COMBINATION:3",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: true,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(3, {
            combination: expect.objectContaining({
              id: "COMBINATION:1",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: true,
          });
        });

        it("should have the correct free bets label", () => {
          const summaries = setupMultiplesReport({}, true);

          expect(summaries[0]).toEqual(
            expect.objectContaining({
              freeBetsLabel: undefined,
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
          expect(summaries[1]).toEqual(
            expect.objectContaining({
              freeBetsLabel: undefined,
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
          expect(summaries[2]).toEqual(
            expect.objectContaining({
              freeBetsLabel: undefined,
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
        });
      });
      describe("when hasGenerosityWallets is false", () => {
        it("should call getGenerosityReceiptAlertData with the correct props", () => {
          setupMultiplesReport({}, false);

          expect(getGenerosityReceiptAlertData).toHaveBeenCalledTimes(3);
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(1, {
            combination: expect.objectContaining({
              id: "COMBINATION:2",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: false,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(2, {
            combination: expect.objectContaining({
              id: "COMBINATION:3",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: false,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(3, {
            combination: expect.objectContaining({
              id: "COMBINATION:1",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: false,
          });
        });

        it("should have the correct free bets label", () => {
          const summaries = setupMultiplesReport({}, false);

          expect(summaries[0]).toEqual(
            expect.objectContaining({
              freeBetsLabel: "some freeBetsLabel",
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
          expect(summaries[1]).toEqual(
            expect.objectContaining({
              freeBetsLabel: "some freeBetsLabel",
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
          expect(summaries[2]).toEqual(
            expect.objectContaining({
              freeBetsLabel: "some freeBetsLabel",
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
        });
      });
    });
  });

  describe("createBoostedMultiplesBuilder", () => {
    describe("when there is no report", () => {
      it("should return no boosted multiples", () => {
        expect(createBoostedMultiplesBuilder()(undefined, {}, {})).toEqual([]);
      });
    });

    describe("when there are only singles", () => {
      function setupSinglesReport() {
        isBoostedMultiple.mockReturnValue(false);
        formatOdds.mockReturnValue("Formatted Display Odds");

        return createBoostedMultiplesBuilder()(
          {
            result: {
              combinations: {
                "COMBINATION:1": { id: "COMBINATION:1", betType: "SINGLE" },
              },
            },
            metadata: {
              "RUNNER:1": { runnerName: "R", marketName: "M", eventName: "E" },
            },
          },
          {},
        );
      }

      it("should return no summaries", () => {
        const summaries = setupSinglesReport();

        expect(summaries).toEqual([]);
      });
    });

    describe("when there are boosted multiples", () => {
      function setupBoostedMultiplesReport(combinations = {}, hasGenerosityWallets = false) {
        isBoostedMultiple.mockReturnValue(true);
        formatOdds.mockReturnValue("Formatted Display Odds");

        return createBoostedMultiplesBuilder()(
          {
            result: {
              combinations: {
                "COMBINATION:1": {
                  id: "COMBINATION:1",
                  isBoosted: true,
                  legs: ["LEG:1"],
                  betType: "DOUBLE",
                  lines: 3,
                  isEachWaySelected: false,
                  isAccaInsured: false,
                  betReceiptId: "123",
                  regulatorId: "x-123",
                },
                "COMBINATION:2": {
                  id: "COMBINATION:2",
                  isBoosted: true,
                  legs: ["LEG:2"],
                  betType: "TREBLE",
                  lines: 1,
                  displayOdds: 1,
                  totalStake: 1.23,
                  originalTotalPotentialReturns: 2,
                  totalPotentialReturns: 3,
                  totalBonusUsed: 1,
                  hasBonusUsed: true,
                  isEachWaySelected: true,
                  isAccaInsured: true,
                  betReceiptId: "124",
                  regulatorId: "x-124",
                },
                "COMBINATION:3": {
                  id: "COMBINATION:3",
                  isBoosted: true,
                  legs: ["LEG:3"],
                  betType: "TREBLE",
                  lines: 1,
                  displayOdds: 1,
                  totalStake: 1.23,
                  totalPotentialReturns: 3,
                  totalBonusUsed: 1,
                  hasBonusUsed: true,
                  isEachWaySelected: true,
                  isAccaInsured: false,
                  isPriceBoosted: true,
                  betReceiptId: "125",
                  regulatorId: "x-125",
                },
                ...combinations,
              },
              legs: {
                "LEG:1": {
                  id: "LEG:1",
                  runners: ["RUNNER:1"],
                },
                "LEG:2": {
                  id: "LEG:2",
                  runners: ["RUNNER:2"],
                },
                "LEG:3": {
                  id: "LEG:3",
                  runners: ["RUNNER:3"],
                },
              },
              relations: {
                legsRunners: {
                  "LEG:1": {
                    "RUNNER:1": {
                      handicap: 3.5,
                    },
                  },
                  "LEG:2": {
                    "RUNNER:2": {
                      handicap: -3.5,
                    },
                  },
                  "LEG:3": {
                    "RUNNER:3": {
                      handicap: 0,
                    },
                  },
                },
              },
            },
            metadata: {
              "RUNNER:1": { runnerName: "R", marketName: "M", eventName: "E" },
              "RUNNER:2": { runnerName: "R", marketName: "M", eventName: "E" },
              "RUNNER:3": { runnerName: "R", marketName: "M", eventName: "E" },
            },
            isFreeBetsSelected: true,
          },
          {
            sportsbookOddsDisplay: "pref",
          },
          { details: "details" },
          hasGenerosityWallets,
        );
      }

      it("should call buildOdds with displayOdds", () => {
        setupBoostedMultiplesReport();

        expect(buildOdds).toHaveBeenCalledWith(1, "pref");
      });

      it("should call currencyFormatWithDecimalPlaces for the stake", () => {
        setupBoostedMultiplesReport();

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          details: "details",
          value: 1.23,
        });
      });

      it("should call buildOriginalPotentialReturns for the returns", () => {
        setupBoostedMultiplesReport({
          "COMBINATION:4": {
            id: "COMBINATION:4",
            betType: "TREBLE",
            legs: ["LEG:1"],
            lines: 1,
            displayOdds: 1,
            totalStake: 1.23,
            totalPotentialReturns: 3,
            totalBonusUsed: 1,
            hasBonusUsed: true,
            isEachWaySelected: true,
            isAccaInsured: false,
            isPriceBoosted: true,
            betReceiptId: "126",
            regulatorId: "x-125",
            originalTotalPotentialReturns: 2,
            originalDisplayOdds: {
              decimalOdds: 1.0,
              fractionalOdds: "1/1",
            },
          },
        });

        expect(buildOriginalPotentialReturns).toHaveBeenCalledWith(1.23, 2, { details: "details" });
      });

      it("should call formatOdds once for the returns", () => {
        setupBoostedMultiplesReport({
          "COMBINATION:4": {
            id: "COMBINATION:4",
            betType: "TREBLE",
            legs: ["LEG:1"],
            lines: 1,
            displayOdds: 1,
            totalStake: 1.23,
            totalPotentialReturns: 3,
            totalBonusUsed: 1,
            hasBonusUsed: true,
            isEachWaySelected: true,
            isAccaInsured: false,
            isPriceBoosted: true,
            betReceiptId: "126",
            regulatorId: "x-125",
            originalTotalPotentialReturns: 2,
            originalDisplayOdds: {
              decimalOdds: 1.0,
              fractionalOdds: "1/1",
            },
          },
        });

        expect(formatOdds).toHaveBeenNthCalledWith(1, { decimalOdds: 1.0, fractionalOdds: "1/1" }, "pref");
      });

      it("should call buildPotentialReturns for the returns", () => {
        setupBoostedMultiplesReport();

        expect(buildPotentialReturns).toHaveBeenCalledWith(1.23, 3, { details: "details" });
      });

      it("should call buildSportsbookFreeBetsLabel the same number as multiples in combinations", () => {
        setupBoostedMultiplesReport();

        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledTimes(3);
      });

      it("should return the summaries ordered by lines", () => {
        const summaries = setupBoostedMultiplesReport();

        expect(summaries[0].title).toEqual("I18N.BETSLIP.SBK.MULTIPLE.TREBLE_LINES");
        expect(summaries[1].title).toEqual("I18N.BETSLIP.SBK.MULTIPLE.TREBLE_LINES");
        expect(summaries[2].title).toEqual("I18N.BETSLIP.SBK.MULTIPLE.DOUBLE_LINES");
      });

      it("should build summaries with returns", () => {
        const summaries = setupBoostedMultiplesReport();

        expect(summaries[0].returns).toEqual("some potentialReturns");
        expect(summaries[1].returns).toEqual("some potentialReturns");
      });

      it("should build summaries with formatted stake", () => {
        const summaries = setupBoostedMultiplesReport();

        expect(summaries[0].stake).toEqual("Formatted Currency");
        expect(summaries[1].stake).toEqual("Formatted Currency");
      });

      it("should build summaries with buildSportsbookFreeBetsLabel", () => {
        const summaries = setupBoostedMultiplesReport();

        expect(summaries[0].freeBetsLabel).toEqual("some freeBetsLabel");
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledTimes(3);
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(
          undefined,
          { details: "details" },
          "I18N.BETSLIP.USED_BONUS",
        );
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(1, { details: "details" }, "I18N.BETSLIP.USED_BONUS");
      });

      it("should return the number of lines in each summary", () => {
        const summaries = setupBoostedMultiplesReport();

        expect(summaries[0].lines).toEqual(1);
        expect(summaries[1].lines).toEqual(1);
        expect(summaries[2].lines).toEqual(3);
      });

      it("should return selections with odds undefined when boosted", () => {
        const summaries = setupBoostedMultiplesReport();

        expect(summaries[0].selections[0].odds).toBe(undefined);
      });

      describe("when hasGenerosityWallets is true", () => {
        it("should call getGenerosityReceiptAlertData with the correct props", () => {
          setupBoostedMultiplesReport({}, true);

          expect(getGenerosityReceiptAlertData).toHaveBeenCalledTimes(3);
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(1, {
            combination: expect.objectContaining({
              id: "COMBINATION:2",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: true,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(2, {
            combination: expect.objectContaining({
              id: "COMBINATION:3",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: true,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(3, {
            combination: expect.objectContaining({
              id: "COMBINATION:1",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: true,
          });
        });

        it("should have the correct free bets message", () => {
          const summaries = setupBoostedMultiplesReport({}, true);

          expect(summaries[0].freeBetsLabel).toBe(undefined);
          expect(summaries[0].generosityAlertMessage).toBe("generosity alert message mock");
          expect(summaries[1].freeBetsLabel).toBe(undefined);
          expect(summaries[1].generosityAlertMessage).toBe("generosity alert message mock");
          expect(summaries[2].freeBetsLabel).toBe(undefined);
          expect(summaries[2].generosityAlertMessage).toBe("generosity alert message mock");
        });
      });

      describe("when hasGenerosityWallets is false", () => {
        it("should call getGenerosityReceiptAlertData with the correct props", () => {
          setupBoostedMultiplesReport({}, false);

          expect(getGenerosityReceiptAlertData).toHaveBeenCalledTimes(3);
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(1, {
            combination: expect.objectContaining({
              id: "COMBINATION:2",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: false,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(2, {
            combination: expect.objectContaining({
              id: "COMBINATION:3",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: false,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(3, {
            combination: expect.objectContaining({
              id: "COMBINATION:1",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: false,
          });
        });

        it("should have the correct free bets alert message", () => {
          const summaries = setupBoostedMultiplesReport({}, false);

          expect(summaries[0].freeBetsLabel).toBe("some freeBetsLabel");
          expect(summaries[0].generosityAlertMessage).toBe("generosity alert message mock");
          expect(summaries[1].freeBetsLabel).toBe("some freeBetsLabel");
          expect(summaries[1].generosityAlertMessage).toBe("generosity alert message mock");
          expect(summaries[2].freeBetsLabel).toBe("some freeBetsLabel");
          expect(summaries[2].generosityAlertMessage).toBe("generosity alert message mock");
        });
      });
    });
  });

  describe("createSinglesBuilder", () => {
    describe("when there is no report", () => {
      it("should return no singles", () => {
        expect(createSinglesBuilder()(undefined, {}, {})).toEqual([]);
      });
    });

    describe("when there are singles", () => {
      function setupSinglesReport(unavailableNotifications = [], hasGenerosityWallets = false) {
        isSingle.mockReturnValue(true);
        formatOdds.mockReturnValue("Formatted Display Odds");

        return createSinglesBuilder()(
          {
            result: {
              combinations: {
                "COMBINATION:1": {
                  id: "COMBINATION:1",
                  betType: "SINGLE",
                  legs: ["LEG:1"],
                  totalStake: 1.23,
                  totalPotentialReturns: 3,
                  totalBonusUsed: 0,
                  isEachWaySelected: true,
                  eachWayPlacesFraction: { numerator: 1, denominator: 2 },
                  eachWayPlaces: 3,
                  isPriceBoosted: true,
                  originalTotalPotentialReturns: 2,
                  originalDisplayOdds: 1.5,
                  isGuaranteedPriceSelected: true,
                  betReceiptId: "123",
                  regulatorId: "x-123",
                },
                "COMBINATION:2": {
                  id: "COMBINATION:2",
                  betType: "SINGLE",
                  legs: ["LEG:2"],
                  isEachWaySelected: false,
                  isPriceBoosted: false,
                  isGuaranteedPriceSelected: false,
                  betReceiptId: "124",
                  regulatorId: "x-124",
                },
                "COMBINATION:3": {
                  id: "COMBINATION:3",
                  betType: "SINGLE",
                  legs: ["LEG:3"],
                  totalStake: 2.5,
                  totalPotentialReturns: 5,
                  totalBonusUsed: 2.5,
                  hasBonusUsed: true,
                  isEachWaySelected: true,
                  eachWayPlacesFraction: { numerator: 4, denominator: 5 },
                  eachWayPlaces: 6,
                  isPriceBoosted: true,
                  originalTotalPotentialReturns: 3,
                  originalDisplayOdds: 2.5,
                  isGuaranteedPriceSelected: true,
                  betReceiptId: "125",
                  regulatorId: "x-125",
                },
                "COMBINATION:4": {
                  id: "COMBINATION:4",
                  betType: "SINGLE",
                  legs: ["LEG:4"],
                  totalStake: 2,
                  totalPotentialReturns: 0,
                  totalBonusUsed: 2,
                  hasBonusUsed: true,
                  isEachWaySelected: false,
                  isPriceBoosted: false,
                  isGuaranteedPriceSelected: false,
                  betReceiptId: "126",
                  regulatorId: "x-126",
                },
              },
              legs: {
                "LEG:1": {
                  displayOdds: 1,
                  runners: ["RUNNER:1"],
                },
                "LEG:2": {
                  runners: ["RUNNER:2"],
                },
                "LEG:3": {
                  runners: ["RUNNER:3"],
                },
                "LEG:4": {
                  runners: ["RUNNER:4"],
                },
              },
              relations: {
                legsRunners: {
                  "LEG:1": {
                    "RUNNER:1": {
                      handicap: 3.5,
                    },
                  },
                  "LEG:2": {
                    "RUNNER:2": {
                      handicap: -3.5,
                    },
                  },
                  "LEG:3": {
                    "RUNNER:3": {
                      handicap: -3.5,
                    },
                  },
                  "LEG:4": {
                    "RUNNER:4": {
                      handicap: -3.5,
                    },
                  },
                },
              },
            },
            metadata: {
              "RUNNER:1": {
                runnerName: "R",
                marketName: "M",
                eventName: "E",
                eventUrn: "ppb:event:1",
                is90Min: true,
                isOddsboostMarketType: true,
                marketType: "SUPER_BOOST",
                sportId: "1",
              },
              "RUNNER:2": {
                runnerName: "R 2",
                marketName: "M 2",
                eventName: "E 2",
                eventUrn: "ppb:event:2",
                is90Min: false,
                marketType: "MARKET_TYPE_2",
                sportId: "1",
              },
              "RUNNER:3": {
                eventUrn: "ppb:event:3",
                runnerName: "R 3",
                marketName: "M 3",
                eventName: "E 3",
                isOddsboostMarketType: true,
                marketType: "SBG_-_DOUBLE_UP_BOOST",
              },
              "RUNNER:4": {
                eventUrn: "ppb:event:3",
                runnerName: "R 3",
                marketName: "M 3",
                eventName: "E 3",
                isOddsboostMarketType: true,
                marketType: "SOME_OTHER_BOOST",
              },
            },
            isFreeBetsSelected: true,
          },
          { sportsbookOddsDisplay: "pref" },
          { details: "details" },
          unavailableNotifications,
          {},
          hasGenerosityWallets,
          true,
        );
      }

      it("should call buildOdds with displayOdds", () => {
        setupSinglesReport();

        expect(buildOdds).toHaveBeenCalledWith(1, "pref");
      });

      it("should call buildSportsbookFreeBetsLabel the same number as singles in combinations", () => {
        setupSinglesReport();

        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledTimes(4);
      });

      it("should call currencyFormatWithDecimalPlaces for the stake", () => {
        setupSinglesReport();

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          details: "details",
          value: 1.23,
        });
      });

      it("should call buildPotentialReturns for the returns", () => {
        setupSinglesReport();

        expect(buildPotentialReturns).toHaveBeenCalledWith(2.5, 5, { details: "details" });
      });

      it("should build singles with and without odds", () => {
        buildOdds.mockReturnValueOnce("Formatted Display Odds");
        buildOdds.mockReturnValueOnce("I18N.BETSLIP.STARTING_PRICE");
        const singles = setupSinglesReport();

        expect(singles[0].odds).toEqual("Formatted Display Odds");
        expect(singles[1].odds).toEqual("I18N.BETSLIP.STARTING_PRICE");
      });

      it("should build singles with and without returns", () => {
        const singles = setupSinglesReport();

        expect(singles[0].profitOrLiability).toEqual("some potentialReturns");
        expect(singles[1].profitOrLiability).toEqual("some potentialReturns");
      });

      it("should build singles with and without isGuaranteedPriceSelected", () => {
        const singles = setupSinglesReport();

        expect(singles[0].isGuaranteedPriceSelected).toEqual(true);
        expect(singles[1].isGuaranteedPriceSelected).toEqual(false);
      });

      it("should build singles with and without is90Min", () => {
        const singles = setupSinglesReport();

        expect(singles[0].is90Min).toEqual(true);
        expect(singles[1].is90Min).toEqual(false);
      });

      it("should build singles with and without selectionTypeIcon", () => {
        getSelectionTypeIcon.mockReturnValueOnce(undefined);
        getSelectionTypeIcon.mockReturnValueOnce(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);

        const singles = setupSinglesReport();

        expect(singles[0].selectionTypeIcon).toEqual(undefined);
        expect(singles[1].selectionTypeIcon).toEqual(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);
      });

      it("should build singles with and without hasBonusUsed", () => {
        const singles = setupSinglesReport();

        expect(singles[2].hasBonusUsed).toEqual(true);
        expect(singles[0].hasBonusUsed).toEqual(undefined);
      });

      it("should build singles with buildSportsbookFreeBetsLabel", () => {
        const singles = setupSinglesReport();

        expect(singles[0]).toEqual(
          expect.objectContaining({
            freeBetsLabel: "some freeBetsLabel",
            generosityAlertMessage: "generosity alert message mock",
          }),
        );
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledTimes(4);
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(0, { details: "details" }, "I18N.BETSLIP.USED_BONUS");
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(
          2.5,
          { details: "details" },
          "I18N.BETSLIP.USED_BONUS",
        );
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(2, { details: "details" }, "I18N.BETSLIP.USED_BONUS");
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(
          undefined,
          { details: "details" },
          "I18N.BETSLIP.USED_BONUS",
        );
      });

      it("should build singles with formatted stake", () => {
        const singles = setupSinglesReport();

        expect(singles[0].stake).toEqual("Formatted Currency");
        expect(singles[1].stake).toEqual("Formatted Currency");
      });

      it("should build singles with hasEachWay", () => {
        const singles = setupSinglesReport();

        expect(singles[0].hasEachWay).toBe(true);
        expect(singles[1].hasEachWay).toBe(false);
        expect(singles[2].hasEachWay).toBe(true);
        expect(singles[3].hasEachWay).toBe(false);
      });

      it("should build singles with eachWaySubtitle", () => {
        const singles = setupSinglesReport();

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES",
          interpolationValues: {
            numerator: 1,
            denominator: 2,
            places: 3,
          },
        });
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES",
          interpolationValues: {
            numerator: 4,
            denominator: 5,
            places: 6,
          },
        });
        expect(singles[0].eachWaySubtitle).toBe("I18N.BETSLIP.EACHWAY_ODDS_PLACES");
        expect(singles[1].eachWaySubtitle).toBe("");
        expect(singles[2].eachWaySubtitle).toBe("I18N.BETSLIP.EACHWAY_ODDS_PLACES");
        expect(singles[3].eachWaySubtitle).toBe("");
      });

      it("should build singles with silk details", () => {
        buildSelection.mockReturnValueOnce({
          icon: "icon 1",
          silkFallbackType: FallbackIconType.HorseRacing,
        });
        buildSelection.mockReturnValueOnce({
          icon: "icon 2",
          silkFallbackType: FallbackIconType.HorseRacing,
        });
        buildSelection.mockReturnValueOnce({
          icon: "icon 3",
          silkFallbackType: FallbackIconType.HorseRacing,
        });
        buildSelection.mockReturnValueOnce({
          icon: "icon 4",
          silkFallbackType: FallbackIconType.HorseRacing,
        });
        const singles = setupSinglesReport();

        expect(singles[0]).toEqual(
          expect.objectContaining({
            icon: "icon 1",
            silkIconAlt: "",
            silkFallbackIconType: FallbackIconType.HorseRacing,
          }),
        );
        expect(singles[1]).toEqual(
          expect.objectContaining({
            icon: "icon 2",
            silkIconAlt: "",
            silkFallbackIconType: FallbackIconType.HorseRacing,
          }),
        );
        expect(singles[2]).toEqual(
          expect.objectContaining({
            icon: "icon 3",
            silkIconAlt: "",
            silkFallbackIconType: FallbackIconType.HorseRacing,
          }),
        );
        expect(singles[3]).toEqual(
          expect.objectContaining({
            icon: "icon 4",
            silkIconAlt: "",
            silkFallbackIconType: FallbackIconType.HorseRacing,
          }),
        );
      });

      it("should build singles with racingSport", () => {
        buildSelection.mockReturnValueOnce({
          racingSport: 7,
        });
        buildSelection.mockReturnValueOnce({
          racingSport: 4339,
        });
        buildSelection.mockReturnValueOnce({
          racingSport: undefined,
        });

        const singles = setupSinglesReport();

        expect(singles[0]).toEqual(
          expect.objectContaining({
            racingSport: 7,
          }),
        );
        expect(singles[1]).toEqual(
          expect.objectContaining({
            racingSport: 4339,
          }),
        );
        expect(singles[2]).toEqual(
          expect.objectContaining({
            racingSport: undefined,
          }),
        );
      });

      it("should build singles with hasMyOddsBoost", () => {
        const singles = setupSinglesReport();

        expect(singles[0]).toEqual(
          expect.objectContaining({
            hasMyOddsBoost: true,
          }),
        );
        expect(singles[1]).toEqual(
          expect.objectContaining({
            hasMyOddsBoost: false,
          }),
        );
        expect(singles[2]).toEqual(
          expect.objectContaining({
            hasMyOddsBoost: true,
          }),
        );
        expect(singles[3]).toEqual(
          expect.objectContaining({
            hasMyOddsBoost: false,
          }),
        );
      });

      it("should build singles with previousOdds", () => {
        formatOdds.mockReturnValueOnce(2);
        formatOdds.mockReturnValueOnce(3);
        const singles = setupSinglesReport();

        expect(formatOdds).toHaveBeenNthCalledWith(1, 1.5, "pref");
        expect(formatOdds).toHaveBeenNthCalledWith(2, 2.5, "pref");
        expect(formatOdds).toHaveBeenCalledTimes(2);

        expect(singles[0]).toEqual(
          expect.objectContaining({
            previousOdds: 2,
          }),
        );
        expect(singles[1]).toEqual(
          expect.objectContaining({
            previousOdds: undefined,
          }),
        );
        expect(singles[2]).toEqual(
          expect.objectContaining({
            previousOdds: 3,
          }),
        );
        expect(singles[3]).toEqual(
          expect.objectContaining({
            previousOdds: undefined,
          }),
        );
      });

      it("should build singles with previousProfitOrLiability", () => {
        currencyFormatWithDecimalPlaces.mockReturnValueOnce("$3.00");
        currencyFormatWithDecimalPlaces.mockReturnValueOnce("formattedStake");
        currencyFormatWithDecimalPlaces.mockReturnValueOnce("formattedStake");
        currencyFormatWithDecimalPlaces.mockReturnValueOnce("$10.00");
        currencyFormatWithDecimalPlaces.mockReturnValueOnce("formattedStake");
        currencyFormatWithDecimalPlaces.mockReturnValueOnce("formattedStake");

        const singles = setupSinglesReport();

        expect(singles[0]).toEqual(
          expect.objectContaining({
            previousProfitOrLiability: "$3.00",
          }),
        );
        expect(singles[1]).toEqual(
          expect.objectContaining({
            previousProfitOrLiability: undefined,
          }),
        );
        expect(singles[2]).toEqual(
          expect.objectContaining({
            previousProfitOrLiability: "$10.00",
          }),
        );
        expect(singles[3]).toEqual(
          expect.objectContaining({
            previousProfitOrLiability: undefined,
          }),
        );
      });

      describe("when building segments icon", () => {
        it("should return undefined if it is not an odds boost market type", () => {
          const result = setupSinglesReport();

          expect(result[1].segmentsIcon).toEqual(undefined);
        });

        describe("when it is an odds boost market type", () => {
          it("should return SUPER_BOOST icon for SUPER_BOOST or SBG_-_SUPER_BOOST market type", () => {
            const result = setupSinglesReport();

            expect(result[0].segmentsIcon).toEqual("SUPER_BOOST");
          });

          it("should return DOUBLE_UP_BOOST icon for SBG_-_DOUBLE_UP_BOOST market type", () => {
            const result = setupSinglesReport();

            expect(result[2].segmentsIcon).toEqual("DOUBLE_UP_BOOST");
          });

          it("should return ODDSBOOST icon for other market types", () => {
            const result = setupSinglesReport();

            expect(result[3].segmentsIcon).toEqual("ODDSBOOST");
          });
        });
      });

      describe("when building boostedInfo", () => {
        it("should build singles with and without boostedInfo", () => {
          getBoostedInfo.mockReturnValueOnce(undefined);
          getBoostedInfo.mockReturnValueOnce({ label: "Price Boost", iconName: "DOUBLE_UP_BOOST" });

          const singles = setupSinglesReport();

          expect(singles[0].boostedInfo).toEqual(undefined);
          expect(singles[2].boostedInfo).toEqual({ label: "Price Boost", iconName: "DOUBLE_UP_BOOST" });
        });
      });

      describe("when there is notification", () => {
        it("should build singles with notifications", () => {
          const singles = setupSinglesReport(["3"]);
          expect(singles[0]).toEqual(
            expect.objectContaining({
              isPushNotificationsUnavailable: false,
            }),
          );
        });
      });

      describe("when there is no notification", () => {
        it("should build singles without notifications", () => {
          const singles = setupSinglesReport(["1", "2"]);
          expect(singles[0]).toEqual(
            expect.objectContaining({
              isPushNotificationsUnavailable: true,
            }),
          );
        });
      });
      describe("when hasGenerosityWallets is true", () => {
        it("should call getGenerosityReceiptAlertData with the correct props", () => {
          setupSinglesReport([], true);

          expect(getGenerosityReceiptAlertData).toHaveBeenCalledTimes(4);
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(1, {
            combination: expect.objectContaining({
              id: "COMBINATION:1",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: true,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(2, {
            combination: expect.objectContaining({
              id: "COMBINATION:2",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: true,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(3, {
            combination: expect.objectContaining({
              id: "COMBINATION:3",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: true,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(4, {
            combination: expect.objectContaining({
              id: "COMBINATION:4",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: true,
          });
        });

        it("should build singles with correct generosity message", () => {
          const singles = setupSinglesReport([], true);
          expect(singles[0]).toEqual(
            expect.objectContaining({
              freeBetsLabel: undefined,
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
          expect(singles[1]).toEqual(
            expect.objectContaining({
              freeBetsLabel: undefined,
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
          expect(singles[2]).toEqual(
            expect.objectContaining({
              freeBetsLabel: undefined,
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
          expect(singles[3]).toEqual(
            expect.objectContaining({
              freeBetsLabel: undefined,
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
        });
      });

      describe("when hasGenerosityWallets is false", () => {
        it("should call getGenerosityReceiptAlertData with the correct props", () => {
          setupSinglesReport([], false);

          expect(getGenerosityReceiptAlertData).toHaveBeenCalledTimes(4);
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(1, {
            combination: expect.objectContaining({
              id: "COMBINATION:1",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: false,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(2, {
            combination: expect.objectContaining({
              id: "COMBINATION:2",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: false,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(3, {
            combination: expect.objectContaining({
              id: "COMBINATION:3",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: false,
          });
          expect(getGenerosityReceiptAlertData).toHaveBeenNthCalledWith(4, {
            combination: expect.objectContaining({
              id: "COMBINATION:4",
            }),
            userDetails: { details: "details" },
            isFreeBetsWalletsActive: false,
          });
        });

        it("should build singles with correct generosity message", () => {
          const singles = setupSinglesReport([], false);
          expect(singles[0]).toEqual(
            expect.objectContaining({
              freeBetsLabel: "some freeBetsLabel",
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
          expect(singles[1]).toEqual(
            expect.objectContaining({
              freeBetsLabel: "some freeBetsLabel",
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
          expect(singles[2]).toEqual(
            expect.objectContaining({
              freeBetsLabel: "some freeBetsLabel",
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
          expect(singles[3]).toEqual(
            expect.objectContaining({
              freeBetsLabel: "some freeBetsLabel",
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
        });
      });
    });

    describe("when metadata has runnerPreviousOdds", () => {
      function setupSinglesReport() {
        formatOdds.mockReturnValueOnce("Formatted Previous Odds");

        return createSinglesBuilder()(
          {
            result: {
              combinations: {
                "COMBINATION:1": {
                  id: "COMBINATION:1",
                  betType: "SINGLE",
                  legs: ["LEG:1"],
                  displayOdds: "2.1",
                  isPriceBoosted: false,
                },
                "COMBINATION:2": {
                  id: "COMBINATION:2",
                  betType: "SINGLE",
                  legs: ["LEG:2"],
                  displayOdds: "2.2",
                  isPriceBoosted: false,
                },
              },
              legs: {
                "LEG:1": {
                  runners: ["RUNNER:1"],
                },
                "LEG:2": {
                  runners: ["RUNNER:2"],
                },
              },
              relations: {
                legsRunners: {
                  "LEG:1": {
                    "RUNNER:1": {
                      handicap: 3.5,
                    },
                  },
                  "LEG:2": {
                    "RUNNER:2": {
                      handicap: -3.5,
                    },
                  },
                },
              },
            },
            metadata: {
              "RUNNER:1": {
                eventUrn: "ppb:event:1",
                runnerName: "R",
                marketName: "M",
                eventName: "E",
                previousOdds: ["1.1"],
                isOddsboostMarketType: true,
              },
              "RUNNER:2": {
                eventUrn: "ppb:event:2",
                runnerName: "R 2",
                marketName: "M 2",
                eventName: "E 2",
                isOddsboostMarketType: false,
              },
            },
          },
          { sportsbookOddsDisplay: "pref" },
          { details: "details" },
          [],
        );
      }

      it("should call formatOdds", () => {
        setupSinglesReport();

        expect(formatOdds).toHaveBeenNthCalledWith(1, "1.1", "pref");
        expect(formatOdds).toHaveBeenCalledTimes(1);
      });

      it("should build singles with and without previousOdds", () => {
        const result = setupSinglesReport();

        expect(result[0].previousOdds).toEqual("Formatted Previous Odds");
        expect(result[1].previousOdds).toEqual(undefined);
      });

      it("should build singles with and without isPriceBoosted", () => {
        const result = setupSinglesReport();

        expect(result[0].isPriceBoosted).toEqual(true);
        expect(result[1].isPriceBoosted).toEqual(false);
      });
    });

    describe("when there are only multiples", () => {
      function setupMultiplesReport() {
        isSingle.mockReturnValue(false);
        formatOdds.mockReturnValue("Formatted Display Odds");

        return createSinglesBuilder()(
          {
            result: {
              combinations: {
                "COMBINATION:1": { id: "COMBINATION:1", betType: "DOUBLE", lines: 3 },
                "COMBINATION:2": {
                  id: "COMBINATION:2",
                  betType: "TREBLE",
                  lines: 1,
                  displayOdds: 1,
                  totalStake: 1.23,
                  totalPotentialReturns: 3,
                },
              },
            },
            metadata: {
              "RUNNER:1": { runnerName: "R", marketName: "M", eventName: "E" },
            },
          },
          { sportsbookOddsDisplay: "pref" },
          { details: "details" },
        );
      }

      it("should return no singles", () => {
        const singles = setupMultiplesReport();

        expect(singles).toEqual([]);
      });
    });
  });

  describe("createCastsBuilder", () => {
    describe("when there is no report", () => {
      it("should return no casts", () => {
        expect(createCastsBuilder()(undefined, {})).toEqual([]);
      });
    });

    describe("when there is a report", () => {
      describe("when the result contains no casts", () => {
        it("should return no built combinations", () => {
          const noCastReport = {
            result: {
              combinations: {
                "C:1": { betType: BET_TYPES.SINGLE },
              },
            },
          };
          isCast.mockReturnValue(false);

          expect(createCastsBuilder()(noCastReport, {})).toEqual([]);
        });
      });

      describe("when the result contains casts", () => {
        describe("when ordering", () => {
          function setupTwoCombinations({ runners = [], combinations = [] }, hasGenerosityWallets = false) {
            const [firstRunner = {}, secondRunner = {}] = runners;
            const [firstCombination = {}, secondCombination = {}] = combinations;

            const report = {
              result: {
                combinations: {
                  "C:1": {
                    legs: ["L:1"],
                    ...firstCombination,
                  },
                  "C:2": {
                    legs: ["L:2"],
                    ...secondCombination,
                  },
                },
                legs: {
                  "L:1": {
                    id: "L:1",
                    runners: ["R:1"],
                    legType: "FORECAST",
                  },
                  "L:2": {
                    id: "L:1",
                    runners: ["R:2"],
                    legType: "REVERSE_FORECAST",
                  },
                },
                relations: {
                  legsRunners: {
                    "L:1": {
                      "R:1": {
                        order: 1,
                      },
                      "R:2": {
                        order: 1,
                      },
                    },
                    "L:2": {
                      "R:1": {},
                      "R:2": {},
                    },
                  },
                },
              },
              metadata: {
                "R:1": {
                  ...firstRunner,
                },
                "R:2": {
                  ...secondRunner,
                },
              },
            };

            isCast.mockReturnValue(true);
            return createCastsBuilder()(report, {}, hasGenerosityWallets);
          }

          describe("when there is no racing metadata", () => {
            it("should keep the order", () => {
              const mock = { runners: [{ eventName: "A" }, { eventName: "B" }] };
              const casts = setupTwoCombinations(mock);

              expect(casts[0].subtitle).toEqual("I18N.BETSLIP.SBK.CAST.FORECAST");
              expect(casts[1].subtitle).toEqual("I18N.BETSLIP.SBK.CAST.REVERSE_FORECAST");
            });
          });

          describe("when the race time is different", () => {
            it("should order by raceTime in ascending order", () => {
              const mock = {
                runners: [
                  { racing: { time: 2, venue: "A" }, type: "RACING" },
                  { racing: { time: 1, venue: "B" }, type: "RACING" },
                ],
              };
              const casts = setupTwoCombinations(mock);

              expect(casts[0].subtitle).toEqual("I18N.BETSLIP.SBK.CAST.REVERSE_FORECAST");
              expect(casts[1].subtitle).toEqual("I18N.BETSLIP.SBK.CAST.FORECAST");
            });
          });

          describe("when the race time is the same", () => {
            it("should order by lines in descending order", () => {
              const combinationMock = [{ lines: 2 }, { lines: 1 }];
              const runnersMock = [
                { racing: { time: 1, venue: "A" }, type: "RACING" },
                { racing: { time: 1, venue: "B" }, type: "RACING" },
              ];
              const mock = { runners: runnersMock, combinations: combinationMock };
              const casts = setupTwoCombinations(mock);

              expect(casts[0].lines).toEqual(1);
              expect(casts[1].lines).toEqual(2);
            });
          });

          it("should call buildSportsbookFreeBetsLabel the same number of time as the number of casts in the combinations", () => {
            const combinationMock = [
              { lines: 1, hasBonusUsed: true },
              { lines: 1, hasBonusUsed: true },
            ];

            const mock = { runners: [], combinations: combinationMock };
            setupTwoCombinations(mock, false);

            expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledTimes(2);
          });

          it("should call getGenerosityReceiptAlertData the same number of time as the number of casts in the combinations", () => {
            const combinationMock = [
              { lines: 1, hasBonusUsed: true },
              { lines: 1, hasBonusUsed: true },
            ];
            const mock = { runners: [], combinations: combinationMock };
            setupTwoCombinations(mock, true);

            expect(getGenerosityReceiptAlertData).toHaveBeenCalledTimes(2);
          });
        });

        describe("when building casts", () => {
          function setupOneCombination(
            { runner = {}, combination = {}, relation = {}, leg = {} },
            hasGenerosityWallets = false,
          ) {
            const report = {
              result: {
                combinations: {
                  "C:1": {
                    legs: ["L:1"],
                    ...combination,
                    hasBonusUsed: true,
                  },
                },
                legs: {
                  "L:1": {
                    id: "L:1",
                    runners: ["R:1"],
                    ...leg,
                  },
                },
                relations: {
                  legsRunners: {
                    "L:1": {
                      "R:1": {
                        order: 1,
                        ...relation,
                      },
                    },
                    "L:2": {
                      "R:1": { ...relation },
                    },
                  },
                },
              },
              metadata: {
                "R:1": {
                  ...runner,
                },
              },
            };

            isCast.mockReturnValue(true);

            return createCastsBuilder()(report, {}, hasGenerosityWallets);
          }

          it("should build a formatted stake", () => {
            const combinationMock = { totalStake: 2.13 };
            const casts = setupOneCombination({ combination: combinationMock });

            expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({ value: 2.13 });
            expect(casts[0].stake).toEqual("Formatted Currency");
          });

          it("should have lines", () => {
            const combinationMock = { lines: 2 };
            const casts = setupOneCombination({ combination: combinationMock });

            expect(casts[0].lines).toEqual(2);
          });

          it("should have a subtitle", () => {
            const leg = { legType: "LEG_TYPE" };
            const casts = setupOneCombination({ leg });

            expect(casts[0].subtitle).toEqual("I18N.BETSLIP.SBK.CAST.LEG_TYPE");
          });

          it("should have returns", () => {
            const casts = setupOneCombination({});

            expect(casts[0].returns).toEqual("some potentialReturns");
          });

          it("should have a title", () => {
            const casts = setupOneCombination({ runner: { racing: { time: 1, venue: "Venue" } } });

            expect(casts[0].title).toEqual("Racing title");
          });

          describe("when hasGenerosityWallets is true", () => {
            it("should call getGenerosityReceiptAlertData with the correct data", () => {
              setupOneCombination({}, true);

              expect(getGenerosityReceiptAlertData).toHaveBeenCalledTimes(1);
              expect(getGenerosityReceiptAlertData).toHaveBeenCalledWith({
                combination: expect.objectContaining({
                  legs: ["L:1"],
                }),
                userDetails: {},
                isFreeBetsWalletsActive: true,
              });
            });

            it("should build singles with free bets correct label", () => {
              const casts = setupOneCombination({}, true);
              expect(casts[0]).toEqual(
                expect.objectContaining({
                  freeBetsLabel: undefined,
                  generosityAlertMessage: "generosity alert message mock",
                }),
              );
            });
          });

          describe("when hasGenerosityWallets is false", () => {
            it("should call getGenerosityReceiptAlertData with the correct data", () => {
              setupOneCombination({}, false);

              expect(getGenerosityReceiptAlertData).toHaveBeenCalledTimes(1);
              expect(getGenerosityReceiptAlertData).toHaveBeenCalledWith({
                combination: expect.objectContaining({
                  legs: ["L:1"],
                }),
                userDetails: {},
                isFreeBetsWalletsActive: false,
              });
            });

            it("should build singles with free bets correct label", () => {
              const casts = setupOneCombination({}, false);
              expect(casts[0]).toEqual(
                expect.objectContaining({
                  freeBetsLabel: "some freeBetsLabel",
                  generosityAlertMessage: "generosity alert message mock",
                }),
              );
            });
          });
        });

        describe("when building a cast's selections", () => {
          const userDetails = { mock: "userDetails" };

          function setupOneCombination({ runners = [], combination = {}, relations = [], leg = {} }) {
            const [firstRunner = {}, secondRunner = {}] = runners;
            const [firstRelation = {}, secondRelation = {}] = relations;

            const report = {
              result: {
                combinations: {
                  "C:1": {
                    legs: ["L:1"],
                    ...combination,
                  },
                },
                legs: {
                  "L:1": {
                    id: "L:1",
                    runners: ["R:1", "R:2"],
                    ...leg,
                  },
                },
                relations: {
                  legsRunners: {
                    "L:1": {
                      "R:1": {
                        order: 1,
                        ...firstRelation,
                      },
                      "R:2": {
                        order: 2,
                        ...secondRelation,
                      },
                    },
                    "L:2": {
                      "R:1": { ...firstRelation },
                      "R:2": { ...secondRelation },
                    },
                  },
                },
              },
              metadata: {
                "R:1": {
                  ...firstRunner,
                },
                "R:2": {
                  ...secondRunner,
                },
              },
            };

            isCast.mockReturnValue(true);

            return createCastsBuilder()(report, userDetails);
          }

          it("should have the runner's id", () => {
            const casts = setupOneCombination({});

            expect(casts[0].selections[0].id).toEqual("R:1");
            expect(casts[0].selections[1].id).toEqual("R:2");
          });

          it("should have the horse name", () => {
            buildSelection.mockReturnValueOnce({ title: "Horse 1" });
            buildSelection.mockReturnValueOnce({ title: "Horse 2" });

            const runnersMock = [{ a: "a" }, { b: "b" }];
            const mock = { runners: runnersMock };
            const casts = setupOneCombination(mock);

            expect(buildSelection).toHaveBeenCalledWith({ a: "a" }, userDetails);
            expect(buildSelection).toHaveBeenCalledWith({ b: "b" }, userDetails);
            expect(casts[0].selections[0].horse).toEqual("Horse 1");
            expect(casts[0].selections[1].horse).toEqual("Horse 2");
          });

          it("should have the icon", () => {
            buildSelection.mockReturnValueOnce({ icon: "silk 1" });
            buildSelection.mockReturnValueOnce({ icon: "silk 2" });

            const casts = setupOneCombination({});

            expect(casts[0].selections[0].icon).toEqual("silk 1");
            expect(casts[0].selections[1].icon).toEqual("silk 2");
          });

          it("should have the racingSport", () => {
            buildSelection.mockReturnValueOnce({ racingSport: 7 });
            buildSelection.mockReturnValueOnce({ racingSport: 7 });

            const casts = setupOneCombination({});

            expect(casts[0].selections[0].racingSport).toEqual(7);
            expect(casts[0].selections[1].racingSport).toEqual(7);
          });

          it("should have the silkFallbackType", () => {
            buildSelection.mockReturnValueOnce({ silkFallbackType: FallbackIconType.HorseRacing });
            buildSelection.mockReturnValueOnce({ silkFallbackType: FallbackIconType.HorseRacing });

            const casts = setupOneCombination({});

            expect(casts[0].selections[0].silkFallbackType).toEqual("HORSE_RACING");
            expect(casts[0].selections[1].silkFallbackType).toEqual("HORSE_RACING");
          });

          describe("when the runner has a order", () => {
            it("should return a formatted positionOrdinal", () => {
              const relations = [{ order: 1 }, { order: 2 }];
              const mock = { relations };
              const casts = setupOneCombination(mock);

              expect(casts[0].selections[0].positionOrdinal).toEqual("ordinal");
              expect(casts[0].selections[1].positionOrdinal).toEqual("ordinal");
            });

            it("should delegate order to getCastOrdinal", () => {
              const relations = [{ order: 1 }, { order: 2 }];
              const mock = { relations };

              setupOneCombination(mock);

              expect(getCastOrdinal).toHaveBeenCalledWith(1);
              expect(getCastOrdinal).toHaveBeenCalledWith(2);
            });

            it("should return an ordered numerical position", () => {
              const relations = [{ order: 2 }, { order: 1 }];
              const mock = { relations };
              const casts = setupOneCombination(mock);

              expect(casts[0].selections[0].position).toEqual(1);
              expect(casts[0].selections[1].position).toEqual(2);
            });
          });

          describe("when the runner has no order", () => {
            it("should return positionOrdinal as undefined", () => {
              const relations = [{ order: undefined }, { order: undefined }];
              const mock = { relations };
              const casts = setupOneCombination(mock);

              expect(getCastOrdinal).not.toHaveBeenCalled();
              expect(casts[0].selections[0].positionOrdinal).toEqual(undefined);
              expect(casts[0].selections[1].positionOrdinal).toEqual(undefined);
            });

            it("should not delegate order to getCastOrdinal", () => {
              const relations = [{ order: undefined }, { order: undefined }];
              const mock = { relations };

              setupOneCombination(mock);

              expect(getCastOrdinal).not.toHaveBeenCalled();
            });

            it("should return position as undefined", () => {
              const relations = [{ order: undefined }, { order: undefined }];
              const mock = { relations };
              const casts = setupOneCombination(mock);

              expect(casts[0].selections[0].position).toEqual(undefined);
              expect(casts[0].selections[1].position).toEqual(undefined);
            });
          });
        });
      });
    });
  });

  describe("createBetBuildersBuilder", () => {
    describe("when there's no report", () => {
      it("should return no betBuilders", () => {
        expect(createBetBuildersBuilder()(undefined)).toEqual([]);
      });
    });

    describe("when there's a report", () => {
      describe("and the result doesn't have bet builders", () => {
        it("should return an empty array", () => {
          const noBetBuildersReport = {
            result: {
              combinations: {
                "C:1": { betType: BET_TYPES.SINGLE },
              },
            },
          };
          isBetBuilder.mockReturnValueOnce(false);

          expect(createBetBuildersBuilder()(noBetBuildersReport)).toEqual([]);
        });
      });

      describe("and the result has bet builders", () => {
        const userDetails = { userDetails: "mock" };

        const setup = (hasGenerosityWallets = false) => {
          const report = {
            result: {
              combinations: {
                "C:1": {
                  id: "C:1",
                  betType: BET_TYPES.DOUBLE,
                  isSgm: true,
                  legs: ["l:1", "l:2"],
                  betReceiptId: "betReceiptIdMock",
                  regulatorId: "regulatorIdMock",
                  displayOdds: "displayOddsMock",
                  totalStake: 1,
                  totalPotentialReturns: 2,
                  hasBonusUsed: true,
                  totalBonusUsed: 1,
                  isPriceBoosted: true,
                },
                "C:2": { id: "C:2", betType: BET_TYPES.SINGLE },
                "C:3": {
                  id: "C:3",
                  betType: BET_TYPES.DOUBLE,
                  isSgm: false,
                },
              },
              legs: {
                "l:1": { id: "l:1", runners: ["r:1"] },
                "l:2": { id: "l:2", runners: ["r:2"] },
              },
            },
            metadata: {
              "r:1": {
                runnerUrn: "r:1",
                eventName: "AD Marco vs FC Porto",
                type: "GENERIC",
                is90Min: true,
                marketType: "MARKET_TYPE_1",
              },
              "r:2": {
                runnerUrn: "r:2",
                eventName: "AD Marco vs FC Porto",
                type: "GENERIC",
                marketType: "MARKET_TYPE_2",
              },
            },
            isFreeBetsSelected: true,
          };

          const preferences = {
            sportsbookOddsDisplay: "sportsbookOddsDisplayMock",
          };

          const entities = {
            races: {},
            sportevents: {
              "ppb:event:1": {
                urn: "ppb:event:1",
                eventId: 1,
                name: "AD Marco vs FC Porto",
              },
            },
          };

          isBetBuilder.mockReturnValueOnce(true);
          isBetBuilder.mockReturnValueOnce(false);
          isBetBuilder.mockReturnValueOnce(false);
          formatOdds.mockReturnValueOnce("2.1");
          buildPotentialReturns.mockReturnValueOnce("€2.10");
          currencyFormatWithDecimalPlaces.mockReturnValueOnce("€1.00");
          buildSelection.mockReturnValueOnce({
            title: "Tó Martins",
            subtitle: "Anytime Goalscorer - AD Marco vs FC Porto",
          });
          buildSelection.mockReturnValueOnce({ title: "3-3", subtitle: "Correct Score - AD Marco vs FC Porto" });

          return createBetBuildersBuilder()(
            report,
            preferences,
            userDetails,
            [],
            entities,
            {},
            hasGenerosityWallets,
            true,
          );
        };

        it("should have id", () => {
          const result = setup();

          expect(result[0].id).toEqual("betReceiptIdMock");
          expect(result[0].regulatorId).toEqual("regulatorIdMock");
        });

        it("should have title", () => {
          const result = setup();

          expect(result[0].title).toEqual("AD Marco vs FC Porto");
        });

        it("should have type", () => {
          const result = setup();

          expect(i18n).toHaveBeenNthCalledWith(1, {
            key: "I18N.BETSLIP.SBK.MULTIPLE.DOUBLE_LINES",
          });
          expect(i18n).toHaveBeenCalledTimes(2);
          expect(result[0].type).toEqual("I18N.BETSLIP.SBK.MULTIPLE.DOUBLE_LINES");
        });

        it("should have odds", () => {
          buildOdds.mockReturnValueOnce("2.1");
          const result = setup();

          expect(buildOdds).toHaveBeenCalledWith("displayOddsMock", "sportsbookOddsDisplayMock");
          expect(buildOdds).toHaveBeenCalledTimes(1);
          expect(result[0].odds).toEqual("2.1");
        });

        it("should have stake", () => {
          const result = setup();

          expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
            userDetails: "mock",
            value: 1,
          });
          expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledTimes(1);
          expect(result[0].stake).toEqual("€1.00");
        });

        it("should have returns", () => {
          const result = setup();

          expect(buildPotentialReturns).toHaveBeenCalledWith(1, 2, { userDetails: "mock" });
          expect(buildPotentialReturns).toHaveBeenCalledTimes(1);
          expect(result[0].returns).toEqual("€2.10");
        });

        it("should have free bets indication", () => {
          const result = setup();

          expect(result[0].hasBonusUsed).toEqual(true);
        });

        it("should have hasMyOddsBoost", () => {
          const result = setup();

          expect(result[0].hasMyOddsBoost).toEqual(true);
        });

        it("should have a free bets label", () => {
          const result = setup();

          expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(
            1,
            { userDetails: "mock" },
            "I18N.BETSLIP.USED_BONUS",
          );
          expect(result[0]).toEqual(
            expect.objectContaining({
              freeBetsLabel: "some freeBetsLabel",
              generosityAlertMessage: "generosity alert message mock",
            }),
          );
        });

        it("should have selectionsLabel", () => {
          const result = setup();

          expect(result[0].selectionsLabel).toEqual("I18N.BETSLIP.SELECTIONS_COUNT");

          expect(i18n).toHaveBeenNthCalledWith(2, {
            key: "I18N.BETSLIP.SELECTIONS_COUNT",
            interpolationValues: { numberOfSelections: 2 },
          });
          expect(i18n).toHaveBeenCalledTimes(2);
        });

        it("should have selections", () => {
          getSelectionTypeIcon.mockReturnValueOnce(undefined);
          getSelectionTypeIcon.mockReturnValueOnce(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);

          const result = setup();

          expect(buildSelection).toHaveBeenNthCalledWith(
            1,
            {
              runnerUrn: "r:1",
              eventName: "AD Marco vs FC Porto",
              type: "GENERIC",
              is90Min: true,
              marketType: "MARKET_TYPE_1",
            },
            userDetails,
          );
          expect(buildSelection).toHaveBeenNthCalledWith(
            2,
            {
              runnerUrn: "r:2",
              eventName: "AD Marco vs FC Porto",
              type: "GENERIC",
              marketType: "MARKET_TYPE_2",
            },
            userDetails,
          );
          expect(buildSelection).toHaveBeenCalledTimes(2);
          expect(result[0].selections).toEqual([
            {
              urn: "r:1",
              id: "l:1",
              title: "Tó Martins",
              subtitle: "Anytime Goalscorer - AD Marco vs FC Porto",
              is90Min: true,
              selectionTypeIcon: undefined,
            },
            {
              urn: "r:2",
              id: "l:2",
              title: "3-3",
              subtitle: "Correct Score - AD Marco vs FC Porto",
              selectionTypeIcon: IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME,
            },
          ]);
        });

        describe("when hasGenerosityWallets is true", () => {
          it("should call getGenerosityReceiptAlertData with the correct data", () => {
            setup(true);

            expect(getGenerosityReceiptAlertData).toHaveBeenCalledTimes(1);
            expect(getGenerosityReceiptAlertData).toHaveBeenCalledWith({
              combination: expect.objectContaining({
                id: "C:1",
              }),
              userDetails: { userDetails: "mock" },
              isFreeBetsWalletsActive: true,
            });
          });

          it("should build singles with free bets correct label", () => {
            const singles = setup(true);
            expect(singles[0]).toEqual(
              expect.objectContaining({
                freeBetsLabel: undefined,
                generosityAlertMessage: "generosity alert message mock",
              }),
            );
          });
        });

        describe("when hasGenerosityWallets is false", () => {
          it("should call getGenerosityReceiptAlertData with the correct data", () => {
            setup(false);

            expect(getGenerosityReceiptAlertData).toHaveBeenCalledTimes(1);
            expect(getGenerosityReceiptAlertData).toHaveBeenCalledWith({
              combination: expect.objectContaining({
                id: "C:1",
              }),
              userDetails: { userDetails: "mock" },
              isFreeBetsWalletsActive: false,
            });
          });

          it("should build singles with free bets correct label", () => {
            const singles = setup(false);
            expect(singles[0]).toEqual(
              expect.objectContaining({
                freeBetsLabel: "some freeBetsLabel",
                generosityAlertMessage: "generosity alert message mock",
              }),
            );
          });
        });
      });

      describe("and the bet builder event has no notifications", () => {
        it("should build bet Builder with isPushNotificationsUnavailable", () => {
          const userDetails = { userDetails: "mock" };

          const report = {
            result: {
              combinations: {
                "C:1": {
                  betType: BET_TYPES.DOUBLE,
                  isSgm: true,
                  legs: ["l:1", "l:2"],
                  betReceiptId: "betReceiptIdMock",
                  regulatorId: "regulatorIdMock",
                  displayOdds: "displayOddsMock",
                  totalStake: 1,
                  totalPotentialReturns: 2,
                  hasBonusUsed: true,
                  totalBonusUsed: 1,
                },
                "C:2": { betType: BET_TYPES.SINGLE },
                "C:3": {
                  betType: BET_TYPES.DOUBLE,
                  isSgm: false,
                },
              },
              legs: {
                "l:1": { id: "l:1", runners: ["r:1"] },
                "l:2": { id: "l:2", runners: ["r:2"] },
              },
            },
            metadata: {
              "r:1": {
                runnerUrn: "r:1",
                eventName: "FC Porto vs SL Benfica",
                type: "GENERIC",
                is90Min: true,
                eventUrn: "ppb:event:1",
                sportId: "1",
              },
              "r:2": {
                runnerUrn: "r:2",
                eventName: "FC Porto vs SL Benfica",
                type: "GENERIC",
                eventUrn: "ppb:event:1",
                sportId: "1",
              },
            },
            isFreeBetsSelected: true,
          };

          const preferences = {
            sportsbookOddsDisplay: "sportsbookOddsDisplayMock",
          };

          const entities = {
            races: {},
            sportevents: {
              "ppb:event:1": {
                urn: "ppb:event:1",
                eventId: 1,
                name: "FC Porto vs SL Benfica",
              },
            },
          };

          isBetBuilder.mockReturnValueOnce(true);
          isBetBuilder.mockReturnValueOnce(false);
          isBetBuilder.mockReturnValueOnce(false);
          formatOdds.mockReturnValueOnce("2.1");
          buildPotentialReturns.mockReturnValueOnce("€2.10");
          currencyFormatWithDecimalPlaces.mockReturnValueOnce("€1.00");
          buildSelection.mockReturnValueOnce({
            title: "Taremi",
            subtitle: "Anytime Goalscorer - FC Porto vs SL Benfica",
          });
          buildSelection.mockReturnValueOnce({ title: "5-0", subtitle: "Correct Score - FC Porto vs SL Benfica" });

          expect(createBetBuildersBuilder()(report, preferences, userDetails, ["1"], entities)).toEqual([
            {
              betReceiptId: "betReceiptIdMock",
              freeBetsLabel: "some freeBetsLabel",
              generosityAlertMessage: "generosity alert message mock",
              generosityIconName: "generosity icon mock",
              hasBonusUsed: true,
              id: "betReceiptIdMock",
              isPushNotificationsUnavailable: true,
              odds: "SP",
              regulatorId: "regulatorIdMock",
              returns: "€2.10",
              selections: [
                {
                  id: "l:1",
                  is90Min: true,
                  subtitle: "Anytime Goalscorer - FC Porto vs SL Benfica",
                  title: "Taremi",
                  urn: "r:1",
                },
                {
                  id: "l:2",
                  is90Min: undefined,
                  subtitle: "Correct Score - FC Porto vs SL Benfica",
                  title: "5-0",
                  urn: "r:2",
                },
              ],
              selectionsLabel: "I18N.BETSLIP.SELECTIONS_COUNT",
              stake: "€1.00",
              title: "FC Porto vs SL Benfica",
              type: "I18N.BETSLIP.SBK.MULTIPLE.DOUBLE_LINES",
            },
          ]);
        });
      });
    });
  });

  describe("createMultiBetBuilder", () => {
    describe("when there's no report", () => {
      it("should return no multi bet builder", () => {
        expect(createMultiBetBuilder()(undefined)).toBeUndefined();
      });
    });

    describe("when there's a report", () => {
      describe("and the result doesn't have a multi bet builder", () => {
        it("should return undefined", () => {
          const noMultiBetBuilderReport = {
            result: {
              combinations: {
                "C:1": { betType: BET_TYPES.SINGLE },
              },
            },
          };
          isMultiBetBuilder.mockReturnValueOnce(false);

          expect(createMultiBetBuilder()(noMultiBetBuilderReport)).toBeUndefined();
        });
      });

      describe("and the result has a multi bet builder", () => {
        const userDetails = { userDetails: "mock" };

        const setup = () => {
          const report = {
            result: {
              combinations: {
                "C:1": {
                  betType: BET_TYPES.DOUBLE,
                  isSgm: true,
                },
                "C:2": { betType: BET_TYPES.SINGLE },
                "C:3": {
                  betType: BET_TYPES.DOUBLE,
                  isSgmMulti: true,
                  legs: ["l:1", "l:2"],
                  betReceiptId: "betReceiptIdMock",
                  displayOdds: "displayOddsMock",
                  totalStake: 1,
                  totalPotentialReturns: 2,
                  hasBonusUsed: true,
                  totalBonusUsed: 1,
                  isPriceBoosted: true,
                },
              },
            },
          };

          const preferences = {
            sportsbookOddsDisplay: "sportsbookOddsDisplayMock",
          };

          isMultiBetBuilder.mockReturnValueOnce(false);
          isMultiBetBuilder.mockReturnValueOnce(false);
          isMultiBetBuilder.mockReturnValueOnce(true);
          buildOdds.mockReturnValueOnce("2.1");
          buildPotentialReturns.mockReturnValueOnce("€2.10");
          currencyFormatWithDecimalPlaces.mockReturnValueOnce("€1.00");

          return createMultiBetBuilder()(report, preferences, userDetails, 10);
        };

        it("should have title", () => {
          const { title } = setup();

          expect(title).toEqual("I18N.BETSLIP.SBK.MULTIPLE.DOUBLE_LINES");
        });

        it("should have odds", () => {
          const { odds } = setup();

          expect(odds).toEqual("2.1");
        });

        it("should call buildOdds with the displayOdds", () => {
          setup();

          expect(buildOdds).toHaveBeenCalledWith("displayOddsMock", "sportsbookOddsDisplayMock");
        });

        it("should have stake", () => {
          const { stake } = setup();

          expect(stake).toEqual("€1.00");
        });

        it("should call currencyFormatWithDecimalPlaces with the stake", () => {
          setup();

          expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({ userDetails: "mock", value: 1 });
        });

        it("should have oddsboost", () => {
          const { hasMyOddsBoost } = setup();

          expect(hasMyOddsBoost).toEqual(true);
        });

        it("should have returns", () => {
          const { returns } = setup();

          expect(returns).toEqual("€2.10");
        });

        it("should call buildPotentialReturns with the total stake and total returns", () => {
          setup();

          expect(buildPotentialReturns).toHaveBeenCalledWith(1, 2, { userDetails: "mock" });
        });
      });
    });
  });

  describe("createMultiBetBuilderGroups", () => {
    describe("when there's no report", () => {
      it("should return no multi bet builder groups", () => {
        expect(createMultiBetBuilderGroups()(undefined)).toBeUndefined();
      });
    });

    describe("when there's a report", () => {
      describe("and the result doesn't have a multi bet builder", () => {
        it("should return undefined", () => {
          const noMultiBetBuilderReport = {
            result: {
              combinations: {
                "C:1": { betType: BET_TYPES.SINGLE },
              },
            },
          };
          isMultiBetBuilder.mockReturnValueOnce(false);

          expect(createMultiBetBuilderGroups()(noMultiBetBuilderReport)).toBeUndefined();
        });
      });

      describe("and the result has a multi bet builder", () => {
        const userDetails = { userDetails: "mock" };

        const setup = () => {
          const report = {
            result: {
              combinations: {
                "C:1": {
                  betType: BET_TYPES.DOUBLE,
                  isSgm: true,
                },
                "C:2": { betType: BET_TYPES.SINGLE },
                "C:3": {
                  betType: BET_TYPES.DOUBLE,
                  isSgmMulti: true,
                  legs: ["l:1", "l:2", "l:3"],
                  betReceiptId: "betReceiptIdMock",
                  displayOdds: "displayOddsMock",
                  totalStake: 1,
                  totalPotentialReturns: 2,
                  hasBonusUsed: true,
                  totalBonusUsed: 1,
                },
              },
              legs: {
                "l:1": { id: "l:1", runners: ["r:1"] },
                "l:2": { id: "l:2", runners: ["r:2"] },
                "l:3": { id: "l:3", runners: ["r:3"] },
              },
            },
            metadata: {
              "r:1": {
                eventUrn: "e:urn:1",
                runnerUrn: "r:1",
                eventName: "AD Marco vs FC Porto",
                type: "GENERIC",
                is90Min: true,
                marketType: "MARKET_TYPE_1",
                meetingCountry: "UK",
                trap: 2,
              },
              "r:2": {
                eventUrn: "e:urn:1",
                runnerUrn: "r:2",
                eventName: "AD Marco vs FC Porto",
                type: "GENERIC",
                marketType: "MARKET_TYPE_2",
              },
              "r:3": {
                type: "RACING",
                racing: {
                  urn: "race:urn:1",
                  venue: "r:3 venue",
                },
              },
            },
          };

          const preferences = {
            sportsbookOddsDisplay: "sportsbookOddsDisplayMock",
          };

          isMultiBetBuilder.mockReturnValueOnce(false);
          isMultiBetBuilder.mockReturnValueOnce(false);
          isMultiBetBuilder.mockReturnValueOnce(true);
          buildOdds.mockReturnValueOnce("2.1");
          buildPotentialReturns.mockReturnValueOnce("€2.10");
          currencyFormatWithDecimalPlaces.mockReturnValueOnce("€1.00");
          getSelectionTypeIcon.mockReturnValueOnce(undefined);
          getSelectionTypeIcon.mockReturnValueOnce(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);

          return createMultiBetBuilderGroups()(report, preferences, userDetails);
        };

        it("should return grouped selections", () => {
          buildMultiBetBuilderGroup.mockImplementation((metadata) => ({
            groupUrn: metadata.eventUrn || metadata.racing.urn,
            groupTitle: metadata.eventName || metadata.racing.venue,
          }));
          const groups = setup();

          expect(groups).toEqual({
            "e:urn:1": {
              selections: [
                {
                  id: "l:1",
                  subtitle: "Subtitle",
                  title: "Title",
                  is90Min: true,
                  selectionTypeIcon: undefined,
                  icon: "Icon",
                  silkFallbackType: FallbackIconType.HorseRacing,
                  racingSport: 7,
                  meetingCountry: "UK",
                  trap: 2,
                },
                {
                  id: "l:2",
                  subtitle: "Subtitle",
                  title: "Title",
                  selectionTypeIcon: IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME,
                  icon: "Icon",
                  silkFallbackType: FallbackIconType.HorseRacing,
                  racingSport: 7,
                  meetingCountry: "UK",
                  trap: 2,
                },
              ],
              title: "AD Marco vs FC Porto",
              urn: "e:urn:1",
            },
            "race:urn:1": {
              selections: [
                {
                  id: "l:3",
                  subtitle: "Subtitle",
                  title: "Title",
                  icon: "Icon",
                  silkFallbackType: FallbackIconType.HorseRacing,
                  racingSport: 7,
                  meetingCountry: "UK",
                  trap: 2,
                },
              ],
              title: "r:3 venue",
              urn: "race:urn:1",
            },
          });
        });
      });
    });
  });

  describe("createOneLineBetsBuilder", () => {
    describe("when there is no report", () => {
      it("should return no one line bet", () => {
        expect(createOneLineBetsBuilder()(undefined, {}, {})).toEqual([]);
      });
    });

    describe("when there are one line bets", () => {
      function setupOneLineBetsReport(
        isFreeBetsWalletsActive = false,
        isFreeBetsSelected = false,
        isSelectionTypeIconEnabled = false,
      ) {
        isLotteries.mockReturnValue(true);
        formatOdds.mockReturnValue("Formatted Display Odds");
        buildSelection.mockReturnValue({ subtitle: "UK49s - Lunchtime" });

        return createOneLineBetsBuilder()(
          {
            result: {
              combinations: {
                "COMBINATION:1": {
                  id: "COMBINATION:1",
                  betType: "SINGLE",
                  legs: ["LEG:1"],
                  totalStake: 1.23,
                  totalPotentialReturns: 3,
                  totalBonusUsed: 0,
                  isEachWaySelected: false,
                  eachWayPlacesFraction: { numerator: 1, denominator: 2 },
                  eachWayPlaces: 3,
                  isPriceBoosted: false,
                  originalTotalPotentialReturns: 2,
                  originalDisplayOdds: 1.5,
                  isGuaranteedPriceSelected: false,
                  betReceiptId: "123",
                  regulatorId: "x-123",
                },
                "COMBINATION:2": {
                  id: "COMBINATION:2",
                  betType: "SINGLE",
                  legs: ["LEG:2"],
                  isEachWaySelected: false,
                  isPriceBoosted: false,
                  isGuaranteedPriceSelected: false,
                  betReceiptId: "124",
                  regulatorId: "x-124",
                },
                "COMBINATION:3": {
                  id: "COMBINATION:3",
                  betType: "SINGLE",
                  legs: ["LEG:3"],
                  totalStake: 2.5,
                  totalPotentialReturns: 5,
                  totalBonusUsed: 2.5,
                  hasBonusUsed: true,
                  isEachWaySelected: true,
                  eachWayPlacesFraction: { numerator: 4, denominator: 5 },
                  eachWayPlaces: 6,
                  isPriceBoosted: true,
                  originalTotalPotentialReturns: 3,
                  originalDisplayOdds: 2.5,
                  isGuaranteedPriceSelected: true,
                  betReceiptId: "125",
                  regulatorId: "x-125",
                },
                "COMBINATION:4": {
                  id: "COMBINATION:4",
                  betType: "SINGLE",
                  legs: ["LEG:4"],
                  totalStake: 2,
                  totalPotentialReturns: 0,
                  totalBonusUsed: 2,
                  hasBonusUsed: true,
                  isEachWaySelected: false,
                  isPriceBoosted: false,
                  isGuaranteedPriceSelected: false,
                  betReceiptId: "126",
                  regulatorId: "x-126",
                },
              },
              legs: {
                "LEG:1": {
                  displayOdds: 1,
                  runners: ["RUNNER:1"],
                  legType: "ONE_LINE_BET",
                },
                "LEG:2": {
                  runners: ["RUNNER:2"],
                  legType: "ONE_LINE_BET",
                },
                "LEG:3": {
                  runners: ["RUNNER:3"],
                  legType: "ONE_LINE_BET",
                },
                "LEG:4": {
                  runners: ["RUNNER:4"],
                  legType: "ONE_LINE_BET",
                },
              },
              relations: {
                legsRunners: {
                  "LEG:1": {
                    "RUNNER:1": {
                      handicap: 3.5,
                    },
                  },
                  "LEG:2": {
                    "RUNNER:2": {
                      handicap: -3.5,
                    },
                  },
                  "LEG:3": {
                    "RUNNER:3": {
                      handicap: -3.5,
                    },
                  },
                  "LEG:4": {
                    "RUNNER:4": {
                      handicap: -3.5,
                    },
                  },
                },
              },
              runners: {
                "RUNNER:1": {
                  displayOdds: {
                    decimalOdds: 1,
                  },
                  id: "RUNNER:1",
                  selectionId: 1,
                },
                "RUNNER:2": {
                  displayOdds: {
                    decimalOdds: 1,
                  },
                  id: "RUNNER:2",
                  selectionId: 2,
                },
                "RUNNER:3": {
                  displayOdds: {
                    decimalOdds: 1,
                  },
                  id: "RUNNER:3",
                  selectionId: 3,
                },
                "RUNNER:4": {
                  displayOdds: {
                    decimalOdds: 1,
                  },
                  id: "RUNNER:4",
                  selectionId: 4,
                },
              },
            },
            metadata: {
              "RUNNER:1": {
                runnerName: "1",
                runnerUrn: "ppb:runner:1",
                marketName: "M",
                eventName: "E",
                eventUrn: "ppb:event:29125756",
                marketType: "STANDARD_BET",
                sportId: "29125756",
              },
              "RUNNER:2": {
                runnerName: "2",
                marketName: "M 2",
                eventName: "E 2",
                eventUrn: "ppb:event:29125756",
                marketType: "STANDARD_BET",
                sportId: "29125756",
              },
              "RUNNER:3": {
                eventUrn: "ppb:event:29125756",
                runnerName: "3",
                marketName: "M 3",
                eventName: "E 3",
                marketType: "STANDARD_BET",
                sportId: "29125756",
              },
              "RUNNER:4": {
                eventUrn: "ppb:event:29125756",
                runnerName: "4",
                marketName: "M 3",
                eventName: "E 3",
                marketType: "STANDARD_BET",
                sportId: "29125756",
              },
            },
            isFreeBetsSelected,
          },
          { sportsbookOddsDisplay: "pref" },
          { details: "details" },
          isFreeBetsWalletsActive,
          isSelectionTypeIconEnabled,
        );
      }

      it("should call buildOdds with displayOdds", () => {
        setupOneLineBetsReport();

        expect(buildOdds).toHaveBeenCalledWith({ decimalOdds: 1 }, "pref");
      });

      it("should call buildSportsbookFreeBetsLabel the same number as one line bet in combinations", () => {
        setupOneLineBetsReport(false, true);

        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledTimes(4);
      });

      it("should call currencyFormatWithDecimalPlaces for the stake", () => {
        setupOneLineBetsReport();

        expect(currencyFormatWithDecimalPlaces).toHaveBeenCalledWith({
          details: "details",
          value: 1.23,
        });
      });

      it("should call buildPotentialReturns for the returns", () => {
        setupOneLineBetsReport();

        expect(buildPotentialReturns).toHaveBeenCalledWith(2.5, 5, { details: "details" });
      });

      it("should build one line bets with and without odds", () => {
        buildOdds.mockReturnValueOnce("Formatted Display Odds");
        buildOdds.mockReturnValueOnce("I18N.BETSLIP.STARTING_PRICE");
        const oneLineBets = setupOneLineBetsReport();

        expect(oneLineBets[0].odds).toEqual("Formatted Display Odds");
        expect(oneLineBets[1].odds).toEqual("I18N.BETSLIP.STARTING_PRICE");
      });

      it("should build one line bets with and without returns", () => {
        const oneLineBets = setupOneLineBetsReport();

        expect(oneLineBets[0].profitOrLiability).toEqual("some potentialReturns");
        expect(oneLineBets[1].profitOrLiability).toEqual("some potentialReturns");
      });

      it("should build one line bets with and without selectionTypeIcon", () => {
        getSelectionTypeIcon.mockReturnValueOnce(undefined);
        getSelectionTypeIcon.mockReturnValueOnce(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);

        const oneLineBets = setupOneLineBetsReport(false, false, true);

        expect(oneLineBets[0].selectionTypeIcon).toEqual(undefined);
        expect(oneLineBets[1].selectionTypeIcon).toEqual(IconsList.TWO_UP_EARLY_PAYOUT_MONOCHROME);
      });

      it("should build one line bets with and without hasBonusUsed", () => {
        const oneLineBets = setupOneLineBetsReport();

        expect(oneLineBets[0].hasBonusUsed).toEqual(undefined);
        expect(oneLineBets[2].hasBonusUsed).toEqual(true);
      });

      it("should build one line bets with buildSportsbookFreeBetsLabel", () => {
        const oneLineBets = setupOneLineBetsReport(false, true);

        expect(oneLineBets[0]).toEqual(
          expect.objectContaining({
            freeBetsLabel: "some freeBetsLabel",
            generosityAlertMessage: undefined,
          }),
        );
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledTimes(4);
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(0, { details: "details" }, "I18N.BETSLIP.USED_BONUS");
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(
          2.5,
          { details: "details" },
          "I18N.BETSLIP.USED_BONUS",
        );
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(2, { details: "details" }, "I18N.BETSLIP.USED_BONUS");
        expect(buildSportsbookFreeBetsLabel).toHaveBeenCalledWith(
          undefined,
          { details: "details" },
          "I18N.BETSLIP.USED_BONUS",
        );
      });

      it("should build one line bets with formatted stake", () => {
        const oneLineBets = setupOneLineBetsReport();

        expect(oneLineBets[0].stake).toEqual("Formatted Currency");
        expect(oneLineBets[1].stake).toEqual("Formatted Currency");
      });

      describe("when isFreeBetsWalletsActive is true", () => {
        it("should call buildFreeBetsAlertMessage", () => {
          setupOneLineBetsReport(true);

          expect(buildFreeBetsAlertMessage).toHaveBeenCalledTimes(2);
          expect(buildFreeBetsAlertMessage).toHaveBeenNthCalledWith(1, {
            combinationAmount: 2.5,
            userDetails: {
              details: "details",
            },
          });
          expect(buildFreeBetsAlertMessage).toHaveBeenNthCalledWith(2, {
            combinationAmount: 2,
            userDetails: {
              details: "details",
            },
          });
        });

        it("should build one line bets with correct generosity message", () => {
          const oneLineBets = setupOneLineBetsReport(true);
          expect(oneLineBets[0]).toEqual(
            expect.objectContaining({
              freeBetsLabel: undefined,
              generosityAlertMessage: undefined,
            }),
          );
          expect(oneLineBets[1]).toEqual(
            expect.objectContaining({
              freeBetsLabel: undefined,
              generosityAlertMessage: undefined,
            }),
          );
          expect(oneLineBets[2]).toEqual(
            expect.objectContaining({
              freeBetsLabel: undefined,
              generosityAlertMessage: "free bets alert message mock",
            }),
          );
          expect(oneLineBets[3]).toEqual(
            expect.objectContaining({
              freeBetsLabel: undefined,
              generosityAlertMessage: "free bets alert message mock",
            }),
          );
        });
      });
    });
  });
});
