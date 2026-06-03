import { PNLAndWhatIf, PrimaryButton } from "@ppb/the-wall-native";
import { render, act } from "@testing-library/react-native";
import { CashoutStep } from "@ppb/tbd-store/state/constants";
import { useHaptics } from "@ppb/the-wall-native/hooks/useHaptics";

import Cashout from "./Cashout.native";

jest.mock("@ppb/the-wall-native", () => ({
  PrimaryButton: jest.fn((props) => <primary-button-mock {...props} />),
  PNLAndWhatIf: jest.fn((props) => <pnl-and-what-if-mock {...props} />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-native/hooks/useHaptics", () => ({
  useHaptics: jest.fn(() => ({
    trigger: jest.fn(),
  })),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const dispatchCashoutTapSpy = jest.fn();
const dispatchCashoutTransactionSpy = jest.fn();
const dispatchUndoConfirmSpy = jest.fn();

function renderCashoutButton({
  betDelay,
  rawSecondaryValue,
  state,
  cashoutURN,
  isVisible,
  isDisabled,
  isConfirmStepActive,
  showWhyIsThisLink,
  suspendedSupportUrl,
  stopAnimation,
  buttonLabel,
  detailLabel,
  loadingLabel,
  formattedSecondaryValueLabel,
  dispatchCashoutTap,
  dispatchCashoutTransaction,
  dispatchUndoConfirm,
  step,
}) {
  return render(
    <Cashout
      betDelay={betDelay}
      state={state}
      rawSecondaryValue={rawSecondaryValue}
      isDisabled={isDisabled}
      isConfirmStepActive={isConfirmStepActive}
      showWhyIsThisLink={showWhyIsThisLink}
      suspendedSupportUrl={suspendedSupportUrl}
      stopAnimation={stopAnimation}
      dispatchCashoutTap={dispatchCashoutTap}
      dispatchCashoutTransaction={dispatchCashoutTransaction}
      dispatchUndoConfirm={dispatchUndoConfirm}
      cashoutURN={cashoutURN}
      isVisible={isVisible}
      buttonLabel={buttonLabel}
      detailLabel={detailLabel}
      loadingLabel={loadingLabel}
      formattedSecondaryValueLabel={formattedSecondaryValueLabel}
      step={step}
    />,
  );
}

const mockedProps = {
  betDelay: 1,
  state: "default",
  rawSecondaryValue: 2,
  cashoutURN: "cashoutUrn",
  isVisible: true,
  isDisabled: false,
  isConfirmStepActive: true,
  stopAnimation: false,
  buttonLabel: "Cash Out: €2.00",
  detailLabel: "Profit",
  loadingLabel: "Cashing Out: €2.00",
  formattedSecondaryValueLabel: "€2.00",
  dispatchCashoutTap: dispatchCashoutTapSpy,
  dispatchCashoutTransaction: dispatchCashoutTransactionSpy,
  dispatchUndoConfirm: dispatchUndoConfirmSpy,
};

describe("Cashout Component", () => {
  jest.useFakeTimers();

  describe("on render and cashout is visible", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should render the PrimaryButton component properly", () => {
      renderCashoutButton(mockedProps);

      expect(PrimaryButton).toHaveBeenCalledTimes(1);
      expect(PrimaryButton).toHaveBeenCalledWith(
        expect.objectContaining({
          delay: 1,
          state: "default",
          label: "Cash Out: €2.00",
          disabled: false,
          loadingLabel: "Cashing Out: €2.00",
          onTap: expect.any(Function),
          stopAnimation: false,
          secondaryLabel: "Profit",
          variant: "transactional",
        }),
        undefined,
      );
    });

    it("should render the PNLAndWhatIf component properly", () => {
      renderCashoutButton(mockedProps);

      expect(PNLAndWhatIf).toHaveBeenCalledTimes(1);
      expect(PNLAndWhatIf).toHaveBeenCalledWith(
        {
          rawPnl: 2,
          pnl: "€2.00",
          size: "medium",
          disabled: false,
          agnostic: true,
        },
        undefined,
      );
    });

    it("should render a Why is this? link when showWhyIsThisLink is true", async () => {
      const { getByText } = renderCashoutButton({
        ...mockedProps,
        showWhyIsThisLink: true,
        suspendedSupportUrl: "foo",
      });

      expect(getByText("I18N.CASH_OUT_SUSPENSION_MESSAGING_PT_2")).not.toBeNull();
    });

    it("should not render a Why is this? link when showWhyIsThisLink is false", async () => {
      const { queryByText } = renderCashoutButton({
        ...mockedProps,
        showWhyIsThisLink: false,
        suspendedSupportUrl: "foo",
      });

      expect(queryByText("I18N.CASH_OUT_SUSPENSION_MESSAGING_PT_2")).toBeNull();
    });

    describe("and onTap is triggered", () => {
      it("should dispatchCashoutTap", () => {
        renderCashoutButton(mockedProps);

        const { onTap } = PrimaryButton.mock.calls[0][0];
        onTap();

        expect(dispatchCashoutTapSpy).toHaveBeenCalledWith("cashoutUrn", true);
        expect(dispatchCashoutTapSpy).toHaveBeenCalledTimes(1);
      });

      describe("and step is not confirm", () => {
        describe("and isConfirmStepActive is false", () => {
          it("should call dispatchCashoutTransaction", () => {
            renderCashoutButton({
              ...mockedProps,
              isConfirmStepActive: false,
              step: CashoutStep.DISPLAY,
            });

            const { onTap } = PrimaryButton.mock.calls[0][0];
            onTap();

            expect(dispatchCashoutTransactionSpy).toHaveBeenCalled();
          });
        });

        describe("and isConfirmStepActive is true", () => {
          it("should not call dispatchCashoutTransaction", () => {
            renderCashoutButton({
              ...mockedProps,
              isConfirmStepActive: true,
              step: CashoutStep.DISPLAY,
            });

            const { onTap } = PrimaryButton.mock.calls[0][0];
            onTap();

            expect(dispatchCashoutTransactionSpy).not.toHaveBeenCalled();
          });
        });
      });

      describe("and step is confirm", () => {
        it("should call dispatchCashoutTransaction", () => {
          renderCashoutButton({
            ...mockedProps,
            step: CashoutStep.CONFIRM,
          });

          const { onTap } = PrimaryButton.mock.calls[0][0];
          onTap();

          expect(dispatchCashoutTransactionSpy).toHaveBeenCalled();
        });

        describe("when validating the reset mechanism", () => {
          it("should not call dispatchUndoConfirm before the interval", () => {
            renderCashoutButton({
              ...mockedProps,
              step: CashoutStep.CONFIRM,
            });

            const { onTap } = PrimaryButton.mock.calls[0][0];
            onTap();

            act(() => jest.advanceTimersByTime(4999));

            expect(dispatchUndoConfirmSpy).not.toHaveBeenCalled();
          });

          it("should call dispatchUndoConfirm after the correct interval", () => {
            renderCashoutButton({
              ...mockedProps,
              step: CashoutStep.CONFIRM,
            });

            const { onTap } = PrimaryButton.mock.calls[0][0];
            onTap();

            act(() => jest.advanceTimersByTime(5000));

            expect(dispatchUndoConfirmSpy).toHaveBeenCalled();
          });

          describe("when the step changes mid timer", () => {
            it("should not call dispatchUndoConfirm if step changes mid timer", () => {
              const { rerender } = renderCashoutButton({
                ...mockedProps,
                step: CashoutStep.CONFIRM,
              });

              const { onTap } = PrimaryButton.mock.calls[0][0];

              onTap();

              act(() => jest.advanceTimersByTime(2500));

              rerender(<Cashout {...mockedProps} step={CashoutStep.DISPLAY} />);

              act(() => jest.advanceTimersByTime(2500));

              expect(dispatchUndoConfirmSpy).not.toHaveBeenCalled();
            });
          });
        });
      });
    });
  });

  describe("on render and cashout is not visible", () => {
    beforeAll(() => {
      renderCashoutButton({
        ...mockedProps,
        isVisible: false,
      });
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should not render the PrimaryButton component", () => {
      expect(PrimaryButton).not.toHaveBeenCalled();
    });

    it("should not render the PNLAndWhatIf component", () => {
      expect(PNLAndWhatIf).not.toHaveBeenCalled();
    });
  });

  describe("haptic feedback", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should trigger success haptic when transitioning to RECEIPT step", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      const { rerender } = renderCashoutButton({ ...mockedProps, step: CashoutStep.CASHING_OUT });
      expect(triggerMock).not.toHaveBeenCalled();

      rerender(<Cashout {...mockedProps} step={CashoutStep.RECEIPT} />);
      expect(triggerMock).toHaveBeenCalledWith("success");
      expect(triggerMock).toHaveBeenCalledTimes(1);
    });

    it("should not trigger haptic on initial render with RECEIPT step", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      renderCashoutButton({ ...mockedProps, step: CashoutStep.RECEIPT });
      expect(triggerMock).not.toHaveBeenCalled();
    });

    it("should not trigger haptic when transitioning between non-RECEIPT steps", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      const { rerender } = renderCashoutButton({ ...mockedProps, step: CashoutStep.DISPLAY });
      expect(triggerMock).not.toHaveBeenCalled();

      rerender(<Cashout {...mockedProps} step={CashoutStep.CONFIRM} />);
      expect(triggerMock).not.toHaveBeenCalled();
    });

    it("should not trigger success haptic when transitioning to RECEIPT from non-CASHING_OUT steps", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      const { rerender } = renderCashoutButton({ ...mockedProps, step: CashoutStep.DISPLAY });
      expect(triggerMock).not.toHaveBeenCalled();

      rerender(<Cashout {...mockedProps} step={CashoutStep.RECEIPT} />);
      expect(triggerMock).not.toHaveBeenCalled();
    });

    it("should not trigger haptic when staying in RECEIPT step", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      const { rerender } = renderCashoutButton({ ...mockedProps, step: CashoutStep.RECEIPT });
      triggerMock.mockClear();

      rerender(<Cashout {...mockedProps} step={CashoutStep.RECEIPT} />);
      expect(triggerMock).not.toHaveBeenCalled();
    });

    it("should trigger error haptic when transitioning from CASHING_OUT to DISPLAY step", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      const { rerender } = renderCashoutButton({ ...mockedProps, step: CashoutStep.CASHING_OUT });
      expect(triggerMock).not.toHaveBeenCalled();

      rerender(<Cashout {...mockedProps} step={CashoutStep.DISPLAY} />);
      expect(triggerMock).toHaveBeenCalledWith("error");
      expect(triggerMock).toHaveBeenCalledTimes(1);
    });

    it("should not trigger error haptic when transitioning to DISPLAY from non-CASHING_OUT steps", () => {
      const triggerMock = jest.fn();
      useHaptics.mockReturnValue({ trigger: triggerMock });

      const { rerender } = renderCashoutButton({ ...mockedProps, step: CashoutStep.CONFIRM });
      expect(triggerMock).not.toHaveBeenCalled();

      rerender(<Cashout {...mockedProps} step={CashoutStep.DISPLAY} />);
      expect(triggerMock).not.toHaveBeenCalled();
    });
  });
});
