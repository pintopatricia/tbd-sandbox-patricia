import React from "react";
import { act, render } from "@testing-library/react";

import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types";
import {
  BetslipNotifications,
  Card,
  NudgesNumberInputField,
  PebbleList,
  PNLAndWhatIf,
  PrimaryButton,
  QuickStakes,
  SecondaryButton,
} from "@ppb/the-wall-web";

import { ExchangeInlineEditPanel } from "./ExchangeInlineEditPanel.web";

jest.mock("@ppb/the-wall-web", () => ({
  BetslipNotifications: jest.fn(() => <betslip-notifications-mock />),
  Card: jest.fn(({ children }) => <card-mock>{children}</card-mock>),
  NudgesNumberInputField: jest.fn(() => <nudges-number-input-field-mock />),
  PebbleList: jest.fn(() => <pebble-list-mock />),
  PNLAndWhatIf: jest.fn(() => <pnl-and-what-if-mock />),
  PrimaryButton: jest.fn(({ children, ...props }) => <primary-button-mock {...props}>{children}</primary-button-mock>),
  QuickStakes: jest.fn(() => <quick-stakes-mock />),
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
}));

function renderExchangeInlineEditPanel({
  priceInputId = "runnerUrn-price",
  sizeInputId = "runnerUrn-size",
  title,
  profitLabel,
  profitValue,
  profitRawValue,
  labels = {},
  placeLabel,
  loadingLabel,
  side = "BACK",
  price,
  size,
  currencySymbol,
  betDelay,
  hasPlaceError,
  isUpdateDisabled,
  isPriceDisabled,
  isSizeDisabled,
  isPersistenceMenuOpen,
  persistenceOptions = [],
  persistenceSelectedId,
  focusedInputId,
  quickStakes = [],
  notifications,
  areKeysDisplayed,
  onDone,
  onPriceNudgeDown,
  onPriceNudgeUp,
  onSizeNudgeDown,
  onSizeNudgeUp,
  onPriceChange,
  onPriceBlur,
  onPriceFocus,
  onSizeChange,
  onSizeBlur,
  onSizeFocus,
  onCancel,
  onUpdate,
  onPersistenceToggle,
  onPersistenceChange,
  onQuickStakeAdd,
  onKeyboardKeyPress,
  onKeyboardDeletePress,
} = {}) {
  return render(
    <ExchangeInlineEditPanel
      priceInputId={priceInputId}
      sizeInputId={sizeInputId}
      title={title}
      profitLabel={profitLabel}
      profitValue={profitValue}
      profitRawValue={profitRawValue}
      isUpdateDisabled={isUpdateDisabled}
      labels={labels}
      placeLabel={placeLabel}
      loadingLabel={loadingLabel}
      side={side}
      price={price}
      size={size}
      currencySymbol={currencySymbol}
      betDelay={betDelay}
      hasPlaceError={hasPlaceError}
      isPriceDisabled={isPriceDisabled}
      isSizeDisabled={isSizeDisabled}
      isPersistenceMenuOpen={isPersistenceMenuOpen}
      persistenceOptions={persistenceOptions}
      persistenceSelectedId={persistenceSelectedId}
      focusedInputId={focusedInputId}
      quickStakes={quickStakes}
      notifications={notifications}
      areKeysDisplayed={areKeysDisplayed}
      onDone={onDone}
      onPriceNudgeDown={onPriceNudgeDown}
      onPriceNudgeUp={onPriceNudgeUp}
      onSizeNudgeDown={onSizeNudgeDown}
      onSizeNudgeUp={onSizeNudgeUp}
      onPriceChange={onPriceChange}
      onPriceBlur={onPriceBlur}
      onPriceFocus={onPriceFocus}
      onSizeChange={onSizeChange}
      onSizeBlur={onSizeBlur}
      onSizeFocus={onSizeFocus}
      onCancel={onCancel}
      onUpdate={onUpdate}
      onPersistenceToggle={onPersistenceToggle}
      onPersistenceChange={onPersistenceChange}
      onQuickStakeAdd={onQuickStakeAdd}
      onKeyboardKeyPress={onKeyboardKeyPress}
      onKeyboardDeletePress={onKeyboardDeletePress}
    />,
  );
}

describe("ExchangeInlineEditPanel", () => {
  beforeEach(jest.clearAllMocks);

  describe("NudgesNumberInputField", () => {
    it("should be called with expected values", () => {
      const onPriceNudgeUp = jest.fn();
      const onPriceNudgeDown = jest.fn();
      const onSizeNudgeUp = jest.fn();
      const onSizeNudgeDown = jest.fn();
      const onPriceChange = jest.fn();
      const onPriceBlur = jest.fn();
      const onPriceFocus = jest.fn();
      const onSizeFocus = jest.fn();
      const onSizeBlur = jest.fn();
      const onSizeChange = jest.fn();

      renderExchangeInlineEditPanel({
        labels: { price: "priceMock", size: "sizeMock" },
        price: 2.2,
        isPriceDisabled: false,
        size: 10,
        currencySymbol: "€",
        isSizeDisabled: false,
        onPriceNudgeUp,
        onPriceNudgeDown,
        onPriceChange,
        onPriceBlur,
        onPriceFocus,
        onSizeFocus,
        onSizeBlur,
        onSizeNudgeUp,
        onSizeNudgeDown,
        onSizeChange,
      });

      expect(NudgesNumberInputField).toHaveBeenCalledWith(
        {
          id: "runnerUrn-price",
          value: 2.2,
          label: "priceMock",
          disabled: false,
          focused: false,
          hasCaret: false,
          onChange: onPriceChange,
          onFocus: expect.any(Function),
          onBlur: onPriceBlur,
          onNudgeUp: onPriceNudgeUp,
          onNudgeDown: onPriceNudgeDown,
        },
        undefined,
      );
      expect(NudgesNumberInputField).toHaveBeenCalledWith(
        {
          id: "runnerUrn-size",
          focused: false,
          hasCaret: false,
          value: 10,
          label: "sizeMock",
          currencySymbol: "€",
          disabled: false,
          onFocus: expect.any(Function),
          onBlur: onSizeBlur,
          onChange: onSizeChange,
          onNudgeUp: onSizeNudgeUp,
          onNudgeDown: onSizeNudgeDown,
        },
        undefined,
      );
      expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
    });

    describe("onPriceFocus", () => {
      it("should not update `focused` state", () => {
        renderExchangeInlineEditPanel({ onPriceFocus: jest.fn(), runner: "runnerUrn" });
        const [priceFieldFirstMock] = NudgesNumberInputField.mock.calls[0];

        act(() => {
          priceFieldFirstMock.onFocus(true);
        });

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
        expect(NudgesNumberInputField).toHaveBeenCalledWith(
          expect.objectContaining({
            id: "runnerUrn-price",
            focused: false,
            hasCaret: false,
          }),
          undefined,
        );

        act(() => {
          priceFieldFirstMock.onFocus(false);
        });

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
      });

      describe("when focused is true", () => {
        it("should call onPriceFocus prop", () => {
          const onPriceFocus = jest.fn();
          renderExchangeInlineEditPanel({ onPriceFocus, runner: "runnerUrn", focusedInputId: "runnerUrn-price" });
          const [priceField] = NudgesNumberInputField.mock.calls[0];

          act(() => {
            priceField.onFocus(true);
          });

          expect(onPriceFocus).toHaveBeenCalledWith(true);
          expect(onPriceFocus).toHaveBeenCalledTimes(1);
          expect(NudgesNumberInputField).toHaveBeenCalledWith(
            expect.objectContaining({
              id: "runnerUrn-price",
              focused: true,
              hasCaret: true,
            }),
            undefined,
          );
        });
      });
    });

    describe("onSizeFocus", () => {
      it("should not update `focused` state", () => {
        renderExchangeInlineEditPanel({ onSizeFocus: jest.fn(), runner: "runnerUrn" });
        const [sizeFieldFirstMock] = NudgesNumberInputField.mock.calls[1];

        act(() => {
          sizeFieldFirstMock.onFocus(true);
        });

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
        expect(NudgesNumberInputField).toHaveBeenCalledWith(
          expect.objectContaining({
            id: "runnerUrn-size",
            focused: false,
            hasCaret: false,
          }),
          undefined,
        );

        act(() => {
          sizeFieldFirstMock.onFocus(true);
        });

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
      });

      describe("when focused is true", () => {
        it("should call onSizeFocus prop", () => {
          const onSizeFocus = jest.fn();
          renderExchangeInlineEditPanel({ onSizeFocus, runner: "runnerUrn", focusedInputId: "runnerUrn-size" });
          const [sizeField] = NudgesNumberInputField.mock.calls[1];

          act(() => {
            sizeField.onFocus(true);
          });

          expect(onSizeFocus).toHaveBeenCalledWith(true);
          expect(onSizeFocus).toHaveBeenCalledTimes(1);
          expect(NudgesNumberInputField).toHaveBeenCalledWith(
            expect.objectContaining({
              id: "runnerUrn-size",
              focused: true,
              hasCaret: true,
            }),
            undefined,
          );
        });
      });
    });
  });

  describe("BetslipNotifications", () => {
    describe("when notifications are available", () => {
      it("should instantiate with proper values", () => {
        const notifications = [{ some: "notification" }, { and: "another" }];
        renderExchangeInlineEditPanel({ notifications });

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
        renderExchangeInlineEditPanel({ notifications: undefined });

        expect(BetslipNotifications).not.toHaveBeenCalled();
      });
    });
  });

  describe("SecondaryButton", () => {
    it("should be called with expected values", () => {
      const onCancelMock = jest.fn();
      renderExchangeInlineEditPanel({ labels: { cancel: "cancelMock" }, onCancel: onCancelMock });

      expect(SecondaryButton).toHaveBeenCalledWith(
        {
          label: "cancelMock",
          onTap: onCancelMock,
        },
        undefined,
      );
      expect(SecondaryButton).toHaveBeenCalledTimes(1);
    });
  });

  describe("PrimaryButton", () => {
    it("should be called with expected values", () => {
      const onUpdateMock = jest.fn();
      renderExchangeInlineEditPanel({
        profitLabel: "profitLabelMock",
        profitValue: "€22",
        profitRawValue: 22,
        placeLabel: "placeMock",
        loadingLabel: "loadingMock",
        betDelay: 42,
        hasPlaceError: false,
        onUpdate: onUpdateMock,
      });

      expect(PrimaryButton).toHaveBeenCalledWith(
        {
          label: "placeMock",
          secondaryLabel: "profitLabelMock",
          children: expect.any(Object),
          delay: 42,
          loadingLabel: "loadingMock",
          stopAnimation: false,
          disabled: undefined,
          onTap: onUpdateMock,
        },
        undefined,
      );
      expect(PrimaryButton).toHaveBeenCalledTimes(1);
    });
  });

  describe("PNLAndWhatIf", () => {
    it("should be called with expected values", () => {
      const onUpdateMock = jest.fn();
      renderExchangeInlineEditPanel({
        profitLabel: "profitLabelMock",
        profitValue: "€22",
        profitRawValue: 22,
        placeLabel: "placeMock",
        loadingLabel: "loadingMock",
        betDelay: 42,
        hasPlaceError: false,
        onUpdate: onUpdateMock,
      });

      expect(PNLAndWhatIf).toHaveBeenCalledWith(
        {
          pnl: "€22",
          rawPnl: 22,
          size: "medium",
          agnostic: true,
        },
        undefined,
      );
      expect(PNLAndWhatIf).toHaveBeenCalledTimes(1);
    });
  });

  describe("Card", () => {
    it("should be called with expected values", () => {
      const onPersistenceToggleMock = jest.fn();

      renderExchangeInlineEditPanel({
        isPersistenceMenuOpen: true,
        onPersistenceToggle: onPersistenceToggleMock,
      });

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          isCollapsible: true,
          fullWidthContent: true,
          onTitleClick: onPersistenceToggleMock,
          startOpen: true,
          theme: CardTheme.TRANSPARENT,
          size: CardHeaderSize.MEDIUM,
        }),
        undefined,
      );

      expect(Card).toHaveBeenCalledTimes(1);
    });

    describe("header", () => {
      describe("without selected option", () => {
        it("title should be persistence label", () => {
          renderExchangeInlineEditPanel({
            labels: { persistence: "who" },
            persistenceSelectedId: undefined,
            persistenceOptions: [
              { id: "chosenOne", text: "The chose one" },
              { id: "nope", text: "nope" },
            ],
          });

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              title: "who",
            }),
            undefined,
          );
        });
      });

      describe("with selected option", () => {
        it("title should be persistence label and the selected option text", () => {
          renderExchangeInlineEditPanel({
            labels: { persistence: "who" },
            persistenceSelectedId: "chosenOne",
            persistenceOptions: [
              { id: "chosenOne", text: "The chose one" },
              { id: "nope", text: "nope" },
            ],
          });

          expect(Card).toHaveBeenCalledWith(
            expect.objectContaining({
              title: "who: The chose one",
            }),
            undefined,
          );
        });
      });
    });
  });

  describe("PebbleList", () => {
    it("should be called with expected values", () => {
      const persistenceOptionsName = "optionsMock";
      const persistenceSelectedId = "option1";
      const persistenceOptions = [{ id: "option1", text: "option one" }];
      const onPersistenceChangeMock = jest.fn();

      renderExchangeInlineEditPanel({
        isDisabled: false,
        persistenceOptions,
        persistenceOptionsName,
        persistenceSelectedId,
        onPersistenceChange: onPersistenceChangeMock,
      });

      expect(PebbleList).toHaveBeenCalledWith(
        {
          items: persistenceOptions,
          defaultSelectedPebble: persistenceSelectedId,
          onPebbleClick: onPersistenceChangeMock,
        },
        undefined,
      );
      expect(PebbleList).toHaveBeenCalledTimes(1);
    });
  });

  describe("QuickStakes", () => {
    describe("when there are quick stakes", () => {
      it("should call QuickStakes with expected values", () => {
        const quickStakes = [{ stake: 10, displayStake: "+ €10" }];
        const onQuickStakeAdd = jest.fn();
        renderExchangeInlineEditPanel({ quickStakes, onQuickStakeAdd });

        expect(QuickStakes).toHaveBeenCalledWith(
          {
            quickStakes,
            onTouch: onQuickStakeAdd,
          },
          undefined,
        );
        expect(QuickStakes).toHaveBeenCalledTimes(1);
      });

      describe("when a quick stake is pressed", () => {
        it("should call provided callback", () => {
          const quickStakes = [{ stake: 10, displayStake: "+ €10" }];
          const onQuickStakeAdd = jest.fn();
          renderExchangeInlineEditPanel({ quickStakes, onQuickStakeAdd });

          act(() => {
            QuickStakes.mock.calls[0][0].onTouch(10);
          });

          expect(onQuickStakeAdd).toHaveBeenCalledWith(10);
        });
      });
    });

    describe("when there are no quick stakes", () => {
      it("should not call QuickStakes", () => {
        renderExchangeInlineEditPanel({ quickStakes: [] });

        expect(QuickStakes).not.toHaveBeenCalled();
      });
    });
  });
});
