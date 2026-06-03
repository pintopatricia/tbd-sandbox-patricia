import { PNLAndWhatIf, PrimaryButton } from "@ppb/the-wall-web";
import { render, act } from "@testing-library/react";
import { CashoutStep } from "@ppb/tbd-store/state/constants";
import Cashout from "./Cashout.web";
import "jest-dom/extend-expect";

jest.mock("@ppb/the-wall-web", () => ({
  PrimaryButton: jest.fn((props) => <primary-button-mock {...props} />),
  PNLAndWhatIf: jest.fn((props) => <pnl-and-what-if-mock {...props} />),
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
  step: CashoutStep.DISPLAY,
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
          secondaryLabel: "Profit",
          disabled: false,
          loadingLabel: "Cashing Out: €2.00",
          onTap: expect.any(Function),
          stopAnimation: false,
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
      const { findByText } = renderCashoutButton({
        ...mockedProps,
        showWhyIsThisLink: true,
        suspendedSupportUrl: "foo",
      });

      const whyIsThis = await findByText("I18N.CASH_OUT_SUSPENSION_MESSAGING_PT_2");
      expect(whyIsThis).toBeInTheDocument();
      expect(whyIsThis).toHaveAttribute("href", "foo");
    });

    it("should not render a  Why is this? link when showWhyIsThisLink is false", async () => {
      const { queryByText } = renderCashoutButton({
        ...mockedProps,
        showWhyIsThisLink: false,
        suspendedSupportUrl: "foo",
      });

      const whyIsThis = await queryByText("I18N.CASH_OUT_SUSPENSION_MESSAGING_PT_2");
      expect(whyIsThis).not.toBeInTheDocument();
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
});
