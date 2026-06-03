import { render, fireEvent, act } from "@testing-library/react";
import "jest-dom/extend-expect";

import { AlertType } from "@ppb/the-wall-common/types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";

import { JurisdictionalOperatorInfo } from "../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.web";

import { Alert, BetsSummary, FreeBets, PrimaryButton, SecondaryButton } from "@ppb/the-wall-web";

import styles from "./PlaceFooter.web.modules.json";
import { PlaceFooter } from "./PlaceFooter.web";

jest.mock("@ppb/the-wall-web/components/bricks/BetsSummary/BetsSummary", () => ({
  BetsSummary: jest.fn(() => <bets-summary-mock />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton", () => ({
  PrimaryButton: jest.fn(() => <primary-button-mock />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/SecondaryButton/SecondaryButton", () => ({
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
}));

jest.mock("@ppb/the-wall-web/components/walls/FreeBets/FreeBets", () => ({
  FreeBets: jest.fn(() => <free-bets />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(({ props }) => <generic-icon-mock {...props} />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/Alert/Alert", () => ({
  Alert: jest.fn(() => <alert-mock />),
}));

jest.mock("../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.web", () => ({
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

const renderPlaceFooter = ({
  i18n = i18nMock,
  isPanelDisabled,
  isPlaceDisabled,
  notifications = <notifications-mock data-testid="notification-mock" />,
  footerPrefix = <div data-testid="footer-prefix"></div>,
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
  placeBtnLoadingLabel = "loadingLabel",
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
  beforeEach(jest.clearAllMocks);

  it("should have sbkPlacePanel class", () => {
    const { container } = renderPlaceFooter();
    const comp = container.querySelector(`${styles.footerContainer}`);

    expect(comp).toBeDefined();
  });

  it("should render the JurisdictionalOperatorInfo component", () => {
    renderPlaceFooter();
    expect(JurisdictionalOperatorInfo).toHaveBeenCalled();
  });

  describe("Free Bets", () => {
    describe("when there are no free bets", () => {
      it("should not render free bets", () => {
        renderPlaceFooter({ hasFreeBets: false });
        expect(FreeBets).toHaveBeenCalledTimes(0);
      });
    });

    describe("when there are free bets", () => {
      describe("and the button to use bonus is not clicked", () => {
        const spyFn = jest.fn();

        beforeEach(() => {
          renderPlaceFooter({
            isPanelDisabled: false,
            hasFreeBets: true,
            isFreeBetsSelected: false,
            onFreeBetsChange: spyFn,
          });
        });

        it("should render free bets", () => {
          expect(FreeBets).toHaveBeenCalledTimes(1);
          expect(FreeBets.mock.calls[0][0]).toEqual({
            label: "freeBets",
            isSelected: false,
            disabled: false,
            onFreeBetsChange: spyFn,
          });
        });
      });

      describe("and the button to use bonus is clicked", () => {
        const spyFn = jest.fn();

        beforeEach(() => {
          renderPlaceFooter({
            hasFreeBets: true,
            isFreeBetsSelected: true,
            onFreeBetsChange: spyFn,
          });
        });

        it("should render free bets", () => {
          expect(FreeBets).toHaveBeenCalledTimes(1);
          expect(FreeBets.mock.calls[0][0]).toEqual({
            label: "freeBets",
            isSelected: true,
            disabled: false,
            onFreeBetsChange: spyFn,
          });
        });
      });

      describe("and the panel is disabled", () => {
        it("should render the FreeBets disabled", () => {
          const onFreeBetsChange = jest.fn();

          renderPlaceFooter({
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

          renderPlaceFooter({
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
        renderPlaceFooter({ freeBetsAlertMessage: "" });

        expect(Alert).not.toHaveBeenCalled();
      });
    });

    describe("when freeBetsAlertMessage is available", () => {
      it("should render the Alert component", () => {
        renderPlaceFooter({
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

  describe("CTA loading", () => {
    describe("when there is no cta loading enabled", () => {
      it("should not pass the loadingLabel to PrimaryButton", () => {
        renderPlaceFooter({ hasCTALoading: false });
        expect(PrimaryButton).toHaveBeenCalledWith(expect.objectContaining({ loadingLabel: undefined }), undefined);
      });
    });

    describe("when there is cta loading enabled", () => {
      it("should pass the loadingLabel to PrimaryButton", () => {
        renderPlaceFooter({ hasCTALoading: true });
        expect(PrimaryButton).toHaveBeenCalledWith(
          expect.objectContaining({ loadingLabel: "loadingLabel" }),
          undefined,
        );
      });
    });
  });

  describe("Footer Prefix", () => {
    it("should display the footerPrefixes render prop", () => {
      const { getByTestId } = renderPlaceFooter();
      const el = getByTestId("footer-prefix");

      expect(el).not.toBeNull();
    });
  });

  describe("Summary", () => {
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

        renderPlaceFooter(props);

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

        renderPlaceFooter(props);

        expect(BetsSummary).toHaveBeenCalledWith(
          {
            disabled: false,

            totalStakeLabel: props.i18n.balanceAfterBet,
            totalStake: props.balanceAfterBet,

            totalReturnsLabel: props.i18n.totalReturns,
            totalReturns: props.totalReturns,
            totalOriginalReturns: props.totalOriginalReturns,
            isOddsBoosted: false,
          },
          undefined,
        );
        expect(BetsSummary).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Terms Link", () => {
    it("should render the terms link when termsUrl is a string", () => {
      const component = renderPlaceFooter({ termsUrl: "something" });
      expect(component.getByText("termsLabel")).not.toBeNull();
    });

    it("should have a link to termsUrl with termsLinkLabel", () => {
      const component = renderPlaceFooter({ termsUrl: "something" });
      expect(component.getByText("termsLinkLabel")).not.toBeNull();
      expect(component.getByText("termsLinkLabel")).toHaveAttribute("href", "something");
    });

    it("should not render the terms link when termsUrl is undefined", () => {
      const component = renderPlaceFooter();
      expect(component.queryByText("termsLabel")).toBeNull();
    });
  });

  describe("Notifications", () => {
    describe("when there is a notification component passed", () => {
      it("should display the notifications component", () => {
        const panel = renderPlaceFooter({
          notifications: <notifications-mock data-testid="notification-mock" />,
        });

        expect(panel.getByTestId("notification-mock")).toBeDefined();
      });
    });
  });

  describe("Actions", () => {
    it("should have actions class", () => {
      const { container } = renderPlaceFooter();
      const el = container.querySelector(`${styles.actions}`);

      expect(el).toBeDefined();
    });

    describe("remove all", () => {
      it("should have removeButton class", () => {
        const { container } = renderPlaceFooter();
        const el = container.querySelector(`${styles.removeButton}`);

        expect(el).toBeDefined();
      });

      it("should call generic icon with Trash", () => {
        renderPlaceFooter();

        expect(GenericIcon).toHaveBeenCalledWith(
          {
            color: "var(--place-footer-icon-default-colour)",
            name: SystemIconName.TRASH,
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenCalledTimes(1);
      });

      describe("when there's the prop isDisabled", () => {
        it("with the value true", () => {
          const { container } = renderPlaceFooter({ isPanelDisabled: true });
          const btn = container.querySelector(`${styles.removeButton}`);

          expect(btn).toBeDisabled();

          expect(GenericIcon).toHaveBeenCalledWith(
            {
              color: "var(--place-footer-icon-disable-colour)",
              name: SystemIconName.TRASH,
            },
            undefined,
          );
        });

        it("with the value false", () => {
          const { container } = renderPlaceFooter({ isPanelDisabled: false });
          const btn = container.querySelector(`${styles.removeButton}`);

          expect(btn).not.toBeDisabled();

          expect(GenericIcon).toHaveBeenCalledWith(
            {
              color: "var(--place-footer-icon-default-colour)",
              name: SystemIconName.TRASH,
            },
            undefined,
          );
        });
      });

      it("should call onRemoveAllPress when clicked", () => {
        const removeAllMock = jest.fn();
        const { container } = renderPlaceFooter({ onRemoveAllPress: removeAllMock });
        const btn = container.querySelector(`${styles.removeButton}`);

        act(() => {
          fireEvent.click(btn);
        });

        expect(removeAllMock).toHaveBeenCalledTimes(1);
      });

      describe("label", () => {
        it("should have screenReaderOnly class", () => {
          const { container } = renderPlaceFooter();
          const el = container.querySelector(`${styles.screenReaderOnly}`);

          expect(el).toBeDefined();
        });

        it("should have label", () => {
          const { container } = renderPlaceFooter({ i18n: { removeLabel: "removeLabelMock" } });
          const el = container.querySelector(`${styles.screenReaderOnly}`);

          expect(el).toHaveTextContent("removeLabelMock");
        });
      });
    });

    describe("place button", () => {
      describe("when isLoggedIn is true", () => {
        it("should call PrimaryButton with transactional variant", () => {
          renderPlaceFooter({
            placeBtnLabel: "Accept odds change and",
            placeBtnSecondaryLabel: "Place £4.23 bet",
            isLoggedIn: true,
            onPlacePress: () => {},
            placeBtnLoadingLabel: "loadingLabel",
          });

          expect(PrimaryButton).toHaveBeenCalledWith(
            {
              label: "Accept odds change and",
              secondaryLabel: "Place £4.23 bet",
              loadingLabel: "loadingLabel",
              disabled: undefined,
              stopAnimation: false,
              onTap: expect.any(Function),
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
          renderPlaceFooter({
            placeBtnLabel: "Accept odds change and",
            placeBtnSecondaryLabel: "Place £4.23 bet",
            isLoggedIn: false,
            onPlacePress: () => {},
            placeBtnLoadingLabel: "loadingLabel",
          });

          expect(PrimaryButton).toHaveBeenCalledWith(
            {
              label: "Accept odds change and",
              secondaryLabel: "Place £4.23 bet",
              loadingLabel: "loadingLabel",
              disabled: undefined,
              stopAnimation: false,
              onTap: expect.any(Function),
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
          renderPlaceFooter({ isPanelDisabled: true });

          expect(PrimaryButton).toHaveBeenCalledWith(expect.objectContaining({ disabled: true }), undefined);
          expect(PrimaryButton).toHaveBeenCalledTimes(1);
        });
      });

      describe("when place is disabled", () => {
        it("should call PrimaryButton with disabled as true", () => {
          renderPlaceFooter({ isPlaceDisabled: true });

          expect(PrimaryButton).toHaveBeenCalledWith(expect.objectContaining({ disabled: true }), undefined);
          expect(PrimaryButton).toHaveBeenCalledTimes(1);
        });
      });

      describe("when there's a place error", () => {
        it("should call PrimaryButton with stopAnimation as true", () => {
          renderPlaceFooter({ hasPlaceError: true });

          expect(PrimaryButton).toHaveBeenCalledWith(expect.objectContaining({ stopAnimation: true }), undefined);
          expect(PrimaryButton).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("secondary button", () => {
      it("should call SecondaryButton", () => {
        renderPlaceFooter({
          secondaryButton: <SecondaryButton />,
        });

        expect(SecondaryButton).toHaveBeenCalledTimes(1);
      });
    });
  });
});
