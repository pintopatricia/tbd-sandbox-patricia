import { useContext } from "react";
import { Text, DeviceEventEmitter } from "react-native";
import { render, fireEvent, act } from "@testing-library/react-native";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AlertType } from "@ppb/the-wall-common/types";
import { SystemIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";

import {
  FreeBets,
  BetsSummary,
  PrimaryButton,
  SecondaryButton,
  Alert,
  SCROLL_INTO_KEYBOARD_EVENT_NAME,
} from "@ppb/the-wall-native";

import { JurisdictionalOperatorInfo } from "../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.native";

import { PLACE_FOOTER, PLACE_FOOTER_REMOVE_ALL_BUTTON } from "./PlaceFooter.native.selectors";
import { PlaceFooter } from "./PlaceFooter.native";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));
jest.mock("react-native-svg", () => ({ SvgCssUri: jest.fn(() => <svg-css-uri-mock />) }));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(({ props }) => <generic-icon-mock {...props} />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  FreeBets: jest.fn(() => <free-bets-mock />),
  BetsSummary: jest.fn(() => <bets-summary-mock />),
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
  KeyboardAwareScrollView: jest.fn(({ children }) => (
    <keyboard-aware-scroll-view-mock>{children}</keyboard-aware-scroll-view-mock>
  )),
  Alerts: jest.fn(() => <alerts-mock />),
  Alert: jest.fn(() => <alert-mock />),
  SCROLL_INTO_KEYBOARD_EVENT_NAME: "SCROLL_INTO_KEYBOARD_EVENT_NAME",
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    PlaceFooterIconDisableColour: "PlaceFooterIconDisableColour",
    PlaceFooterIconDefaultColour: "PlaceFooterIconDefaultColour",
  },
}));

jest.mock("../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.native", () => ({
  JurisdictionalOperatorInfo: jest.fn(() => <jurisdictional-operator-info-mock />),
}));

const i18nMock = {
  balanceAfterBet: "Balance After Bet",
  totalReturns: "totalReturns",
  removeLabel: "removeLabel",
  freeBetsLabel: "freeBets",
  freeBetsAlertRemoveLabel: "Remove",
  termsLabel: "termsLabel",
  termsLinkLabel: "termsLinkLabel",
};

const renderSportsbookPlacePanel = ({
  i18n = i18nMock,
  isPanelDisabled,
  isPlaceDisabled,
  notifications = <notifications-mock testId="notification-mock" />,
  footerPrefix = <Text>footer-prefix</Text>,
  termsUrl,
  hasFreeBets,
  isOddsMovementOn = false,
  oddsMovementLabels = { message: "", detailMessage: "" },
  isFreeBetsSelected,
  isFreeBetsDisabled = false,
  freeBetsAlertMessage,
  isSummaryDisabled,
  balanceAfterBet,
  totalReturns,
  totalOriginalReturns,
  isOddsBoosted = false,
  hasCTALoading = true,
  hasPlaceError,
  placeBtnLabel,
  placeBtnSecondaryLabel,
  placeBtnLoadingLabel,
  reversePlaceBtnLabels = false,
  isLoggedIn = false,
  secondaryButton,
  onFreeBetsChange,
  onFreeBetsRemovePress,
  onRemoveAllPress,
  onPlacePress,
  onOddsMovementPreferencesChange = jest.fn(),
} = {}) =>
  render(
    <PlaceFooter
      footerPrefix={footerPrefix}
      hasCTALoading={hasCTALoading}
      hasFreeBets={hasFreeBets}
      hasPlaceError={hasPlaceError}
      i18n={i18n}
      isFreeBetsSelected={isFreeBetsSelected}
      isFreeBetsDisabled={isFreeBetsDisabled}
      isOddsBoosted={isOddsBoosted}
      isPanelDisabled={isPanelDisabled}
      isPlaceDisabled={isPlaceDisabled}
      isSummaryDisabled={isSummaryDisabled}
      notifications={notifications}
      placeBtnLabel={placeBtnLabel}
      totalOriginalReturns={totalOriginalReturns}
      totalReturns={totalReturns}
      termsUrl={termsUrl}
      freeBetsAlertMessage={freeBetsAlertMessage}
      secondaryButton={secondaryButton}
      isOddsMovementOn={isOddsMovementOn}
      oddsMovementLabels={oddsMovementLabels}
      isLoggedIn={isLoggedIn}
      placeBtnSecondaryLabel={placeBtnSecondaryLabel}
      placeBtnLoadingLabel={placeBtnLoadingLabel}
      reversePlaceBtnLabels={reversePlaceBtnLabels}
      balanceAfterBet={balanceAfterBet}
      onFreeBetsRemovePress={onFreeBetsRemovePress}
      onFreeBetsChange={onFreeBetsChange}
      onPlacePress={onPlacePress}
      onRemoveAllPress={onRemoveAllPress}
      onOddsMovementPreferencesChange={onOddsMovementPreferencesChange}
    />,
  );

describe("PlaceFooter", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render the component", () => {
    const mockFocusedTargetRef = {
      current: {
        something: "nice",
      },
    };
    useContext.mockImplementation(() => ({
      focusedKeyboardControls: {
        focusedTargetRef: mockFocusedTargetRef,
      },
    }));
    const selectors = renderSportsbookPlacePanel({});
    const component = selectors.queryByTestId(PLACE_FOOTER);

    expect(component).not.toBeNull();
  });

  it("should render the JurisdictionalOperatorInfo component", () => {
    renderSportsbookPlacePanel();
    expect(JurisdictionalOperatorInfo).toHaveBeenCalled();
  });

  describe("when is not bet confirmation step", () => {
    describe("and focusedTargetRef is populated", () => {
      it("should emit SCROLL_EVENT_NAME", () => {
        const mockFocusedTargetRef = {
          current: {
            something: "nice",
          },
        };
        useContext.mockImplementation(() => ({
          focusedKeyboardControls: {
            focusedTargetRef: mockFocusedTargetRef,
          },
          isBetConfirmationStep: false,
        }));
        jest.spyOn(DeviceEventEmitter, "emit");
        const { getByTestId } = renderSportsbookPlacePanel({});

        const {
          props: { onLayout },
        } = getByTestId(PLACE_FOOTER);

        act(() => onLayout());

        expect(DeviceEventEmitter.emit).toHaveBeenCalledWith(
          SCROLL_INTO_KEYBOARD_EVENT_NAME,
          mockFocusedTargetRef?.current,
        );
      });
    });
  });

  describe("when is bet confirmation step", () => {
    describe("and focusedTargetRef is populated", () => {
      it("shouldn't emit SCROLL_EVENT_NAME", () => {
        const mockFocusedTargetRef = {
          current: {
            something: "nice",
          },
        };
        useContext.mockImplementation(() => ({
          focusedKeyboardControls: {
            focusedTargetRef: mockFocusedTargetRef,
          },
          isBetConfirmationStep: true,
        }));
        jest.spyOn(DeviceEventEmitter, "emit");
        const { getByTestId } = renderSportsbookPlacePanel({});

        const {
          props: { onLayout },
        } = getByTestId(PLACE_FOOTER);

        act(() => onLayout());

        expect(DeviceEventEmitter.emit).not.toHaveBeenCalledWith(
          SCROLL_INTO_KEYBOARD_EVENT_NAME,
          mockFocusedTargetRef?.current,
        );
      });
    });
  });

  describe("free bets", () => {
    describe("when the PlaceFooter is rendered", () => {
      it("should not render free bets by default", () => {
        renderSportsbookPlacePanel();
        expect(FreeBets).toHaveBeenCalledTimes(0);
      });
    });

    describe("when there are no free bets", () => {
      it("should not render free bets", () => {
        renderSportsbookPlacePanel({ hasFreeBets: false });
        expect(FreeBets).toHaveBeenCalledTimes(0);
      });
    });

    describe("when there are free bets", () => {
      it("should render free bets", () => {
        const props = {
          hasFreeBets: true,
          i18n: {
            freeBetsLabel: "freeBets",
          },
          isFreeBetsSelected: true,
          onFreeBetsChange: jest.fn(),
        };

        renderSportsbookPlacePanel(props);

        expect(FreeBets).toHaveBeenCalledTimes(1);
        expect(FreeBets).toHaveBeenCalledWith(
          {
            label: props.i18n.freeBetsLabel,
            isSelected: props.isFreeBetsSelected,
            onFreeBetsChange: props.onFreeBetsChange,
            disabled: false,
          },
          undefined,
        );
      });

      describe("and the panel is disabled", () => {
        it("should render the FreeBets disabled", () => {
          const onFreeBetsChange = jest.fn();

          renderSportsbookPlacePanel({
            isPanelDisabled: true,
            hasFreeBets: true,
            isFreeBetsSelected: false,
            onFreeBetsChange,
          });

          expect(FreeBets.mock.calls[0][0]).toEqual({
            label: "freeBets",
            isSelected: false,
            disabled: true,
            onFreeBetsChange,
          });
        });
      });

      describe("and FreeBets is disabled directly", () => {
        it("should render the FreeBets disabled", () => {
          const onFreeBetsChange = jest.fn();

          renderSportsbookPlacePanel({
            isFreeBetsDisabled: true,
            hasFreeBets: true,
            isFreeBetsSelected: false,
            onFreeBetsChange,
          });

          expect(FreeBets.mock.calls[0][0]).toEqual({
            label: "freeBets",
            isSelected: false,
            disabled: true,
            onFreeBetsChange,
          });
        });
      });
    });
  });

  describe("Free Bets Wallets", () => {
    describe("when freeBetsAlertMessage is not available", () => {
      it("should not render the Alert component", () => {
        renderSportsbookPlacePanel({ freeBetsAlertMessage: "" });

        expect(Alert).not.toHaveBeenCalled();
      });
    });

    describe("when freeBetsAlertMessage is available", () => {
      it("should render the Alert component", () => {
        renderSportsbookPlacePanel({
          freeBetsAlertMessage: "Includes £5.00 in Free Bets",
          onFreeBetsRemovePress: () => {},
        });

        expect(Alert).toHaveBeenCalledWith(
          {
            message: "Includes £5.00 in Free Bets",
            type: AlertType.Generosity,
            showCloseIcon: false,
            dismissLabel: "Remove",
            onClose: expect.any(Function),
            iconOverload: "Value--Free-Bet",
          },
          undefined,
        );
      });
    });
  });

  describe("footerPrefix", () => {
    it("should display the footerPrefixes render prop", () => {
      const { getByText } = renderSportsbookPlacePanel();
      const el = getByText("footer-prefix");

      expect(el).toBeDefined();
    });
  });

  describe("footer", () => {
    describe("summary", () => {
      describe("when Balance After Bet is not available", () => {
        it("should call BetsSummary with stake", () => {
          const props = {
            i18n: {
              totalReturns: "totalReturnsMock",
            },
            isSummaryDisabled: false,
            isPanelDisabled: false,
            totalReturns: "totalReturnsMock",
            totalOriginalReturns: "totalOriginalReturnsMock",
          };

          renderSportsbookPlacePanel(props);

          expect(BetsSummary).toHaveBeenCalledWith(
            {
              disabled: false,
              totalStakeLabel: "",
              totalReturnsLabel: props.i18n.totalReturns,
              totalStake: "",
              totalReturns: props.totalReturns,
              totalOriginalReturns: props.totalOriginalReturns,
              isOddsBoosted: false,
            },
            undefined,
          );
          expect(BetsSummary).toHaveBeenCalledTimes(1);
        });
      });

      describe("when Balance After Bet is available", () => {
        it("should call BetsSummary with balance", () => {
          const props = {
            i18n: {
              totalReturns: "i18nTotalReturns",
              balanceAfterBet: "i18nBalanceAfterBet",
            },
            isSummaryDisabled: false,
            isPanelDisabled: false,
            totalReturns: "totalReturns",
            totalOriginalReturns: "totalOriginalReturns",
            balanceAfterBet: "£1.00",
          };

          renderSportsbookPlacePanel(props);

          expect(BetsSummary).toHaveBeenCalledWith(
            {
              disabled: false,
              isOddsBoosted: false,
              totalStakeLabel: props.i18n.balanceAfterBet,
              totalStake: props.balanceAfterBet,

              totalReturnsLabel: props.i18n.totalReturns,
              totalReturns: props.totalReturns,
              totalOriginalReturns: props.totalOriginalReturns,
            },
            undefined,
          );
          expect(BetsSummary).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("notifications", () => {
      describe("when there is a notification component passed", () => {
        it("should display the notifications component", () => {
          const panel = renderSportsbookPlacePanel({
            notifications: <notifications-mock testID="notification-mock" />,
          });

          expect(panel.getByTestId("notification-mock")).toBeDefined();
        });
      });
    });

    describe("actions", () => {
      describe("remove all button", () => {
        it("should render the component", () => {
          const mockFocusedTargetRef = {
            current: {
              something: "nice",
            },
          };
          useContext.mockImplementation(() => ({
            focusedKeyboardControls: {
              focusedTargetRef: mockFocusedTargetRef,
            },
          }));
          const selectors = renderSportsbookPlacePanel({});
          const component = selectors.queryByTestId(PLACE_FOOTER_REMOVE_ALL_BUTTON);

          expect(component).not.toBeNull();
        });

        it("should call onRemoveAllPress when clicked", () => {
          const removeAllMock = jest.fn();

          const selectors = renderSportsbookPlacePanel({ onRemoveAllPress: removeAllMock });
          const component = selectors.queryByTestId(PLACE_FOOTER_REMOVE_ALL_BUTTON);

          fireEvent(component, "onPress");

          expect(removeAllMock).toHaveBeenCalledWith();
          expect(removeAllMock).toHaveBeenCalledTimes(1);
        });

        it("should call generic icon with Trash", () => {
          renderSportsbookPlacePanel();

          expect(GenericIcon).toHaveBeenCalledWith(
            {
              color: tokens.PlaceFooterIconDefaultColour,
              name: SystemIconName.TRASH,
            },
            undefined,
          );
          expect(GenericIcon).toHaveBeenCalledTimes(1);
        });

        describe("when provided with isPanelDisabled", () => {
          it("should not call onRemoveAllPress when clicked", () => {
            const removeAllMock = jest.fn();

            const selectors = renderSportsbookPlacePanel({ onRemoveAllPress: removeAllMock, isPanelDisabled: true });
            const component = selectors.queryByTestId(PLACE_FOOTER_REMOVE_ALL_BUTTON);

            fireEvent(component, "onPress");

            expect(removeAllMock).toHaveBeenCalledTimes(0);
          });

          it("should call generic icon with Trash and disabled color", () => {
            renderSportsbookPlacePanel({ isPanelDisabled: true });

            expect(GenericIcon).toHaveBeenCalledWith(
              {
                color: tokens.PlaceFooterIconDisableColour,
                name: SystemIconName.TRASH,
              },
              undefined,
            );
          });
        });
      });

      describe("place button", () => {
        describe("when isLoggedIn is true", () => {
          it("should call PrimaryButton with transactional variant", () => {
            const props = {
              placeBtnLabel: "Accept odds change and",
              placeBtnSecondaryLabel: "Place £4.23 bet",
              isLoggedIn: true,
              onPlacePress: jest.fn(),
            };

            renderSportsbookPlacePanel(props);

            expect(PrimaryButton).toHaveBeenCalledWith(
              {
                label: props.placeBtnLabel,
                secondaryLabel: props.placeBtnSecondaryLabel,
                loadingLabel: undefined,
                disabled: undefined,
                stopAnimation: undefined,
                onTap: props.onPlacePress,
                variant: "transactional",
                reverseLabels: false,
              },
              undefined,
            );
            expect(PrimaryButton).toHaveBeenCalledTimes(1);
          });
        });

        describe("when isLoggedIn is false", () => {
          it("should call PrimaryButton with primary variant", () => {
            const props = {
              placeBtnLabel: "Accept odds change and",
              placeBtnSecondaryLabel: "Place £4.23 bet",
              isLoggedIn: false,
              onPlacePress: jest.fn(),
            };

            renderSportsbookPlacePanel(props);

            expect(PrimaryButton).toHaveBeenCalledWith(
              {
                label: props.placeBtnLabel,
                secondaryLabel: props.placeBtnSecondaryLabel,
                loadingLabel: undefined,
                disabled: undefined,
                stopAnimation: undefined,
                onTap: props.onPlacePress,
                variant: "primary",
                reverseLabels: false,
              },
              undefined,
            );
            expect(PrimaryButton).toHaveBeenCalledTimes(1);
          });
        });

        describe("when hasCTALoading is true", () => {
          it("should call PrimaryButton with place label", () => {
            const props = {
              hasCTALoading: true,
              placeBtnLabel: "placeMock",
              placeBtnLoadingLabel: "loadingLabel",
              onPlacePress: jest.fn(),
            };

            renderSportsbookPlacePanel(props);

            expect(PrimaryButton).toHaveBeenCalledWith(
              {
                label: props.placeBtnLabel,
                loadingLabel: props.placeBtnLoadingLabel,
                disabled: undefined,
                stopAnimation: undefined,
                onTap: props.onPlacePress,
                variant: "primary",
                reverseLabels: false,
              },
              undefined,
            );
            expect(PrimaryButton).toHaveBeenCalledTimes(1);
          });
        });

        describe("when hasCTALoading is false", () => {
          it("should call PrimaryButton without loading label", () => {
            const props = {
              hasCTALoading: false,
              i18n: {
                placing: "placingMock",
              },
              placeBtnLabel: "placeMock",
              onPlacePress: jest.fn(),
            };

            renderSportsbookPlacePanel(props);

            expect(PrimaryButton).toHaveBeenCalledWith(
              {
                label: props.placeBtnLabel,
                loadingLabel: undefined,
                disabled: undefined,
                stopAnimation: undefined,
                onTap: props.onPlacePress,
                variant: "primary",
                reverseLabels: false,
              },
              undefined,
            );
            expect(PrimaryButton).toHaveBeenCalledTimes(1);
          });
        });

        describe("when panel is disabled", () => {
          it("should call PrimaryButton with disabled as true", () => {
            renderSportsbookPlacePanel({ isPanelDisabled: true });

            expect(PrimaryButton).toHaveBeenCalledWith(expect.objectContaining({ disabled: true }), undefined);
            expect(PrimaryButton).toHaveBeenCalledTimes(1);
          });
        });

        describe("when place is disabled", () => {
          it("should call PrimaryButton with disabled as true", () => {
            renderSportsbookPlacePanel({ isPlaceDisabled: true });

            expect(PrimaryButton).toHaveBeenCalledWith(expect.objectContaining({ disabled: true }), undefined);
            expect(PrimaryButton).toHaveBeenCalledTimes(1);
          });
        });

        describe("when there's a place error", () => {
          it("should call PrimaryButton with stopAnimation as true", () => {
            renderSportsbookPlacePanel({ hasPlaceError: true });

            expect(PrimaryButton).toHaveBeenCalledWith(expect.objectContaining({ stopAnimation: true }), undefined);
            expect(PrimaryButton).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe("secondary button", () => {
        it("should call SecondaryButton", () => {
          renderSportsbookPlacePanel({
            secondaryButton: <SecondaryButton />,
          });

          expect(SecondaryButton).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
