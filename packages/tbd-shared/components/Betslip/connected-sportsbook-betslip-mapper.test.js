import { AlertType, FallbackIconType } from "@ppb/the-wall-common/types";
import { OddsDisplayPreference } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import {
  getAllUniqueCombinationsFailures,
  getAllUniqueRunnersFailures,
  getOperationalFailure,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  getSbkPlaceImportantErrorCode,
  hasAnyInvalidCombinationFailure,
  hasAnyMarketClosedFailure,
  hasAnyMarketSuspendedFailure,
  isSingleLike,
} from "@ppb/tbd-store/helpers/sportsbook-betting";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { RUNNER_FAILURE_CODES, BET_TYPES } from "@ppb/betslip-core";
import { RacingSport } from "@ppb/tbd-store";
import { formatDateWithOrdinal } from "@ppb/formatters";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import {
  buildSingles,
  buildReturnsLabel,
  buildSportsbookTransactionalError,
  buildSelection,
  createAvailabilityNotificationSelector,
  createMultiplesNotificationsSelector,
  translateMultiple,
  combinationToBetBuilder,
  hasAnyInvalidSGMCombinationFailure,
  hasAnySameMarketCombinationFailure,
  hasNotEligibleSGMSelectionCombinationFailure,
  buildMultiBetBuilderGroup,
  createAreAllCombinationsClosedOrSuspendedSelector,
} from "./connected-sportsbook-betslip-mapper";
import { i18n } from "../../helpers/i18n";
import { formatTime } from "../../helpers/dates";
import { buildCombinationOdds } from "./betslip-formatters";
import { formatHandicap, formatRunnerName } from "../../formatters/runner-formatters";
import { NotificationCode } from "./betslip-notification-code";

jest.mock("../../formatters/runner-formatters", () => ({
  formatHandicap: jest.fn(() => "(+1)"),
  formatRunnerName: jest.fn(() => "Formatted Runner Name"),
}));

const USER_DETAILS = {
  localeCode: "en",
  countryCode: "gb",
  currencyCode: "eur",
  localeCodeBcp47: "en",
  timezone: "timezone",
};

jest.mock("reselect", () => ({
  createSelector: jest.fn((_deps, selector) => selector),
  createSelectorCreator: jest.fn(() => jest.fn((selector) => selector)),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(() => "formattedCurrency"),
}));
jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors");
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getAllUniqueCombinationsFailures: jest.fn(),
  getAllUniqueRunnersFailures: jest.fn(),
  getOperationalFailure: jest.fn(),
  getSportsbookBettingImplyRunnerFailures: jest.fn().mockReturnValue({}),
  getSportsbookBettingSBGBetslipBrandSettingIsSet: jest.fn().mockReturnValue({}),
  getSportsbookBettingNumRunners: jest.fn().mockReturnValue({}),
  getSportsbookBettingRunners: jest.fn().mockReturnValue({}),
  getSportsbookBettingLegs: jest.fn(),
  createSportsbookBettingRunnerSelector: jest.fn(() => () => "createSportsbookBettingRunnerSelector"),
}));
jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createBettingRunnersMetadataSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors", () => ({
  createOddsMovementSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  getSbkPlaceImportantErrorCode: jest.fn(),
  isSingleLike: jest.fn(),
  hasAnyMarketClosedFailure: jest.fn(),
  hasAnyMarketSuspendedFailure: jest.fn(),
  hasAnyInvalidCombinationFailure: jest.fn(),
}));
jest.mock("../../helpers/race", () => ({
  getSilkFallbackType: jest.fn((sportId) => (sportId === 7 ? FallbackIconType.HorseRacing : undefined)),
  getRaceSport: jest.fn((sportId) => (sportId === 7 ? RacingSport.HORSE_RACING : undefined)),
}));
jest.mock("./betslip-formatters", () => ({
  buildCombinationOdds: jest.fn().mockReturnValue("Formatted Display Odds"),
}));
jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => (interpolationValues ? { key, interpolationValues } : key)),
}));
jest.mock("../../helpers/dates", () => ({
  formatTime: jest.fn().mockReturnValue("Formatted Time"),
}));
jest.mock("@ppb/formatters", () => ({
  formatDateWithOrdinal: jest.fn().mockReturnValue("Formatted Date"),
}));

describe("Connected Sportsbook Betslip Mapper", () => {
  beforeEach(jest.clearAllMocks);

  describe("hasAnyInvalidCombinationFailure", () => {
    describe("when there is an INVALID_COMBINATION failure", () => {
      it("should return true", () => {
        hasAnyInvalidCombinationFailure.mockReturnValueOnce(true);

        expect(hasAnyInvalidCombinationFailure([{ failureCode: RUNNER_FAILURE_CODES.INVALID_COMBINATION }])).toEqual(
          true,
        );
      });
    });

    describe("when there is NO INVALID_COMBINATION failure", () => {
      it("should return false", () => {
        hasAnyInvalidCombinationFailure.mockReturnValueOnce(false);

        expect(hasAnyInvalidCombinationFailure([{ failureCode: "STUFF" }])).toEqual(false);
      });
    });
  });

  describe("hasAnyInvalidSGMCombinationFailure", () => {
    describe("when there is an INVALID_SGM_COMBINATION failure", () => {
      it("should return true", () => {
        expect(
          hasAnyInvalidSGMCombinationFailure([{ failureCode: RUNNER_FAILURE_CODES.INVALID_SGM_COMBINATION }]),
        ).toEqual(true);
      });
    });

    describe("when there is NO INVALID_SGM_COMBINATION failure", () => {
      it("should return false", () => {
        expect(hasAnyInvalidSGMCombinationFailure([{ failureCode: "STUFF" }])).toEqual(false);
      });
    });
  });

  describe("hasAnySameMarketCombinationFailure", () => {
    describe("when there is an IMPOSSIBLE_SAME_MARKET_COMBINATION failure", () => {
      it("should return true", () => {
        expect(
          hasAnySameMarketCombinationFailure([
            { failureCode: RUNNER_FAILURE_CODES.IMPOSSIBLE_SAME_MARKET_COMBINATION },
          ]),
        ).toEqual(true);
      });
    });

    describe("when there is NO IMPOSSIBLE_SAME_MARKET_COMBINATION failure", () => {
      it("should return false", () => {
        expect(hasAnySameMarketCombinationFailure([{ failureCode: "STUFF" }])).toEqual(false);
      });
    });
  });

  describe("hasNotEligibleSGMSelectionCombinationFailure", () => {
    describe("when there is an NOT_ELIGIBLE_SGM_SELECTION failure", () => {
      it("should return true", () => {
        expect(
          hasNotEligibleSGMSelectionCombinationFailure([
            { failureCode: RUNNER_FAILURE_CODES.NOT_ELIGIBLE_SGM_SELECTION },
          ]),
        ).toEqual(true);
      });
    });

    describe("when there is NO NOT_ELIGIBLE_SGM_SELECTION failure", () => {
      it("should return false", () => {
        expect(hasNotEligibleSGMSelectionCombinationFailure([{ failureCode: "STUFF" }])).toEqual(false);
      });
    });
  });

  describe("buildSelection", () => {
    describe("when RACING metadata type", () => {
      it("should return a formatted name", () => {
        const { name } = buildSelection(
          {
            racing: { saddleCloth: "3." },
            runnerName: "Runner Name",
            type: "RACING",
          },
          {
            localeCodeBcp47: "locale",
            timezone: "timezone",
          },
        );

        expect(name).toEqual("3. Runner Name");
      });

      it("should return a formatted title", () => {
        const { title } = buildSelection(
          {
            racing: { saddleCloth: "3." },
            runnerName: "Runner Name",
            type: "RACING",
          },
          {
            localeCodeBcp47: "locale",
            timezone: "timezone",
          },
        );

        expect(title).toEqual("3. Runner Name");
      });

      it("should return title same as name", () => {
        const { title, name } = buildSelection(
          {
            racing: { saddleCloth: "3." },
            runnerName: "Runner Name",
            type: "RACING",
          },
          {
            localeCodeBcp47: "locale",
            timezone: "timezone",
          },
        );

        expect(title).toEqual(name);
      });

      it("should return a icon", () => {
        const { icon } = buildSelection(
          {
            racing: { runnerVisual: "X Visual" },
            runnerName: "Runner Name",
            type: "RACING",
          },
          {
            localeCodeBcp47: "locale",
            timezone: "timezone",
          },
        );

        expect(icon).toEqual("X Visual");
      });

      it("should return a silk fallback type", () => {
        const { silkFallbackType } = buildSelection(
          {
            racing: {},
            sportId: 7,
            runnerName: "Runner Name",
            type: "RACING",
          },
          {
            localeCodeBcp47: "locale",
            timezone: "timezone",
          },
        );

        expect(silkFallbackType).toEqual(FallbackIconType.HorseRacing);
      });

      it("should return a racingSport", () => {
        const { racingSport } = buildSelection(
          {
            racing: { runnerVisual: "X Visual" },
            runnerName: "Runner Name",
            sportId: 7,
            type: "RACING",
          },
          {
            localeCodeBcp47: "locale",
            timezone: "timezone",
          },
        );

        expect(racingSport).toEqual(7);
      });

      describe("should return correct trap", () => {
        it("should return trap number when mapped market", () => {
          const { trap } = buildSelection(
            {
              racing: { runnerVisual: "X Visual", trap: 1 },
              runnerName: "Runner Name",
              marketType: "WIN",
              sportId: 4339,
              type: "RACING",
            },
            {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          );

          expect(trap).toEqual(1);
        });

        it("should return default as trap if mapped market but no trap", () => {
          const { trap } = buildSelection(
            {
              racing: { runnerVisual: "X Visual" },
              runnerName: "Runner Name",
              marketType: "WIN",
              sportId: 4339,
              type: "RACING",
            },
            {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          );

          expect(trap).toEqual("default");
        });

        it("should return undefined when not mapped market", () => {
          const { trap } = buildSelection(
            {
              racing: { runnerVisual: "X Visual", trap: 1 },
              marketType: "Some Random Market",
            },
            {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          );

          expect(trap).toBeUndefined();
        });

        it("should return undefined when no market type provided", () => {
          const { trap } = buildSelection(
            {
              racing: { runnerVisual: "X Visual", trap: 1 },
              marketTypeName: "Some Market",
              marketName: "Some Market",
            },
            {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          );

          expect(trap).toBeUndefined();
        });
      });

      describe("should return meetingCountry", () => {
        it("should map GB to UK", () => {
          const { meetingCountry } = buildSelection(
            {
              racing: { runnerVisual: "X Visual", meetingCountry: "GB" },

              runnerName: "Runner Name",
              sportId: 7,
              type: "RACING",
            },
            {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          );
          expect(meetingCountry).toEqual("UK");
        });

        it("should map US to US", () => {
          const { meetingCountry } = buildSelection(
            {
              racing: { runnerVisual: "X Visual", meetingCountry: "US" },
              runnerName: "Runner Name",
              sportId: 7,
              type: "RACING",
            },
            {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          );
          expect(meetingCountry).toEqual("US");
        });

        it("should map AU to AU", () => {
          const { meetingCountry } = buildSelection(
            {
              racing: { runnerVisual: "X Visual", meetingCountry: "AU" },
              runnerName: "Runner Name",
              sportId: 7,
              type: "RACING",
            },
            {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          );
          expect(meetingCountry).toEqual("AU");
        });

        it("should map unknown country to AGNOSTIC", () => {
          const { meetingCountry } = buildSelection(
            {
              racing: { runnerVisual: "X Visual", meetingCountry: "BRA" },
              runnerName: "Runner Name",
              sportId: 7,
              type: "RACING",
            },
            {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          );
          expect(meetingCountry).toEqual("AGNOSTIC");
        });
      });

      it("should return a formatted eventUrn", () => {
        const { eventUrn } = buildSelection(
          {
            racing: { venue: "Venue", urn: "ppb:race:12345.007" },
            sportId: 7,
            marketName: "5m",
            runnerName: "Runner Name",
            type: "RACING",
          },
          {
            localeCodeBcp47: "locale",
            timezone: "timezone",
          },
        );

        expect(eventUrn).toEqual("ppb:race:12345.007");
      });

      describe("when there is a market type name", () => {
        it("should return a formatted subtitle with the market type name", () => {
          const { subtitle } = buildSelection(
            {
              racing: { venue: "Venue", time: "12" },
              sportId: 7,
              marketTypeName: "Win",
              runnerName: "Runner Name",
              type: "RACING",
            },
            {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          );

          expect(subtitle).toEqual("Win - Formatted Time Venue");
          expect(formatTime).toHaveBeenCalledWith("12", "locale", "timezone");
        });
        it("and market type is greyhound betting without should return a formatted subtitle with the market name", () => {
          const { subtitle } = buildSelection(
            {
              racing: { venue: "Venue", time: "12" },
              sportId: 7,
              marketTypeName: "Betting Without",
              marketName: "Betting Without Runner A",
              runnerName: "Runner Name",
              type: "RACING",
              marketType: "BETTING_W/O",
            },
            {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          );

          expect(subtitle).toEqual("Betting Without Runner A - Formatted Time Venue");
          expect(formatTime).toHaveBeenCalledWith("12", "locale", "timezone");
        });
      });
      describe("when there is a market name", () => {
        it("should return a formatted subtitle with the market name", () => {
          const { subtitle } = buildSelection(
            {
              racing: { venue: "Venue" },
              sportId: 7,
              marketName: "5m",
              runnerName: "Runner Name",
              type: "RACING",
            },
            {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          );

          expect(subtitle).toEqual("5m - Formatted Time Venue");
        });
      });
    });

    describe("when GENERIC metadata type", () => {
      it("should return a formatted handicap", () => {
        const { name } = buildSelection(
          {
            runnerName: "Runner Name",
            type: "GENERIC",
          },
          "userDetails",
          { handicap: 3 },
        );

        expect(formatHandicap).toHaveBeenCalledWith(3);
        expect(name).toEqual("Runner Name");
      });

      it("should return a formatted title", () => {
        const { title } = buildSelection(
          {
            runnerName: "Runner Name",
            type: "GENERIC",
          },
          "userDetails",
          { handicap: 3 },
        );

        expect(formatRunnerName).toHaveBeenCalledWith("Runner Name", 3);
        expect(title).toEqual("Formatted Runner Name");
      });

      it("should return the base runner name", () => {
        const { name } = buildSelection(
          {
            runnerName: "Runner Name",
            type: "GENERIC",
          },
          "userDetails",
          { handicap: 3 },
        );

        expect(name).toEqual("Runner Name");
      });

      it("should return a formatted subtitle", () => {
        const { subtitle } = buildSelection(
          {
            runnerName: "Runner Name",
            marketName: "Market Name",
            eventName: "Event Name",
            type: "GENERIC",
          },
          { handicap: 3 },
        );

        expect(subtitle).toEqual("Market Name - Event Name");
      });

      describe("when it is a Lotteries event", () => {
        const lotteriesMetadata = {
          eventName: "Lunchtime",
          competitionName: "Uk 49s",
          sportId: 29125756,
        };
        describe("when there is eventOpenDate", () => {
          it("should return a formatted subtitle with date", () => {
            const { subtitle } = buildSelection(
              {
                ...lotteriesMetadata,
                eventOpenDate: "2024-06-21T12:30:00.000Z",
              },
              {},
            );

            expect(formatDateWithOrdinal).toHaveBeenCalledTimes(1);
            expect(subtitle).toEqual("Uk 49s Lunchtime Formatted Date");
          });
        });

        describe("when there is no eventOpenDate", () => {
          it("should return a formatted subtitle without date", () => {
            const { subtitle } = buildSelection(lotteriesMetadata, {});

            expect(formatDateWithOrdinal).not.toHaveBeenCalled();
            expect(subtitle).toEqual("Uk 49s Lunchtime");
          });
        });
      });

      describe("when super sub is true", () => {
        it("should return the correct formatted subtitle", () => {
          const { subtitle } = buildSelection(
            {
              marketName: "Market Name",
              eventName: "Event Name",
              isSuperSub: true,
              type: "GENERIC",
            },
            { handicap: 3 },
          );

          expect(subtitle).toEqual({
            key: "I18N.BETSLIP.SUPER_SUB.SUBTITLE",
            interpolationValues: { eventName: "Event Name", marketName: "Market Name" },
          });
        });
      });

      it("should return a formatted eventUrn", () => {
        const { eventUrn } = buildSelection(
          {
            runnerName: "Runner Name",
            marketName: "Market Name",
            eventName: "Event Name",
            eventUrn: "ppb:event:12345",
            type: "GENERIC",
          },
          { handicap: 3 },
        );

        expect(eventUrn).toEqual("ppb:event:12345");
      });
    });
  });

  describe("createMultiplesNotificationsSelector", () => {
    describe("when there are failed runners", () => {
      it("should return a populated array of multiples notifications", () => {
        hasAnyInvalidCombinationFailure.mockReturnValueOnce(true);

        const failedRunners = { "RUNNER:1": [{ failureCode: "INVALID_COMBINATION" }] };
        const multiplesNotifications = createMultiplesNotificationsSelector()(failedRunners);

        expect(multiplesNotifications.length).toEqual(1);
        expect(multiplesNotifications).toEqual([
          {
            id: NotificationCode.NotCombinable,
            type: "WARNING",
            message: "I18N.BETSLIP.NOT_COMBINABLE",
          },
        ]);

        expect(i18n).toHaveBeenCalledTimes(1);
        expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.NOT_COMBINABLE" });
      });
    });

    describe("when there are not failed runners", () => {
      it("should return an empty array", () => {
        const failedRunners = {};
        const multiplesNotifications = createMultiplesNotificationsSelector()(failedRunners);

        expect(multiplesNotifications.length).toEqual(0);
      });
    });
  });

  describe("buildSportsbookTransactionalError", () => {
    describe("when there is a technical error", () => {
      function setupTechnicalError() {
        getBetslipCard.mockReturnValue({ hasSportsbookTechnicalError: true });

        return buildSportsbookTransactionalError({});
      }

      it("should return an unknown error message", () => {
        const error = setupTechnicalError();

        expect(error).toEqual({
          id: NotificationCode.TransactionalError,
          type: "ERROR",
          message: "I18N.BETSLIP.ERROR.UNKNOWN",
        });
      });
    });

    function setupOperationalFailure({
      operationalFailure = "ACCOUNT_SUSPENDED",
      runnersFailures,
      combinationsFailures,
      errorCode,
      state = {},
    } = {}) {
      getBetslipCard.mockReturnValue({ hasSportsbookTechnicalError: false });
      getOperationalFailure.mockReturnValue(operationalFailure);
      getAllUniqueRunnersFailures.mockReturnValue(runnersFailures);
      getAllUniqueCombinationsFailures.mockReturnValue(combinationsFailures);
      getSbkPlaceImportantErrorCode.mockReturnValue(errorCode);

      return buildSportsbookTransactionalError(state);
    }

    describe("when there is no operational failure", () => {
      it("should return no error message", () => {
        const error = setupOperationalFailure({ operationalFailure: null });

        expect(error).toEqual(undefined);
      });
    });

    describe("when there's an operational failure", () => {
      it("should call getAllUniqueRunnersFailures", () => {
        const state = "stateMock";
        setupOperationalFailure({ state });

        expect(getAllUniqueRunnersFailures).toHaveBeenCalledWith(state);
        expect(getAllUniqueRunnersFailures).toHaveBeenCalledTimes(1);
      });

      it("should call getAllUniqueCombinationsFailures", () => {
        const state = "stateMock";
        setupOperationalFailure({ state });

        expect(getAllUniqueCombinationsFailures).toHaveBeenCalledWith(state);
        expect(getAllUniqueCombinationsFailures).toHaveBeenCalledTimes(1);
      });

      it("should call getSbkPlaceImportantErrorCode", () => {
        const operationalFailure = "BEST_FAILURE";
        const runnersFailures = "AMAZING_RUNNER_FAILURE";
        const combinationsFailures = "BEST_SO_FAR_COMBINATION_FAILURE";
        setupOperationalFailure({ operationalFailure, runnersFailures, combinationsFailures });

        expect(getSbkPlaceImportantErrorCode).toHaveBeenCalledWith({
          operationalFailure,
          uniqueRunnersFailures: runnersFailures,
          uniqueCombinationsFailures: combinationsFailures,
        });
        expect(getSbkPlaceImportantErrorCode).toHaveBeenCalledTimes(1);
      });

      describe("the returned notification", () => {
        it("should be of Error type", () => {
          const errorCode = "GREATEST_ERROR";
          const notification = setupOperationalFailure({ errorCode });

          expect(notification.type).toBe(AlertType.Error);
        });

        it("should be translated message", () => {
          const errorCode = "GREATEST_ERROR";
          const notification = setupOperationalFailure({ errorCode });

          expect(i18n).toHaveBeenCalledWith({ key: "I18N.BETSLIP.SBK.ERROR.GREATEST_ERROR" });
          expect(i18n).toHaveBeenCalledTimes(1);
          expect(notification.message).toBe("I18N.BETSLIP.SBK.ERROR.GREATEST_ERROR");
        });
      });
    });
  });

  describe("createAvailabilityNotificationSelector", () => {
    describe("when there are closed runners", () => {
      it("should return a closed message", () => {
        hasAnyMarketClosedFailure.mockReturnValueOnce(true);

        const closedFailures = {
          "R:1": [{ failureCode: RUNNER_FAILURE_CODES.SELECTION_NOT_FOUND }],
        };
        const buildAvailabilityNotification = createAvailabilityNotificationSelector();

        expect(buildAvailabilityNotification(closedFailures)).toEqual({
          id: NotificationCode.Availability,
          type: AlertType.Warning,
          message: "I18N.BETSLIP.SBK.MARKET_CLOSED",
        });
      });
    });

    describe("when there are closed markets", () => {
      const closedFailures = {
        "R:1": [{ failureCode: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND }],
      };

      it("should return a closed message if not multi or SBG", () => {
        hasAnyMarketClosedFailure.mockReturnValueOnce(true);

        const buildAvailabilityNotification = createAvailabilityNotificationSelector();

        expect(buildAvailabilityNotification(closedFailures)).toEqual({
          id: NotificationCode.Availability,
          type: AlertType.Warning,
          message: "I18N.BETSLIP.SBK.MARKET_CLOSED",
        });
      });

      it("should return a closed message with exclude closed if multi or SBG", () => {
        hasAnyMarketClosedFailure.mockReturnValueOnce(true);

        const buildAvailabilityNotification = createAvailabilityNotificationSelector();

        expect(buildAvailabilityNotification(closedFailures, true, 3)).toEqual({
          id: NotificationCode.Availability,
          type: AlertType.Info,
          message: "I18N.BETSLIP.SBK.MARKET_CLOSED",
          detail: "I18N.BETSLIP.SBG.EXCLUDE_CLOSED",
        });
      });
    });

    describe("when there are suspended runners", () => {
      it("should return a suspended message", () => {
        hasAnyMarketSuspendedFailure.mockReturnValueOnce(true);

        const suspendedFailures = {
          "R:1": [{ failureCode: RUNNER_FAILURE_CODES.RUNNER_SUSPENDED }],
        };
        const buildAvailabilityNotification = createAvailabilityNotificationSelector();

        expect(buildAvailabilityNotification(suspendedFailures)).toEqual({
          id: NotificationCode.Availability,
          type: AlertType.Warning,
          message: "I18N.BETSLIP.SBK.MARKET_SUSPENDED",
        });
      });
    });

    describe("when there are suspended markets", () => {
      const suspendedFailures = {
        "R:1": [{ failureCode: RUNNER_FAILURE_CODES.MARKET_SUSPENDED }],
      };

      it("should return a suspended message if not multi or SBG", () => {
        hasAnyMarketSuspendedFailure.mockReturnValueOnce(true);

        const buildAvailabilityNotification = createAvailabilityNotificationSelector();

        expect(buildAvailabilityNotification(suspendedFailures)).toEqual({
          id: NotificationCode.Availability,
          type: AlertType.Warning,
          message: "I18N.BETSLIP.SBK.MARKET_SUSPENDED",
        });
      });

      it("should return an availability changed with exclude unavailable if multi and SBG", () => {
        hasAnyMarketSuspendedFailure.mockReturnValueOnce(true);

        const buildAvailabilityNotification = createAvailabilityNotificationSelector();

        expect(buildAvailabilityNotification(suspendedFailures, true, 3)).toEqual({
          id: NotificationCode.Availability,
          type: AlertType.Info,
          message: "I18N.BETSLIP.SBG.AVAILABILITY_CHANGED",
          detail: "I18N.BETSLIP.SBG.EXCLUDE_UNAVAILABLE",
        });
      });
    });

    describe("when there are suspended and closed failures", () => {
      const failures = {
        "R:1": [{ failureCode: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND }],
        "R:2": [{ failureCode: RUNNER_FAILURE_CODES.MARKET_SUSPENDED }],
      };

      it("should return a closed message if not multi or SBG", () => {
        hasAnyMarketClosedFailure.mockReturnValueOnce(true);
        hasAnyMarketSuspendedFailure.mockReturnValueOnce(true);

        const buildAvailabilityNotification = createAvailabilityNotificationSelector();

        expect(buildAvailabilityNotification(failures)).toEqual({
          id: NotificationCode.Availability,
          type: AlertType.Warning,
          message: "I18N.BETSLIP.AVAILABILITY_NOTIFICATION",
        });
      });

      it("should return an availability changed with exclude closed or suspended if multi and SBG", () => {
        hasAnyMarketClosedFailure.mockReturnValueOnce(true);
        hasAnyMarketSuspendedFailure.mockReturnValueOnce(true);

        const buildAvailabilityNotification = createAvailabilityNotificationSelector();

        expect(buildAvailabilityNotification(failures, true, 3)).toEqual({
          id: NotificationCode.Availability,
          type: AlertType.Info,
          message: "I18N.BETSLIP.SBG.AVAILABILITY_CHANGED",
          detail: "I18N.BETSLIP.SBG.EXCLUDE_CLOSED_OR_SUSPENDED",
        });
      });
    });

    describe("when there are no closures or suspensions", () => {
      it("should return undefined", () => {
        const failures = {
          "R:1": [{ failureCode: RUNNER_FAILURE_CODES.DUPLICATE_RUNNER }],
        };
        const buildAvailabilityNotification = createAvailabilityNotificationSelector();

        expect(buildAvailabilityNotification(failures)).toBeUndefined();
      });
    });

    describe("when there are no failures of any kind", () => {
      it("should return undefined", () => {
        const closedFailures = {};
        const buildAvailabilityNotification = createAvailabilityNotificationSelector();

        expect(buildAvailabilityNotification(closedFailures)).toBeUndefined();
      });
    });
  });

  describe("buildSingles", () => {
    function setupOneCombination({
      odds,
      stake,
      oddsDisplay,
      isBonusAvailable,
      previousOdds,
      racing,
      sportInfo = {},
      type = "GENERIC",
      isEachWayAvailable,
      isEachWaySelected,
      eachWayPlaces,
      eachWayPlacesFraction,
      eachWayOdds,
      isPriceBoostAvailable,
      isPriceBoostSelected,
      numLines,
    }) {
      const state = {
        combinations: {
          "COMBINATION:1": {
            id: "COMBINATION:1",
            creationTimestamp: "creationTimestamp1",
            odds,
            stake,
            legs: ["LEG:1"],
            betType: BET_TYPES.SINGLE,
            isBonusAvailable,
            isEachWayAvailable,
            isEachWaySelected,
            eachWayPlaces,
            eachWayOdds,
            numLines,
            isPriceBoostAvailable,
            isPriceBoostSelected,
            eachWayPlacesFraction,
          },
        },
        legs: {
          "LEG:1": {
            runners: ["RUNNER:1,1"],
          },
        },
      };
      const metadata = {
        "RUNNER:1,1": {
          ...sportInfo,
          marketType: "marketType",
          runnerName: "1,1 Runner Name",
          marketName: "1,1 Market Name",
          eventName: "1,1 Event Name",
          previousOdds,
          type,
          racing,
        },
      };
      isSingleLike.mockReturnValue(true);
      formatOdds.mockReturnValue("Formatted Odds");
      buildCombinationOdds.mockReturnValue("Formatted Odds");

      return buildSingles(state, USER_DETAILS, metadata, oddsDisplay, true);
    }

    describe("when there are several combinations", () => {
      function setupSeveralCombinations({ oddsDisplay, sportInfo = {} }) {
        const state = {
          combinations: {
            "COMBINATION:1": {
              id: "COMBINATION:1",
              creationTimestamp: 3,
              legs: ["LEG:1"],
              betType: BET_TYPES.SINGLE,
            },
            "COMBINATION:2": {
              id: "COMBINATION:2",
              creationTimestamp: 2,
              legs: ["LEG:2"],
              betType: BET_TYPES.SINGLE,
            },
            "COMBINATION:3": {
              id: "COMBINATION:3",
              creationTimestamp: 1,
              legs: ["LEG:3"],
              betType: BET_TYPES.SINGLE,
            },
          },
          legs: {
            "LEG:1": {
              runners: ["RUNNER:1,1"],
            },
            "LEG:2": {
              runners: ["RUNNER:2,1"],
            },
            "LEG:3": {
              runners: ["RUNNER:3,1"],
            },
          },
        };
        const metadata = {
          "RUNNER:1,1": {
            ...sportInfo,
            marketType: "marketType",
            runnerName: "1,1 Runner Name",
            marketName: "1,1 Market Name",
            eventName: "1,1 Event Name",
            type: "GENERIC",
          },
          "RUNNER:2,1": {
            ...sportInfo,
            marketType: "marketType",
            runnerName: "2,1 Runner Name",
            marketName: "2,1 Market Name",
            eventName: "2,1 Event Name",
            type: "GENERIC",
          },
          "RUNNER:3,1": {
            ...sportInfo,
            marketType: "marketType",
            runnerName: "3,1 Runner Name",
            marketName: "3,1 Market Name",
            eventName: "3,1 Event Name",
            type: "GENERIC",
          },
        };
        isSingleLike.mockReturnValue(true);
        formatOdds.mockReturnValue("Formatted Odds");

        return buildSingles(state, USER_DETAILS, metadata, oddsDisplay);
      }

      it("should map out the single combinations by timestamp", () => {
        const singles = setupSeveralCombinations({});

        expect(singles.length).toBe(3);
        expect(singles[0].id).toBe("COMBINATION:3");
        expect(singles[1].id).toBe("COMBINATION:2");
        expect(singles[2].id).toBe("COMBINATION:1");
      });
    });

    describe("when all the values are present in the combinations", () => {
      it("should return the built combinations", () => {
        const combinationsList = setupOneCombination({
          odds: { decimalOdds: 1.23, fractionalOdds: { numerator: 1, denominator: 2 } },
          stake: 1.23,
          oddsDisplay: OddsDisplayPreference.Fractional,
          isBonusAvailable: false,
          isEachWayAvailable: true,
          isEachWaySelected: true,
          eachWayPlaces: "4",
          eachWayPlacesFraction: { numerator: 1, denominator: 2 },
          eachWayOdds: "2.3",
          isPriceBoostAvailable: true,
          isPriceBoostSelected: true,
          numLines: 3,
        });

        expect(combinationsList).toEqual([
          expect.objectContaining({
            id: "COMBINATION:1",
            creationTimestamp: "creationTimestamp1",
            legId: "LEG:1",
            odds: "Formatted Odds",
            stake: 1.23,
            returnsLabel: {
              interpolationValues: {
                potentialReturns: "formattedCurrency",
              },
              key: "I18N.BETSLIP.BET_RETURNS",
            },
            selection: {
              title: "Formatted Runner Name",
              subtitle: "1,1 Market Name - 1,1 Event Name",
            },
            isBonusAvailable: false,
            isEachWayAvailable: true,
            isEachWaySelected: true,
            isPriceBoostAvailable: true,
            isPriceBoostSelected: true,
            multiplier: "6x",
            eachWaySubtitle: {
              key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES",
              interpolationValues: {
                numerator: 1,
                denominator: 2,
                places: "4",
              },
            },
          }),
        ]);
      });

      it("should call formatOdds with the passed preference", () => {
        const odds = { decimalOdds: 1.23, fractionalOdds: { numerator: 1, denominator: 2 } };

        setupOneCombination({ odds, stake: 1.23, oddsDisplay: OddsDisplayPreference.Fractional });

        expect(buildCombinationOdds).toHaveBeenCalledWith(
          expect.objectContaining({ odds }),
          OddsDisplayPreference.Fractional,
        );
      });

      it("should call i18n with the each way values to build each way subtitle", () => {
        setupOneCombination(
          {
            decimalOdds: 1.23,
            fractionalOdds: { numerator: 1, denominator: 2 },
            eachWayPlacesFraction: {
              numerator: 3,
              denominator: 4,
            },
            eachWayPlaces: 5,
            isEachWayAvailable: true,
          },
          1.23,
          OddsDisplayPreference.Fractional,
          false,
          undefined,
          undefined,
          true,
          true,
          "4",
          { numerator: 1, denominator: 2 },
          "2.3",
        );

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES",
          interpolationValues: {
            numerator: 3,
            denominator: 4,
            places: 5,
          },
        });
      });

      describe("when each way is not available", () => {
        it("should not return eachWaySubtitle", () => {
          const [combination] = setupOneCombination({
            decimalOdds: 1.23,
            fractionalOdds: { numerator: 1, denominator: 2 },
          });
          expect(combination.eachWaySubtitle).toBeUndefined();
        });
        it("should not call i18n with the each way values to build each way subtitle", () => {
          setupOneCombination({
            decimalOdds: 1.23,
            fractionalOdds: { numerator: 1, denominator: 2 },
          });

          expect(i18n).not.toHaveBeenCalledWith({
            key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES",
            interpolationValues: expect.any(Object),
          });
        });
      });
    });

    describe("when the combinations do not have stake", () => {
      it("should return the combinations with undefined stake", () => {
        const combinationsList = setupOneCombination({
          stake: null,
          oddsDisplay: OddsDisplayPreference.Fractional,
          isBonusAvailable: false,
        });

        expect(combinationsList).toEqual([
          expect.objectContaining({
            id: "COMBINATION:1",
            legId: "LEG:1",
            odds: "Formatted Odds",
            stake: undefined,
            selection: {
              title: "Formatted Runner Name",
              subtitle: "1,1 Market Name - 1,1 Event Name",
            },
            isBonusAvailable: false,
          }),
        ]);
      });
    });

    describe("when the combinations have bonus available", () => {
      it("should return the combinations with isBonusAvailable has true", () => {
        const combinationsList = setupOneCombination({
          stake: null,
          oddsDisplay: OddsDisplayPreference.Fractional,
          isBonusAvailable: true,
        });

        expect(combinationsList).toEqual([
          expect.objectContaining({
            id: "COMBINATION:1",
            legId: "LEG:1",
            odds: "Formatted Odds",
            stake: undefined,
            selection: {
              title: "Formatted Runner Name",
              subtitle: "1,1 Market Name - 1,1 Event Name",
            },
            isBonusAvailable: true,
          }),
        ]);
      });
    });

    describe("when metadata has runnerPreviousOdds", () => {
      it("should return the built combinations", () => {
        const combinationsList = setupOneCombination({
          stake: 1.23,
          oddsDisplay: OddsDisplayPreference.Fractional,
          isBonusAvailable: false,
          previousOdds: ["previous odds"],
        });

        expect(combinationsList).toEqual([
          expect.objectContaining({
            id: "COMBINATION:1",
            legId: "LEG:1",
            odds: "Formatted Odds",
            previousOdds: "Formatted Odds",
            stake: 1.23,
            selection: {
              title: "Formatted Runner Name",
              subtitle: "1,1 Market Name - 1,1 Event Name",
            },
            isBonusAvailable: false,
          }),
        ]);
      });

      it("should call formatOdds with the passed preference", () => {
        setupOneCombination({
          stake: 1.23,
          oddsDisplay: OddsDisplayPreference.Fractional,
          isBonusAvailable: false,
          previousOdds: ["previousOdds"],
        });

        expect(formatOdds).toHaveBeenCalledWith("previousOdds", OddsDisplayPreference.Fractional);
      });
    });

    describe("when metadata has racing", () => {
      it("should return Racing data", () => {
        const racing = {
          time: new Date(1608223556016), // Thu Dec 17 2020 16:45:56 GMT+0000
          venue: "venue",
          saddleCloth: "saddleCloth",
          runnerVisual: "runnerVisual",
        };

        const [combination] = setupOneCombination({
          stake: null,
          racing,
          sportInfo: { sportId: 7, sportName: "Horse Racing" },
          type: "RACING",
        });
        const { selection, icon, silkFallbackIconType } = combination;

        expect(selection).toEqual({
          subtitle: "1,1 Market Name - Formatted Time venue",
          title: "saddleCloth 1,1 Runner Name",
        });
        expect(icon).toEqual("runnerVisual");
        expect(silkFallbackIconType).toEqual(FallbackIconType.HorseRacing);
      });
    });
  });

  describe("buildReturnsLabel", () => {
    describe("when potential returns can be calculated", () => {
      it("should return proper label", () => {
        currencyFormatWithDecimalPlaces.mockReturnValueOnce("€123.10");
        const label = buildReturnsLabel({ totalStake: 1, potentialReturns: 123.1, userDetails: USER_DETAILS });

        expect(label).toEqual({
          interpolationValues: { potentialReturns: "€123.10" },
          key: "I18N.BETSLIP.BET_RETURNS",
        });
      });

      describe("and when original potential returns is provided", () => {
        it("should return proper label", () => {
          currencyFormatWithDecimalPlaces.mockReturnValueOnce("€123.10");
          const label = buildReturnsLabel({
            totalStake: 1,
            potentialReturns: 123.1,
            userDetails: USER_DETAILS,
            originalPotentialReturns: 222,
          });

          expect(label).toEqual({
            interpolationValues: { potentialReturns: "€123.10" },
            key: "I18N.BETSLIP.BET_RETURNS",
          });
        });
      });

      describe("and when price boost is selected", () => {
        it("should return proper label", () => {
          currencyFormatWithDecimalPlaces.mockReturnValueOnce("€123.10");
          const label = buildReturnsLabel({
            totalStake: 1,
            potentialReturns: 123.1,
            userDetails: USER_DETAILS,
            isPriceBoostSelected: true,
          });

          expect(label).toEqual({
            interpolationValues: { potentialReturns: "€123.10" },
            key: "I18N.BETSLIP.BET_RETURNS",
          });
        });
      });

      describe("and when original potential returns is provided and price boost is selected", () => {
        it("should return proper label", () => {
          const label = buildReturnsLabel({
            totalStake: 1,
            potentialReturns: 111,
            userDetails: USER_DETAILS,
            originalPotentialReturns: 222,
            isPriceBoostSelected: true,
          });

          expect(currencyFormatWithDecimalPlaces.mock.calls[0][0].value).toBe(111);
          expect(currencyFormatWithDecimalPlaces.mock.calls[1][0].value).toBe(222);

          expect(label).toEqual({
            interpolationValues: {
              originalPotentialReturns: "formattedCurrency",
              potentialReturns: "formattedCurrency",
            },
            key: "I18N.BETSLIP.BET_RETURNS_WITH_ORIGINAL",
          });
        });
      });
    });

    describe("when potential returns can not be calculated", () => {
      describe("and there aren't odds available", () => {
        it("should return the BET_RETURNS_TBD label", () => {
          const label = buildReturnsLabel({
            totalStake: 1,
            userDetails: USER_DETAILS,
          });

          expect(label).toBe("I18N.BETSLIP.BET_RETURNS_TBD");
        });
      });

      describe("and there are odds available", () => {
        it("should return the correct return label with zero value", () => {
          currencyFormatWithDecimalPlaces.mockReturnValueOnce("€0.00");
          const label = buildReturnsLabel({
            totalStake: 1,
            userDetails: USER_DETAILS,
            odds: {},
          });

          expect(label).toEqual({
            interpolationValues: { potentialReturns: "€0.00" },
            key: "I18N.BETSLIP.BET_RETURNS",
          });
        });

        describe("and it is a starting price combination", () => {
          it("should return the BET_RETURNS_TBD label", () => {
            const label = buildReturnsLabel({
              totalStake: 1,
              userDetails: USER_DETAILS,
              hasStartingPrice: true,
            });

            expect(label).toBe("I18N.BETSLIP.BET_RETURNS_TBD");
          });
        });
      });
    });
  });

  describe("translateMultiple", () => {
    function setupMultiple() {
      return BET_TYPES.DOUBLE;
    }

    it("should return a translated multiple title", () => {
      expect(translateMultiple(setupMultiple())).toEqual("I18N.BETSLIP.SBK.MULTIPLE.DOUBLE_LINES");
    });
  });

  describe("combinationToBetBuilder", () => {
    const setupCombinationToBetBuilder = ({
      combination = {
        id: "combination:1",
        betType: "DOUBLE",
        legs: ["leg:1", "leg:2"],
      },
    } = {}) => {
      const legsMap = {
        "leg:1": {
          runners: ["runner:1"],
        },
        "leg:2": {
          runners: ["runner:2"],
        },
      };
      const runnersMetadata = {
        "runner:1": {
          type: "GENERIC",
          marketName: "Match Odds",
          eventName: "FC Porto - AD Marco",
          runnerName: "first runner",
        },
        "runner:2": {
          type: "GENERIC",
          marketName: "Over 2.5 Goals",
          eventName: "FC Porto - AD Marco",
          runnerName: "second runner",
        },
      };
      const bettingRunnersMap = {
        "runner:1": {
          handicap: 0,
        },
        "runner:2": {
          handicap: 5,
        },
      };
      const userDetails = { userDetailsMock: "userDetailsMock" };

      return combinationToBetBuilder(legsMap, runnersMetadata, userDetails, bettingRunnersMap)(combination);
    };

    it("should return combination id", () => {
      const betBuilder = setupCombinationToBetBuilder();

      expect(betBuilder.id).toEqual("combination:1");
    });

    it("should return title", () => {
      const betBuilder = setupCombinationToBetBuilder();

      expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.BETSLIP.SBK.MULTIPLE.DOUBLE_LINES" });
      expect(betBuilder.title).toEqual("I18N.BETSLIP.SBK.MULTIPLE.DOUBLE_LINES");
    });

    it("should return subtitle", () => {
      const betBuilder = setupCombinationToBetBuilder();

      expect(betBuilder.subtitle).toEqual("FC Porto - AD Marco");
    });

    it("should return selections", () => {
      const betBuilder = setupCombinationToBetBuilder();

      expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.BETSLIP.REMOVE" });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.BETSLIP.REMOVE" });
      expect(betBuilder.selections).toEqual([
        {
          action: "I18N.BETSLIP.REMOVE",
          id: "leg:1",
          subtitle: "Match Odds - FC Porto - AD Marco",
          title: "Formatted Runner Name",
        },
        {
          action: "I18N.BETSLIP.REMOVE",
          id: "leg:2",
          subtitle: "Over 2.5 Goals - FC Porto - AD Marco",
          title: "Formatted Runner Name",
        },
      ]);
    });

    it("should return selectionsLabel", () => {
      const betBuilder = setupCombinationToBetBuilder();

      expect(i18n).toHaveBeenNthCalledWith(4, {
        key: "I18N.BETSLIP.SELECTIONS_COUNT",
        interpolationValues: { numberOfSelections: 2 },
      });
      expect(betBuilder.selectionsLabel).toEqual({
        interpolationValues: {
          numberOfSelections: 2,
        },
        key: "I18N.BETSLIP.SELECTIONS_COUNT",
      });
    });
  });

  describe("buildMultiBetBuilderGroup", () => {
    describe("when GENERIC metadata", () => {
      it("should build urn and title", () => {
        expect(
          buildMultiBetBuilderGroup(
            {
              type: "GENERIC",
              eventUrn: "e:urn",
              eventName: "Sporting CP - SL Benfica",
            },
            USER_DETAILS,
          ),
        ).toEqual({
          groupUrn: "e:urn",
          groupTitle: "Sporting CP - SL Benfica",
        });
      });
    });

    describe("when RACING metadata", () => {
      it("should build urn and title", () => {
        expect(
          buildMultiBetBuilderGroup(
            {
              type: "RACING",
              racing: {
                urn: "race:urn",
                time: "some time",
                venue: "some venue",
              },
            },
            USER_DETAILS,
          ),
        ).toEqual({
          groupUrn: "race:urn",
          groupTitle: "Formatted Time some venue",
        });
      });
    });
  });

  describe("createAreAllCombinationsClosedOrSuspendedSelector", () => {
    describe("when there's no errors for every runner", () => {
      it("should return false", () => {
        const allRunners = { "RUNNER:1": [], "RUNNER:2": [] };
        const failedRunners = { "RUNNER:1": [] };

        const getAreAllCombinationsClosedOrSuspended = createAreAllCombinationsClosedOrSuspendedSelector()(
          allRunners,
          failedRunners,
        );

        expect(getAreAllCombinationsClosedOrSuspended).toEqual(false);
      });
    });

    describe("when there's errors for every runner", () => {
      describe("and, for at least one runner, there's no suspended nor closed error", () => {
        it("should return false", () => {
          hasAnyMarketClosedFailure.mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false);
          // due to Close OR priority: first and third call
          hasAnyMarketSuspendedFailure.mockReturnValueOnce(true).mockReturnValueOnce(false);

          const allRunners = { "RUNNER:1": [], "RUNNER:2": [], "RUNNER:3": [] };
          const failedRunners = { "RUNNER:1": [], "RUNNER:2": [], "RUNNER:3": [] };

          const getAreAllCombinationsClosedOrSuspended = createAreAllCombinationsClosedOrSuspendedSelector()(
            allRunners,
            failedRunners,
          );

          expect(getAreAllCombinationsClosedOrSuspended).toEqual(false);
        });
      });

      describe("and all runners have at least a suspended or closed error", () => {
        it("should return false", () => {
          hasAnyMarketClosedFailure.mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(true);
          // due to Close OR priority: first and third call
          hasAnyMarketSuspendedFailure.mockReturnValueOnce(true).mockReturnValueOnce(true);

          const allRunners = { "RUNNER:1": [], "RUNNER:2": [], "RUNNER:3": [] };
          const failedRunners = { "RUNNER:1": [], "RUNNER:2": [], "RUNNER:3": [] };

          const getAreAllCombinationsClosedOrSuspended = createAreAllCombinationsClosedOrSuspendedSelector()(
            allRunners,
            failedRunners,
          );

          expect(getAreAllCombinationsClosedOrSuspended).toEqual(true);
        });
      });
    });
  });
});
