import React from "react";
import { render, act } from "@testing-library/react";

import {
  BetslipNotifications,
  FreeBets,
  NudgesNumberInputField,
  PNLAndWhatIf,
  PrimaryButton,
  QuickStakes,
} from "@ppb/the-wall-web";

import { ExchangeInlinePlacePanel } from "./ExchangeInlinePlacePanel.web";

jest.mock("@ppb/the-wall-web", () => ({
  BetslipNotifications: jest.fn(() => <betslip-notifications-mock />),
  FreeBets: jest.fn(() => <free-bets-mock />),
  NudgesNumberInputField: jest.fn(() => <nudges-number-field-mock />),
  PNLAndWhatIf: jest.fn(() => <pnl-and-what-if-mock />),
  PrimaryButton: jest.fn(({ children, ...props }) => <primary-button-mock {...props}>{children}</primary-button-mock>),
  QuickStakes: jest.fn(() => <quick-stake-mock />),
}));

const QUICK_STAKES_MOCK = [
  { stake: 5, displayStake: "+ €5" },
  { stake: 10, displayStake: "+ €10" },
  { stake: 20, displayStake: "+ €20" },
  { stake: 50, displayStake: "+ €50" },
];

const MERGED_PROPS = {
  sizeInputId: "runnerUrn-size",
  priceInputId: "runnerUrn-price",
  currencySymbol: "€",
  hasFreeBets: false,
  isFreeBetsSelected: false,
  isPlaceButtonDisabled: false,
  focusedInputId: null,
  loadingLabel: "loading label mock",
  placeBtnLabel: "place button label mock",
  pricePlaceholder: "price placeholder mock",
  quickStakes: QUICK_STAKES_MOCK,
  sizePlaceholder: "size placeholder mock",
  betDelay: 0,
  freeBetsLabel: "free bets label mock",
  profitLabel: "profit label mock",
  profitValue: "profit value mock",
  profitRawValue: 22,
};

function renderExchangeInlinePlacePanel(props = {}) {
  const renderProps = { ...MERGED_PROPS, ...props };
  return render(<ExchangeInlinePlacePanel {...renderProps} />);
}

describe("ExchangeInlinePlacePanel", () => {
  beforeEach(jest.clearAllMocks);

  describe("NudgesNumberInputField", () => {
    it("should instantiate with proper values", () => {
      const onPriceChangeSpy = jest.fn();
      const onPriceBlurSpy = jest.fn();
      const onPriceNudgeUpSpy = jest.fn();
      const onPriceNudgeDownSpy = jest.fn();
      const onSizeNudgeUpSpy = jest.fn();
      const onSizeNudgeDownSpy = jest.fn();
      const onSizeBlurSpy = jest.fn();
      const onSizeChangeSpy = jest.fn();

      renderExchangeInlinePlacePanel({
        onPriceChange: onPriceChangeSpy,
        onPriceBlur: onPriceBlurSpy,
        onPriceNudgeUp: onPriceNudgeUpSpy,
        onPriceNudgeDown: onPriceNudgeDownSpy,
        onSizeNudgeUp: onSizeNudgeUpSpy,
        onSizeNudgeDown: onSizeNudgeDownSpy,
        onSizeBlur: onSizeBlurSpy,
        onSizeChange: onSizeChangeSpy,
        price: 123,
        size: 1,
      });

      // Price/Odds input
      expect(NudgesNumberInputField).toHaveBeenCalledWith(
        {
          id: "runnerUrn-price",
          label: "price placeholder mock",
          disabled: false,
          focused: false,
          hasCaret: false,
          value: 123,
          onBlur: expect.any(Function),
          onChange: expect.any(Function),
          onFocus: expect.any(Function),
          onNudgeDown: expect.any(Function),
          onNudgeUp: expect.any(Function),
        },
        undefined,
      );

      // Size/Stake input
      expect(NudgesNumberInputField).toHaveBeenCalledWith(
        {
          id: "runnerUrn-size",
          currencySymbol: "€",
          disabled: false,
          focused: false,
          hasCaret: false,
          label: "size placeholder mock",
          value: 1,
          onChange: expect.any(Function),
          onFocus: expect.any(Function),
          onBlur: onSizeBlurSpy,
          onNudgeDown: expect.any(Function),
          onNudgeUp: expect.any(Function),
        },
        undefined,
      );

      expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
    });

    describe("when focusedInputId is equal to component id", () => {
      it("should have `focused` as true (price)", () => {
        renderExchangeInlinePlacePanel({
          priceInputId: "the:runner-price",
          sizeInputId: "the:runner-size",
          focusedInputId: "the:runner-price",
        });

        expect(NudgesNumberInputField.mock.calls[0][0].focused).toBe(true);
        expect(NudgesNumberInputField.mock.calls[1][0].focused).toBe(false);
        expect(NudgesNumberInputField).toHaveBeenCalledWith(
          expect.objectContaining({
            id: "the:runner-price",
            focused: true,
            hasCaret: true,
          }),
          undefined,
        );

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
      });

      it("should have `focused` as true (size)", () => {
        renderExchangeInlinePlacePanel({
          priceInputId: "the:runner-price",
          sizeInputId: "the:runner-size",
          focusedInputId: "the:runner-size",
        });

        expect(NudgesNumberInputField.mock.calls[0][0].focused).toBe(false);
        expect(NudgesNumberInputField.mock.calls[1][0].focused).toBe(true);
        expect(NudgesNumberInputField).toHaveBeenCalledWith(
          expect.objectContaining({
            id: "the:runner-size",
            focused: true,
            hasCaret: true,
          }),
          undefined,
        );

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
      });
    });

    describe("disabled", () => {
      describe("when disabled is `false`", () => {
        it("should not disable the component", () => {
          renderExchangeInlinePlacePanel({
            disabled: false,
          });

          expect(NudgesNumberInputField).toHaveBeenCalledWith(
            expect.objectContaining({
              disabled: false,
            }),
            undefined,
          );
        });
      });

      describe("when disabled is `true`", () => {
        it("should disable the component", () => {
          renderExchangeInlinePlacePanel({
            disabled: true,
          });

          expect(NudgesNumberInputField).toHaveBeenCalledWith(
            expect.objectContaining({
              disabled: true,
            }),
            undefined,
          );
        });
      });
    });

    describe("onPriceFocus", () => {
      describe("when NudgesNumberInputField `onFocus` is called", () => {
        it("should call `onPriceFocus` when focused only", () => {
          const onPriceFocusSpy = jest.fn();

          renderExchangeInlinePlacePanel({ onPriceFocus: onPriceFocusSpy });

          const [priceNumberFieldFirstMock] = NudgesNumberInputField.mock.calls[0];

          act(() => {
            priceNumberFieldFirstMock.onFocus(true);
          });

          expect(onPriceFocusSpy).toHaveBeenCalledTimes(1);
          expect(onPriceFocusSpy).toHaveBeenLastCalledWith();

          const [priceNumberFieldSecondMock] = NudgesNumberInputField.mock.calls[0];

          act(() => {
            priceNumberFieldSecondMock.onFocus(false);
          });

          expect(onPriceFocusSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("onSizeFocus", () => {
      it("should call `onSizeFocus` when focused only", () => {
        const onSizeFocusSpy = jest.fn();

        renderExchangeInlinePlacePanel({ onSizeFocus: onSizeFocusSpy });

        const [sizeNumberFieldFirstMock] = NudgesNumberInputField.mock.calls[1];
        act(() => {
          sizeNumberFieldFirstMock.onFocus(false);
        });

        expect(onSizeFocusSpy).not.toHaveBeenCalled();

        act(() => {
          sizeNumberFieldFirstMock.onFocus(true);
        });

        expect(onSizeFocusSpy).toHaveBeenCalledTimes(1);
        expect(onSizeFocusSpy).toHaveBeenLastCalledWith();
      });
    });
  });

  describe("FreeBets", () => {
    describe("when free bets are available", () => {
      it("should instantiate with proper values", () => {
        const onFreeBetsChangeSpy = jest.fn();

        renderExchangeInlinePlacePanel({
          hasFreeBets: true,
          onFreeBetsChange: onFreeBetsChangeSpy,
        });

        expect(FreeBets).toHaveBeenCalledTimes(1);
        expect(FreeBets).toHaveBeenCalledWith(
          expect.objectContaining({
            label: "free bets label mock",
            isSelected: false,
            onFreeBetsChange: onFreeBetsChangeSpy,
          }),
          undefined,
        );
      });

      describe("disabled", () => {
        describe("when disabled is `false`", () => {
          it("should not disable the component", () => {
            renderExchangeInlinePlacePanel({
              hasFreeBets: true,
              disabled: false,
            });

            expect(FreeBets).toHaveBeenCalledWith(
              expect.objectContaining({
                disabled: false,
              }),
              undefined,
            );
          });
        });

        describe("when disabled is `true`", () => {
          it("should disable the component", () => {
            renderExchangeInlinePlacePanel({
              hasFreeBets: true,
              disabled: true,
            });

            expect(FreeBets).toHaveBeenCalledWith(
              expect.objectContaining({
                disabled: true,
              }),
              undefined,
            );
          });
        });
      });
    });

    describe("when free bets are not available", () => {
      it("should not display free bets", () => {
        renderExchangeInlinePlacePanel({ hasFreeBets: false });

        expect(FreeBets).not.toHaveBeenCalled();
      });
    });
  });

  describe("BetslipNotifications", () => {
    describe("when notifications are available", () => {
      it("should instantiate with proper values", () => {
        const notifications = [{ some: "notification" }, { and: "another" }];
        renderExchangeInlinePlacePanel({ notifications });

        expect(BetslipNotifications).toHaveBeenCalledTimes(1);
        expect(BetslipNotifications).toHaveBeenCalledWith(
          {
            alerts: notifications,
          },
          undefined,
        );
      });
    });

    describe("when notifications are not available", () => {
      it("should not display notifications", () => {
        renderExchangeInlinePlacePanel({ notifications: undefined });

        expect(BetslipNotifications).not.toHaveBeenCalled();
      });
    });
  });

  describe("PrimaryButton", () => {
    it("should instantiate with proper values", () => {
      const onPlaceClickSpy = jest.fn();

      renderExchangeInlinePlacePanel({
        onPlaceClick: onPlaceClickSpy,
      });

      expect(PrimaryButton).toHaveBeenCalledTimes(1);
      expect(PrimaryButton).toHaveBeenCalledWith(
        expect.objectContaining({
          label: "place button label mock",
          delay: 0,
          loadingLabel: "loading label mock",
          onTap: onPlaceClickSpy,
          secondaryLabel: "profit label mock",
          children: expect.any(Object),
        }),
        undefined,
      );
    });

    describe("PNLAndWhatIf", () => {
      it("should instantiate with proper values", () => {
        const onPlaceClickSpy = jest.fn();

        renderExchangeInlinePlacePanel({
          onPlaceClick: onPlaceClickSpy,
        });

        expect(PNLAndWhatIf).toHaveBeenCalledTimes(1);
        expect(PNLAndWhatIf).toHaveBeenCalledWith(
          expect.objectContaining({
            pnl: "profit value mock",
            rawPnl: 22,
            size: "medium",
            agnostic: true,
          }),
          undefined,
        );
      });
    });

    describe("disabled", () => {
      describe("when isPlaceButtonDisabled is `true`", () => {
        it("should disable the component", () => {
          renderExchangeInlinePlacePanel({
            isPlaceButtonDisabled: true,
            disabled: false,
          });

          expect(PrimaryButton).toHaveBeenCalledWith(
            expect.objectContaining({
              disabled: true,
            }),
            undefined,
          );

          expect(PNLAndWhatIf).toHaveBeenCalledWith(
            expect.objectContaining({
              disabled: true,
            }),
            undefined,
          );
        });
      });

      describe("when disabled is `true`", () => {
        it("should disable the component", () => {
          renderExchangeInlinePlacePanel({
            disabled: true,
            isPlaceButtonDisabled: false,
          });

          expect(PrimaryButton).toHaveBeenCalledWith(
            expect.objectContaining({
              disabled: true,
            }),
            undefined,
          );
        });
      });

      describe("when disabled is `false` and isPlaceButtonDisabled is `false`", () => {
        it("should not disable the component", () => {
          renderExchangeInlinePlacePanel({
            disabled: false,
            isPlaceButtonDisabled: false,
          });

          expect(PrimaryButton).toHaveBeenCalledWith(
            expect.objectContaining({
              disabled: false,
            }),
            undefined,
          );
        });
      });
    });

    describe("stopAnimation", () => {
      describe("when hasPlaceError is `true`", () => {
        it("should pass stopAnimation prop as `true`", () => {
          renderExchangeInlinePlacePanel({
            hasPlaceError: true,
          });

          expect(PrimaryButton).toHaveBeenCalledWith(
            expect.objectContaining({
              stopAnimation: true,
            }),
            undefined,
          );
        });
      });

      describe("when hasPlaceError is `false`", () => {
        it("should pass stopAnimation prop as `false`", () => {
          renderExchangeInlinePlacePanel({
            hasPlaceError: false,
          });

          expect(PrimaryButton).toHaveBeenCalledWith(
            expect.objectContaining({
              stopAnimation: false,
            }),
            undefined,
          );
        });
      });

      describe("when hasPlaceError is undefined", () => {
        it("should pass stopAnimation prop as `false`", () => {
          renderExchangeInlinePlacePanel({
            hasPlaceError: false,
          });

          expect(PrimaryButton).toHaveBeenCalledWith(
            expect.objectContaining({
              stopAnimation: false,
            }),
            undefined,
          );
        });
      });
    });
  });

  describe("QuickStakes", () => {
    describe("when quickstakes are available", () => {
      it("should instantiate with proper values", () => {
        renderExchangeInlinePlacePanel();

        expect(QuickStakes).toHaveBeenCalledTimes(1);
        expect(QuickStakes).toHaveBeenCalledWith(
          expect.objectContaining({
            quickStakes: QUICK_STAKES_MOCK,
            onTouch: expect.any(Function),
          }),
          undefined,
        );
      });

      describe("onQuickStakeTouch", () => {
        describe("when quickstake button is pressed", () => {
          describe("when disabled is `false`", () => {
            it("should call callback with correct quickstake value", () => {
              const onQuickStakeTouchSpy = jest.fn();

              renderExchangeInlinePlacePanel({
                onQuickStakeTouch: onQuickStakeTouchSpy,
                disabled: false,
              });

              act(() => {
                const { onTouch, quickStakes } = QuickStakes.mock.calls[0][0];
                const { stake } = quickStakes[0];
                onTouch(stake);
              });

              expect(onQuickStakeTouchSpy).toHaveBeenCalledTimes(1);
              expect(onQuickStakeTouchSpy).toHaveBeenCalledWith(5);
            });
          });

          describe("when disabled is `true`", () => {
            it("should not call callback", () => {
              const onQuickStakeTouchSpy = jest.fn();

              renderExchangeInlinePlacePanel({
                onQuickStakeTouch: onQuickStakeTouchSpy,
                disabled: true,
              });

              act(() => {
                const { onTouch } = QuickStakes.mock.calls[0][0];
                onTouch();
              });

              expect(onQuickStakeTouchSpy).toHaveBeenCalledTimes(0);
            });
          });
        });
      });
    });

    describe("when quickstakes are not available", () => {
      it("should not display quickstakes", () => {
        renderExchangeInlinePlacePanel({ quickStakes: undefined });

        expect(QuickStakes).not.toHaveBeenCalled();
      });
    });
  });
});
