import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { AlertType } from "@ppb/the-wall-common/types";
import { InlinePanelColorMap } from "../../../InlinePanel/InlinePanel.types";
import {
  FixedNumberInputField,
  CurrencyNumberInputField,
  FreeBets,
  SecondaryButton,
  PrimaryButton,
  PNLAndWhatIf,
  Alert,
} from "@ppb/the-wall-web";
import { InlinePanel } from "../../../InlinePanel/InlinePanel.web";
import { JurisdictionalOperatorInfo } from "../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.web";
import { ExchangeInlineConfirmPanel } from "./ExchangeInlineConfirmPanel.web";

jest.mock("../../../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.web", () => ({
  JurisdictionalOperatorInfo: jest.fn(() => <jurisdictional-operator-info-mock />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  FixedNumberInputField: jest.fn(() => <fixed-number-field-mock />),
  CurrencyNumberInputField: jest.fn(() => <currency-number-field-mock />),
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
  PrimaryButton: jest.fn(({ children, props }) => <primary-button-mock {...props}>{children}</primary-button-mock>),
  Alert: jest.fn(() => <alerts-mock />),
  FreeBets: jest.fn(() => <free-bets-mock />),
  PNLAndWhatIf: jest.fn(() => <pnl-and-what-if-mock />),
}));

jest.mock("../../../InlinePanel/InlinePanel.web", () => ({
  InlinePanel: jest.fn(({ children }) => (
    <inline-panel-panel-mock data-testid="inline-panel">{children}</inline-panel-panel-mock>
  )),
}));

function renderExchangeInlineConfirmPanel({
  labels = {},
  freeBets,
  titlePrefix,
  title,
  side,
  price,
  size,
  currencySymbol,
  profitLabel,
  profitValue,
  profitRawValue,
  betDelay,
  error,
  isFreeBetsSelected,
  onCancel,
  onEdit,
  onConfirm,
} = {}) {
  return render(
    <ExchangeInlineConfirmPanel
      labels={labels}
      freeBets={freeBets}
      titlePrefix={titlePrefix}
      title={title}
      side={side}
      price={price}
      size={size}
      confirm={labels.confirm}
      loading={labels.loading}
      currencySymbol={currencySymbol}
      profitLabel={profitLabel}
      profitValue={profitValue}
      profitRawValue={profitRawValue}
      betDelay={betDelay}
      error={error}
      isFreeBetsSelected={isFreeBetsSelected}
      onCancel={onCancel}
      onEdit={onEdit}
      onConfirm={onConfirm}
    />,
  );
}

describe("ExchangeInlineConfirmPanel", () => {
  beforeEach(jest.clearAllMocks);

  describe("InlinePanel", () => {
    describe.each(Object.entries(InlinePanelColorMap))("with %s side", (side, color) => {
      it(`should be called with expected values and ${color} color`, () => {
        const onCancelMock = jest.fn();
        renderExchangeInlineConfirmPanel({
          labels: {
            cancel: "cancelMock",
          },
          title: "titleMock",
          side,
          onCancel: onCancelMock,
        });

        expect(InlinePanel).toHaveBeenCalledWith(
          {
            title: "titleMock",
            onAction: onCancelMock,
            color,
            children: expect.anything(),
          },
          undefined,
        );
        expect(InlinePanel).toHaveBeenCalledTimes(1);
      });
    });

    describe("FixedNumberInputField", () => {
      it("should be called with expected values", () => {
        renderExchangeInlineConfirmPanel({ labels: { price: "priceMock" }, price: 2.2 });

        expect(FixedNumberInputField).toHaveBeenCalledWith({ value: 2.2, label: "priceMock" }, undefined);
        expect(FixedNumberInputField).toHaveBeenCalledTimes(1);
      });
    });

    describe("CurrencyNumberInputField", () => {
      it("should be called with expected values", () => {
        renderExchangeInlineConfirmPanel({ labels: { size: "sizeMock" }, size: 10, currencySymbol: "€" });

        expect(CurrencyNumberInputField).toHaveBeenCalledWith(
          {
            readonly: true,
            value: 10,
            label: "sizeMock",
            currencySymbol: "€",
          },
          undefined,
        );
        expect(CurrencyNumberInputField).toHaveBeenCalledTimes(1);
      });
    });

    describe("when isFreeBetsSelected is true", () => {
      it("should call FreeBets with expected values", () => {
        renderExchangeInlineConfirmPanel({ freeBets: "freeBetsMock", isFreeBetsSelected: true });

        expect(FreeBets).toHaveBeenCalledWith(
          {
            isReadOnly: true,
            label: "freeBetsMock",
            isSelected: true,
          },
          undefined,
        );
        expect(FreeBets).toHaveBeenCalledTimes(1);
      });
    });

    describe("error", () => {
      describe("when error is defined", () => {
        it("should call Alert with expected values", () => {
          renderExchangeInlineConfirmPanel({
            error: { message: "messageMock", detail: "detailMock" },
          });

          expect(Alert).toHaveBeenCalledWith(
            {
              message: "messageMock",
              detail: "detailMock",
              type: AlertType.Error,
            },
            undefined,
          );
          expect(Alert).toHaveBeenCalledTimes(1);
        });
      });

      describe("when error is not defined", () => {
        it("should not call Alert", () => {
          renderExchangeInlineConfirmPanel({
            error: undefined,
          });

          expect(Alert).not.toHaveBeenCalled();
        });
      });
    });

    describe("SecondaryButton", () => {
      it("should be called with expected values", () => {
        const onEditMock = jest.fn();
        renderExchangeInlineConfirmPanel({ labels: { edit: "editMock" }, onEdit: onEditMock });

        expect(SecondaryButton).toHaveBeenCalledWith(
          {
            label: "editMock",
            onTap: onEditMock,
          },
          undefined,
        );
        expect(SecondaryButton).toHaveBeenCalledTimes(1);
      });
    });

    describe("PrimaryButton", () => {
      it("should be called with expected values", () => {
        const onConfirmMock = jest.fn();
        renderExchangeInlineConfirmPanel({
          labels: { confirm: "confirmMock", loading: "loadingMock" },
          profitLabel: "Profit:",
          profitValue: "£22",
          profitRawValue: 22,
          betDelay: 42,
          error: false,
          onConfirm: onConfirmMock,
        });

        expect(PrimaryButton).toHaveBeenCalledWith(
          {
            label: "confirmMock",
            secondaryLabel: "Profit:",
            children: expect.any(Object),
            delay: 42,
            loadingLabel: "loadingMock",
            stopAnimation: false,
            onTap: onConfirmMock,
          },
          undefined,
        );
        expect(PrimaryButton).toHaveBeenCalledTimes(1);
      });
    });

    describe("PNLAndWhatIf", () => {
      it("should be called with expected values", () => {
        const onConfirmMock = jest.fn();
        renderExchangeInlineConfirmPanel({
          labels: { confirm: "confirmMock", loading: "loadingMock" },
          profitLabel: "Profit:",
          profitValue: "£22",
          profitRawValue: 22,
          betDelay: 42,
          error: false,
          onConfirm: onConfirmMock,
        });

        expect(PNLAndWhatIf).toHaveBeenCalledWith(
          {
            pnl: "£22",
            rawPnl: 22,
            size: "medium",
            agnostic: true,
          },
          undefined,
        );
        expect(PNLAndWhatIf).toHaveBeenCalledTimes(1);
      });
    });

    describe("Jurisdictional Operator Info", () => {
      beforeEach(() => {
        renderExchangeInlineConfirmPanel();
      });

      it("should render the JurisdictionalOperatorInfo component", () => {
        expect(JurisdictionalOperatorInfo).toHaveBeenCalled();
      });
    });

    describe("title", () => {
      const titlesMock = {
        titlePrefix: "Back (bet for)",
        title: "The market - The runner",
      };

      beforeEach(() => {
        renderExchangeInlineConfirmPanel(titlesMock);
      });

      it("should pass the correct titlePrefix and title to InlinePanel", () => {
        expect(InlinePanel).toHaveBeenCalledWith(expect.objectContaining(titlesMock), undefined);
      });
    });
  });
});
