import { FETCH_USER_MAIN_WALLET } from "@ppb/tbd-store/actions/user-wallets";
import { UI__MY_ACCOUNT_ICON_CLICK } from "@ppb/tbd-store/actions/interface";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { createGetUserMainWalletValueSelector } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { createGetWalletsAvailabilitySelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const MAIN_WALLET_STATE = {
  entities: {
    userdetails: {
      currencyCode: "EUR",
      localeCode: "en",
      countryCode: "GB",
    },
    wallets: {
      MAIN: {
        walletName: "MAIN",
        amount: 123.4567,
      },
    },
    preferences: {
      showBalances: true,
    },
  },
  layouts: {
    views: {
      browse: {
        "ppb:tbd:view:browse:browse": {},
      },
    },
    cards: {
      myaccount: {
        isOpen: false,
      },
    },
  },
  router: {
    currentUrl: "",
  },
};

const TOKENS_WALLET_STATE = {
  entities: {
    userdetails: {
      currencyCode: "EUR",
      localeCode: "en",
      countryCode: "GB",
    },
    wallets: {
      TOKENS: {
        walletName: "TOKENS",
        amount: 5,
      },
    },
    preferences: {
      showBalances: false,
    },
  },
  layouts: {
    views: {
      browse: {
        "ppb:tbd:view:browse:browse": {},
      },
    },
    cards: {
      myaccount: {
        isOpen: true,
      },
    },
  },
  router: {
    currentUrl: "",
  },
};

const getUserDetailsMock = jest.fn();
const getWalletsAvailabilityMock = jest.fn(() => ({
  freeBetsBalance: 0,
  boostedTokensAvailable: false,
  accaInsuranceTokensAvailable: false,
}));
const getUserMainWalletValueMock = jest.fn();
const getUserPreferencesWithProductSwitcherMock = jest.fn();

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => getUserDetailsMock),
}));

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  createGetUserMainWalletValueSelector: jest.fn(() => getUserMainWalletValueMock),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createGetWalletsAvailabilitySelector: jest.fn(() => getWalletsAvailabilityMock),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(() => "currency formatted value"),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => getUserPreferencesWithProductSwitcherMock),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should be a factory function", () => {
    expect(makeMapStateToProps()).toEqual(expect.any(Function));
  });

  it("should call createGetUserMainWalletValueSelector only 1 time", () => {
    makeMapStateToProps();
    expect(createGetUserMainWalletValueSelector).toHaveBeenCalledTimes(1);
  });

  it("should call createGetWalletsAvailabilitySelector only 1 time", () => {
    makeMapStateToProps();
    expect(createGetWalletsAvailabilitySelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    describe("when state contains MAIN wallet", () => {
      it("should return properly formatted account balance and search state", () => {
        getUserDetailsMock.mockReturnValue({ countryCode: "IE", localeCode: "en", currencyCode: "EUR" });
        getUserMainWalletValueMock.mockReturnValue(45.72);
        getUserPreferencesWithProductSwitcherMock.mockReturnValueOnce({ showBalances: true });
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(MAIN_WALLET_STATE);

        expect(props).toEqual({
          accountBalance: "currency formatted value",
          showBalances: true,
          url: "",
          urn: "",
          freeBetsLabel: "I18N.FREE_BETS",
        });
      });
    });

    describe("when state does not contain MAIN wallet", () => {
      it("should return undefined", () => {
        getUserDetailsMock.mockReturnValue(undefined);
        getUserMainWalletValueMock.mockReturnValue(undefined);
        getUserPreferencesWithProductSwitcherMock.mockReturnValueOnce({ showBalances: false });
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(TOKENS_WALLET_STATE);

        expect(props).toEqual({
          accountBalance: undefined,
          showBalances: false,
          url: "",
          urn: "",
          freeBetsLabel: "I18N.FREE_BETS",
        });
      });
    });

    describe("when free bets balance is defined", () => {
      it("should return properly formatted free bets balance", () => {
        getUserDetailsMock.mockReturnValue({ countryCode: "IE", localeCode: "en", currencyCode: "EUR" });
        getUserMainWalletValueMock.mockReturnValue(45.72);
        getWalletsAvailabilityMock.mockReturnValue({
          freeBetsBalance: 20,
          boostedTokensAvailable: false,
          accaInsuranceTokensAvailable: false,
        });
        getUserPreferencesWithProductSwitcherMock.mockReturnValueOnce({ showBalances: true });
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(MAIN_WALLET_STATE);

        expect(props).toEqual({
          accountBalance: "currency formatted value",
          freeBetsBalance: "currency formatted value",
          showBalances: true,
          url: "",
          urn: "",
          freeBetsLabel: "I18N.FREE_BETS",
        });
      });
    });

    describe("when free bets balance is not defined", () => {
      it("should return undefined free bets balance", () => {
        getUserDetailsMock.mockReturnValue({ countryCode: "IE", localeCode: "en", currencyCode: "EUR" });
        getUserMainWalletValueMock.mockReturnValue(45.72);
        getWalletsAvailabilityMock.mockReturnValue({
          freeBetsBalance: 0,
          boostedTokensAvailable: false,
          accaInsuranceTokensAvailable: false,
        });
        getUserPreferencesWithProductSwitcherMock.mockReturnValueOnce({ showBalances: true });
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(MAIN_WALLET_STATE);

        expect(props).toEqual({
          accountBalance: "currency formatted value",
          freeBetsBalance: undefined,
          showBalances: true,
          url: "",
          urn: "",
          freeBetsLabel: "I18N.FREE_BETS",
        });
      });
    });

    describe("when `getUserDetails` throws", () => {
      const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";
      beforeEach(() => {
        getUserDetails.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });
      });

      it("should call console.error with the error thrown by `getUserDetails`", () => {
        makeMapStateToProps()(MAIN_WALLET_STATE);

        expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
      });

      it("should return an empty object", () => {
        const props = makeMapStateToProps()(MAIN_WALLET_STATE);

        expect(props).toEqual({});
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchFetchUserMainWallet", () => {
      it("should dispatch fetch user main wallet", () => {
        const { dispatchFetchUserMainWallet } = mapDispatchToProps;

        expect(dispatchFetchUserMainWallet()).toEqual({
          type: FETCH_USER_MAIN_WALLET,
        });
      });
    });

    describe("dispatchMyAccountClickAction", () => {
      it("should dispatch my account click action", () => {
        const { dispatchMyAccountClickAction } = mapDispatchToProps;

        expect(dispatchMyAccountClickAction(false)).toEqual({
          type: UI__MY_ACCOUNT_ICON_CLICK,
          payload: false,
        });
      });
    });

    describe("dispatchChangeUrl", () => {
      it("should dispatch change url", () => {
        const { dispatchChangeUrl } = mapDispatchToProps;

        expect(dispatchChangeUrl("closeUrn", "closeUrl")).toEqual({
          type: PUSH,
          payload: {
            viewUrn: "closeUrn",
            viewUrl: "closeUrl",
          },
        });
      });
    });
  });
});
