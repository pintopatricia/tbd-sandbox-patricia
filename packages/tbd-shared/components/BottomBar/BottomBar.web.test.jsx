import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { CookieNames } from "../../config/cookies";
import { BottomBar as BottomBarComponent } from "@ppb/the-wall-web";
import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { ProductUrlSuffix } from "@ppb/tbd-store";
import { getCookie, setCookie } from "../../helpers/cookies.web";
import BottomBar from "./BottomBar.web";

jest.mock("@ppb/the-wall-web", () => ({
  BottomBar: jest.fn((props) => <bottom-bar-mock {...props} />),
}));

jest.mock("../../helpers/cookies.web", () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
}));

const ITEMS = [
  {
    tileType: "HOME",
    title: "Home",
    url: "betting/",
  },
  {
    tileType: "BROWSE",
    title: "Browse",
    url: "betting/browse",
  },
  {
    tileType: "MY_BETS",
    title: "My Bets",
    url: "betting/mybets",
  },
  {
    tileType: "BLACKJACK",
    title: "Blackjack",
    url: "url-tolb",
  },
];

const VIEW_LINK_MOCK = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };
const GTM_TRANSLATIONS_MOCK = ["Home", "Browse", "My Bets", "Blackjack"];

const dispatchBottomBarNavigationSpy = jest.fn();
const dispatchBottomBarGameLaunchSpy = jest.fn();
const dispatchGenericPushActionSpy = jest.fn();
const dispatchWebSwitchProductPreferenceActionSpy = jest.fn();
const dispatchGoToExchangeXSellActionSpy = jest.fn();
const dispatchOpenPredictsSpy = jest.fn();
const preventDefault = jest.fn();

const DEFAULT_PROPS = {
  items: ITEMS,
  isBetslipCollapsed: false,
  isBetslipOpen: false,
  isReceiptOpen: false,
  dispatchBottomBarNavigation: dispatchBottomBarNavigationSpy,
  dispatchBottomBarGameLaunch: dispatchBottomBarGameLaunchSpy,
  dispatchGenericPushAction: dispatchGenericPushActionSpy,
  dispatchWebSwitchProductPreferenceAction: dispatchWebSwitchProductPreferenceActionSpy,
  dispatchGoToExchangeXSellAction: dispatchGoToExchangeXSellActionSpy,
  dispatchOpenPredicts: dispatchOpenPredictsSpy,
};

const renderBottomBar = (props = {}) => render(<BottomBar {...DEFAULT_PROPS} {...props} />);

describe("BottomBar.web", () => {
  beforeEach(jest.clearAllMocks);

  describe("when no items are passed", () => {
    it("should select the Home tile as the default accordingly", () => {
      renderBottomBar({ items: undefined });

      expect(BottomBarComponent).not.toHaveBeenCalled();
    });
  });

  describe("when onTileClick is called", () => {
    const setupOnTileClick = ({ clickedIndex = 0, gtmTranslations = GTM_TRANSLATIONS_MOCK, items = ITEMS } = {}) => {
      renderBottomBar({
        gtmTranslations,
        items,
      });

      act(() => {
        const { onTileClick } = BottomBarComponent.mock.calls[0][0];
        onTileClick({ preventDefault }, items[clickedIndex].tileType, clickedIndex, VIEW_LINK_MOCK);
      });
    };

    it("should prevent the default event", () => {
      setupOnTileClick();

      expect(preventDefault).toHaveBeenCalledWith();
    });

    it("should call the dispatchBottomBarNavigation when tileType is not game launch related", () => {
      setupOnTileClick({ clickedIndex: 0 });

      expect(dispatchBottomBarNavigationSpy).toHaveBeenCalledWith(VIEW_LINK_MOCK, GTM_TRANSLATIONS_MOCK[0]);
    });

    it("should call the dispatchBottomBarGameLaunch when tileType is game launch related", () => {
      setupOnTileClick({ clickedIndex: 3 });

      expect(dispatchBottomBarGameLaunchSpy).toHaveBeenCalledWith(VIEW_LINK_MOCK, GTM_TRANSLATIONS_MOCK[3]);
    });

    it("should call the dispatchGenericPushAction", () => {
      setupOnTileClick();

      expect(dispatchGenericPushActionSpy).toHaveBeenCalledWith(VIEW_LINK_MOCK);
    });
  });

  describe("productSwitcherConfig", () => {
    describe("when productSwitcherConfig is undefined", () => {
      it("should call Bottom Bar with hasProductSwitcher as false and without the productSwitcherTitle", () => {
        renderBottomBar();
        expect(BottomBarComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            hasProductSwitcher: false,
            productSwitcherTitle: undefined,
          }),
          undefined,
        );
      });
    });

    describe("when productSwitcherConfig is defined", () => {
      it("should call Bottom Bar with hasProductSwitcher as true and with the productSwitcherTitle", () => {
        renderBottomBar({
          productSwitcherConfig: {
            isExcOnboardingThrottleActive: true,
            isXSell: false,
            productPreference: ProductsOption.sportsbook,
            title: "Exchange",
            isProductSwitcherAvailable: {
              default: true,
            },
          },
        });
        expect(BottomBarComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            hasProductSwitcher: true,
            productSwitcherTitle: "Exchange",
          }),
          undefined,
        );
      });
    });
  });

  describe("onProductSwitch", () => {
    const setupOnProductSwitch = ({
      isXSell = false,
      isExcAllowedJurisdictionThrottleActive = false,
      productPreference = ProductsOption.sportsbook,
      title = "Exchange",
      showOnboardingNewLabel = false,
      isLoggedIn = false,
    } = {}) => {
      renderBottomBar({
        productSwitcherConfig: {
          isLoggedIn,
          isExcAllowedJurisdictionThrottleActive,
          isXSell,
          productPreference,
          title,
          showOnboardingNewLabel,
          onboardingLabelTitle: "NEW",
        },
      });

      act(() => {
        const lastCall = BottomBarComponent.mock.calls.length - 1;
        const { onProductSwitch } = BottomBarComponent.mock.calls[lastCall][0];
        onProductSwitch({ preventDefault });
      });
    };

    it("should prevent the default event", () => {
      setupOnProductSwitch({ isXSell: true });

      act(() => {
        const { onProductSwitch } = BottomBarComponent.mock.calls[0][0];
        onProductSwitch({ preventDefault });
      });

      expect(preventDefault).toHaveBeenCalledWith();
    });

    describe("when user is logged in", () => {
      describe("and isXSell is true", () => {
        it("should call dispatchGoToExchangeXSellAction", () => {
          setupOnProductSwitch({ isLoggedIn: true, isXSell: true, productPreference: ProductsOption.sportsbook });
          expect(dispatchGoToExchangeXSellActionSpy).toHaveBeenCalled();
        });
      });

      describe("and isXSell is false", () => {
        it("should call dispatchWebSwitchProductPreferenceAction", () => {
          setupOnProductSwitch({ isLoggedIn: true, isXSell: false, productPreference: ProductsOption.sportsbook });
          expect(dispatchWebSwitchProductPreferenceActionSpy).toHaveBeenCalledWith(
            ProductUrlSuffix.Exchange,
            ProductsOption.exchange,
          );
        });
      });

      describe("when showOnboardingNewLabel is false", () => {
        it("should call Bottom Bar with hasOnboardingLabel as false", () => {
          setupOnProductSwitch({
            isLoggedIn: true,
            showOnboardingNewLabel: false,
            productPreference: ProductsOption.sportsbook,
          });

          expect(BottomBarComponent).toHaveBeenCalledWith(
            expect.objectContaining({
              hasOnboardingLabel: false,
            }),
            undefined,
          );
        });
      });

      describe("when showOnboardingNewLabel is true", () => {
        it("should call Bottom Bar with hasOnboardingLabel as true", () => {
          setupOnProductSwitch({
            isLoggedIn: true,
            showOnboardingNewLabel: true,
            productPreference: ProductsOption.sportsbook,
          });

          expect(BottomBarComponent).toHaveBeenCalledWith(
            expect.objectContaining({
              hasOnboardingLabel: true,
            }),
            undefined,
          );
        });
      });
    });

    describe("and user is logged out", () => {
      describe("and PHOENIX_ENABLED cookie is 'true'", () => {
        beforeEach(() => {
          getCookie.mockReturnValue("true");
          setupOnProductSwitch({
            isLoggedIn: false,
            isExcAllowedJurisdictionThrottleActive: true,
            isXSell: true,
            productPreference: ProductsOption.sportsbook,
          });
        });

        it("should call dispatchWebSwitchProductPreferenceAction", () => {
          expect(dispatchWebSwitchProductPreferenceActionSpy).toHaveBeenCalledWith(
            ProductUrlSuffix.Exchange,
            ProductsOption.exchange,
          );
        });

        it("should call Bottom Bar with hasOnboardingLabel as true", () => {
          expect(BottomBarComponent).toHaveBeenCalledWith(
            expect.objectContaining({
              hasOnboardingLabel: true,
            }),
            undefined,
          );
        });
      });

      describe("and PHOENIX_ENABLED cookie is 'false'", () => {
        beforeEach(() => {
          getCookie.mockReturnValue("false");
          setupOnProductSwitch({
            isLoggedIn: false,
            isExcAllowedJurisdictionThrottleActive: true,
            isXSell: false,
            productPreference: ProductsOption.sportsbook,
          });
        });
        it("should call dispatchGoToExchangeXSellAction", () => {
          expect(dispatchGoToExchangeXSellActionSpy).toHaveBeenCalled();
        });

        it("should call Bottom Bar with hasOnboardingLabel as false", () => {
          expect(BottomBarComponent).toHaveBeenCalledWith(
            expect.objectContaining({
              hasOnboardingLabel: false,
            }),
            undefined,
          );
        });
      });

      describe("and no cookie is present", () => {
        beforeEach(() => {
          getCookie.mockReturnValue(undefined);
          setupOnProductSwitch({
            showOnboardingNewLabel: false,
            isLoggedIn: false,
            isXSell: true,
            productPreference: ProductsOption.sportsbook,
          });
        });

        it("should fallback to isXSell prop value", () => {
          expect(dispatchGoToExchangeXSellActionSpy).toHaveBeenCalled();
        });

        it("should call Bottom Bar with hasOnboardingLabel as false", () => {
          expect(BottomBarComponent).toHaveBeenCalledWith(
            expect.objectContaining({
              hasOnboardingLabel: false,
            }),
            undefined,
          );
        });
      });
    });
  });

  describe("when shouldShowXSellToPredicts is true", () => {
    const renderWithPredicts = (overrides = {}) =>
      renderBottomBar({
        productSwitcherConfig: {
          title: "Predicts",
          productPreference: ProductsOption.sportsbook,
          isProductSwitcherAvailable: { default: true },
          showOnboardingNewLabel: false,
          isLoggedIn: false,
          isExcAllowedJurisdictionThrottleActive: false,
          shouldShowXSellToPredicts: true,
          isXSell: true,
          onboardingLabelTitle: "NEW",
          ...overrides,
        },
      });

    it("should call dispatchOpenPredicts when onProductSwitch is fired", () => {
      renderWithPredicts();

      act(() => {
        const lastCall = BottomBarComponent.mock.calls.length - 1;
        const { onProductSwitch } = BottomBarComponent.mock.calls[lastCall][0];
        onProductSwitch({ preventDefault });
      });

      expect(dispatchOpenPredictsSpy).toHaveBeenCalledTimes(1);
      expect(dispatchWebSwitchProductPreferenceActionSpy).not.toHaveBeenCalled();
      expect(dispatchGoToExchangeXSellActionSpy).not.toHaveBeenCalled();
    });

    it("should not call dispatchOpenPredicts when shouldShowXSellToPredicts is false", () => {
      renderBottomBar({
        productSwitcherConfig: {
          title: "Exchange",
          productPreference: ProductsOption.sportsbook,
          isProductSwitcherAvailable: { default: true },
          showOnboardingNewLabel: false,
          isLoggedIn: true,
          isExcAllowedJurisdictionThrottleActive: false,
          shouldShowXSellToPredicts: false,
          isXSell: true,
          onboardingLabelTitle: "NEW",
        },
      });

      act(() => {
        const lastCall = BottomBarComponent.mock.calls.length - 1;
        const { onProductSwitch } = BottomBarComponent.mock.calls[lastCall][0];
        onProductSwitch({ preventDefault });
      });

      expect(dispatchOpenPredictsSpy).not.toHaveBeenCalled();
    });
  });

  describe("on component update", () => {
    describe("when user is logged in", () => {
      describe("and phoenix is available", () => {
        describe("and isXSell is false", () => {
          it("should set PHOENIX_ENABLED cookie to 'true'", () => {
            renderBottomBar({
              productSwitcherConfig: {
                isLoggedIn: true,
                isExcAllowedJurisdictionThrottleActive: true,
                isXSell: false,
              },
            });

            expect(setCookie).toHaveBeenCalledWith(CookieNames.PHOENIX_ENABLED, "true", "/");
          });
        });

        describe("and isXSell is true", () => {
          it("should set PHOENIX_ENABLED cookie to 'false'", () => {
            renderBottomBar({
              productSwitcherConfig: {
                isLoggedIn: true,
                isExcAllowedJurisdictionThrottleActive: true,
                isXSell: true,
              },
            });

            expect(setCookie).toHaveBeenCalledWith(CookieNames.PHOENIX_ENABLED, "false", "/");
          });
        });
      });

      describe("and phoenix is not available", () => {
        it("should not set the PHOENIX_ENABLED cookie", () => {
          renderBottomBar({
            productSwitcherConfig: {
              isLoggedIn: true,
              isExcAllowedJurisdictionThrottleActive: false,
              isXSell: false,
            },
          });

          expect(setCookie).not.toHaveBeenCalled();
        });
      });
    });

    describe("when user is logged out", () => {
      it("should not call setCookie even if throttle is active", () => {
        renderBottomBar({
          productSwitcherConfig: {
            isLoggedIn: false,
            isExcAllowedJurisdictionThrottleActive: true,
          },
        });

        expect(setCookie).not.toHaveBeenCalled();
      });
    });
  });
});
