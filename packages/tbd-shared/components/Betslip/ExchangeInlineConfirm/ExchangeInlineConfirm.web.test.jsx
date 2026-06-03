import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Styled } from "@ppb/the-wall-web";
import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { ExchangeInlineConfirm } from "./ExchangeInlineConfirm.web";
import { ExchangeInlineConfirmPanel } from "./snowflakes/ExchangeInlineConfirmPanel/ExchangeInlineConfirmPanel.web";

const dispatchConfirmBet = jest.fn();
const dispatchClose = jest.fn();
const dispatchEdit = jest.fn();
const dispatchDepositRedirect = jest.fn();
const dispatchNavigate = jest.fn();

jest.mock("@ppb/the-wall-web", () => ({
  Styled: jest.fn(() => <styled-mock />),
}));

jest.mock("./snowflakes/ExchangeInlineConfirmPanel/ExchangeInlineConfirmPanel.web", () => ({
  ExchangeInlineConfirmPanel: jest.fn(() => <exchange-confirm-panel-mock />),
}));

jest.mock("../betslip-deposit-redirect-mapper", () => ({
  buildDepositRedirectPayload: jest.fn().mockReturnValue({ viewUrn: "deposit:endpoint", viewUrl: "deposit.endpoint" }),
}));

function renderExchangeInlineConfirm(props) {
  const allProps = {
    urn: "runnerMock",
    profitLabel: "profitLabelMock",
    profitValue: "111",
    profitRawValue: 111,
    title: "titleMock",
    titlePrefix: "titlePrefixMock",
    side: ExchangeSide.BACK,
    size: 2,
    price: 1.23,
    currencySymbol: "currencySymbolMock",
    betDelay: 0,
    error: "placePanelErrorMock",
    isFreeBetsSelected: false,
    freebets: "",
    confirm: "I18N.BETSLIP.CONFIRM_BET",
    loading: "I18N.BETSLIP.PLACING_BET",
    isDepositRequired: false,
    dispatchConfirmBet,
    dispatchClose,
    dispatchEdit,
    dispatchDepositRedirect,
    dispatchNavigate,
    labels: {
      edit: "I18N.BETSLIP.EDIT_BET",
      price: "I18N.BETSLIP.ODDS",
      size: "I18N.BETSLIP.STAKE",
    },
    ...props,
  };
  return render(<ExchangeInlineConfirm {...allProps} />);
}

describe("ExchangeInlineConfirm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when there is no side", () => {
    it("should not call ExchangeInlineConfirmPanel", () => {
      renderExchangeInlineConfirm({
        side: undefined,
      });

      expect(ExchangeInlineConfirmPanel).not.toHaveBeenCalled();
    });

    it("should render nothing", () => {
      const betslip = renderExchangeInlineConfirm({
        side: undefined,
      });

      expect(betslip.container).toBeEmpty();
    });
  });

  describe("when there is no price", () => {
    it("should not call ExchangeInlineConfirmPanel", () => {
      renderExchangeInlineConfirm({
        price: undefined,
      });

      expect(ExchangeInlineConfirmPanel).not.toHaveBeenCalled();
    });

    it("should render nothing", () => {
      const betslip = renderExchangeInlineConfirm({
        price: undefined,
      });

      expect(betslip.container).toBeEmpty();
    });
  });

  describe("when there is no size", () => {
    it("should not call ExchangeInlineConfirmPanel", () => {
      renderExchangeInlineConfirm({
        size: undefined,
      });

      expect(ExchangeInlineConfirmPanel).not.toHaveBeenCalled();
    });

    it("should render nothing", () => {
      const betslip = renderExchangeInlineConfirm({
        size: undefined,
      });

      expect(betslip.container).toBeEmpty();
    });
  });

  describe("when there is no currencySymbol", () => {
    it("should not call ExchangeInlineConfirmPanel", () => {
      renderExchangeInlineConfirm({
        currencySymbol: undefined,
      });

      expect(ExchangeInlineConfirmPanel).not.toHaveBeenCalled();
    });

    it("should render nothing", () => {
      const betslip = renderExchangeInlineConfirm({
        currencySymbol: undefined,
      });

      expect(betslip.container).toBeEmpty();
    });
  });

  describe("when titlePrefix is provided", () => {
    it("should pass titlePrefix to ExchangeInlineConfirmPanel", () => {
      renderExchangeInlineConfirm({ titlePrefix: "titlePrefixMock" });

      expect(ExchangeInlineConfirmPanel).toHaveBeenCalledWith(
        expect.objectContaining({ titlePrefix: "titlePrefixMock" }),
        undefined,
      );
    });
  });

  describe("when titlePrefix is not provided", () => {
    it("should pass titlePrefix as undefined to ExchangeInlineConfirmPanel", () => {
      renderExchangeInlineConfirm({ titlePrefix: undefined });

      expect(ExchangeInlineConfirmPanel).toHaveBeenCalledWith(
        expect.objectContaining({ titlePrefix: undefined }),
        undefined,
      );
    });

    it("should still render ExchangeInlineConfirmPanel", () => {
      renderExchangeInlineConfirm({ titlePrefix: undefined });

      expect(ExchangeInlineConfirmPanel).toHaveBeenCalledTimes(1);
    });
  });

  describe("when urn is not provided and onConfirm is called", () => {
    it("should not call dispatchConfirmBet", () => {
      renderExchangeInlineConfirm({ urn: null });

      const { onConfirm } = ExchangeInlineConfirmPanel.mock.calls[0][0];
      onConfirm();

      expect(dispatchConfirmBet).toHaveBeenCalledTimes(0);
    });
  });

  describe("when there is all data", () => {
    it("should render ExchangeInlineConfirmPanel", () => {
      renderExchangeInlineConfirm();

      expect(ExchangeInlineConfirmPanel).toHaveBeenCalledWith(
        {
          profitLabel: "profitLabelMock",
          profitValue: "111",
          profitRawValue: 111,
          title: "titleMock",
          titlePrefix: "titlePrefixMock",
          side: ExchangeSide.BACK,
          size: 2,
          price: 1.23,
          currencySymbol: "currencySymbolMock",
          betDelay: 0,
          error: "placePanelErrorMock",
          isFreeBetsSelected: false,
          freeBets: undefined,
          confirm: expect.anything(),
          loading: "I18N.BETSLIP.PLACING_BET",
          onCancel: expect.any(Function),
          onConfirm: expect.any(Function),
          onEdit: expect.any(Function),
          labels: {
            edit: "I18N.BETSLIP.EDIT_BET",
            price: "I18N.BETSLIP.ODDS",
            size: "I18N.BETSLIP.STAKE",
          },
        },
        undefined,
      );
      render(ExchangeInlineConfirmPanel.mock.calls[0][0].confirm);
      expect(Styled).toHaveBeenCalledWith(
        { translation: "I18N.BETSLIP.CONFIRM_BET", styles: { depositTo: "typography-h220" } },
        undefined,
      );
      expect(ExchangeInlineConfirmPanel).toHaveBeenCalledTimes(1);
    });

    describe("and onEdit is called", () => {
      it("should call dispatchEdit", () => {
        renderExchangeInlineConfirm();

        const { onEdit } = ExchangeInlineConfirmPanel.mock.calls[0][0];
        onEdit();

        expect(dispatchEdit).toHaveBeenCalledWith();
        expect(dispatchEdit).toHaveBeenCalledTimes(1);
      });
    });

    describe("and onConfirm is called", () => {
      describe("when there is no deposit needed", () => {
        it("should call dispatchConfirmBet", () => {
          renderExchangeInlineConfirm({ isDepositRequired: false });

          const { onConfirm } = ExchangeInlineConfirmPanel.mock.calls[0][0];
          onConfirm();

          expect(dispatchConfirmBet).toHaveBeenCalledWith("runnerMock");
          expect(dispatchConfirmBet).toHaveBeenCalledTimes(1);
        });
      });

      describe("when there is a deposit needed", () => {
        it("should call dispatchDepositRedirect", () => {
          renderExchangeInlineConfirm({ isDepositRequired: true });

          const { onConfirm } = ExchangeInlineConfirmPanel.mock.calls[0][0];
          onConfirm();

          expect(dispatchDepositRedirect).toHaveBeenCalledWith();
          expect(dispatchDepositRedirect).toHaveBeenCalledTimes(1);
        });

        it("should call dispatchNavigate", () => {
          renderExchangeInlineConfirm({ isDepositRequired: true });

          const { onConfirm } = ExchangeInlineConfirmPanel.mock.calls[0][0];
          onConfirm();

          expect(dispatchNavigate).toHaveBeenCalledWith("deposit:endpoint", "deposit.endpoint");
          expect(dispatchNavigate).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("and onCancel is called", () => {
      it("should call dispachClose", () => {
        renderExchangeInlineConfirm();

        const { onCancel } = ExchangeInlineConfirmPanel.mock.calls[0][0];
        onCancel();

        expect(dispatchClose).toHaveBeenCalledWith();
        expect(dispatchClose).toHaveBeenCalledTimes(1);
      });
    });
  });
});
