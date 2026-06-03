import { act, render } from "@testing-library/react";
import { MessageBanner, Overlay } from "@ppb/the-wall-web";
import { UserProfileWeb } from "./UserProfile.web";
import { SuccessfulDepositContent } from "./SuccessfulDepositContent/SuccessfulDepositContent.web";
import ConnectedGenericView from "../GenericView";
import { GenericView, GenericViewPlaceholder } from "../GenericView/GenericView.web";
import { ConnectedUserProfileHeader } from "../UserProfileHeader";
import { UserProfile } from "./snowflakes/UserProfile/UserProfile.web";

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors");

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  getPreferences: jest.fn(() => ({
    sportsbookOddsDisplay: "FRACTIONAL",
    quickStakes: [],
    showBalances: true,
  })),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserFirstName: jest.fn().mockReturnValue({
    userdetails: {
      firstName: "Sebastian",
    },
  }),
}));

jest.mock("../../view-model-factories/user-profile", () => ({
  getPropsForUserProfile: jest.fn((onClick) => ({
    menuItems: [
      {
        onClick,
      },
    ],
  })),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/my-account/my-account-selectors", () => ({
  createMyAccountInterfaceStateSelector: jest.fn(),
  createWalletNamesSelector: jest.fn(),
  createWalletSectionsSelector: jest.fn(),
  createQuickLinksSelector: jest.fn(),
  createRewardsCardBySelector: jest.fn(),
  createAccountBannersCardBySelector: jest.fn(),
  createMyAccountViewItemsSelector: jest.fn(),
  createLinksSelector: jest.fn(),
  createBudgetCardBySelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
}));

jest.mock("../../view-model-factories/cash-balances", () => ({
  createPropsForCashBalances: jest.fn(),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Overlay: jest.fn(({ children }) => <overlay-mock>{children}</overlay-mock>),
  MessageBanner: jest.fn(() => <messagebanner-mock></messagebanner-mock>),
}));

jest.mock("./snowflakes/UserProfile/UserProfile.web", () => ({
  UserProfile: jest.fn(() => <userprofile-mock></userprofile-mock>),
}));

jest.mock("../../components/UserProfileHeader", () => ({
  ConnectedUserProfileHeader: jest.fn(() => <connected-userprofile-header-mock></connected-userprofile-header-mock>),
}));

jest.mock("../../components/SettingsPage", () => ({
  SettingsPage: jest.fn(() => <settings-mock></settings-mock>),
}));

jest.mock("react-redux", () => {
  const { useCallback } = jest.requireActual("react-redux");
  const connectMock = jest.fn().mockReturnValue((component) => component);

  return { connect: connectMock, useCallback };
});

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(() => "$10"),
  currencyFormatWithoutDecimalPlaces: jest.fn(() => "$10"),
}));

jest.mock("../GenericView", () => jest.fn(() => <connected-generic-view-mock />));
jest.mock("../GenericView/GenericView.web", () => ({
  GenericView: jest.fn(() => <generic-view-mock />),
  GenericViewPlaceholder: jest.fn(() => <generic-view-placeholder-mock />),
}));
jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn(() => "https://myspendbudget.betfair.com/my-budget?prod=90&showHeader=0"),
  getAuthData: jest.fn().mockReturnValue({ SSO_URL: "ssoUrlMock" }),
}));

jest.mock("./SuccessfulDepositContent/SuccessfulDepositContent.web", () => ({
  SuccessfulDepositContent: jest.fn(() => <successful-deposit-content-mock />),
}));

Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting",
  },
});

const walletsToCallWas = [
  "MAIN",
  "XG",
  "POKER",
  "CASINO_BONUS",
  "ARCADE_BONUS",
  "SPORTSBOOK_BONUS",
  "FROZEN",
  "SPORTSBOOK_BONUS_CASH",
  "EXCHANGE_BONUS_CASH",
  "BOOST_TOKENS",
];

const dispatchPushActionMock = jest.fn();
const dispatchFetchCatalogueActionMock = jest.fn();
const dispatchOnLogoutClickMock = jest.fn();
const dispatchUserProfileMenuEyeIconClickActionMock = jest.fn();
const dispatchOnClickMenuLinkMock = jest.fn();
const dispatchOnClickQuickMenuMock = jest.fn();
const dispatchOnToggleSimpleDetailedViewClickMock = jest.fn();
const dispatchFetchUserWalletsActionMock = jest.fn();
const dispatchOnClickBudgetMock = jest.fn();
const dispatchBetPlacementMock = jest.fn();
const dispatchLoginMock = jest.fn();
const dispatchDepositSuccessfulActionMock = jest.fn();

function renderUserProfileWeb({
  rewards,
  rewardsTitle,
  basicPlan,
  noPlanSelected,
  packageLevelValue,
  groupsMenu = [],
  quickMenuItems = [],
  firstName = "Sebastian",
  lastLoginDate = "2024-11-22T11:08:15.000Z",
  simpleView = [],
  detailedView = [],
  showBalances = true,
  walletsToCallWasService = [],
  currentViewURN = "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  jurisdiction = "INTERNATIONAL",
  balanceToggle = false,
  currentBanner,
  accountBannersCardURN,
  budgetLimit,
  wizardUrl,
  betslipDepositRedirect = {
    isDepositRedirect: false,
    activeProduct: "activeProduct",
    step: "step",
    betId: "betId",
    exchangeMarket: "exchangeMarket",
    exchangeRunner: "exchangeRunner",
  },
  depositSuccessfulLabels = {
    depositSuccessful: "depositSuccessful",
    placingBet: "placingBet",
  },
  isLoggedIn = true,
  userProfileLinks = {
    rewardsLink: "https://myaccount.betfair.com/rewards/my-rewards?prod=90&showHeader=0",
    chooseRewardsLink: "https://myaccount.betfair.com/rewards/my-rewards/choose?prod=90&showHeader=0",
    promosLink: "https://promos.betfair.com/sport?prod=90",
    applePay: "apple_pay_proxy.js",
  },
  dispatchPushAction = dispatchPushActionMock,
  dispatchFetchCatalogueAction = dispatchFetchCatalogueActionMock,
  dispatchUpdateCurrentBannerAction = jest.fn(),
  dispatchBannerActionRequest = jest.fn(),
  dispatchOnLogoutClick = dispatchOnLogoutClickMock,
  dispatchUserProfileMenuEyeIconClickAction = dispatchUserProfileMenuEyeIconClickActionMock,
  dispatchOnClickMenuLink = dispatchOnClickMenuLinkMock,
  dispatchOnClickQuickMenu = dispatchOnClickQuickMenuMock,
  dispatchOnToggleSimpleDetailedViewClick = dispatchOnToggleSimpleDetailedViewClickMock,
  dispatchFetchUserWalletsAction = dispatchFetchUserWalletsActionMock,
  dispatchOnClickBudget = dispatchOnClickBudgetMock,
  dispatchBetPlacement = dispatchBetPlacementMock,
  dispatchLogin = dispatchLoginMock,
  dispatchDepositSuccessfulAction = dispatchDepositSuccessfulActionMock,
} = {}) {
  return render(
    <UserProfileWeb
      rewards={rewards}
      rewardsTitle={rewardsTitle}
      basicPlan={basicPlan}
      noPlanSelected={noPlanSelected}
      packageLevelValue={packageLevelValue}
      groupsMenu={groupsMenu}
      quickMenuItems={quickMenuItems}
      firstName={firstName}
      lastLoginDate={lastLoginDate}
      simpleView={simpleView}
      detailedView={detailedView}
      showBalances={showBalances}
      walletsToCallWasService={walletsToCallWasService}
      currentViewURN={currentViewURN}
      jurisdiction={jurisdiction}
      balanceToggle={balanceToggle}
      currentBanner={currentBanner}
      accountBannersCardURN={accountBannersCardURN}
      budgetLimit={budgetLimit}
      betslipDepositRedirect={betslipDepositRedirect}
      depositSuccessfulLabels={depositSuccessfulLabels}
      isLoggedIn={isLoggedIn}
      wizardUrl={wizardUrl}
      userProfileLinks={userProfileLinks}
      dispatchPushAction={dispatchPushAction}
      dispatchFetchCatalogueAction={dispatchFetchCatalogueAction}
      dispatchUpdateCurrentBannerAction={dispatchUpdateCurrentBannerAction}
      dispatchBannerActionRequest={dispatchBannerActionRequest}
      dispatchOnLogoutClick={dispatchOnLogoutClick}
      dispatchUserProfileMenuEyeIconClickAction={dispatchUserProfileMenuEyeIconClickAction}
      dispatchOnClickMenuLink={dispatchOnClickMenuLink}
      dispatchOnClickQuickMenu={dispatchOnClickQuickMenu}
      dispatchOnToggleSimpleDetailedViewClick={dispatchOnToggleSimpleDetailedViewClick}
      dispatchFetchUserWalletsAction={dispatchFetchUserWalletsAction}
      dispatchOnClickBudget={dispatchOnClickBudget}
      dispatchBetPlacement={dispatchBetPlacement}
      dispatchLogin={dispatchLogin}
      dispatchDepositSuccessfulAction={dispatchDepositSuccessfulAction}
    />,
  );
}

describe("Connected User Profile", () => {
  beforeEach(jest.clearAllMocks);

  describe("when logged out", () => {
    it("should call dispatchLogin with the correct payload", () => {
      const dispatchLogin = jest.fn();

      renderUserProfileWeb({ isLoggedIn: false, dispatchLogin });

      expect(dispatchLogin).toHaveBeenCalledWith("ssoUrlMock&url=https%3A%2F%2Fwww.betfair.com%2Fbetting");
      expect(dispatchLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe("when initializing the component with user profile open", () => {
    let userProfileExpectedProps;

    const onClick = expect.any(Function);
    const onClickQuickMenuLink = expect.any(Function);
    const onClickUserMenuLink = expect.any(Function);
    const onEyeIconClick = expect.any(Function);
    const onNoPlanSelectedClick = expect.any(Function);
    const onRewardsClick = expect.any(Function);
    const onToggleSimpleDetailedViewClick = expect.any(Function);
    const onBudgetLinkClick = expect.any(Function);

    beforeEach(() => {
      jest.clearAllMocks();

      userProfileExpectedProps = {
        basicPlan: undefined,
        detailedViewBalance: [],
        firstName: "Sebastian",
        lastLoginDate: "2024-11-22T11:08:15.000Z",
        groupsMenu: [],
        menuItems: [
          {
            onClick,
          },
        ],
        noPlanSelected: undefined,
        onClickQuickMenuLink,
        onClickUserMenuLink,
        onEyeIconClick,
        onNoPlanSelectedClick,
        onRewardsClick,
        onToggleSimpleDetailedViewClick,
        onBudgetLinkClick,
        packageLevel: undefined,
        quickMenu: [],
        rewards: undefined,
        rewardsTitle: undefined,
        showBalances: true,
        simpleViewBalances: [],
        budgetLimit: undefined,
        budgetTitle: undefined,
        balanceToggle: false,
      };
    });

    it("the fetch user wallets should be dispatched", () => {
      renderUserProfileWeb({ walletsToCallWasService: walletsToCallWas });

      expect(dispatchFetchUserWalletsActionMock).toHaveBeenCalledWith([
        "MAIN",
        "XG",
        "POKER",
        "CASINO_BONUS",
        "ARCADE_BONUS",
        "SPORTSBOOK_BONUS",
        "FROZEN",
        "SPORTSBOOK_BONUS_CASH",
        "EXCHANGE_BONUS_CASH",
        "BOOST_TOKENS",
      ]);
    });

    it("the fetch user wallets should not be dispatched if the wallet is empty", () => {
      renderUserProfileWeb();

      expect(dispatchFetchUserWalletsActionMock).toHaveBeenCalledTimes(0);
    });

    it("should create a user profile overlay component with correct props", () => {
      renderUserProfileWeb();

      expect(UserProfile).toHaveBeenCalledWith(userProfileExpectedProps, undefined);
      expect(UserProfile).toHaveBeenCalledTimes(1);
      expect(Overlay).toHaveBeenCalledTimes(1);
    });

    describe("when wizardUrl is not null", () => {
      it("should redirect to the url", () => {
        global.open = jest.fn();
        renderUserProfileWeb({ wizardUrl: "https://playerprotection.betfair.com/" });

        expect(global.open).toHaveBeenCalledWith("https://playerprotection.betfair.com/", "_top");
      });
    });

    describe("when navigationFrame is equal to settings", () => {
      it("should call the ConnectedSettingsPage with the right props (GenericView)", () => {
        const currentViewURN =
          "ppb:tbd:view:myAccountView:aHR0cHM6Ly93d3cuYmV0ZmFpci5jb20vYmV0dGluZy9iZXR0aW5nL3NldHRpbmdzOnNldHRpbmdzP3Byb2Q9OTAmd2lkdGg9MzIwcHgmc2hvd0hlYWRlcj0w";
        renderUserProfileWeb({ currentViewURN });

        expect(ConnectedGenericView).toHaveBeenCalledWith(
          {
            urn: "ppb:tbd:view:settings:settings",
            component: GenericView,
            placeholder: GenericViewPlaceholder,
          },
          undefined,
        );
        expect(ConnectedGenericView).toHaveBeenCalled();
      });
      it("should dispatch the FetchCatalogueAction action", () => {
        const currentViewURN =
          "ppb:tbd:view:myAccountView:aHR0cHM6Ly93d3cuYmV0ZmFpci5jb20vYmV0dGluZy9iZXR0aW5nL3NldHRpbmdzOnNldHRpbmdzP3Byb2Q9OTAmd2lkdGg9MzIwcHgmc2hvd0hlYWRlcj0w";
        renderUserProfileWeb({ currentViewURN });

        expect(dispatchFetchCatalogueActionMock).toHaveBeenCalledTimes(1);
        expect(dispatchFetchCatalogueActionMock).toHaveBeenCalledWith("ppb:tbd:view:settings:settings");
      });
    });

    it("should dispatch correct action when onClickQuickMenuLink is called", () => {
      renderUserProfileWeb();

      const userProfile = UserProfile.mock.calls[0][0];
      const preventDefault = jest.fn();
      act(() => {
        userProfile.onClickQuickMenuLink({
          preventDefault,
          currentTarget: {
            textContent: "mock_textContent",
            getAttribute: () => "mock_getAttribute",
          },
        });
      });

      expect(dispatchOnClickQuickMenuMock).toHaveBeenCalledWith(
        "mock_textContent",
        "INTERNATIONAL",
        "mock_getAttribute",
      );
      expect(dispatchOnClickQuickMenuMock).toHaveBeenCalledTimes(1);
      expect(preventDefault).toHaveBeenCalled();
    });

    describe("onClickUserMenuLink", () => {
      describe("when target is _self", () => {
        beforeEach(() => {
          renderUserProfileWeb();

          const userProfile = UserProfile.mock.calls[0][0];
          act(() => {
            userProfile.onClickUserMenuLink(
              {
                preventDefault: jest.fn(),
                currentTarget: {
                  getAttribute: () => "_self",
                },
              },
              { viewLink: { viewUrl: "mock_url", viewUrn: "mock_urn" } },
            );
          });
        });

        it("should dispatch correct action when onClickUserMenuLink is called", () => {
          expect(dispatchOnClickMenuLinkMock).toHaveBeenCalledWith("INTERNATIONAL", "", "mock_url");
          expect(dispatchOnClickMenuLinkMock).toHaveBeenCalledTimes(1);
        });

        it("should dispatch a navigation push", () => {
          expect(dispatchPushActionMock).toHaveBeenCalledWith(
            "ppb:tbd:view:myAccountView:bW9ja191cmw=",
            "/navigation/a-bW9ja191cmw=",
          );
        });
      });

      describe("when target is the settings page", () => {
        beforeEach(() => {
          renderUserProfileWeb();

          const userProfile = UserProfile.mock.calls[0][0];
          act(() => {
            userProfile.onClickUserMenuLink(
              {
                preventDefault: jest.fn(),
                currentTarget: {
                  getAttribute: () => "_top",
                },
              },
              {
                viewLink: {
                  viewUrl: "https://newBrandOnCactus.com/settings:settings?moreQueryParams=true",
                  viewUrn: "mock_urn",
                },
              },
            );
          });
        });

        it("should dispatch correct action when onClickUserMenuLink is called", () => {
          expect(dispatchOnClickMenuLinkMock).toHaveBeenCalledWith(
            "INTERNATIONAL",
            "",
            "https://newBrandOnCactus.com/settings:settings?moreQueryParams=true",
          );
          expect(dispatchOnClickMenuLinkMock).toHaveBeenCalledTimes(1);
        });

        it("should dispatch a navigation push", () => {
          expect(dispatchPushActionMock).toHaveBeenCalledWith(
            "ppb:tbd:view:myAccountView:aHR0cHM6Ly9uZXdCcmFuZE9uQ2FjdHVzLmNvbS9zZXR0aW5nczpzZXR0aW5ncz9tb3JlUXVlcnlQYXJhbXM9dHJ1ZQ==",
            "/navigation/a-aHR0cHM6Ly9uZXdCcmFuZE9uQ2FjdHVzLmNvbS9zZXR0aW5nczpzZXR0aW5ncz9tb3JlUXVlcnlQYXJhbXM9dHJ1ZQ==",
          );
        });
      });

      describe("when target neither _self or the settings page", () => {
        beforeEach(() => {
          renderUserProfileWeb();

          const userProfile = UserProfile.mock.calls[0][0];
          act(() => {
            userProfile.onClickUserMenuLink(
              {
                preventDefault: jest.fn(),
                currentTarget: {
                  getAttribute: () => "_top",
                },
              },
              {
                viewLink: {
                  viewUrl: "mock_url",
                  viewUrn: "mock_urn",
                },
              },
            );
          });
        });

        it("should dispatch correct action when onClickUserMenuLink is called", () => {
          expect(dispatchOnClickMenuLinkMock).toHaveBeenCalledWith("INTERNATIONAL", "", "mock_url");
          expect(dispatchOnClickMenuLinkMock).toHaveBeenCalledTimes(1);
        });

        it("should not dispatch a navigation push", () => {
          expect(dispatchPushActionMock).not.toHaveBeenCalled();
        });
      });
    });

    it("should dispatch correct action when onEyeIconClick is called", () => {
      renderUserProfileWeb();

      const userProfile = UserProfile.mock.calls[0][0];
      userProfile.onEyeIconClick();

      expect(dispatchUserProfileMenuEyeIconClickActionMock).toHaveBeenLastCalledWith(false, "INTERNATIONAL");
      expect(dispatchUserProfileMenuEyeIconClickActionMock).toHaveBeenCalledTimes(1);
    });

    it("should dispatch correct action when onToggleSimpleDetailedViewClick is called with toggle on", () => {
      renderUserProfileWeb();

      const userProfile = UserProfile.mock.calls[0][0];
      userProfile.onToggleSimpleDetailedViewClick(true);

      expect(dispatchOnToggleSimpleDetailedViewClickMock).toHaveBeenCalledWith(true, "INTERNATIONAL");
      expect(dispatchOnToggleSimpleDetailedViewClickMock).toHaveBeenCalledTimes(1);
    });

    it("should dispatch correct action when onToggleSimpleDetailedViewClick is called with toggle off", () => {
      renderUserProfileWeb();

      const userProfile = UserProfile.mock.calls[0][0];
      userProfile.onToggleSimpleDetailedViewClick(false);

      expect(dispatchOnToggleSimpleDetailedViewClickMock).toHaveBeenCalledWith(false, "INTERNATIONAL");
      expect(dispatchOnToggleSimpleDetailedViewClickMock).toHaveBeenCalledTimes(1);
    });

    it("should dispatch correct action when onBudgetLinkClick is called", () => {
      renderUserProfileWeb();

      const userProfile = UserProfile.mock.calls[0][0];
      act(() => {
        userProfile.onBudgetLinkClick(
          {
            preventDefault: jest.fn(),
            currentTarget: {
              getAttribute: () => "_self",
            },
          },
          { itemLink: { viewLink: { viewUrl: "mock_url", viewUrn: "mock_urn" } } },
        );
      });

      expect(dispatchOnClickBudgetMock).toHaveBeenCalledWith("mock_url", "INTERNATIONAL");
      expect(dispatchOnClickBudgetMock).toHaveBeenCalledTimes(1);
    });

    it("should render ConnectedUserProfile with close location set to home", () => {
      renderUserProfileWeb();

      const connectedUserProfileHeader = ConnectedUserProfileHeader.mock.calls[0][0];

      expect(connectedUserProfileHeader.closeLocation).toStrictEqual({
        urn: "ppb:tbd:view:generic:home",
        url: "",
        encodedUrl: "cHBiOnRiZDp2aWV3OmdlbmVyaWM6aG9tZSMjIw==",
      });
    });

    it("should render the rewards choose URL in iframe from currentViewURN", () => {
      const currentViewURN =
        "ppb:tbd:view:myAccountView:aHR0cHM6Ly9teWFjY291bnQuYmV0ZmFpci5jb20vcmV3YXJkcy9teS1yZXdhcmRzL2Nob29zZT9wcm9kPTkwJnNob3dIZWFkZXI9MA";
      const { container } = renderUserProfileWeb({ currentViewURN });

      expect(container.querySelector("iframe").src).toBe(
        "https://myaccount.betfair.com/rewards/my-rewards/choose?prod=90&showHeader=0",
      );
    });

    it("should render the rewards URL in iframe from currentViewURN", () => {
      const currentViewURN =
        "ppb:tbd:view:myAccountView:aHR0cHM6Ly9teWFjY291bnQuYmV0ZmFpci5jb20vcmV3YXJkcy9teS1yZXdhcmRzP3Byb2Q9OTAmc2hvd0hlYWRlcj0w";
      const { container } = renderUserProfileWeb({ currentViewURN });

      expect(container.querySelector("iframe").src).toBe(
        "https://myaccount.betfair.com/rewards/my-rewards?prod=90&showHeader=0",
      );
    });

    it("should render the iframe when currentViewURN contains a myAccountView URL", () => {
      const currentViewURN =
        "ppb:tbd:view:myAccountView:aHR0cHM6Ly9teWFjY291bnQuYmV0ZmFpci5jb20vcmV3YXJkcy9teS1yZXdhcmRzL2Nob29zZT9wcm9kPTkwJnNob3dIZWFkZXI9MA";
      const { container } = renderUserProfileWeb({ currentViewURN });

      const iframe = container.querySelector("iframe");
      expect(iframe).not.toBeNull();
    });

    describe("user profile handlers", () => {
      const encodeUrl = (url) => btoa(url).replace(/\+/g, "-").replace(/\//g, "!");

      it("should dispatch pushAction with the rewards URL when onRewardsClick is called", () => {
        const rewardsLink = "https://myaccount.betfair.com/rewards/my-rewards?prod=90&showHeader=0";
        renderUserProfileWeb();

        const userProfile = UserProfile.mock.calls[0][0];
        act(() => {
          userProfile.onRewardsClick();
        });

        const encodedUrl = encodeUrl(rewardsLink);
        expect(dispatchPushActionMock).toHaveBeenCalledWith(
          `ppb:tbd:view:myAccountView:${encodedUrl}`,
          `/navigation/a-${encodedUrl}`,
        );
      });

      it("should dispatch pushAction with the choose rewards URL when onNoPlanSelectedClick is called", () => {
        const chooseRewardsLink = "https://myaccount.betfair.com/rewards/my-rewards/choose?prod=90&showHeader=0";
        renderUserProfileWeb();

        const userProfile = UserProfile.mock.calls[0][0];
        act(() => {
          userProfile.onNoPlanSelectedClick();
        });

        const encodedUrl = encodeUrl(chooseRewardsLink);
        expect(dispatchPushActionMock).toHaveBeenCalledWith(
          `ppb:tbd:view:myAccountView:${encodedUrl}`,
          `/navigation/a-${encodedUrl}`,
        );
      });

      it("should dispatch pushAction with the viewUrl when onClickUserMenuLink is called on a _self target", () => {
        const viewUrl = "https://myaccount.betfair.com/some-menu-link?prod=90";
        renderUserProfileWeb();

        const userProfile = UserProfile.mock.calls[0][0];
        const preventDefault = jest.fn();
        act(() => {
          userProfile.onClickUserMenuLink(
            {
              preventDefault,
              currentTarget: { getAttribute: () => "_self" },
            },
            { viewLink: { viewUrl, viewUrn: "mock_urn" }, text: "menu text" },
          );
        });

        const encodedUrl = encodeUrl(viewUrl);
        expect(preventDefault).toHaveBeenCalled();
        expect(dispatchPushActionMock).toHaveBeenCalledWith(
          `ppb:tbd:view:myAccountView:${encodedUrl}`,
          `/navigation/a-${encodedUrl}`,
        );
      });
    });

    it("should not open the iframe when onClickQuickMenu is called on a non _self target", () => {
      const { container } = renderUserProfileWeb();
      const userProfile = UserProfile.mock.calls[0][0];
      const preventDefault = jest.fn();
      act(() => {
        userProfile.onClickUserMenuLink(
          {
            preventDefault,
            currentTarget: {
              getAttribute: () => "_random-target",
            },
          },
          { viewLink: { viewUrl: "mock_url", viewUrn: "mock_urn" } },
        );
      });

      const iframe = container.querySelector("iframe");
      expect(iframe).toBeNull();
    });
  });

  describe("message event listener", () => {
    describe("language/timezone update events", () => {
      const oldWindowLocation = window.location;
      const currentViewURN =
        "ppb:tbd:view:myAccountView:aHR0cHM6Ly93d3cuYmV0ZmFpci5jb20vYmV0dGluZy9iZXR0aW5nL3NldHRpbmdzOnNldHRpbmdzP3Byb2Q9OTAmd2lkdGg9MzIwcHgmc2hvd0hlYWRlcj0w";

      beforeAll(() => {
        delete window.location;
        window.location = { reload: jest.fn() };
      });

      afterAll(() => {
        window.location = oldWindowLocation;
      });

      describe("if language has changed", () => {
        it("should refresh page", () => {
          renderUserProfileWeb({ currentViewURN });

          act(() => {
            global.dispatchEvent(
              new MessageEvent("message", {
                data: { type: "LANGUAGE.UPDATED", message: "" },
              }),
            );
          });

          expect(window.location.reload).toHaveBeenCalledWith();
        });
      });

      describe("if timezone has changed", () => {
        it("should refresh page", () => {
          renderUserProfileWeb({ currentViewURN });

          act(() => {
            global.dispatchEvent(
              new MessageEvent("message", {
                data: { type: "TIMEZONE.UPDATED", message: "" },
              }),
            );
          });

          expect(window.location.reload).toHaveBeenCalledWith();
        });
      });

      describe("if SGX modal has closed", () => {
        it("should refresh iframe content by changing iframe key", () => {
          const { container } = renderUserProfileWeb({
            currentViewURN:
              "ppb:tbd:view:myAccountView:aHR0cHM6Ly9wbGF5ZXJwcm90ZWN0aW9uLmJldGZhaXIuY29tLz9wcm9kPTkwJnNob3dIZWFkZXI9MA==",
          });
          expect(container.querySelector("iframe").name).toEqual("user-profile-iframe-0");

          act(() => {
            global.dispatchEvent(
              new MessageEvent("message", {
                data: { type: "SGX_MODAL_CLOSE" },
              }),
            );
          });

          expect(container.querySelector("iframe").name).toEqual("user-profile-iframe-1");
        });
      });
    });

    describe("PYW events", () => {
      describe("when a BALANCE_REFRESHED event is listened", () => {
        describe("when walletsToCallWasService is provided", () => {
          it("should fetch wallets page", () => {
            renderUserProfileWeb({ walletsToCallWasService: walletsToCallWas });

            act(() => {
              global.dispatchEvent(
                new MessageEvent("message", {
                  data: { action: "BALANCE_REFRESHED", message: "" },
                  origin: "http://www.betfair.com",
                }),
              );
            });

            expect(dispatchFetchUserWalletsActionMock).toHaveBeenCalledWith([
              "MAIN",
              "XG",
              "POKER",
              "CASINO_BONUS",
              "ARCADE_BONUS",
              "SPORTSBOOK_BONUS",
              "FROZEN",
              "SPORTSBOOK_BONUS_CASH",
              "EXCHANGE_BONUS_CASH",
              "BOOST_TOKENS",
            ]);
          });
        });

        describe("when walletsToCallWasService is not provided", () => {
          it("should not fetch wallets page", () => {
            renderUserProfileWeb();

            act(() => {
              global.dispatchEvent(
                new MessageEvent("message", {
                  data: { action: "BALANCE_REFRESHED", message: "" },
                  origin: "http://www.betfair.com",
                }),
              );
            });

            expect(dispatchFetchUserWalletsActionMock).not.toHaveBeenCalled();
          });
        });
      });

      describe("when a DEPOSIT_SUCCESS event is listened", () => {
        describe("when isDepositRedirect is true", () => {
          const betslipDepositRedirect = {
            isDepositRedirect: true,
            activeProduct: "activeProduct",
            step: "step",
            betId: "betId",
            exchangeMarket: "exchangeMarket",
            exchangeRunner: "exchangeRunner",
          };

          it("should call dispatchBetPlacement", () => {
            renderUserProfileWeb({ betslipDepositRedirect });

            act(() => {
              global.dispatchEvent(
                new MessageEvent("message", {
                  data: { action: "DEPOSIT_SUCCESS", message: "" },
                  origin: "http://www.betfair.com",
                }),
              );
            });

            expect(dispatchBetPlacementMock).toHaveBeenCalledWith(betslipDepositRedirect);
          });

          it("should call SuccessfulDepositContent", () => {
            renderUserProfileWeb({ betslipDepositRedirect });

            act(() => {
              global.dispatchEvent(
                new MessageEvent("message", {
                  data: { action: "DEPOSIT_SUCCESS", message: "" },
                  origin: "http://www.betfair.com",
                }),
              );
            });

            expect(SuccessfulDepositContent).toHaveBeenCalledWith(
              {
                depositSuccessful: "depositSuccessful",
                placingBet: "placingBet",
              },
              undefined,
            );
          });

          describe("when the document.referrer is not an empty string", () => {
            it("should call dispatchDepositSuccessfulAction with the document.referrer", () => {
              jest.spyOn(document, "referrer", "get").mockReturnValueOnce("http://referrer.com");

              renderUserProfileWeb({ betslipDepositRedirect });

              act(() => {
                global.dispatchEvent(
                  new MessageEvent("message", {
                    data: { action: "DEPOSIT_SUCCESS", message: "" },
                    origin: "http://www.betfair.com",
                  }),
                );
              });

              expect(dispatchDepositSuccessfulActionMock).toHaveBeenCalledWith(
                {
                  action: "DEPOSIT_SUCCESS",
                  message: "",
                },
                "http://referrer.com",
              );
            });
          });

          describe("when the document.referrer is an empty string", () => {
            it("should call dispatchDepositSuccessfulAction with the document.location.host", () => {
              jest.spyOn(document, "referrer", "get").mockReturnValueOnce("");

              renderUserProfileWeb({ betslipDepositRedirect });

              act(() => {
                global.dispatchEvent(
                  new MessageEvent("message", {
                    data: { action: "DEPOSIT_SUCCESS", message: "" },
                    origin: "http://www.betfair.com",
                  }),
                );
              });

              expect(dispatchDepositSuccessfulActionMock).toHaveBeenCalledWith(
                {
                  action: "DEPOSIT_SUCCESS",
                  message: "",
                },
                "localhost",
              );
            });
          });

          describe("when the successful deposit content is dismissed", () => {
            beforeEach(() => {
              jest.useFakeTimers();
            });

            afterEach(() => {
              jest.useRealTimers();
            });

            it("should call dispatchPushAction", () => {
              renderUserProfileWeb({ betslipDepositRedirect });

              act(() => {
                global.dispatchEvent(
                  new MessageEvent("message", {
                    data: { action: "DEPOSIT_SUCCESS", message: "" },
                    origin: "http://www.betfair.com",
                  }),
                );

                jest.advanceTimersByTime(3000);
              });

              expect(dispatchPushActionMock).toHaveBeenCalledWith("ppb:tbd:view:generic:home", "");
            });
          });
        });

        describe("when isDepositRedirect is false", () => {
          it("should not call dispatchBetPlacement nor dispatchDepositSuccessfulAction", () => {
            renderUserProfileWeb();

            act(() => {
              global.dispatchEvent(
                new MessageEvent("message", {
                  data: { action: "DEPOSIT_SUCCESS", message: "" },
                  origin: "http://www.betfair.com",
                }),
              );
            });

            expect(dispatchBetPlacementMock).not.toHaveBeenCalled();
            expect(dispatchDepositSuccessfulActionMock).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe("when onLogoutClick is called", () => {
    it("should dispatch the correct action", () => {
      renderUserProfileWeb({ walletsToCallWasService: walletsToCallWas });

      const { menuItems } = UserProfile.mock.calls[0][0];
      const { onClick } = menuItems[0];
      onClick();

      expect(dispatchOnLogoutClickMock).toHaveBeenCalledWith();
    });
  });

  describe("when loading component", () => {
    it("should add the apple pay proxy script to the DOM body", () => {
      renderUserProfileWeb({ walletsToCallWasService: walletsToCallWas });

      expect(document.body.getElementsByTagName("script")[0].attributes.getNamedItem("src").value).toContain(
        "apple_pay_proxy.js",
      );
    });
  });

  describe("accountBanners", () => {
    const currentBanner = {
      bannerInfo: {
        title: "Verify Number",
        bodyContent: {
          text: "Did you know you can enhance the security of your account by verifying your phone number?",
          items: null,
          formContent: null,
          contactUsInfo: null,
        },
      },
      minimizedBannerInfo: {
        bodyText: "Did you know you can enhance the security of your account by verifying your phone number?",
      },
      bannerActions: [
        {
          label: "Verify Number",
          gaLabel: null,
          minimizedLabel: "Verify Number",
          type: "button",
          buttonType: "PRIMARY",
          path: "/accountdetails/mydetails?shouldVerifyPhone=true",
          url: "https://myaccount.nxt.internal:443/accountdetails/mydetails?shouldVerifyPhone=true&flow=tbd",
          target: "_top",
          action: null,
          data: null,
          actionFinalize: {
            onErrorBanner: null,
          },
        },
      ],
      isMinimized: true,
      priority: "4120",
      useCase: "DEFAULT",
      flow: "TBD",
      template: null,
      attentionLevel: "WARNING",
      maxDisplays: null,
      version: null,
      isClosable: true,
      bannerType: "phone",
    };

    const messageBannerExpectedProps = {
      attentionLevel: "WARNING",
      bannerActions: [
        {
          action: null,
          actionFinalize: { onErrorBanner: null },
          buttonType: "PRIMARY",
          data: null,
          gaLabel: null,
          label: "Verify Number",
          minimizedLabel: "Verify Number",
          path: "/accountdetails/mydetails?shouldVerifyPhone=true",
          target: "_top",
          type: "button",
          url: "https://myaccount.nxt.internal:443/accountdetails/mydetails?shouldVerifyPhone=true&flow=tbd",
        },
      ],
      isClosable: true,
      isCollapsed: false,
      items: [],
      onBannerButtonClick: expect.any(Function),
      onBannerClose: expect.any(Function),
      text: "Did you know you can enhance the security of your account by verifying your phone number?",
      title: "Verify Number",
    };

    it("should render MessageBanner when there are banners", () => {
      renderUserProfileWeb({
        firstName: "Viorel",
        currentViewURN: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
        currentBanner,
      });

      expect(MessageBanner).toHaveBeenCalledWith(messageBannerExpectedProps, undefined);
      expect(MessageBanner).toHaveBeenCalledTimes(1);
    });
  });
});
