import { render } from "@testing-library/react-native";

import { QuickStakes } from "@ppb/the-wall-native";
import { ObbPlace } from "./ObbPlace.native";
import { FooterCustomKeyboard } from "../Keyboard/FooterCustomKeyboard.native";
import { SportsbookPlacePanel } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.native";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
}));

const mockLogin = jest.fn();
jest.mock("../../../hooks/useLoginWithPendingState.native", () => ({
  __esModule: true,
  default: jest.fn(() => mockLogin),
}));

jest.mock("@ppb/the-wall-native", () => ({
  QuickStakes: jest.fn(() => <quick-stakes-mock />),
  KeyboardAwareScrollView: jest.fn(({ props, children }) => (
    <keyboard-aware-scroll-view-mock {...props}>{children}</keyboard-aware-scroll-view-mock>
  )),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("../Keyboard/FooterCustomKeyboard.native", () => ({
  FooterCustomKeyboard: jest.fn(() => <footer-custom-keyboard-mock />),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigateDeposit: jest.fn(),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../../../config/endpoints");

jest.mock("../ObbSingle", () => jest.fn(({ props }) => <connected-obb-single-mock {...props} />));
jest.mock("../ObbSingle/ObbSingle.native", () => ({
  ObbSingle: jest.fn(({ props }) => <obb-single-mock {...props} />),
}));

jest.mock("../ObbNotifier", () => jest.fn(({ props }) => <connected-obb-notifier-mock {...props} />));

jest.mock("../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.native", () => ({
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
  termsUrl: "some-terms-url",
  dispatchOnRemoveAllClick: jest.fn(),
  dispatchOnPlaceBetsClick: jest.fn(),
  dispatchRedirectToLogin: jest.fn(),
  dispatchDepositRedirect: jest.fn(),
  dispatchNavigate: jest.fn(),
  dispatchIncrementPress: jest.fn(),
  onCollapseToggle: jest.fn(),
  onPlaceClick: jest.fn(),
};

function renderObbPlace(props = {}) {
  const componentProps = { ...DEFAULT_PROPS, ...props };

  return render(<ObbPlace {...componentProps} />);
}

describe("ObbPlace", () => {
  afterEach(jest.clearAllMocks);

  it("should render ObbPlace", () => {
    renderObbPlace();

    expect(SportsbookPlacePanel).toHaveBeenCalledWith(
      {
        balanceAfterBet: "balanceAfterBet",
        betslipCards: expect.any(Object),
        footerPrefix: expect.anything(),
        hasPlaceError: false,
        i18n: {
          balanceAfterBet: "balanceAfterBetLabel",
          totalReturns: "totalReturnsLabel",
          removeLabel: "removeLabel",
          freeBetsLabel: "freeBetsLabel",
          freeBetsAlertRemoveLabel: "freeBetsAlertRemoveLabel",
          termsLabel: "termsLabel",
          termsLinkLabel: "termsLinkLabel",
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
        isLoggedIn: true,
        isPanelDisabled: false,
        isPlaceDisabled: false,
        isSummaryDisabled: false,
        showAcceptOddsMovementAlert: false,
        isOddsMovementOn: false,
        oddsMovementLabels: { message: "", detailMessage: "" },
        placeBtnLabel: "placeBtnLabel",
        placeBtnLoadingLabel: "placeBtnLoadingLabel",
        placeBtnSecondaryLabel: "placeBtnSecondaryLabel",
        reversePlaceBtnLabels: false,
        totalReturns: "€100",
        termsUrl: "some-terms-url",
        hasMarketBlurbs: true,
        notifications: expect.anything(),
        onPlaceClick: expect.any(Function),
        onRemoveAllClick: expect.any(Function),
        onOddsMovementPreferencesChange: expect.any(Function),
      },
      undefined,
    );
  });

  describe("footerPrefix", () => {
    it("should render the correct footerPrefix component", () => {
      renderObbPlace({
        quickStakes: <QuickStakes />,
        separator: ",",
        isPanelDisabled: false,
      });

      expect(FooterCustomKeyboard).toHaveBeenCalledTimes(1);

      expect(FooterCustomKeyboard).toHaveBeenCalledWith(
        expect.objectContaining({
          prefix: expect.any(Object),
          isDisabled: false,
          id: "id",
        }),
        undefined,
      );
    });
  });

  describe("actions", () => {
    describe("dispatchOnRemoveAllClick", () => {
      const mockDispatchOnRemoveAllClick = jest.fn();

      it("should dispatch `dispatchOnRemoveAllClick` onRemoveAllClick", () => {
        renderObbPlace({
          isPanelDisabled: false,
          dispatchOnRemoveAllClick: mockDispatchOnRemoveAllClick,
        });

        SportsbookPlacePanel.mock.calls[0][0].onRemoveAllClick();

        expect(mockDispatchOnRemoveAllClick).toHaveBeenCalled();
      });
    });

    describe("handlePlaceClick", () => {
      const mockDispatchDepositRedirect = jest.fn();
      const mockDispatchOnPlaceBetsClick = jest.fn();

      beforeEach(() => {
        mockLogin.mockClear();
      });

      describe("when user isn't authenticated", () => {
        it("should dispatch login action onPlaceClick", () => {
          renderObbPlace({
            isLoggedIn: false,
            dispatchDepositRedirect: mockDispatchDepositRedirect,
            dispatchOnPlaceBetsClick: mockDispatchOnPlaceBetsClick,
          });

          SportsbookPlacePanel.mock.calls[0][0].onPlaceClick();

          expect(mockLogin).toHaveBeenCalled();
          expect(mockDispatchDepositRedirect).not.toHaveBeenCalled();
          expect(mockDispatchOnPlaceBetsClick).not.toHaveBeenCalled();
        });
      });

      describe("when the user is authenticated", () => {
        describe("and has insufficient funds", () => {
          it("should dispatch dispatchDepositRedirect onPlaceClick", () => {
            renderObbPlace({
              isDepositRequired: true,
              dispatchDepositRedirect: mockDispatchDepositRedirect,
              dispatchOnPlaceBetsClick: mockDispatchOnPlaceBetsClick,
            });

            SportsbookPlacePanel.mock.calls[0][0].onPlaceClick();

            expect(mockLogin).not.toHaveBeenCalled();
            expect(mockDispatchDepositRedirect).toHaveBeenCalled();
            expect(mockDispatchOnPlaceBetsClick).not.toHaveBeenCalled();
          });
        });

        describe("when the user has funds to bet", () => {
          it("should dispatch dispatchDepositRedirect onPlaceClick", () => {
            renderObbPlace({
              dispatchDepositRedirect: mockDispatchDepositRedirect,
              dispatchOnPlaceBetsClick: mockDispatchOnPlaceBetsClick,
            });

            SportsbookPlacePanel.mock.calls[0][0].onPlaceClick();

            expect(mockLogin).not.toHaveBeenCalled();
            expect(mockDispatchDepositRedirect).not.toHaveBeenCalled();
            expect(mockDispatchOnPlaceBetsClick).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
