import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { QuickStakes } from "@ppb/the-wall-web";
import { ObbPlace } from "./ObbPlace.web";
import { FooterCustomKeyboard } from "../Keyboard/FooterCustomKeyboard.web";
import { SportsbookPlacePanel } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.web";

import { ConfigContextProvider } from "../../Config/ConfigContext";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(() => ({
    current: null,
  })),
  useContext: jest.fn(() => ({
    setFocusedKeyboardControls: jest.fn(),
    focusedKeyboardControls: {
      focusedInputId: null,
      focusedInputRef: null,
      focusedTargetRef: null,
    },
    isDesktopLayout: false,
  })),
}));

jest.mock("../../../hooks/useRefContext", () => ({
  useRefContext: jest.fn(() => []),
}));

jest.mock("../betslip-deposit-redirect-mapper", () => ({
  buildDepositRedirectPayload: jest.fn(() => ({ viewUrn: "viewUrn", viewUrl: "viewUrl" })),
}));

jest.mock("../ObbNotifier", () => jest.fn().mockReturnValue(<connected-obb-notifier-mock />));

global.window = Object.create(window);
Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting",
  },
});

jest.mock("@ppb/the-wall-web", () => ({
  BetsSummary: jest.fn(() => <secondary-button-mock />),
  PrimaryButton: jest.fn(({ children, ...props }) => <primary-button-mock {...props}>{children}</primary-button-mock>),
  Collapse: jest.fn(({ children, ...props }) => <collapse-mock {...props}>{children}</collapse-mock>),
  MarketBlurbs: jest.fn(() => <market-blurbs-mock />),
  QuickStakes: jest.fn(() => <quick-stakes-mock />),
}));

jest.mock("../Keyboard/FooterCustomKeyboard.web", () => ({
  FooterCustomKeyboard: jest.fn(() => <footer-custom-keyboard-mock />),
}));

jest.mock("../ObbSingle", () => jest.fn(({ props }) => <connected-obb-single-mock {...props} />));

jest.mock("../../../config/endpoints", () => ({
  getAuthData: () => ({ SSO_URL: "SSO_URL" }),
}));

jest.mock("../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.web", () => ({
  SportsbookPlacePanel: jest.fn(({ footerPrefix, children, ...props }) => (
    <sportsbook-place-panel-mock {...props}>{footerPrefix || children}</sportsbook-place-panel-mock>
  )),
}));

const DEFAULT_PROPS = {
  i18n: {
    balanceAfterBet: "balanceAfterBetLabel",
    totalReturns: "totalReturnsLabel",
    removeLabel: "removeLabel",
    freeBetsLabel: "freeBetsLabel",
    freeBetsAlertRemoveLabel: "freeBetsAlertRemoveLabel",
    termsLabel: "termsLabel",
    termsLinkLabel: "termsLinkLabel",
    operatorRegulation: "operatorRegulationLabel",
    voidBlurbText: "voidBlurbText",
    multiples: "",
    additionalMultiples: "",
    singles: "singles",
    casts: "",
    oddsLabel: "oddsLabel",
    stakeLabel: "stakeLabel",
    oddsMovementUp: "",
    oddsMovementDown: "",
    eachWay: "",
    eachWaySubtitle: "",
    betBuilder: "betBuilder",
    multiBetBuilder: "s",
    priceBoosts: "",
  },
  totalReturns: "€100",
  isPanelDisabled: false,
  isPlaceDisabled: false,
  hasError: false,
  isDepositRequired: false,
  isLoggedIn: true,
  quickStakes: "10",
  separator: "€",
  placeBtnLabel: "placeBtnLabel",
  placeBtnSecondaryLabel: "placeBtnSecondaryLabel",
  placeBtnLoadingLabel: "placeBtnLoadingLabel",
  reversePlaceBtnLabels: false,
  balanceAfterBet: "balanceAfterBet",
  singles: ["1", "2"],
  multiplesGroups: [["3"]],
  termsUrl: "some_terms-url",
  hasMarketBlurbs: true,
  dispatchOnRemoveAllClick: jest.fn(),
  dispatchOnPlaceBetsClick: jest.fn(),
  dispatchRedirectToLogin: jest.fn(),
  dispatchDepositRedirect: jest.fn(),
  dispatchNavigate: jest.fn(),
  dispatchIncrementPress: jest.fn(),
};

function renderObbPlace(props, value = { isDesktopLayout: false }) {
  const componentProps = { ...DEFAULT_PROPS, ...props };

  return render(
    <ConfigContextProvider value={value}>
      <ObbPlace {...componentProps} />
    </ConfigContextProvider>,
  );
}

describe("ObbPlace", () => {
  afterEach(jest.clearAllMocks);

  it("should render Obb Place correctly", () => {
    renderObbPlace({});
    expect(SportsbookPlacePanel).toHaveBeenCalledWith(
      {
        balanceAfterBet: "balanceAfterBet",
        betslipCards: expect.any(Object),
        hasPlaceError: false,
        i18n: {
          additionalMultiples: "",
          balanceAfterBet: "balanceAfterBetLabel",
          betBuilder: "betBuilder",
          casts: "",
          eachWay: "",
          eachWaySubtitle: "",
          freeBetsAlertRemoveLabel: "freeBetsAlertRemoveLabel",
          freeBetsLabel: "freeBetsLabel",
          multiBetBuilder: "s",
          multiples: "",
          oddsLabel: "oddsLabel",
          oddsMovementDown: "",
          oddsMovementUp: "",
          operatorRegulation: "operatorRegulationLabel",
          priceBoosts: "",
          removeLabel: "removeLabel",
          singles: "singles",
          stakeLabel: "stakeLabel",
          termsLabel: "termsLabel",
          termsLinkLabel: "termsLinkLabel",
          totalReturns: "totalReturnsLabel",
          voidBlurbText: "voidBlurbText",
        },
        isDesktop: false,
        isLoggedIn: true,
        isPanelDisabled: false,
        isPlaceDisabled: false,
        isSummaryDisabled: false,
        notifications: expect.anything(),
        footerPrefix: expect.anything(),
        onCollapseToggle: undefined,
        onPlaceClick: expect.any(Function),
        onRemoveAllClick: expect.any(Function),
        placeBtnLabel: "placeBtnLabel",
        placeBtnLoadingLabel: "placeBtnLoadingLabel",
        placeBtnSecondaryLabel: "placeBtnSecondaryLabel",
        reversePlaceBtnLabels: false,
        totalReturns: "€100",
        termsUrl: "some_terms-url",
        hasMarketBlurbs: true,
        isOddsMovementOn: false,
        oddsMovementLabels: { message: "", detailMessage: "" },
        onOddsMovementPreferencesChange: expect.any(Function),
        showAcceptOddsMovementAlert: false,
      },
      undefined,
    );
  });

  describe("footerPrefix", () => {
    it("should render the correct footerPrefix component", () => {
      renderObbPlace({
        quickStakes: <QuickStakes />,
        separator: "£",
        isPanelDisabled: false,
      });

      expect(FooterCustomKeyboard).toHaveBeenCalledTimes(1);

      expect(FooterCustomKeyboard).toHaveBeenCalledWith(
        expect.objectContaining({
          prefix: expect.any(Object),
          separator: "£",
          isDisabled: false,
        }),
        undefined,
      );
    });
  });

  describe("actions", () => {
    describe("dispatchOnRemoveAllClick", () => {
      const mockDispatchOnRemoveAllClick = jest.fn();

      it("should dispatch `dispatchOnRemoveAllClick`", () => {
        renderObbPlace({
          dispatchOnRemoveAllClick: mockDispatchOnRemoveAllClick,
        });

        SportsbookPlacePanel.mock.calls[0][0].onRemoveAllClick();

        expect(mockDispatchOnRemoveAllClick).toHaveBeenCalled();
      });
    });

    describe("handlePlaceClick", () => {
      const mockDispatchDepositRedirect = jest.fn();
      const mockDispatchOnPlaceBetsClick = jest.fn();
      const mockDispatchRedirectToLogin = jest.fn();
      const mockDispatchNavigate = jest.fn();

      describe("when user isn't authenticated", () => {
        it("should dispatch dispatchRedirectToLogin action onPlaceClick", () => {
          renderObbPlace({
            isLoggedIn: false,
            dispatchDepositRedirect: mockDispatchDepositRedirect,
            dispatchOnPlaceBetsClick: mockDispatchOnPlaceBetsClick,
            dispatchRedirectToLogin: mockDispatchRedirectToLogin,
            dispatchNavigate: mockDispatchNavigate,
          });

          SportsbookPlacePanel.mock.calls[0][0].onPlaceClick();

          expect(mockDispatchRedirectToLogin).toHaveBeenCalledWith(
            "SSO_URL&url=https%3A%2F%2Fwww.betfair.com%2Fbetting",
          );
          expect(mockDispatchDepositRedirect).not.toHaveBeenCalled();
          expect(mockDispatchOnPlaceBetsClick).not.toHaveBeenCalled();
          expect(mockDispatchNavigate).not.toHaveBeenCalled();
        });
      });

      describe("when the user is authenticated", () => {
        describe("and has insufficient funds", () => {
          it("should dispatch both dispatchDepositRedirect and dispatchNavigate onPlaceClick", () => {
            renderObbPlace({
              isDepositRequired: true,
              dispatchDepositRedirect: mockDispatchDepositRedirect,
              dispatchOnPlaceBetsClick: mockDispatchOnPlaceBetsClick,
              dispatchRedirectToLogin: mockDispatchRedirectToLogin,
              dispatchNavigate: mockDispatchNavigate,
            });

            SportsbookPlacePanel.mock.calls[0][0].onPlaceClick();

            expect(mockDispatchRedirectToLogin).not.toHaveBeenCalled();
            expect(mockDispatchDepositRedirect).toHaveBeenCalled();
            expect(mockDispatchOnPlaceBetsClick).not.toHaveBeenCalled();
            expect(mockDispatchNavigate).toHaveBeenCalledWith("viewUrn", "viewUrl");
          });
        });

        describe("when the user has funds to bet", () => {
          it("should dispatch dispatchDepositRedirect onPlaceClick", () => {
            renderObbPlace({
              dispatchDepositRedirect: mockDispatchDepositRedirect,
              dispatchOnPlaceBetsClick: mockDispatchOnPlaceBetsClick,
              dispatchRedirectToLogin: mockDispatchRedirectToLogin,
              dispatchNavigate: mockDispatchNavigate,
            });

            SportsbookPlacePanel.mock.calls[0][0].onPlaceClick();

            expect(mockDispatchRedirectToLogin).not.toHaveBeenCalled();
            expect(mockDispatchDepositRedirect).not.toHaveBeenCalled();
            expect(mockDispatchOnPlaceBetsClick).toHaveBeenCalled();
            expect(mockDispatchNavigate).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe("onCollapseToggle", () => {
      it("should call dispatchAccordionToggle", () => {
        const dispatchAccordionToggle = jest.fn();
        renderObbPlace({ dispatchAccordionToggle });

        SportsbookPlacePanel.mock.calls[0][0].onCollapseToggle();

        expect(dispatchAccordionToggle).toHaveBeenCalledWith();
        expect(dispatchAccordionToggle).toHaveBeenCalledTimes(1);
      });
    });
  });
});
