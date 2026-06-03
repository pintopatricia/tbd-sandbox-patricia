import React from "react";
import { render, act } from "@testing-library/react-native";

import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types";

import {
  Alerts,
  Card,
  NudgesNumberInputField,
  PNLAndWhatIf,
  PrimaryButton,
  QuickStakes,
  PebbleList,
  SecondaryButton,
} from "@ppb/the-wall-native";

import { ExchangeInlineEditPanel } from "./ExchangeInlineEditPanel.native";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
  tokens: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Alerts: jest.fn(() => <alerts-mock />),
  Card: jest.fn(({ children }) => <card-mock>{children}</card-mock>),
  NudgesNumberInputField: jest.fn(() => <nudges-number-input-field-mock />),
  PebbleList: jest.fn(() => <pebble-list-mock />),
  PNLAndWhatIf: jest.fn(() => <pnl-and-what-if-mock />),
  PrimaryButton: jest.fn(({ children, ...props }) => <primary-button-mock {...props}>{children}</primary-button-mock>),
  QuickStakes: jest.fn(() => <quick-stakes-mock />),
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

function renderExchangeInlineEditPanel({
  priceInputId = "runner-price",
  sizeInputId = "runner-size",
  profitLabel,
  profitValue,
  profitRawValue,
  labels = {},
  placeLabel,
  loadingLabel,
  price,
  size,
  currencySymbol,
  betDelay,
  hasPlaceError,
  hasCaret,
  isUpdateDisabled,
  isPriceDisabled,
  isSizeDisabled,
  isPersistenceMenuOpen,
  persistenceOptions = [],
  persistenceSelectedId,
  quickStakes = [],
  notifications,
  focusedInputId,
  onPriceNudgeUp = jest.fn(),
  onPriceNudgeDown = jest.fn(),
  onSizeNudgeUp = jest.fn(),
  onSizeNudgeDown = jest.fn(),
  onPriceChange = jest.fn(),
  onPriceBlur = jest.fn(),
  onPriceFocus = jest.fn(),
  onSizeChange = jest.fn(),
  onSizeBlur = jest.fn(),
  onSizeFocus = jest.fn(),
  onCancel = jest.fn(),
  onUpdate = jest.fn(),
  onPersistenceToggle = jest.fn(),
  onPersistenceChange = jest.fn(),
  onQuickStakeAdd = jest.fn(),
} = {}) {
  return render(
    <ExchangeInlineEditPanel
      priceInputId={priceInputId}
      sizeInputId={sizeInputId}
      profitLabel={profitLabel}
      profitValue={profitValue}
      profitRawValue={profitRawValue}
      labels={labels}
      placeLabel={placeLabel}
      loadingLabel={loadingLabel}
      price={price}
      size={size}
      currencySymbol={currencySymbol}
      betDelay={betDelay}
      hasPlaceError={hasPlaceError}
      hasCaret={hasCaret}
      isUpdateDisabled={isUpdateDisabled}
      isPriceDisabled={isPriceDisabled}
      isSizeDisabled={isSizeDisabled}
      isPersistenceMenuOpen={isPersistenceMenuOpen}
      persistenceOptions={persistenceOptions}
      persistenceSelectedId={persistenceSelectedId}
      quickStakes={quickStakes}
      notifications={notifications}
      focusedInputId={focusedInputId}
      onPriceNudgeUp={onPriceNudgeUp}
      onPriceNudgeDown={onPriceNudgeDown}
      onSizeNudgeUp={onSizeNudgeUp}
      onSizeNudgeDown={onSizeNudgeDown}
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
    />,
  );
}

describe("ExchangeInlineEditPanel", () => {
  beforeEach(jest.clearAllMocks);

  describe("NudgesNumberInputField", () => {
    it("should be called with expected values", () => {
      renderExchangeInlineEditPanel({
        labels: { price: "priceMock", size: "sizeMock" },
        price: 2.2,
        isPriceDisabled: false,
        hasCaret: false,
        size: 10,
        currencySymbol: "€",
        isSizeDisabled: false,
      });

      expect(NudgesNumberInputField).toHaveBeenCalledWith(
        {
          id: "runner-price",
          disabled: false,
          label: "priceMock",
          value: 2.2,
          focused: false,
          hasCaret: false,
          onNudgeUp: expect.any(Function),
          onNudgeDown: expect.any(Function),
          onFocus: expect.any(Function),
          onBlur: expect.any(Function),
          onChange: expect.any(Function),
        },
        undefined,
      );
      expect(NudgesNumberInputField).toHaveBeenCalledWith(
        {
          id: "runner-size",
          disabled: false,
          label: "sizeMock",
          value: 10,
          focused: false,
          hasCaret: false,
          currencySymbol: "€",
          onFocus: expect.any(Function),
          onBlur: expect.any(Function),
          onChange: expect.any(Function),
          onNudgeUp: expect.any(Function),
          onNudgeDown: expect.any(Function),
        },
        undefined,
      );
      expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
    });

    describe("onPriceFocus", () => {
      it("should not update `focused` state", () => {
        renderExchangeInlineEditPanel({ onPriceFocus: jest.fn() });
        const [priceFieldFirstMock] = NudgesNumberInputField.mock.calls[0];

        act(() => {
          priceFieldFirstMock.onFocus(true);
        });

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
        expect(NudgesNumberInputField).toHaveBeenCalledWith(
          expect.objectContaining({
            id: "runner-price",
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
          renderExchangeInlineEditPanel({ onPriceFocus, focusedInputId: "runner-price" });
          const [priceField] = NudgesNumberInputField.mock.calls[0];

          act(() => {
            priceField.onFocus(true);
          });

          expect(onPriceFocus).toHaveBeenCalledWith(true);
          expect(onPriceFocus).toHaveBeenCalledTimes(1);
          expect(NudgesNumberInputField).toHaveBeenCalledWith(
            expect.objectContaining({
              id: "runner-price",
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
        renderExchangeInlineEditPanel({ onSizeFocus: jest.fn() });
        const [sizeFieldInitial] = NudgesNumberInputField.mock.calls[1];

        act(() => {
          sizeFieldInitial.onFocus(true);
        });

        expect(NudgesNumberInputField).toHaveBeenCalledTimes(2);
        expect(NudgesNumberInputField).toHaveBeenCalledWith(
          expect.objectContaining({
            id: "runner-size",
            focused: false,
            hasCaret: false,
          }),
          undefined,
        );
      });

      describe("when focused is true", () => {
        it("should call onSizeFocus prop", () => {
          const onSizeFocus = jest.fn();
          renderExchangeInlineEditPanel({ onSizeFocus, focusedInputId: "runner-size" });
          const [sizeField] = NudgesNumberInputField.mock.calls[1];

          act(() => {
            sizeField.onFocus(true);
          });

          expect(onSizeFocus).toHaveBeenCalledWith(true);
          expect(onSizeFocus).toHaveBeenCalledTimes(1);
          expect(NudgesNumberInputField).toHaveBeenCalledWith(
            expect.objectContaining({
              id: "runner-size",
              focused: true,
              hasCaret: true,
            }),
            undefined,
          );
        });
      });
    });
  });

  describe("Alerts", () => {
    describe("when notifications are available", () => {
      it("should instantiate with proper values", () => {
        const notifications = [{ some: "notification" }, { and: "another" }];
        renderExchangeInlineEditPanel({ notifications });

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
        renderExchangeInlineEditPanel({ notifications: undefined });

        expect(Alerts).not.toHaveBeenCalled();
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
        placeLabel: "placeMock",
        loadingLabel: "loadingMock",
        currencySymbol: "€",
        profitLabel: "profitMock",
        profitValue: "€22",
        profitRawValue: 22,
        betDelay: 42,
        hasPlaceError: false,
        onUpdate: onUpdateMock,
      });

      expect(PrimaryButton).toHaveBeenCalledWith(
        {
          label: "placeMock",
          secondaryLabel: "profitMock",
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
        placeLabel: "placeMock",
        loadingLabel: "loadingMock",
        currencySymbol: "€",
        profitLabel: "profitMock",
        profitValue: "€22",
        profitRawValue: 22,
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
      const persistenceSelectedId = "option1";
      const persistenceOptions = [{ id: "option1", text: "option one" }];
      const onPersistenceChangeMock = jest.fn();

      renderExchangeInlineEditPanel({
        isDisabled: false,
        persistenceOptions,
        persistenceSelectedId,
        onPersistenceChange: onPersistenceChangeMock,
      });

      expect(PebbleList).toHaveBeenCalledWith(
        {
          items: persistenceOptions,
          defaultSelectedPebble: persistenceSelectedId,
          onPebblePress: onPersistenceChangeMock,
        },
        undefined,
      );
      expect(PebbleList).toHaveBeenCalledTimes(1);
    });
  });

  describe("QuickStakes", () => {
    it("should be called with expected values", () => {
      const quickStakes = [{ stake: 10, displayStake: "+ €10" }];
      const onQuickStakeAdd = jest.fn();
      renderExchangeInlineEditPanel({ areKeysDisplayed: true, quickStakes, onQuickStakeAdd });

      expect(QuickStakes).toHaveBeenCalledWith(
        {
          quickStakes,
          onTouch: onQuickStakeAdd,
        },
        undefined,
      );
      expect(QuickStakes).toHaveBeenCalledTimes(1);
    });
  });
});
