import { BetProduct, OddsDisplayPreference } from "@ppb/tbd-store";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { DELETE_VIEW_ITEMS } from "@ppb/tbd-store/actions/catalogue";
import {
  UI__MY_BETS_BET_SHARING_DISMISS_TAP,
  UI__MY_BETS_BET_SHARING_SHARE_BET_TAP,
  UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP,
} from "@ppb/tbd-store/actions/my-bets";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";

import { getMainUrl } from "../../helpers/domain.web";
import { buildBetslipAddBetsDeepLink } from "../../helpers/deep-links";
import { getBetStatusLabel } from "../../helpers/my-bets";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.spyOn(global.console, "error").mockImplementation();

const getBetSharingCardGroupByURNSelector = jest.fn();
jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(() => getBetSharingCardGroupByURNSelector),
}));

const getUserPreferencesWithProductSwitcher = jest.fn();
jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getUserPreferencesWithProductSwitcher),
}));

const getSportsbookBetLegsSelector = jest.fn();
jest.mock("@ppb/tbd-store/state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors", () => ({
  createSportsbookBetLegsSelector: jest.fn(() => getSportsbookBetLegsSelector),
}));

const getUserDetailsSelector = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetailsSelector),
}));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({ isActive: false })),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => (interpolationValues ? `${key} ${interpolationValues.url}` : key)),
}));

const DEEPLINK_URL = "some url";

jest.mock("../../helpers/deep-links", () => ({
  buildBetslipAddBetsDeepLink: jest.fn(() => DEEPLINK_URL),
}));

jest.mock("../../helpers/domain.web", () => ({
  getMainUrl: jest.fn(),
}));

jest.mock("../../helpers/dates", () => ({
  formatStartDateWithTodayOrTomorrow: jest.fn(() => "formatStartDateWithTodayOrTomorrowMock"),
}));

const BET_TITLE = `SOME BET TITLE`;
const BET_SUPPORTING_TEXT = "SOME BET SUPPORTING TEXT";
const BET_STATUS_LABEL = "SOME BET STATUS LABEL";

jest.mock("../../helpers/my-bets", () => ({
  getBetTitle: jest.fn(() => BET_TITLE),
  getBetSupportingText: jest.fn(() => BET_SUPPORTING_TEXT),
  getBetStatusLabel: jest.fn(() => BET_STATUS_LABEL),
}));

const DEFAULT_STATE = {
  layouts: {
    cardgroups: {
      betsharingcardgroups: [
        {
          typename: "",
          bet: {
            isSettled: false,
            product: BetProduct.SPORTSBOOK,
            legs: [
              {
                parts: [
                  {
                    selectionId: 123,
                    marketId: 321,
                  },
                ],
              },
              {
                parts: [
                  {
                    selectionId: 456,
                    marketId: 654,
                  },
                ],
              },
            ],
          },
          items: [
            {
              someLeg: "someLeg",
            },
          ],
        },
      ],
    },
  },
  entities: {
    preferences: {
      sportsbookOddsDisplay: OddsDisplayPreference.Decimal,
    },
    throttles: {},
  },
};

const EXPECTED_PROPS = {
  title: "I18N.BET_SHARING.TITLE",
  description: "I18N.BET_SHARING.DESCRIPTION",
  betTitle: BET_TITLE,
  betSupportingText: BET_SUPPORTING_TEXT,
  betStatusLabel: BET_STATUS_LABEL,
  items: DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0].items,
  betShareButtonText: undefined,
  imageShareButtonText: "I18N.BET_SHARING.IMAGE_SHARE_BUTTON_TEXT",
  shareMessage: undefined,
};

const setupMapStateToProps = ({ state = DEFAULT_STATE, urn } = {}) => makeMapStateToProps()(state, { urn });

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when `getUserDetailsSelector` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    it("should return an empty object", () => {
      getUserDetailsSelector.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });

      setupMapStateToProps();

      expect(global.console.error).toHaveBeenCalledTimes(1);
      expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
    });
  });

  describe("when the betSharingCardGroup is undefined", () => {
    it("should return an empty object", () => {
      getBetSharingCardGroupByURNSelector.mockReturnValueOnce(undefined);

      const props = setupMapStateToProps();

      expect(props).toEqual({});
    });
  });

  describe("when the bet is settled", () => {
    it("should return the correct object with betShareButtonText and shareMessage undefined", () => {
      getBetSharingCardGroupByURNSelector.mockReturnValueOnce({
        ...DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0],
        bet: {
          isSettled: true,
        },
      });
      getSportsbookBetLegsSelector.mockReturnValueOnce([
        ...DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0].bet.legs,
      ]);
      getUserDetailsSelector.mockReturnValueOnce({ jurisdiction: Jurisdiction.INTERNATIONAL });
      getUserPreferencesWithProductSwitcher.mockReturnValueOnce({
        sportsbookOddsDisplay: OddsDisplayPreference.Decimal,
      });

      const props = setupMapStateToProps();

      expect(getMainUrl).not.toHaveBeenCalled();
      expect(buildBetslipAddBetsDeepLink).not.toHaveBeenCalled();

      expect(props).toEqual({
        ...EXPECTED_PROPS,
        betShareButtonText: undefined,
        shareMessage: undefined,
      });
    });
  });

  describe("when the bet is not settled and the product is virtual", () => {
    it("should return the correct object with betShareButtonText and shareMessage undefined", () => {
      getBetSharingCardGroupByURNSelector.mockReturnValueOnce({
        ...DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0],
        bet: {
          isSettled: false,
          product: BetProduct.VIRTUAL,
        },
      });
      getSportsbookBetLegsSelector.mockReturnValueOnce([
        ...DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0].bet.legs,
      ]);
      getUserDetailsSelector.mockReturnValueOnce({ jurisdiction: Jurisdiction.INTERNATIONAL });
      getUserPreferencesWithProductSwitcher.mockReturnValueOnce({
        sportsbookOddsDisplay: OddsDisplayPreference.Decimal,
      });

      const props = setupMapStateToProps();

      expect(getMainUrl).not.toHaveBeenCalled();
      expect(buildBetslipAddBetsDeepLink).not.toHaveBeenCalled();

      expect(props).toEqual({
        ...EXPECTED_PROPS,
        betShareButtonText: undefined,
        shareMessage: undefined,
      });
    });
  });

  describe("when the bet is not settled, the product is sportsbook and has no legs", () => {
    it("should return the correct object with betShareButtonText and shareMessage undefined", () => {
      getBetSharingCardGroupByURNSelector.mockReturnValueOnce({
        ...DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0],
        bet: {
          isSettled: false,
          product: BetProduct.SPORTSBOOK,
          legs: [],
        },
      });

      getSportsbookBetLegsSelector.mockReturnValueOnce(undefined);
      getUserDetailsSelector.mockReturnValueOnce({ jurisdiction: Jurisdiction.INTERNATIONAL });
      getUserPreferencesWithProductSwitcher.mockReturnValueOnce({
        sportsbookOddsDisplay: OddsDisplayPreference.Decimal,
      });

      const props = setupMapStateToProps();

      expect(getMainUrl).not.toHaveBeenCalled();
      expect(buildBetslipAddBetsDeepLink).not.toHaveBeenCalled();

      expect(props).toEqual({
        ...EXPECTED_PROPS,
        betShareButtonText: undefined,
        shareMessage: undefined,
      });
    });
  });

  describe("when the bet is not settled, the product is sportsbook and has legs", () => {
    it("should return the correct object", () => {
      getBetSharingCardGroupByURNSelector.mockReturnValueOnce({
        ...DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0],
        bet: {
          isSettled: false,
          product: BetProduct.SPORTSBOOK,
          legs: DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0].bet.legs,
        },
      });
      getSportsbookBetLegsSelector.mockReturnValueOnce([
        ...DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0].bet.legs,
      ]);
      getUserDetailsSelector.mockReturnValueOnce({ jurisdiction: Jurisdiction.INTERNATIONAL });
      getUserPreferencesWithProductSwitcher.mockReturnValueOnce({
        sportsbookOddsDisplay: OddsDisplayPreference.Decimal,
      });

      const props = setupMapStateToProps();

      expect(getMainUrl).toHaveBeenCalledTimes(1);
      expect(buildBetslipAddBetsDeepLink).toHaveBeenCalledTimes(1);

      expect(props).toEqual({
        ...EXPECTED_PROPS,
        betShareButtonText: "I18N.BET_SHARING.BET_SHARE_BUTTON_TEXT",
        shareMessage: `I18N.BET_SHARING.SHARE_MESSAGE ${DEEPLINK_URL}&src=betsharing \n \n`,
      });
    });
  });

  describe("when MY_BETS_WIN_LOST_VOID throttle is active", () => {
    const betStatusLabelOptionsWithThrottle = {
      locale: "foo",
      timezone: "bar",
      showWinLoseVoidFeature: true,
    };

    it("should call getBetStatusLabel with bet, betLegs and options", () => {
      getUserDetailsSelector.mockReturnValueOnce({
        jurisdiction: Jurisdiction.INTERNATIONAL,
        localeCodeBcp47: betStatusLabelOptionsWithThrottle.locale,
        timezone: betStatusLabelOptionsWithThrottle.timezone,
      });

      createGetThrottleSelector.mockReturnValueOnce(jest.fn().mockReturnValue({ isActive: true }));

      getBetSharingCardGroupByURNSelector.mockReturnValueOnce({
        ...DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0],
        bet: {
          ...DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0].bet,
          lowestEventStartTime: "lowestEventStartTimeMock",
        },
      });
      getSportsbookBetLegsSelector.mockReturnValueOnce([
        ...DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0].bet.legs,
      ]);
      getUserDetailsSelector.mockReturnValueOnce({ jurisdiction: Jurisdiction.INTERNATIONAL });
      getUserPreferencesWithProductSwitcher.mockReturnValueOnce({
        sportsbookOddsDisplay: OddsDisplayPreference.Decimal,
      });

      setupMapStateToProps();
      expect(getBetStatusLabel).toHaveBeenCalledWith(
        {
          ...DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0].bet,
          lowestEventStartTime: "lowestEventStartTimeMock",
        },
        DEFAULT_STATE.layouts.cardgroups.betsharingcardgroups[0].bet.legs,
        betStatusLabelOptionsWithThrottle,
      );
    });
  });
});

describe("mapDispatchToProps", () => {
  const { dispatchDeleteViewItems, dispatchDismissTap, dispatchShareBetTap, dispatchShareImageTap } =
    mapDispatchToProps;

  describe("dispatchDeleteView", () => {
    it("should dispatch an action of type DELETE_VIEW with a urn", () => {
      const URN = "ppb:tbd:cardgroup:betSharing:123";

      expect(dispatchDeleteViewItems(URN)).toEqual({
        type: DELETE_VIEW_ITEMS,
        payload: [URN],
      });
    });
  });

  describe("dispatchDismissTap", () => {
    it("should dispatch an action of type UI__MY_BETS_BET_SHARING_DISMISS_TAP", () => {
      expect(dispatchDismissTap()).toEqual({
        type: UI__MY_BETS_BET_SHARING_DISMISS_TAP,
      });
    });
  });

  describe("dispatchShareBetTap", () => {
    it("should dispatch an action of type UI__MY_BETS_BET_SHARING_SHARE_BET_TAP", () => {
      expect(dispatchShareBetTap()).toEqual({
        type: UI__MY_BETS_BET_SHARING_SHARE_BET_TAP,
      });
    });
  });

  describe("dispatchShareImageTap", () => {
    it("should dispatch an action of type UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP", () => {
      expect(dispatchShareImageTap()).toEqual({
        type: UI__MY_BETS_BET_SHARING_SHARE_IMAGE_TAP,
      });
    });
  });
});
