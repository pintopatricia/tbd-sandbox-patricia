import React from "react";
import { render, act } from "@testing-library/react-native";

import { Alerts, FreeBets, PNLAndWhatIf, PrimaryButton, QuickStakes } from "@ppb/the-wall-native";
import { NudgesNumberInputField } from "@ppb/the-wall-native/components/InputsAndControls/NudgesNumberInputField/NudgesNumberInputField";

import { ExchangeInlinePlacePanel } from "./ExchangeInlinePlacePanel.native";

jest.mock("@ppb/the-wall-native", () => ({
  Alerts: jest.fn(() => <alerts-mock />),
  FreeBets: jest.fn(() => <free-bets-mock />),
  PNLAndWhatIf: jest.fn(() => <pnl-and-what-if-mock />),
  PrimaryButton: jest.fn(({ children, ...props }) => <primary-button-mock {...props}>{children}</primary-button-mock>),
  QuickStakes: jest.fn(() => <quick-stake-mock />),
}));

jest.mock("@ppb/the-wall-native/components/InputsAndControls/NudgesNumberInputField/NudgesNumberInputField", () => ({
  NudgesNumberInputField: jest.fn(() => <nudges-number-field-mock />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
}));

const QUICK_STAKES_MOCK = [
  { stake: 5, displayStake: "+ €5" },
  { stake: 10, displayStake: "+ €10" },
  { stake: 20, displayStake: "+ €20" },
  { stake: 50, displayStake: "+ €50" },
];

const MERGED_PROPS = {
  currencySymbol: "€",
  hasFreeBets: false,
  isFreeBetsSelected: false,
  isPlaceButtonDisabled: false,
  loadingLabel: "loading label mock",
  placeBtnLabel: "place button label mock",
  pricePlaceholder: "price placeholder mock",
  quickStakes: QUICK_STAKES_MOCK,
  runner: "runner",
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
      const onSizeChangeSpy = jest.fn();
      const onSizeBlurSpy = jest.fn();

      renderExchangeInlinePlacePanel({
        priceInputId: "runner-price",
        sizeInputId: "runner-size",
        onPriceChange: onPriceChangeSpy,
        onPriceBlur: onPriceBlurSpy,
        onPriceNudgeUp: onPriceNudgeUpSpy,
        onPriceNudgeDown: onPriceNudgeDownSpy,
        onSizeNudgeUp: onSizeNudgeUpSpy,
        onSizeNudgeDown: onSizeNudgeDownSpy,
        onSizeChange: onSizeChangeSpy,
        onSizeBlur: onSizeBlurSpy,
        price: 123,
        hasCaret: false,
        size: 123,
      });

      expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
      expect(NudgesNumberInputField).toHaveBeenCalledWith(
        {
          id: "runner-price",
          disabled: false,
          focused: false,
          label: "price placeholder mock",
          onBlur: expect.any(Function),
          onChange: expect.any(Function),
          onFocus: expect.any(Function),
          onNudgeDown: expect.any(Function),
          onNudgeUp: expect.any(Function),
          value: 123,
          hasCaret: false,
        },
        undefined,
      );
      expect(NudgesNumberInputField).toHaveBeenCalledWith(
        {
          id: "runner-size",
          disabled: false,
          label: "size placeholder mock",
          value: 123,
          focused: false,
          currencySymbol: "€",
          onChange: expect.any(Function),
          onFocus: expect.any(Function),
          onBlur: expect.any(Function),
          onNudgeDown: expect.any(Function),
          onNudgeUp: expect.any(Function),
          hasCaret: false,
        },
        undefined,
      );
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

          renderExchangeInlinePlacePanel({ priceInputId: "runner-price", onPriceFocus: onPriceFocusSpy });

          const [priceNumberFieldFirstMock] = NudgesNumberInputField.mock.calls[0];

          act(() => {
            priceNumberFieldFirstMock.onFocus(true);
          });

          expect(onPriceFocusSpy).toHaveBeenCalledTimes(1);
          expect(onPriceFocusSpy).toHaveBeenLastCalledWith();
          expect(NudgesNumberInputField).toHaveBeenCalledWith(
            expect.objectContaining({
              id: "runner-price",
              focused: false,
              hasCaret: false,
            }),
            undefined,
          );

          act(() => {
            priceNumberFieldFirstMock.onFocus(false);
          });

          expect(onPriceFocusSpy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("onPriceBlur", () => {
      function setupNudgesOnBlur() {
        const onPriceFocus = jest.fn();
        const onPriceBlur = jest.fn();

        renderExchangeInlinePlacePanel({ onPriceFocus, onPriceBlur });

        return { onPriceBlur };
      }

      it("should call `onPriceBlur`", () => {
        const { onPriceBlur } = setupNudgesOnBlur();

        const [priceNumberFieldFirstMock] = NudgesNumberInputField.mock.calls[0];
        act(() => {
          priceNumberFieldFirstMock.onFocus(true);
        });

        act(() => {
          priceNumberFieldFirstMock.onBlur();
        });

        expect(onPriceBlur).toHaveBeenCalled();
      });

      it("should not set `focused` prop to `false`", () => {
        setupNudgesOnBlur();

        const [priceNumberFieldFirstMock] = NudgesNumberInputField.mock.calls[0];
        act(() => {
          priceNumberFieldFirstMock.onFocus(true);
        });

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
        expect(NudgesNumberInputField).toHaveBeenCalledWith(
          expect.objectContaining({
            focused: false,
          }),
          undefined,
        );

        act(() => {
          priceNumberFieldFirstMock.onBlur();
        });

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
      });
    });

    describe("onSizeFocus", () => {
      describe("when NudgesNumberInputField `onFocus` is called", () => {
        it("should call `onSizeFocus` when focused only", () => {
          const onSizeFocus = jest.fn();
          renderExchangeInlinePlacePanel({ sizeInputId: "runner-size", onSizeFocus });

          const [sizeNumberFieldFirstMock] = NudgesNumberInputField.mock.calls[1];
          act(() => {
            sizeNumberFieldFirstMock.onFocus(false);
          });

          expect(onSizeFocus).not.toHaveBeenCalled();
          expect(NudgesNumberInputField).toHaveBeenCalledWith(
            expect.objectContaining({
              id: "runner-size",
              focused: false,
              hasCaret: false,
            }),
            undefined,
          );

          act(() => {
            sizeNumberFieldFirstMock.onFocus(true);
          });

          expect(onSizeFocus).toHaveBeenCalledTimes(1);
          expect(NudgesNumberInputField).toHaveBeenCalledWith(
            expect.objectContaining({
              id: "runner-size",
              focused: false,
              hasCaret: false,
            }),
            undefined,
          );
        });
      });
    });

    describe("onSizeBlur", () => {
      function setupCurrencyOnBlur() {
        const onSizeFocus = jest.fn();
        const onSizeBlur = jest.fn();

        renderExchangeInlinePlacePanel({ onSizeFocus, onSizeBlur });

        return { onSizeBlur };
      }

      it("should call `onSizeBlur`", () => {
        const { onSizeBlur } = setupCurrencyOnBlur();

        const [sizeNumberFieldMock] = NudgesNumberInputField.mock.calls[1];
        act(() => {
          sizeNumberFieldMock.onBlur();
        });

        expect(onSizeBlur).toHaveBeenCalled();
      });

      it("should not set `focused` prop to `true`", () => {
        setupCurrencyOnBlur();

        const [sizeNumberFieldFirstMock] = NudgesNumberInputField.mock.calls[1];
        act(() => {
          sizeNumberFieldFirstMock.onFocus(true);
        });

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
        expect(NudgesNumberInputField).toHaveBeenCalledWith(
          expect.objectContaining({
            focused: false,
          }),
          undefined,
        );

        act(() => {
          sizeNumberFieldFirstMock.onBlur();
        });

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
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

  describe("Alerts", () => {
    describe("when notifications are available", () => {
      it("should instantiate with proper values", () => {
        const notifications = [{ some: "notification" }, { and: "another" }];
        renderExchangeInlinePlacePanel({ notifications });

        expect(Alerts).toHaveBeenCalledTimes(1);
        expect(Alerts).toHaveBeenCalledWith(
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

        expect(Alerts).not.toHaveBeenCalled();
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

    describe("disabled", () => {
      describe("when isPlaceButtonDisabled is `true`", () => {
        it("should disable the component", () => {
          renderExchangeInlinePlacePanel({
            isPlaceButtonDisabled: true,
            disabled: false,
          });

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

          expect(PNLAndWhatIf).toHaveBeenCalledWith(
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

          expect(PNLAndWhatIf).toHaveBeenCalledWith(
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
        renderExchangeInlinePlacePanel({ quickStakes: [] });

        expect(QuickStakes).not.toHaveBeenCalled();
      });
    });
  });
});
