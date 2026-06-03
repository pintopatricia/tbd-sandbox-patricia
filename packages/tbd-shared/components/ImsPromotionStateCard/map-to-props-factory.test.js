import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { getPromotionByURN } from "@ppb/tbd-store/state/entities/ims-promotions/ims-promotion-selectors";
import { PromotionLayout, PromotionStatus } from "@ppb/tbd-store/state/entities/ims-promotions/ImsPromotion";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  ACCEPT_PROMOTION,
  CANCEL_PROMOTION,
  DEPOSIT_NAVIGATION,
  INTERACT_CANCEL_PROMOTION_MODAL,
  REFRESH_PROMOTION,
  REMOVE_INTERACTIVE_RESPONSE_ERROR,
} from "@ppb/tbd-store/actions/promotion";
import { SAW_CARD } from "@ppb/tbd-store/actions/interface";
import { EXTERNAL_PUSH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key, interpolationValues }) => ({ key, interpolationValues }),
}));

const getUserMainWalletValueMock = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest
    .fn()
    .mockReturnValue({ countryCode: "IE", localeCodeBcp47: "en", currencyCode: "EUR", loggedIn: true }),
}));

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  createGetUserMainWalletValueSelector: jest.fn(() => getUserMainWalletValueMock),
}));

jest.mock("../../formatters/time-formatters", () => ({
  secondsToDh: jest.fn().mockReturnValue("16 hours"),
}));

jest.mock("../../helpers/navigation", () => ({
  base64EncodeUrl: jest.fn().mockReturnValue("encodedUrl"),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => {
  const getImsPromotionStateCardByURN = jest.fn();
  return {
    createCardByURNSelector: jest.fn(() => getImsPromotionStateCardByURN),
  };
});

jest.mock("@ppb/tbd-store/state/entities/ims-promotions/ims-promotion-selectors", () => ({
  getPromotionByURN: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/tbd-store/state/entities/ims-promotions/ImsPromotion", () => ({
  PromotionLayout: {
    Accept: "ACCEPT",
    BuyIn: "BUY_IN",
    OptIn: "OPT_IN",
  },
  PromotionStatus: {
    OptedIn: "OPTED_IN",
    NotOptedIn: "NOT_OPTED_IN",
  },
  PromotionWagerType: {
    PreWager: "PRE_WAGER",
    AfterWager: "AFTER_WAGER",
    FreeSpins: "FREE_SPINS",
    GoldenChips: "GOLDEN_CHIPS",
    Unknown: "UNKNOWN",
  },
  InteractiveResponseErrorCode: {
    OpenSession: 67,
  },
  IMS_PROMOTION_MODULE_NAME: "moduleName",
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  OngoingPromoCardTypes: {
    GOLDEN_CHIPS: "GOLDEN_CHIPS",
    FREE_SPINS: "FREE_SPINS",
    CASH: "CASH",
    OPTIN: "OPT_IN",
  },
  AdditionalMessageType: {
    SUCCESS: "SUCCESS",
    WARNING: "WARNING",
  },
  AlertType: {
    Success: "SUCCESS",
    Warning: "WARNING",
    Error: "ERROR",
    Info: "INFO",
  },
}));

jest.mock("../../config/endpoints", () => ({
  getAuthData: jest.fn(() => "AuthData"),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const STATE = {
  layouts: {
    cards: {
      imspromotionsstate: {},
    },
  },
  entities: {
    imspromotions: {},
  },
};

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("When accept promo exists", () => {
    it("should return correct props", () => {
      const getImsPromotionStateCardByURN = createCardByURNSelector();

      getUserMainWalletValueMock.mockReturnValue(50);

      getImsPromotionStateCardByURN.mockReturnValueOnce({
        promotion: "fakePromotion",
        depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      });

      getPromotionByURN.mockReturnValueOnce({
        urn: "fakeUrn",
        headline: "fakeHeadline",
        subHeadline: "fakeSubHeadline",
        image: null,
        ctaText: "fakeText",
        layout: PromotionLayout.Accept,
        status: PromotionStatus.OptedIn,
        timeLeft: 23,
        wagerType: null,
        percentCompleted: null,
        bonusWagering: 30,
        wageringLeft: 20,
        bonusAwarded: 10,
        freeSpins: null,
        goldenChips: null,
        buyIn: null,
        interactiveResponseError: undefined,
        currentBonusBalance: 0,
        amountOnPendingWinnings: 0,
      });

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(STATE, { urn: "fakePromotion" });

      expect(getImsPromotionStateCardByURN).toHaveBeenCalledWith(undefined, "fakePromotion");
      expect(getPromotionByURN).toHaveBeenCalledWith(STATE.entities.imspromotions, "fakePromotion");
      expect(props).toEqual({
        promoCard: "fakePromotion",
        promotion: "fakeUrn",
        image: "",
        status: PromotionStatus.OptedIn,
        subHeadline: "fakeSubHeadline",
        ctaText: i18n({ key: "I18N.PROMO.ACCEPT" }),
        layout: PromotionLayout.Accept,
        title: "fakeHeadline",
        availableFunds: 50,
        footerValue: "16 hours",
        min: 0,
        max: 0,
        progressValue: 0,
        secondsLeft: 23,
        type: "CASH",
        bonusAmount: 0,
        bonusPercent: 100,
        buyInMaxValue: 0,
        buyInMinValue: 0,
        pendingWinnings: "€0.00",
        isLoggedIn: true,
        authData: "AuthData",
        notificationMessage: undefined,
        depositViewLink: {
          viewUrl: "/navigation/a-encodedUrl",
          viewUrn: "ppb:tbd:view:myAccountView:encodedUrl",
        },
        disclaimerText: {
          bottomText: i18n({ key: "I18N.PROMOTION.DISCLAIMER.BOTTOM" }),
          listItemOne: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.FIRST" }),
          listItemTwo: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.SECOND" }),
          listTitle: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.TITLE" }),
          titleFirstPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE" }),
          titleSecondPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE.NEXT" }),
        },
        currencyDetails: {
          currencyCode: "EUR",
          localeCode: "en",
        },
        i18n: {
          availableFunds: i18n({ key: "I18N.PROMO.AVAILABLE_FUNDS" }),
          badgeLabel: i18n({ key: "I18N.PROMO.BADGE_LABEL" }),
          pendingWinnings: i18n({ key: "I18N.PROMO.PENDING_WINNINGS" }),
          cancel: i18n({ key: "I18N.PROMO.CANCEL" }),
          confirmCancel: i18n({ key: "I18N.PROMO.CONFIRM_CANCEL" }),
          declineCancel: i18n({ key: "I18N.PROMO.DECLINE_CANCEL" }),
          deposit: i18n({ key: "I18N.PROMOTION.DEPOSIT" }),
          footerText: i18n({ key: "I18N.PROMO.FOOTER_TEXT" }),
          refresh: i18n({ key: "I18N.PROMO.REFRESH" }),
          remainingHeader: i18n({
            key: "I18N.PROMO.REMAINING_CASH",
            interpolationValues: { amount: "€20.00" },
          }),
          remainingSubHeader: i18n({
            key: "I18N.PROMO.REQUIREMENTS_CASH",
            interpolationValues: { value: "€10.00", times: "3" },
          }),
          promotionContent: i18n({
            key: "I18N.PROMO.PROMO_CONTENT",
            interpolationValues: { amount: "€20.00", value: "€0.00" },
          }),
          promotionTitle: i18n({ key: "I18N.PROMO.PROMO_TITLE" }),
          requirements: "",
        },
      });
    });
    it("should return props when notification message exists", () => {
      const getImsPromotionStateCardByURN = createCardByURNSelector();

      getImsPromotionStateCardByURN.mockReturnValue({
        promotion: "fakePromotion",
        depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      });

      getPromotionByURN.mockReturnValue({
        urn: "fakeUrn",
        headline: "fakeHeadline",
        subHeadline: "fakeSubHeadline",
        image: null,
        ctaText: i18n({ key: "I18N.PROMO.ACCEPT" }),
        layout: PromotionLayout.Accept,
        status: PromotionStatus.NotOptedIn,
        timeLeft: 60001,
        wagerType: "GOLDEN_CHIPS",
        percentCompleted: 80,
        bonusWagering: null,
        wageringLeft: 100,
        bonusAwarded: null,
        freeSpins: null,
        goldenChips: {
          remainingGoldenChips: 20,
          goldenChipsAmount: 10,
          initialGoldenChips: 100,
        },
        buyIn: null,
        interactiveResponseError: { responseCode: -1 },
        currentBonusBalance: 0,
        amountOnPendingWinnings: 0,
      });

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(STATE, { urn: "fakePromotion" });

      expect(getImsPromotionStateCardByURN).toHaveBeenCalledWith(undefined, "fakePromotion");
      expect(getPromotionByURN).toHaveBeenCalledWith(STATE.entities.imspromotions, "fakePromotion");
      expect(props).toEqual({
        promoCard: "fakePromotion",
        promotion: "fakeUrn",
        image: "",
        status: PromotionStatus.NotOptedIn,
        subHeadline: "fakeSubHeadline",
        ctaText: i18n({ key: "I18N.PROMO.ACCEPT" }),
        layout: PromotionLayout.Accept,
        title: "fakeHeadline",
        availableFunds: 50,
        footerValue: "16 hours",
        min: 0,
        max: 0,
        progressValue: 80,
        secondsLeft: 60001,
        type: "GOLDEN_CHIPS",
        bonusAmount: 0,
        bonusPercent: 100,
        buyInMaxValue: 0,
        buyInMinValue: 0,
        pendingWinnings: "€0.00",
        isLoggedIn: true,
        authData: "AuthData",
        notificationMessage: {
          type: "WARNING",
          title: i18n({ key: "I18N.PROMOTION.ERROR.TITLE" }),
          body: i18n({ key: "I18N.PROMOTION.ERROR.BODY" }),
        },
        depositViewLink: {
          viewUrl: "/navigation/a-encodedUrl",
          viewUrn: "ppb:tbd:view:myAccountView:encodedUrl",
        },
        disclaimerText: {
          bottomText: i18n({ key: "I18N.PROMOTION.DISCLAIMER.BOTTOM" }),
          listItemOne: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.FIRST" }),
          listItemTwo: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.SECOND" }),
          listTitle: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.TITLE" }),
          titleFirstPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE" }),
          titleSecondPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE.NEXT" }),
        },
        currencyDetails: {
          currencyCode: "EUR",
          localeCode: "en",
        },
        i18n: {
          availableFunds: i18n({ key: "I18N.PROMO.AVAILABLE_FUNDS" }),
          badgeLabel: i18n({ key: "I18N.PROMO.BADGE_LABEL" }),
          cancel: i18n({ key: "I18N.PROMO.CANCEL" }),
          pendingWinnings: i18n({ key: "I18N.PROMO.PENDING_WINNINGS" }),
          confirmCancel: i18n({ key: "I18N.PROMO.CONFIRM_CANCEL" }),
          declineCancel: i18n({ key: "I18N.PROMO.DECLINE_CANCEL" }),
          deposit: i18n({ key: "I18N.PROMOTION.DEPOSIT" }),
          footerText: i18n({ key: "I18N.PROMO.FOOTER_TEXT" }),
          refresh: i18n({ key: "I18N.PROMO.REFRESH" }),
          remainingHeader: i18n({
            key: "I18N.PROMO.SUBHEADER_GOLDEN_CHIPS",
            interpolationValues: { remainingWagger: "€100.00" },
          }),
          remainingSubHeader: i18n({
            key: "I18N.PROMO.REMAINING_GOLDEN_CHIPS",
            interpolationValues: { goldChipsAmount: "€10.00", remainingGoldChips: 20 },
          }),
          promotionContent: i18n({
            key: "I18N.PROMO.PROMO_CONTENT",
            interpolationValues: { amount: "€100.00", value: "€0.00" },
          }),
          promotionTitle: i18n({ key: "I18N.PROMO.PROMO_TITLE" }),
          requirements: i18n({
            key: "I18N.PROMO.REQUIREMENTS",
            interpolationValues: { times: 0, value: "€0.00" },
          }),
        },
      });
    });
  });

  describe("When opt in promo exists", () => {
    it("should return correct props", () => {
      const getImsPromotionStateCardByURN = createCardByURNSelector();

      getUserMainWalletValueMock.mockReturnValue(50);

      getImsPromotionStateCardByURN.mockReturnValueOnce({
        promotion: "fakePromotion",
        depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      });

      getPromotionByURN.mockReturnValueOnce({
        urn: "fakeUrn",
        headline: "fakeHeadline",
        subHeadline: "fakeSubHeadline",
        image: null,
        ctaText: "fakeText",
        layout: PromotionLayout.OptIn,
        status: PromotionStatus.NotOptedIn,
        timeLeft: 23,
        wagerType: null,
        percentCompleted: null,
        bonusWagering: 30,
        wageringLeft: 20,
        bonusAwarded: 10,
        freeSpins: null,
        goldenChips: null,
        buyIn: null,
        interactiveResponseError: undefined,
        currentBonusBalance: 0,
        amountOnPendingWinnings: 0,
      });

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(STATE, { urn: "fakePromotion" });

      expect(getImsPromotionStateCardByURN).toHaveBeenCalledWith(undefined, "fakePromotion");
      expect(getPromotionByURN).toHaveBeenCalledWith(STATE.entities.imspromotions, "fakePromotion");
      expect(props).toEqual({
        promoCard: "fakePromotion",
        promotion: "fakeUrn",
        image: "",
        status: PromotionStatus.NotOptedIn,
        subHeadline: "fakeSubHeadline",
        ctaText: i18n({ key: "I18N.PROMO.OPTIN" }),
        layout: PromotionLayout.OptIn,
        title: "fakeHeadline",
        availableFunds: 50,
        footerValue: "16 hours",
        min: 0,
        max: 0,
        progressValue: 0,
        secondsLeft: 23,
        type: "OPT_IN",
        bonusAmount: 0,
        bonusPercent: 100,
        buyInMaxValue: 0,
        buyInMinValue: 0,
        pendingWinnings: "€0.00",
        isLoggedIn: true,
        authData: "AuthData",
        notificationMessage: undefined,
        depositViewLink: {
          viewUrl: "/navigation/a-encodedUrl",
          viewUrn: "ppb:tbd:view:myAccountView:encodedUrl",
        },
        disclaimerText: {
          bottomText: i18n({ key: "I18N.PROMOTION.DISCLAIMER.BOTTOM" }),
          listItemOne: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.FIRST" }),
          listItemTwo: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.SECOND" }),
          listTitle: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.TITLE" }),
          titleFirstPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE" }),
          titleSecondPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE.NEXT" }),
        },
        currencyDetails: {
          currencyCode: "EUR",
          localeCode: "en",
        },
        i18n: {
          availableFunds: i18n({ key: "I18N.PROMO.AVAILABLE_FUNDS" }),
          badgeLabel: i18n({ key: "I18N.PROMO.BADGE_LABEL" }),
          pendingWinnings: i18n({ key: "I18N.PROMO.PENDING_WINNINGS" }),
          cancel: i18n({ key: "I18N.PROMO.CANCEL" }),
          confirmCancel: i18n({ key: "I18N.PROMO.CONFIRM_CANCEL" }),
          declineCancel: i18n({ key: "I18N.PROMO.DECLINE_CANCEL" }),
          deposit: i18n({ key: "I18N.PROMOTION.DEPOSIT" }),
          footerText: i18n({ key: "I18N.PROMO.FOOTER_TEXT" }),
          refresh: i18n({ key: "I18N.PROMO.REFRESH" }),
          remainingHeader: i18n({
            key: "I18N.PROMO.REMAINING_CASH",
            interpolationValues: { amount: "€20.00" },
          }),
          remainingSubHeader: i18n({
            key: "I18N.PROMO.REQUIREMENTS_CASH",
            interpolationValues: { value: "€10.00", times: "3" },
          }),
          promotionContent: i18n({
            key: "I18N.PROMO.PROMO_CONTENT",
            interpolationValues: { amount: "€20.00", value: "€0.00" },
          }),
          promotionTitle: i18n({ key: "I18N.PROMO.PROMO_TITLE" }),
          requirements: "",
        },
      });
    });

    describe("and `getUserDetails` throws", () => {
      const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

      beforeEach(() => {
        const getImsPromotionStateCardByURN = createCardByURNSelector();

        getUserMainWalletValueMock.mockReturnValue(50);

        getImsPromotionStateCardByURN.mockReturnValueOnce({
          promotion: "fakePromotion",
          depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
        });

        getPromotionByURN.mockReturnValueOnce({
          urn: "fakeUrn",
          headline: "fakeHeadline",
          subHeadline: "fakeSubHeadline",
          image: null,
          ctaText: "fakeText",
          layout: PromotionLayout.OptIn,
          status: PromotionStatus.NotOptedIn,
          timeLeft: 23,
          wagerType: null,
          percentCompleted: null,
          bonusWagering: 30,
          wageringLeft: 20,
          bonusAwarded: 10,
          freeSpins: null,
          goldenChips: null,
          buyIn: null,
          interactiveResponseError: undefined,
          currentBonusBalance: 0,
          amountOnPendingWinnings: 0,
        });

        getUserDetails.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });
      });

      it("should call console.error with the error thrown by `getUserDetails`", () => {
        makeMapStateToProps()(STATE, { urn: "fakePromotion" });

        expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
      });

      it("should return an empty object", () => {
        expect(makeMapStateToProps()(STATE, { urn: "fakePromotion" })).toEqual({});
      });
    });
  });

  describe("When buy in promotion exist", () => {
    it("Should return correct props", () => {
      const getImsPromotionStateCardByURN = createCardByURNSelector();

      getImsPromotionStateCardByURN.mockReturnValue({
        promotion: "fakePromotion",
        depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      });

      getPromotionByURN.mockReturnValue({
        urn: "fakeUrn",
        headline: "fakeHeadline",
        subHeadline: "fakeSubHeadline",
        image: null,
        ctaText: "fakeText",
        layout: PromotionLayout.BuyIn,
        status: PromotionStatus.NotOptedIn,
        timeLeft: null,
        wagerType: null,
        percentCompleted: 20,
        bonusWagering: null,
        wageringLeft: null,
        bonusAwarded: null,
        freeSpins: null,
        goldenChips: null,
        buyIn: {
          buyInMinValue: 5,
          buyInMaxValue: 100,
          boughtIn: 0,
          intervals: [{ min: 5, max: 100, amount: 0, percentage: 200 }],
        },
        currentBonusBalance: 0,
        amountOnPendingWinnings: 0,
      });

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(STATE, { urn: "fakePromotion" });

      expect(getImsPromotionStateCardByURN).toHaveBeenCalledWith(undefined, "fakePromotion");
      expect(getPromotionByURN).toHaveBeenCalledWith(STATE.entities.imspromotions, "fakePromotion");
      expect(props).toEqual({
        promoCard: "fakePromotion",
        promotion: "fakeUrn",
        image: "",
        status: PromotionStatus.NotOptedIn,
        subHeadline: "fakeSubHeadline",
        ctaText: i18n({ key: "I18N.PROMO.CLAIM_NOW" }),
        layout: PromotionLayout.BuyIn,
        title: "fakeHeadline",
        availableFunds: 50,
        footerValue: "16 hours",
        secondsLeft: 0,
        progressValue: 20,
        type: "CASH",
        min: 10,
        max: 200,
        bonusAmount: 0,
        bonusPercent: 200,
        buyInMaxValue: 100,
        buyInMinValue: 5,
        pendingWinnings: "€0.00",
        isLoggedIn: true,
        authData: "AuthData",
        notificationMessage: undefined,
        depositViewLink: {
          viewUrl: "/navigation/a-encodedUrl",
          viewUrn: "ppb:tbd:view:myAccountView:encodedUrl",
        },
        disclaimerText: {
          bottomText: i18n({ key: "I18N.PROMOTION.DISCLAIMER.BOTTOM" }),
          listItemOne: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.FIRST" }),
          listItemTwo: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.SECOND" }),
          listTitle: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.TITLE" }),
          titleFirstPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE" }),
          titleSecondPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE.NEXT" }),
        },
        currencyDetails: {
          currencyCode: "EUR",
          localeCode: "en",
        },
        i18n: {
          availableFunds: i18n({ key: "I18N.PROMO.AVAILABLE_FUNDS" }),
          badgeLabel: i18n({ key: "I18N.PROMO.BADGE_LABEL" }),
          cancel: i18n({ key: "I18N.PROMO.CANCEL" }),
          pendingWinnings: i18n({ key: "I18N.PROMO.PENDING_WINNINGS" }),
          confirmCancel: i18n({ key: "I18N.PROMO.CONFIRM_CANCEL" }),
          declineCancel: i18n({ key: "I18N.PROMO.DECLINE_CANCEL" }),
          deposit: i18n({ key: "I18N.PROMOTION.DEPOSIT" }),
          footerText: i18n({ key: "I18N.PROMO.FOOTER_TEXT" }),
          refresh: i18n({ key: "I18N.PROMO.REFRESH" }),
          remainingHeader: i18n({
            key: "I18N.PROMO.REMAINING_CASH",
            interpolationValues: { amount: "€0.00" },
          }),
          remainingSubHeader: "",
          promotionContent: i18n({
            key: "I18N.PROMO.PROMO_CONTENT",
            interpolationValues: { amount: "€0.00", value: "€0.00" },
          }),
          promotionTitle: i18n({ key: "I18N.PROMO.PROMO_TITLE" }),
          requirements: "",
        },
      });
    });
    it("should return props when notification message exists", () => {
      const getImsPromotionStateCardByURN = createCardByURNSelector();

      getImsPromotionStateCardByURN.mockReturnValue({
        promotion: "fakePromotion",
        depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      });

      getPromotionByURN.mockReturnValue({
        urn: "fakeUrn",
        headline: "fakeHeadline",
        subHeadline: "fakeSubHeadline",
        image: null,
        ctaText: "fakeText",
        layout: PromotionLayout.BuyIn,
        status: PromotionStatus.NotOptedIn,
        timeLeft: 60001,
        wagerType: "GOLDEN_CHIPS",
        percentCompleted: 80,
        bonusWagering: null,
        wageringLeft: 50,
        bonusAwarded: null,
        freeSpins: null,
        goldenChips: {
          remainingGoldenChips: 20,
          goldenChipsAmount: 10,
          initialGoldenChips: 100,
        },
        buyIn: null,
        interactiveResponseError: { responseCode: -1 },
        currentBonusBalance: 0,
        amountOnPendingWinnings: 0,
      });

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(STATE, { urn: "fakePromotion" });

      expect(getImsPromotionStateCardByURN).toHaveBeenCalledWith(undefined, "fakePromotion");
      expect(getPromotionByURN).toHaveBeenCalledWith(STATE.entities.imspromotions, "fakePromotion");
      expect(props).toEqual({
        promoCard: "fakePromotion",
        promotion: "fakeUrn",
        image: "",
        status: PromotionStatus.NotOptedIn,
        subHeadline: "fakeSubHeadline",
        ctaText: i18n({ key: "I18N.PROMO.CLAIM_NOW" }),
        layout: PromotionLayout.BuyIn,
        title: "fakeHeadline",
        availableFunds: 50,
        footerValue: "16 hours",
        min: 0,
        max: 0,
        progressValue: 80,
        secondsLeft: 60001,
        type: "GOLDEN_CHIPS",
        bonusAmount: 0,
        bonusPercent: 100,
        buyInMaxValue: 0,
        buyInMinValue: 0,
        pendingWinnings: "€0.00",
        isLoggedIn: true,
        authData: "AuthData",
        notificationMessage: {
          type: "WARNING",
          title: i18n({ key: "I18N.PROMOTION.ERROR.TITLE" }),
          body: i18n({ key: "I18N.PROMOTION.ERROR.BODY" }),
        },
        depositViewLink: {
          viewUrl: "/navigation/a-encodedUrl",
          viewUrn: "ppb:tbd:view:myAccountView:encodedUrl",
        },
        disclaimerText: {
          bottomText: i18n({ key: "I18N.PROMOTION.DISCLAIMER.BOTTOM" }),
          listItemOne: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.FIRST" }),
          listItemTwo: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.SECOND" }),
          listTitle: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.TITLE" }),
          titleFirstPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE" }),
          titleSecondPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE.NEXT" }),
        },
        currencyDetails: {
          currencyCode: "EUR",
          localeCode: "en",
        },
        i18n: {
          availableFunds: i18n({ key: "I18N.PROMO.AVAILABLE_FUNDS" }),
          badgeLabel: i18n({ key: "I18N.PROMO.BADGE_LABEL" }),
          cancel: i18n({ key: "I18N.PROMO.CANCEL" }),
          pendingWinnings: i18n({ key: "I18N.PROMO.PENDING_WINNINGS" }),
          confirmCancel: i18n({ key: "I18N.PROMO.CONFIRM_CANCEL" }),
          declineCancel: i18n({ key: "I18N.PROMO.DECLINE_CANCEL" }),
          deposit: i18n({ key: "I18N.PROMOTION.DEPOSIT" }),
          footerText: i18n({ key: "I18N.PROMO.FOOTER_TEXT" }),
          refresh: i18n({ key: "I18N.PROMO.REFRESH" }),
          remainingHeader: i18n({
            key: "I18N.PROMO.SUBHEADER_GOLDEN_CHIPS",
            interpolationValues: { remainingWagger: "€50.00" },
          }),
          remainingSubHeader: i18n({
            key: "I18N.PROMO.REMAINING_GOLDEN_CHIPS",
            interpolationValues: { goldChipsAmount: "€10.00", remainingGoldChips: 20 },
          }),
          promotionContent: i18n({
            key: "I18N.PROMO.PROMO_CONTENT",
            interpolationValues: { amount: "€50.00", value: "€0.00" },
          }),
          promotionTitle: i18n({ key: "I18N.PROMO.PROMO_TITLE" }),
          requirements: i18n({
            key: "I18N.PROMO.REQUIREMENTS",
            interpolationValues: { times: 0, value: "€0.00" },
          }),
        },
      });
    });
  });

  describe("When ongoing promotion exist", () => {
    it("should return correct props for GOLDEN CHIPS type", () => {
      const getImsPromotionStateCardByURN = createCardByURNSelector();

      getImsPromotionStateCardByURN.mockReturnValue({
        promotion: "fakePromotion",
        depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      });

      getPromotionByURN.mockReturnValue({
        urn: "fakeUrn",
        headline: "fakeHeadline",
        subHeadline: "fakeSubHeadline",
        image: null,
        ctaText: "fakeText",
        layout: null,
        status: PromotionStatus.OptedIn,
        timeLeft: 60001,
        wagerType: "GOLDEN_CHIPS",
        percentCompleted: 80,
        bonusWagering: 10,
        wageringLeft: null,
        bonusAwarded: null,
        freeSpins: null,
        goldenChips: {
          remainingGoldenChips: 20,
          goldenChipsAmount: 10,
          initialGoldenChips: 100,
        },
        buyIn: null,
        currentBonusBalance: 300,
        amountOnPendingWinnings: 50,
      });

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(STATE, { urn: "fakePromotion" });

      expect(getImsPromotionStateCardByURN).toHaveBeenCalledWith(undefined, "fakePromotion");
      expect(getPromotionByURN).toHaveBeenCalledWith(STATE.entities.imspromotions, "fakePromotion");
      expect(props).toEqual({
        promoCard: "fakePromotion",
        promotion: "fakeUrn",
        image: "",
        status: PromotionStatus.OptedIn,
        subHeadline: "fakeSubHeadline",
        ctaText: "fakeText",
        layout: null,
        title: "fakeHeadline",
        availableFunds: 50,
        secondsLeft: 60001,
        footerValue: "16 hours",
        min: 0,
        max: 0,
        progressValue: 80,
        type: "GOLDEN_CHIPS",
        bonusAmount: 0,
        bonusPercent: 100,
        buyInMaxValue: 0,
        buyInMinValue: 0,
        pendingWinnings: "€150.00",
        isLoggedIn: true,
        authData: "AuthData",
        notificationMessage: undefined,
        depositViewLink: {
          viewUrl: "/navigation/a-encodedUrl",
          viewUrn: "ppb:tbd:view:myAccountView:encodedUrl",
        },
        disclaimerText: {
          bottomText: i18n({ key: "I18N.PROMOTION.DISCLAIMER.BOTTOM" }),
          listItemOne: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.FIRST" }),
          listItemTwo: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.SECOND" }),
          listTitle: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.TITLE" }),
          titleFirstPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE" }),
          titleSecondPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE.NEXT" }),
        },
        currencyDetails: {
          currencyCode: "EUR",
          localeCode: "en",
        },
        i18n: {
          availableFunds: i18n({ key: "I18N.PROMO.AVAILABLE_FUNDS" }),
          badgeLabel: i18n({ key: "I18N.PROMO.BADGE_LABEL" }),
          cancel: i18n({ key: "I18N.PROMO.CANCEL" }),
          pendingWinnings: i18n({ key: "I18N.PROMO.PENDING_WINNINGS" }),
          confirmCancel: i18n({ key: "I18N.PROMO.CONFIRM_CANCEL" }),
          declineCancel: i18n({ key: "I18N.PROMO.DECLINE_CANCEL" }),
          deposit: i18n({ key: "I18N.PROMOTION.DEPOSIT" }),
          footerText: i18n({ key: "I18N.PROMO.FOOTER_TEXT" }),
          refresh: i18n({ key: "I18N.PROMO.REFRESH" }),
          remainingHeader: i18n({
            key: "I18N.PROMO.SUBHEADER_GOLDEN_CHIPS",
            interpolationValues: { remainingWagger: "€0.00" },
          }),
          remainingSubHeader: i18n({
            key: "I18N.PROMO.REMAINING_GOLDEN_CHIPS",
            interpolationValues: { remainingGoldChips: 20, goldChipsAmount: "€10.00" },
          }),
          promotionContent: i18n({
            key: "I18N.PROMO.PROMO_CONTENT",
            interpolationValues: { amount: "€0.00", value: "€350.00" },
          }),
          promotionTitle: i18n({ key: "I18N.PROMO.PROMO_TITLE" }),
          requirements: i18n({ key: "I18N.PROMO.REQUIREMENTS", interpolationValues: { value: "€0.00", times: 10 } }),
        },
      });
    });

    it("should return correct props for FREE SPINS type", () => {
      const getImsPromotionStateCardByURN = createCardByURNSelector();

      getImsPromotionStateCardByURN.mockReturnValue({
        promotion: "fakePromotion",
        depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      });

      getPromotionByURN.mockReturnValue({
        urn: "fakeUrn",
        headline: "fakeHeadline",
        subHeadline: "fakeSubHeadline",
        image: null,
        ctaText: "fakeText",
        layout: null,
        status: PromotionStatus.OptedIn,
        timeLeft: 60001,
        wagerType: "GOLDEN_CHIPS",
        percentCompleted: 80,
        bonusWagering: null,
        wageringLeft: null,
        bonusAwarded: null,
        freeSpins: { remainingFreeSpins: 10, initialFreeSpins: 50 },
        goldenChips: null,
        buyIn: null,
        currentBonusBalance: 0,
        amountOnPendingWinnings: 0,
      });

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(STATE, { urn: "fakePromotion" });

      expect(getImsPromotionStateCardByURN).toHaveBeenCalledWith(undefined, "fakePromotion");
      expect(getPromotionByURN).toHaveBeenCalledWith(STATE.entities.imspromotions, "fakePromotion");
      expect(props).toEqual({
        promoCard: "fakePromotion",
        promotion: "fakeUrn",
        status: PromotionStatus.OptedIn,
        image: "",
        subHeadline: "fakeSubHeadline",
        ctaText: "fakeText",
        layout: null,
        title: "fakeHeadline",
        availableFunds: 50,
        footerValue: "16 hours",
        secondsLeft: 60001,
        min: 0,
        max: 0,
        progressValue: 80,
        type: "FREE_SPINS",
        bonusAmount: 0,
        bonusPercent: 100,
        buyInMaxValue: 0,
        buyInMinValue: 0,
        pendingWinnings: "€0.00",
        isLoggedIn: true,
        authData: "AuthData",
        notificationMessage: undefined,
        depositViewLink: {
          viewUrl: "/navigation/a-encodedUrl",
          viewUrn: "ppb:tbd:view:myAccountView:encodedUrl",
        },
        disclaimerText: {
          bottomText: i18n({ key: "I18N.PROMOTION.DISCLAIMER.BOTTOM" }),
          listItemOne: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.FIRST" }),
          listItemTwo: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.SECOND" }),
          listTitle: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.TITLE" }),
          titleFirstPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE" }),
          titleSecondPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE.NEXT" }),
        },
        currencyDetails: {
          currencyCode: "EUR",
          localeCode: "en",
        },
        i18n: {
          availableFunds: i18n({ key: "I18N.PROMO.AVAILABLE_FUNDS" }),
          pendingWinnings: i18n({ key: "I18N.PROMO.PENDING_WINNINGS" }),
          badgeLabel: i18n({ key: "I18N.PROMO.BADGE_LABEL" }),
          cancel: i18n({ key: "I18N.PROMO.CANCEL" }),
          confirmCancel: i18n({ key: "I18N.PROMO.CONFIRM_CANCEL" }),
          declineCancel: i18n({ key: "I18N.PROMO.DECLINE_CANCEL" }),
          deposit: i18n({ key: "I18N.PROMOTION.DEPOSIT" }),
          footerText: i18n({ key: "I18N.PROMO.FOOTER_TEXT" }),
          refresh: i18n({ key: "I18N.PROMO.REFRESH" }),
          remainingHeader: i18n({
            key: "I18N.PROMO.REMAINING_FREE_SPINS",
            interpolationValues: { remainingFreeSpins: 10 },
          }),
          remainingSubHeader: "",
          promotionContent: i18n({
            key: "I18N.PROMO.PROMO_CONTENT",
            interpolationValues: { amount: "€0.00", value: "€0.00" },
          }),
          promotionTitle: i18n({ key: "I18N.PROMO.PROMO_TITLE" }),
          requirements: "",
        },
      });
    });

    it("should return props when notification message exists", () => {
      const getImsPromotionStateCardByURN = createCardByURNSelector();

      getImsPromotionStateCardByURN.mockReturnValue({
        promotion: "fakePromotion",
        depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      });

      getPromotionByURN.mockReturnValue({
        urn: "fakeUrn",
        headline: "fakeHeadline",
        subHeadline: "fakeSubHeadline",
        image: null,
        ctaText: "fakeText",
        layout: null,
        status: PromotionStatus.OptedIn,
        timeLeft: 60001,
        wagerType: "GOLDEN_CHIPS",
        percentCompleted: 80,
        bonusWagering: null,
        wageringLeft: null,
        bonusAwarded: null,
        freeSpins: null,
        goldenChips: {
          remainingGoldenChips: 20,
          goldenChipsAmount: 10,
          initialGoldenChips: 100,
        },
        buyIn: null,
        interactiveResponseError: { responseCode: -1 },
        currentBonusBalance: 0,
        amountOnPendingWinnings: 0,
      });

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(STATE, { urn: "fakePromotion" });

      expect(getImsPromotionStateCardByURN).toHaveBeenCalledWith(undefined, "fakePromotion");
      expect(getPromotionByURN).toHaveBeenCalledWith(STATE.entities.imspromotions, "fakePromotion");
      expect(props).toEqual({
        promoCard: "fakePromotion",
        promotion: "fakeUrn",
        image: "",
        status: PromotionStatus.OptedIn,
        subHeadline: "fakeSubHeadline",
        ctaText: "fakeText",
        layout: null,
        title: "fakeHeadline",
        availableFunds: 50,
        footerValue: "16 hours",
        min: 0,
        max: 0,
        progressValue: 80,
        secondsLeft: 60001,
        type: "GOLDEN_CHIPS",
        bonusAmount: 0,
        bonusPercent: 100,
        buyInMaxValue: 0,
        buyInMinValue: 0,
        pendingWinnings: "€0.00",
        isLoggedIn: true,
        authData: "AuthData",
        notificationMessage: {
          type: "WARNING",
          title: i18n({ key: "I18N.PROMOTION.ERROR.TITLE" }),
          body: i18n({ key: "I18N.PROMOTION.ERROR.BODY" }),
        },
        depositViewLink: {
          viewUrl: "/navigation/a-encodedUrl",
          viewUrn: "ppb:tbd:view:myAccountView:encodedUrl",
        },
        disclaimerText: {
          bottomText: i18n({ key: "I18N.PROMOTION.DISCLAIMER.BOTTOM" }),
          listItemOne: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.FIRST" }),
          listItemTwo: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.SECOND" }),
          listTitle: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.TITLE" }),
          titleFirstPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE" }),
          titleSecondPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE.NEXT" }),
        },
        currencyDetails: {
          currencyCode: "EUR",
          localeCode: "en",
        },
        i18n: {
          availableFunds: i18n({ key: "I18N.PROMO.AVAILABLE_FUNDS" }),
          badgeLabel: i18n({ key: "I18N.PROMO.BADGE_LABEL" }),
          cancel: i18n({ key: "I18N.PROMO.CANCEL" }),
          pendingWinnings: i18n({ key: "I18N.PROMO.PENDING_WINNINGS" }),
          confirmCancel: i18n({ key: "I18N.PROMO.CONFIRM_CANCEL" }),
          declineCancel: i18n({ key: "I18N.PROMO.DECLINE_CANCEL" }),
          deposit: i18n({ key: "I18N.PROMOTION.DEPOSIT" }),
          footerText: i18n({ key: "I18N.PROMO.FOOTER_TEXT" }),
          refresh: i18n({ key: "I18N.PROMO.REFRESH" }),
          remainingHeader: i18n({
            key: "I18N.PROMO.SUBHEADER_GOLDEN_CHIPS",
            interpolationValues: { remainingWagger: "€0.00" },
          }),
          remainingSubHeader: i18n({
            key: "I18N.PROMO.REMAINING_GOLDEN_CHIPS",
            interpolationValues: { goldChipsAmount: "€10.00", remainingGoldChips: 20 },
          }),
          promotionContent: i18n({
            key: "I18N.PROMO.PROMO_CONTENT",
            interpolationValues: { amount: "€0.00", value: "€0.00" },
          }),
          promotionTitle: i18n({ key: "I18N.PROMO.PROMO_TITLE" }),
          requirements: i18n({
            key: "I18N.PROMO.REQUIREMENTS",
            interpolationValues: { times: 0, value: "€0.00" },
          }),
        },
      });
    });

    it("should return correct requirements text if 'times' equals 1", () => {
      const getImsPromotionStateCardByURN = createCardByURNSelector();

      getImsPromotionStateCardByURN.mockReturnValue({
        promotion: "fakePromotion",
        depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      });

      getPromotionByURN.mockReturnValue({
        urn: "fakeUrn",
        headline: "fakeHeadline",
        subHeadline: "fakeSubHeadline",
        image: null,
        ctaText: "fakeText",
        layout: null,
        status: PromotionStatus.OptedIn,
        timeLeft: 60001,
        wagerType: "GOLDEN_CHIPS",
        percentCompleted: 80,
        bonusWagering: 5,
        wageringLeft: null,
        bonusAwarded: 5,
        freeSpins: null,
        goldenChips: {
          remainingGoldenChips: 20,
          goldenChipsAmount: 10,
          initialGoldenChips: 100,
        },
        buyIn: null,
        interactiveResponseError: { responseCode: -1 },
        currentBonusBalance: 0,
        amountOnPendingWinnings: 0,
      });

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(STATE, { urn: "fakePromotion" });

      expect(getImsPromotionStateCardByURN).toHaveBeenCalledWith(undefined, "fakePromotion");
      expect(getPromotionByURN).toHaveBeenCalledWith(STATE.entities.imspromotions, "fakePromotion");
      expect(props).toEqual({
        promoCard: "fakePromotion",
        promotion: "fakeUrn",
        image: "",
        status: PromotionStatus.OptedIn,
        subHeadline: "fakeSubHeadline",
        ctaText: "fakeText",
        layout: null,
        title: "fakeHeadline",
        availableFunds: 50,
        footerValue: "16 hours",
        min: 0,
        max: 0,
        progressValue: 80,
        secondsLeft: 60001,
        type: "GOLDEN_CHIPS",
        bonusAmount: 0,
        bonusPercent: 100,
        buyInMaxValue: 0,
        buyInMinValue: 0,
        pendingWinnings: "€0.00",
        isLoggedIn: true,
        authData: "AuthData",
        notificationMessage: {
          type: "WARNING",
          title: i18n({ key: "I18N.PROMOTION.ERROR.TITLE" }),
          body: i18n({ key: "I18N.PROMOTION.ERROR.BODY" }),
        },
        depositViewLink: {
          viewUrl: "/navigation/a-encodedUrl",
          viewUrn: "ppb:tbd:view:myAccountView:encodedUrl",
        },
        disclaimerText: {
          bottomText: i18n({ key: "I18N.PROMOTION.DISCLAIMER.BOTTOM" }),
          listItemOne: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.FIRST" }),
          listItemTwo: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.SECOND" }),
          listTitle: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.TITLE" }),
          titleFirstPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE" }),
          titleSecondPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE.NEXT" }),
        },
        currencyDetails: {
          currencyCode: "EUR",
          localeCode: "en",
        },
        i18n: {
          availableFunds: i18n({ key: "I18N.PROMO.AVAILABLE_FUNDS" }),
          badgeLabel: i18n({ key: "I18N.PROMO.BADGE_LABEL" }),
          cancel: i18n({ key: "I18N.PROMO.CANCEL" }),
          pendingWinnings: i18n({ key: "I18N.PROMO.PENDING_WINNINGS" }),
          confirmCancel: i18n({ key: "I18N.PROMO.CONFIRM_CANCEL" }),
          declineCancel: i18n({ key: "I18N.PROMO.DECLINE_CANCEL" }),
          deposit: i18n({ key: "I18N.PROMOTION.DEPOSIT" }),
          footerText: i18n({ key: "I18N.PROMO.FOOTER_TEXT" }),
          refresh: i18n({ key: "I18N.PROMO.REFRESH" }),
          remainingHeader: i18n({
            key: "I18N.PROMO.SUBHEADER_GOLDEN_CHIPS",
            interpolationValues: { remainingWagger: "€0.00" },
          }),
          remainingSubHeader: i18n({
            key: "I18N.PROMO.REMAINING_GOLDEN_CHIPS",
            interpolationValues: { goldChipsAmount: "€10.00", remainingGoldChips: 20 },
          }),
          promotionContent: i18n({
            key: "I18N.PROMO.PROMO_CONTENT",
            interpolationValues: { amount: "€0.00", value: "€0.00" },
          }),
          promotionTitle: i18n({ key: "I18N.PROMO.PROMO_TITLE" }),
          requirements: i18n({
            key: "I18N.PROMO.REQUIREMENTS_ONE_TIME",
            interpolationValues: { value: "€5.00" },
          }),
        },
      });
    });

    it("should return props when ongoing promotion CASH exist", () => {
      const getImsPromotionStateCardByURN = createCardByURNSelector();

      getImsPromotionStateCardByURN.mockReturnValue({
        promotion: "fakePromotion",
        depositLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      });

      getPromotionByURN.mockReturnValue({
        urn: "fakeUrn",
        headline: "fakeHeadline",
        subHeadline: "fakeSubHeadline",
        image: null,
        ctaText: "fakeText",
        layout: null,
        status: PromotionStatus.OptedIn,
        timeLeft: 60001,
        wagerType: null,
        percentCompleted: 40,
        bonusWagering: 100,
        wageringLeft: 50,
        bonusAwarded: 25,
        freeSpins: null,
        goldenChips: null,
        buyIn: null,
        currentBonusBalance: 0,
        amountOnPendingWinnings: 0,
      });

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(STATE, { urn: "fakePromotion" });

      expect(getImsPromotionStateCardByURN).toHaveBeenCalledWith(undefined, "fakePromotion");
      expect(getPromotionByURN).toHaveBeenCalledWith(STATE.entities.imspromotions, "fakePromotion");
      expect(props).toStrictEqual({
        promoCard: "fakePromotion",
        promotion: "fakeUrn",
        status: PromotionStatus.OptedIn,
        image: "",
        subHeadline: "fakeSubHeadline",
        ctaText: "fakeText",
        layout: null,
        title: "fakeHeadline",
        availableFunds: 50,
        footerValue: "16 hours",
        secondsLeft: 60001,
        min: 0,
        max: 0,
        progressValue: 40,
        type: "CASH",
        bonusAmount: 0,
        bonusPercent: 100,
        buyInMaxValue: 0,
        buyInMinValue: 0,
        pendingWinnings: "€0.00",
        isLoggedIn: true,
        authData: "AuthData",
        notificationMessage: undefined,
        depositViewLink: {
          viewUrl: "/navigation/a-encodedUrl",
          viewUrn: "ppb:tbd:view:myAccountView:encodedUrl",
        },
        disclaimerText: {
          bottomText: i18n({ key: "I18N.PROMOTION.DISCLAIMER.BOTTOM" }),
          listItemOne: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.FIRST" }),
          listItemTwo: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.ITEM.SECOND" }),
          listTitle: i18n({ key: "I18N.PROMOTION.DISCLAIMER.LIST.TITLE" }),
          titleFirstPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE" }),
          titleSecondPart: i18n({ key: "I18N.PROMOTION.DISCLAIMER.TITLE.NEXT" }),
        },
        currencyDetails: {
          currencyCode: "EUR",
          localeCode: "en",
        },
        i18n: {
          availableFunds: i18n({ key: "I18N.PROMO.AVAILABLE_FUNDS" }),
          badgeLabel: i18n({ key: "I18N.PROMO.BADGE_LABEL" }),
          pendingWinnings: i18n({ key: "I18N.PROMO.PENDING_WINNINGS" }),
          cancel: i18n({ key: "I18N.PROMO.CANCEL" }),
          confirmCancel: i18n({ key: "I18N.PROMO.CONFIRM_CANCEL" }),
          declineCancel: i18n({ key: "I18N.PROMO.DECLINE_CANCEL" }),
          deposit: i18n({ key: "I18N.PROMOTION.DEPOSIT" }),
          footerText: i18n({ key: "I18N.PROMO.FOOTER_TEXT" }),
          refresh: i18n({ key: "I18N.PROMO.REFRESH" }),
          remainingHeader: i18n({
            key: "I18N.PROMO.REMAINING_CASH",
            interpolationValues: { amount: "€50.00" },
          }),
          remainingSubHeader: i18n({
            key: "I18N.PROMO.REQUIREMENTS_CASH",
            interpolationValues: { value: "€25.00", times: "4" },
          }),
          promotionContent: i18n({
            key: "I18N.PROMO.PROMO_CONTENT",
            interpolationValues: { amount: "€50.00", value: "€0.00" },
          }),
          promotionTitle: i18n({ key: "I18N.PROMO.PROMO_TITLE" }),
          requirements: "",
        },
      });
    });
  });

  describe("When Promotion does not exist", () => {
    it("should return an empty object", () => {
      const getImsPromotionStateCardByURN = createCardByURNSelector();

      getImsPromotionStateCardByURN.mockReturnValue(null);

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(STATE, { urn: "fakePromotion" });

      expect(getImsPromotionStateCardByURN).toHaveBeenCalledWith(undefined, "fakePromotion");
      expect(props).toEqual({});
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchAcceptPromotion", () => {
    it("should dispatch accept promotion action", () => {
      const { dispatchAcceptPromotion } = mapDispatchToProps;
      const promoUrn = "fakeUrn";
      const amount = 5;

      expect(dispatchAcceptPromotion(promoUrn, "fakeTitle", "not accepted", "opt in", amount, "OPT_IN", 40)).toEqual({
        type: ACCEPT_PROMOTION,
        payload: {
          urn: promoUrn,
          amount,
          name: "fakeTitle",
          promoStatus: "not accepted",
          userStatus: "opt in",
          type: "OPT_IN",
          progressValue: 40,
        },
      });
    });
  });

  describe("dispatchCancelPromotion", () => {
    it("shoud dispatch cancel promotion action", () => {
      const { dispatchCancelPromotion } = mapDispatchToProps;
      const promoUrn = "fakeUrn";

      expect(dispatchCancelPromotion(promoUrn)).toEqual({
        payload: { urn: promoUrn },
        type: CANCEL_PROMOTION,
      });
    });
  });

  describe("dispatchClearErrorMessage", () => {
    it("shoud dispatch clear error message action", () => {
      const { dispatchClearErrorMessage } = mapDispatchToProps;
      const promoUrn = "fakeUrn";

      expect(dispatchClearErrorMessage(promoUrn)).toEqual({
        payload: { urn: promoUrn },
        type: REMOVE_INTERACTIVE_RESPONSE_ERROR,
      });
    });
  });

  describe("dispatchDepositNavigation", () => {
    it("shoud dispatch deposit navigation action", () => {
      const { dispatchDepositNavigation } = mapDispatchToProps;
      const viewLink = { viewUrn: "fakeURN", viewUrl: "fakeURL" };
      expect(dispatchDepositNavigation(viewLink)).toEqual({
        payload: { viewLink },
        type: DEPOSIT_NAVIGATION,
      });
    });
  });

  describe("dispatchSawPromotionError", () => {
    it("shoud dispatch saw promotion error action", () => {
      const { dispatchSawPromotionError } = mapDispatchToProps;
      const label = "Error";

      expect(dispatchSawPromotionError(label)).toEqual({
        payload: { label, moduleName: "moduleName" },
        type: SAW_CARD,
      });
    });
  });

  describe("dispatchInteractCancelPromotionModal", () => {
    it("shoud dispatch interact with cancel promotion modal action", () => {
      const { dispatchInteractCancelPromotionModal } = mapDispatchToProps;
      const promoUrn = "fakeUrn";
      const name = "fakeName";
      const promoStatus = "fakePromo";
      const userStatus = "OPTED_IN";
      const label = "cancel";
      const type = "Free Spins";
      const progressValue = 30;

      expect(
        dispatchInteractCancelPromotionModal(promoUrn, name, promoStatus, userStatus, label, type, progressValue),
      ).toEqual({
        payload: { urn: promoUrn, name, promoStatus, userStatus, label, type, progressValue },
        type: INTERACT_CANCEL_PROMOTION_MODAL,
      });
    });
  });

  describe("dispatchRefreshPromotion", () => {
    it("shoud dispatch refresh promotion action", () => {
      const { dispatchRefreshPromotion } = mapDispatchToProps;
      const promoUrn = "fakeUrn";
      const name = "fakeName";
      const promoStatus = "fakePromo";
      const userStatus = "OPTED_IN";
      const label = "cancel";
      const promotion = "promotionUnr";

      expect(dispatchRefreshPromotion(promoUrn, name, promoStatus, userStatus, label, promotion)).toEqual({
        payload: { urn: promoUrn, name, promoStatus, userStatus, label, promotion },
        type: REFRESH_PROMOTION,
      });
    });
  });

  describe("dispatchExternalPushAction", () => {
    it("should dispatch external push action without URN", () => {
      const { dispatchExternalPushAction } = mapDispatchToProps;

      expect(dispatchExternalPushAction("label", "moduleName", "URL")).toEqual({
        type: EXTERNAL_PUSH,
        payload: {
          viewUrn: "",
          viewUrl: "URL",
          gtmData: {
            label: "label",
            moduleName: "moduleName",
          },
        },
      });
    });
  });
});
