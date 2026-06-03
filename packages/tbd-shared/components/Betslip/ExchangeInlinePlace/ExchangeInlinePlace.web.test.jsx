import { render, act } from "@testing-library/react";

import { InlinePanel } from "../InlinePanel/InlinePanel.web";
import { InlinePanelColorMap } from "../InlinePanel/InlinePanel.types";

import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { NotificationKeys, useNotifications } from "../../../hooks/useNotifications";
import { getAuthData } from "../../../config/endpoints";
import { JurisdictionalOperatorInfo } from "../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.web";

import { ExchangeInlinePlacePanel } from "./snowflakes/ExchangeInlinePlacePanel/ExchangeInlinePlacePanel.web";
import { ExchangeInlinePlace } from "./ExchangeInlinePlace.web";

const mockSetFocusedKeyboardControls = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    focusedKeyboardControls: {
      focusedInputId: "focusedInputId",
    },
    setFocusedKeyboardControls: mockSetFocusedKeyboardControls,
  })),
  useLayoutEffect: jest.fn(),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Styled: jest.fn(() => <styled-mock />),
}));

jest.mock("../../../hooks/useNotifications", () => ({
  ...jest.requireActual("../../../hooks/useNotifications"),
  useNotifications: jest.fn(() => ({
    addNotifications: jest.fn(() => "addNotifications"),
    clearNotifications: jest.fn(() => "clearNotifications"),
  })),
}));

jest.mock("../InlinePanel/InlinePanel.web", () => ({
  InlinePanel: jest.fn(({ children }) => (
    <inline-panel-panel-mock data-testid="inline-panel">{children}</inline-panel-panel-mock>
  )),
}));

jest.mock("../Keyboard/withKeyboard.web", () => ({
  withKeyboard: jest.fn((component) => component),
}));

jest.mock("../betslip-deposit-redirect-mapper", () => ({
  buildDepositRedirectPayload: jest.fn(() => ({ viewUrn: "viewUrn", viewUrl: "viewUrl" })),
}));

jest.mock("../../../config/endpoints", () => ({
  getAuthData: jest.fn().mockReturnValue({ SSO_URL: "ssoUrlMock" }),
}));

jest.mock("./snowflakes/ExchangeInlinePlacePanel/ExchangeInlinePlacePanel.web", () => ({
  ExchangeInlinePlacePanel: jest.fn(() => <exchange-inline-place-panel-mock />),
}));

jest.mock("../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.web", () => ({
  JurisdictionalOperatorInfo: jest.fn(() => <jurisdictional-operator-info-mock />),
}));

global.window = Object.create(window);
Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting",
  },
});

const quickStakesMock = [
  { stake: 5, displayStake: "+5" },
  { stake: 10, displayStake: "+10" },
  { stake: 20, displayStake: "+20" },
  { stake: 50, displayStake: "+50" },
];

const priceErrorMock = {
  newPrice: 99,
  notification: {
    type: "warn",
    message: "price error msg",
    details: "price error details",
  },
};

const DEFAULT_PROPS = {
  title: "some title",
  profitLabel: "some profitLabel",
  profitValue: "some profitValue",
  profitRawValue: 111,
  runner: "some runner",
  hasPlaceError: false,
  currencySymbol: "some currencySymbol",
  isPlacing: false,
  betDelay: 0,
  prefersConfirm: false,
  placeBtnLabel: "some placeBtnLabel",
  loadingLabel: "some loadingLabel",
  pricePlaceholder: "some pricePlaceholder",
  sizePlaceholder: "some sizePlaceholder",
  freeBetsLabel: "some freeBetsLabel",
  dispatchExchangeSizeInputChangeAction: jest.fn(),
  dispatchExchangePriceInputChangeAction: jest.fn(),
  dispatchExchangePriceNudgeUpAction: jest.fn(),
  dispatchExchangePriceNudgeDownAction: jest.fn(),
  dispatchExchangeSizeNudgeUpAction: jest.fn(),
  dispatchExchangeSizeNudgeDownAction: jest.fn(),
  dispatchIncrementByQuickStakeAction: jest.fn(),
  dispatchExchangeBonusChangeAction: jest.fn(),
  dispatchExchangePlaceBetAction: jest.fn(),
  dispatchCloseAction: jest.fn(),
  dispatchLogin: jest.fn(),
  dispatchDepositRedirect: jest.fn(),
  dispatchNavigate: jest.fn(),
  dispatchLoginToPlaceBetAction: jest.fn(),
};

function renderExchangeInlinePlace(props) {
  const mergedProps = { ...DEFAULT_PROPS, ...props };
  return render(<ExchangeInlinePlace {...mergedProps} />);
}

describe("ExchangeInlinePlacePanel", () => {
  beforeEach(jest.clearAllMocks);

  describe("InlinePanel", () => {
    describe.each(Object.entries(InlinePanelColorMap))("with %s side", (side, color) => {
      it(`should be called with expected values and ${color} color`, () => {
        renderExchangeInlinePlace({
          side,
          quickStakes: quickStakesMock,
          dispatchCloseAction: jest.fn(),
        });

        expect(InlinePanel).toHaveBeenCalledWith(
          {
            children: expect.anything(),
            color,
            onAction: expect.any(Function),
            title: "some title",
          },
          undefined,
        );
      });
    });

    describe("onAction", () => {
      const dispatchExchangeSelectionRemoveAction = jest.fn();
      const dispatchCloseAction = jest.fn();

      describe("when the runner is undefined", () => {
        beforeEach(() => {
          renderExchangeInlinePlace({
            side: ExchangeSide.LAY,
            quickStakes: quickStakesMock,
            runner: undefined,
            dispatchExchangeSelectionRemoveAction,
            dispatchCloseAction,
          });

          act(() => {
            InlinePanel.mock.calls[0][0].onAction();
          });
        });

        it("should not call dispatchExchangeSelectionRemoveAction", () => {
          expect(dispatchExchangeSelectionRemoveAction).not.toHaveBeenCalled();
        });

        it("should call dispatchCloseAction", () => {
          expect(dispatchCloseAction).toHaveBeenCalled();
        });
      });

      describe("when the runner and side are defined", () => {
        beforeEach(() => {
          renderExchangeInlinePlace({
            side: ExchangeSide.LAY,
            quickStakes: quickStakesMock,
            runner: "some runner",
            dispatchExchangeSelectionRemoveAction,
            dispatchCloseAction,
          });

          act(() => {
            InlinePanel.mock.calls[0][0].onAction();
          });
        });

        it("should call dispatchExchangeSelectionRemoveAction", () => {
          expect(dispatchExchangeSelectionRemoveAction).toHaveBeenCalledWith("some runner", ExchangeSide.LAY);
        });

        it("should call dispatchCloseAction", () => {
          expect(dispatchCloseAction).toHaveBeenCalled();
        });
      });
    });

    describe("Jurisdictional Operator Info", () => {
      beforeEach(() => {
        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          quickStakes: quickStakesMock,
        });
      });

      it("should render the JurisdictionalOperatorInfo component", () => {
        expect(JurisdictionalOperatorInfo).toHaveBeenCalled();
      });
    });
  });

  describe("when there is a side and quickStakes", () => {
    it("should provide mapped props to ExchangeInlinePlacePanel", () => {
      renderExchangeInlinePlace({
        runner: "runner",
        side: ExchangeSide.LAY,
        size: 2,
        price: 1.01,
        quickStakes: quickStakesMock,
      });

      expect(ExchangeInlinePlacePanel).toHaveBeenCalledWith(
        {
          sizeInputId: "runner-size",
          priceInputId: "runner-price",
          disabled: false,
          hasFreeBets: false,
          hasPlaceError: false,
          isFreeBetsSelected: false,
          isPlaceButtonDisabled: false,
          betDelay: 0,
          currencySymbol: "some currencySymbol",
          loadingLabel: "some loadingLabel",
          profitLabel: "some profitLabel",
          profitValue: "some profitValue",
          profitRawValue: 111,
          placeBtnLabel: expect.anything(),
          pricePlaceholder: "some pricePlaceholder",
          freeBetsLabel: "some freeBetsLabel",
          quickStakes: quickStakesMock,
          sizePlaceholder: "some sizePlaceholder",
          price: 1.01,
          size: 2,
          focusedInputId: "focusedInputId",
          onFreeBetsChange: expect.any(Function),
          onPriceNudgeDown: expect.any(Function),
          onPriceNudgeUp: expect.any(Function),
          onSizeNudgeDown: expect.any(Function),
          onSizeNudgeUp: expect.any(Function),
          onPlaceClick: expect.any(Function),
          onPriceChange: expect.any(Function),
          onPriceBlur: expect.any(Function),
          onPriceFocus: expect.any(Function),
          onQuickStakeTouch: expect.any(Function),
          onSizeChange: expect.any(Function),
          onSizeBlur: expect.any(Function),
          onSizeFocus: expect.any(Function),
          onSizeMouseDown: expect.any(Function),
          onPriceMouseDown: expect.any(Function),
          scrollIntoViewOptions: { offset: 101 },
        },
        undefined,
      );
    });

    describe("when isDepositRequired is true", () => {
      it("should pass Styled with correct parameters in placeBtnLabel prop", () => {
        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
          isDepositRequired: true,
        });

        const [args] = ExchangeInlinePlacePanel.mock.calls[0];

        expect(args.placeBtnLabel.props).toEqual({
          translation: "some placeBtnLabel",
          styles: { depositTo: "typography-h220" },
        });
      });
    });

    describe("and on onPriceNudgeUp is called", () => {
      it("should delegate to nudgeUpClick", () => {
        const dispatchExchangePriceNudgeUpAction = jest.fn();
        renderExchangeInlinePlace({
          dispatchExchangePriceNudgeUpAction,
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onPriceNudgeUp } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onPriceNudgeUp();
        });

        expect(dispatchExchangePriceNudgeUpAction).toHaveBeenCalledWith("some runner", ExchangeSide.LAY);
        expect(dispatchExchangePriceNudgeUpAction).toHaveBeenCalledTimes(1);
      });

      it("should call clearNotifications", () => {
        const clearNotifications = jest.fn();
        useNotifications.mockReturnValue({ clearNotifications });

        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onPriceNudgeUp } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onPriceNudgeUp();
        });

        expect(clearNotifications).toHaveBeenCalledTimes(1);
        expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Price);
      });
    });

    describe("and on onPriceNudgeDown is called", () => {
      it("should delegate to nudgeDownClick", () => {
        const dispatchExchangePriceNudgeDownAction = jest.fn();
        renderExchangeInlinePlace({
          dispatchExchangePriceNudgeDownAction,
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onPriceNudgeDown } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onPriceNudgeDown();
        });

        expect(dispatchExchangePriceNudgeDownAction).toHaveBeenCalledWith("some runner", ExchangeSide.LAY);
        expect(dispatchExchangePriceNudgeDownAction).toHaveBeenCalledTimes(1);
      });

      it("should call clearNotifications", () => {
        const clearNotifications = jest.fn();
        useNotifications.mockReturnValue({ clearNotifications });

        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onPriceNudgeDown } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onPriceNudgeDown();
        });

        expect(clearNotifications).toHaveBeenCalledTimes(1);
        expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Price);
      });
    });

    describe("and on onSizeNudgeUp is called", () => {
      it("should delegate to nudgeUpClick", () => {
        const dispatchExchangeSizeNudgeUpAction = jest.fn();
        renderExchangeInlinePlace({
          dispatchExchangeSizeNudgeUpAction,
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onSizeNudgeUp } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onSizeNudgeUp();
        });

        expect(dispatchExchangeSizeNudgeUpAction).toHaveBeenCalledWith("some runner", ExchangeSide.LAY);
        expect(dispatchExchangeSizeNudgeUpAction).toHaveBeenCalledTimes(1);
      });

      it("should call clearNotifications", () => {
        const clearNotifications = jest.fn();
        useNotifications.mockReturnValue({ clearNotifications });

        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onSizeNudgeUp } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onSizeNudgeUp();
        });

        expect(clearNotifications).toHaveBeenCalledTimes(1);
        expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Size);
      });
    });

    describe("and on onSizeNudgeDown is called", () => {
      it("should delegate to nudgeDownClick", () => {
        const dispatchExchangeSizeNudgeDownAction = jest.fn();
        renderExchangeInlinePlace({
          dispatchExchangeSizeNudgeDownAction,
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onSizeNudgeDown } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onSizeNudgeDown();
        });

        expect(dispatchExchangeSizeNudgeDownAction).toHaveBeenCalledWith("some runner", ExchangeSide.LAY);
        expect(dispatchExchangeSizeNudgeDownAction).toHaveBeenCalledTimes(1);
      });

      it("should call clearNotifications", () => {
        const clearNotifications = jest.fn();
        useNotifications.mockReturnValue({ clearNotifications });

        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onSizeNudgeDown } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onSizeNudgeDown();
        });

        expect(clearNotifications).toHaveBeenCalledTimes(1);
        expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Size);
      });
    });

    describe("and on onPlaceClick is called", () => {
      describe("when logged in", () => {
        it("should call dispatchExchangePlaceBetAction", () => {
          const dispatchExchangePlaceBetAction = jest.fn();
          renderExchangeInlinePlace({
            dispatchExchangePlaceBetAction,
            prefersConfirm: true,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            isLoggedIn: true,
          });

          const { onPlaceClick } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onPlaceClick();
          });

          expect(dispatchExchangePlaceBetAction).toHaveBeenCalledTimes(1);
          expect(dispatchExchangePlaceBetAction).toHaveBeenCalledWith("some runner", true);
        });
      });

      describe("when logged out", () => {
        const dispatchLogin = jest.fn();
        const dispatchLoginToPlaceBetAction = jest.fn();

        it("should call dispatchLoginToPlaceBetAction and dispatchLogin with the correct payload", () => {
          renderExchangeInlinePlace({
            prefersConfirm: true,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            dispatchLogin,
            isLoggedIn: false,
            dispatchLoginToPlaceBetAction,
          });

          ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();

          expect(dispatchLoginToPlaceBetAction).toHaveBeenCalledWith(ExchangeSide.LAY);

          expect(dispatchLogin).toHaveBeenCalledTimes(1);
          expect(dispatchLogin).toHaveBeenCalledWith("ssoUrlMock&url=https%3A%2F%2Fwww.betfair.com%2Fbetting");
        });

        describe("when getAuthData returns null", () => {
          it("should call dispatchLoginToPlaceBetAction and dispatchLogin with the correct payload", () => {
            getAuthData.mockReturnValueOnce(null);

            renderExchangeInlinePlace({
              prefersConfirm: true,
              side: ExchangeSide.BACK,
              size: 2,
              price: 1.01,
              quickStakes: quickStakesMock,
              dispatchLogin,
              isLoggedIn: false,
              dispatchLoginToPlaceBetAction,
            });

            ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();

            expect(dispatchLoginToPlaceBetAction).toHaveBeenCalledWith(ExchangeSide.BACK);

            expect(dispatchLogin).toHaveBeenCalledTimes(1);
            expect(dispatchLogin).toHaveBeenCalledWith("undefined&url=https%3A%2F%2Fwww.betfair.com%2Fbetting");
          });
        });
      });

      describe("and isDepositRequired is true", () => {
        it("should call dispatchDepositRedirect", () => {
          const dispatchDepositRedirect = jest.fn();
          renderExchangeInlinePlace({
            prefersConfirm: true,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            isDepositRequired: true,
            isLoggedIn: true,
            dispatchDepositRedirect,
          });

          act(() => {
            ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();
          });

          expect(dispatchDepositRedirect).toHaveBeenCalled();
        });

        it("should call dispatchNavigate", () => {
          const dispatchNavigate = jest.fn();
          renderExchangeInlinePlace({
            prefersConfirm: true,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            isDepositRequired: true,
            isLoggedIn: true,
            dispatchNavigate,
          });

          act(() => {
            ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();
          });

          expect(dispatchNavigate).toHaveBeenCalledWith("viewUrn", "viewUrl");
        });

        it("should not call dispatchExchangePlaceBetAction", () => {
          const dispatchExchangePlaceBetAction = jest.fn();
          renderExchangeInlinePlace({
            dispatchExchangePlaceBetAction,
            prefersConfirm: true,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            isDepositRequired: true,
            isLoggedIn: true,
            dispatchDepositRedirect: jest.fn(),
          });

          act(() => {
            ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();
          });

          expect(dispatchExchangePlaceBetAction).toHaveBeenCalledTimes(0);
        });
      });

      describe("and isDepositRequired is false", () => {
        it("should not call dispatchDepositRedirect", () => {
          const dispatchDepositRedirect = jest.fn();
          const dispatchNavigate = jest.fn();
          renderExchangeInlinePlace({
            prefersConfirm: true,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            isDepositRequired: false,
            dispatchDepositRedirect,
            dispatchNavigate,
          });

          act(() => {
            ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();
          });

          expect(dispatchDepositRedirect).toHaveBeenCalledTimes(0);
        });

        it("should not call dispatchNavigate", () => {
          const dispatchDepositRedirect = jest.fn();
          const dispatchNavigate = jest.fn();
          renderExchangeInlinePlace({
            prefersConfirm: true,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            isDepositRequired: false,
            dispatchDepositRedirect,
            dispatchNavigate,
          });

          act(() => {
            ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();
          });

          expect(dispatchNavigate).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe("and on onPriceChange is called", () => {
      it("should call clearNotifications", () => {
        const clearNotifications = jest.fn();
        useNotifications.mockReturnValue({ clearNotifications });

        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onPriceChange } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onPriceChange(100);
        });

        expect(clearNotifications).toHaveBeenCalledTimes(1);
        expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Price);
      });

      it("should delegate to priceInputChange", () => {
        const dispatchExchangePriceInputChangeAction = jest.fn();
        renderExchangeInlinePlace({
          dispatchExchangePriceInputChangeAction,
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onPriceChange } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onPriceChange(10);
        });

        expect(dispatchExchangePriceInputChangeAction).toHaveBeenCalledWith("some runner", ExchangeSide.LAY, 10, 2);
        expect(dispatchExchangePriceInputChangeAction).toHaveBeenCalledTimes(1);
      });
    });

    describe("and on onPriceBlur is called", () => {
      describe("and when there are price errors", () => {
        it("should delegate to priceInputBlur", () => {
          const dispatchExchangePriceInputBlurAction = jest.fn();
          const priceError = { newPrice: "some new price" };
          useNotifications.mockReturnValue({
            clearNotifications: jest.fn(),
            addNotifications: jest.fn(),
          });

          renderExchangeInlinePlace({
            dispatchExchangePriceInputBlurAction,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            priceError,
          });

          const { onPriceBlur } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onPriceBlur();
          });

          expect(dispatchExchangePriceInputBlurAction).toHaveBeenCalledWith(
            "some runner",
            ExchangeSide.LAY,
            "some new price",
            2,
          );
        });

        it("should call addNotifications with price error notification", () => {
          const addNotifications = jest.fn();
          const dispatchExchangePriceInputBlurAction = jest.fn();
          const priceError = { notification: "some price error" };
          useNotifications.mockReturnValue({
            clearNotifications: jest.fn(),
            addNotifications,
          });

          renderExchangeInlinePlace({
            dispatchExchangePriceInputBlurAction,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            priceError,
          });

          const { onPriceBlur } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onPriceBlur();
          });

          expect(addNotifications).toHaveBeenCalledWith({ price: priceError.notification });
        });
      });

      describe("and when there are no price errors", () => {
        it("should not delegate to priceInputBlur", () => {
          const dispatchExchangePriceInputBlurAction = jest.fn();
          useNotifications.mockReturnValue({
            clearNotifications: jest.fn(),
            addNotifications: jest.fn(),
          });

          renderExchangeInlinePlace({
            dispatchExchangePriceInputBlurAction,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onPriceBlur } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onPriceBlur();
          });

          expect(dispatchExchangePriceInputBlurAction).not.toHaveBeenCalled();
        });

        it("should call addNotifications with price error notification", () => {
          const addNotifications = jest.fn();
          useNotifications.mockReturnValue({
            clearNotifications: jest.fn(),
            addNotifications,
          });

          renderExchangeInlinePlace({
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onPriceBlur } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onPriceBlur();
          });

          expect(addNotifications).not.toHaveBeenCalled();
        });
      });
    });

    describe("and on onSizeBlur is called", () => {
      describe("and when there are size errors", () => {
        it("should delegate to sizeInputBlur", () => {
          const dispatchExchangeSizeInputBlurAction = jest.fn();
          const sizeError = { newSize: "some new size" };
          useNotifications.mockReturnValue({
            clearNotifications: jest.fn(),
            addNotifications: jest.fn(),
          });

          renderExchangeInlinePlace({
            dispatchExchangeSizeInputBlurAction,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            sizeError,
          });

          const { onSizeBlur } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onSizeBlur();
          });

          expect(dispatchExchangeSizeInputBlurAction).toHaveBeenCalledWith(
            "some runner",
            ExchangeSide.LAY,
            1.01,
            "some new size",
          );
        });

        it("should call addNotifications with size error notification", () => {
          const addNotifications = jest.fn();
          const dispatchExchangeSizeInputBlurAction = jest.fn();
          const sizeError = { notification: "some size error" };
          useNotifications.mockReturnValue({
            clearNotifications: jest.fn(),
            addNotifications,
          });

          renderExchangeInlinePlace({
            dispatchExchangeSizeInputBlurAction,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            sizeError,
          });

          const { onSizeBlur } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onSizeBlur();
          });

          expect(addNotifications).toHaveBeenCalledWith({ size: sizeError.notification });
        });
      });

      describe("and when there are no size errors", () => {
        it("should not delegate to sizeInputBlur", () => {
          const dispatchExchangeSizeInputBlurAction = jest.fn();
          useNotifications.mockReturnValue({
            clearNotifications: jest.fn(),
            addNotifications: jest.fn(),
          });

          renderExchangeInlinePlace({
            dispatchExchangeSizeInputBlurAction,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onSizeBlur } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onSizeBlur();
          });

          expect(dispatchExchangeSizeInputBlurAction).not.toHaveBeenCalled();
        });

        it("should call addNotifications with size error notification", () => {
          const addNotifications = jest.fn();
          useNotifications.mockReturnValue({
            clearNotifications: jest.fn(),
            addNotifications,
          });

          renderExchangeInlinePlace({
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onSizeBlur } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onSizeBlur();
          });

          expect(addNotifications).not.toHaveBeenCalled();
        });
      });
    });

    describe("and on onSizeChange is called", () => {
      it("should call clearNotifications", () => {
        const clearNotifications = jest.fn();
        useNotifications.mockReturnValue({ clearNotifications });

        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onSizeChange } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onSizeChange(100);
        });

        expect(clearNotifications).toHaveBeenCalledTimes(1);
        expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Size);
      });

      it("should delegate to sizeInputChange", () => {
        const dispatchExchangeSizeInputChangeAction = jest.fn();
        renderExchangeInlinePlace({
          dispatchExchangeSizeInputChangeAction,
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onSizeChange } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onSizeChange(200);
        });

        expect(dispatchExchangeSizeInputChangeAction).toHaveBeenCalledWith("some runner", ExchangeSide.LAY, 1.01, 200);
        expect(dispatchExchangeSizeInputChangeAction).toHaveBeenCalledTimes(1);
      });
    });

    describe("and when onPriceFocus is called", () => {
      describe("when clicking from a nudge button (inputMouseDownRef is false)", () => {
        const clearNotifications = jest.fn();
        const dispatchExchangePriceInputChangeAction = jest.fn();

        beforeEach(() => {
          useNotifications.mockReturnValue({ clearNotifications });

          renderExchangeInlinePlace({
            dispatchExchangePriceInputChangeAction,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onPriceFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onPriceFocus();
          });
        });

        it("should clear notifications", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Price);
        });

        it("should NOT clear the input value", () => {
          expect(dispatchExchangePriceInputChangeAction).not.toHaveBeenCalled();
        });
      });

      describe("when clicking directly on the input (inputMouseDownRef is true)", () => {
        const clearNotifications = jest.fn();
        const dispatchExchangePriceInputChangeAction = jest.fn();

        beforeEach(() => {
          useNotifications.mockReturnValue({ clearNotifications });

          renderExchangeInlinePlace({
            dispatchExchangePriceInputChangeAction,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onPriceMouseDown, onPriceFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onPriceMouseDown({ target: { closest: () => null } }); // target is not a button
            onPriceFocus();
          });
        });

        it("should clear notifications", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Price);
        });

        it("should clear the input value", () => {
          expect(dispatchExchangePriceInputChangeAction).toHaveBeenCalledWith(
            "some runner",
            ExchangeSide.LAY,
            undefined,
            2,
          );
        });
      });
    });

    describe("and when onSizeFocus is called", () => {
      describe("when clicking from a nudge button (inputMouseDownRef is false)", () => {
        const clearNotifications = jest.fn();
        const dispatchExchangeSizeInputChangeAction = jest.fn();

        beforeEach(() => {
          useNotifications.mockReturnValue({ clearNotifications });

          renderExchangeInlinePlace({
            dispatchExchangeSizeInputChangeAction,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onSizeFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onSizeFocus();
          });
        });

        it("should clear notifications", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Size);
        });

        it("should NOT clear the input value", () => {
          expect(dispatchExchangeSizeInputChangeAction).not.toHaveBeenCalled();
        });
      });

      describe("when clicking directly on the input (inputMouseDownRef is true)", () => {
        const clearNotifications = jest.fn();
        const dispatchExchangeSizeInputChangeAction = jest.fn();

        beforeEach(() => {
          useNotifications.mockReturnValue({ clearNotifications });

          renderExchangeInlinePlace({
            dispatchExchangeSizeInputChangeAction,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onSizeMouseDown, onSizeFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onSizeMouseDown({ target: { closest: () => null } });
            onSizeFocus();
          });
        });

        it("should clear notifications", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Size);
        });

        it("should clear the input value", () => {
          expect(dispatchExchangeSizeInputChangeAction).toHaveBeenCalledWith(
            "some runner",
            ExchangeSide.LAY,
            1.01,
            undefined,
          );
        });
      });
    });

    describe("and on onQuickStakeTouch is called", () => {
      it("should call dispatchIncrementByQuickStakeAction when size input is not focused", () => {
        const dispatchIncrementByQuickStakeAction = jest.fn();
        renderExchangeInlinePlace({
          dispatchIncrementByQuickStakeAction,
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onQuickStakeTouch } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onQuickStakeTouch(10);
        });

        expect(dispatchIncrementByQuickStakeAction).toHaveBeenCalledTimes(1);
        expect(dispatchIncrementByQuickStakeAction).toHaveBeenCalledWith(
          "some runner",
          ExchangeSide.LAY,
          10,
          "some currencySymbol",
        );
      });

      it("should call clearNotifications", () => {
        const clearNotifications = jest.fn();
        useNotifications.mockReturnValue({ clearNotifications });

        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onQuickStakeTouch } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onQuickStakeTouch(10);
        });

        expect(clearNotifications).toHaveBeenCalledTimes(1);
      });

      describe("when the size input is focused and has a decimal display value", () => {
        const defaultContextValue = {
          focusedKeyboardControls: { focusedInputId: "focusedInputId" },
          setFocusedKeyboardControls: mockSetFocusedKeyboardControls,
        };

        beforeEach(() => {
          require("react").useContext.mockReturnValue({
            focusedKeyboardControls: { focusedInputId: "some runner-size" },
            setFocusedKeyboardControls: mockSetFocusedKeyboardControls,
          });
          jest.spyOn(document, "getElementById").mockImplementation((id) => {
            if (id === "some runner-size") {
              return { value: "1.5" };
            }
            return null;
          });
        });

        afterEach(() => {
          require("react").useContext.mockReturnValue(defaultContextValue);
          document.getElementById.mockRestore();
        });

        it("should call dispatchExchangeSizeInputChangeAction with decoded value + quickStakeValue", () => {
          const dispatchExchangeSizeInputChangeAction = jest.fn();
          const dispatchIncrementByQuickStakeAction = jest.fn();

          renderExchangeInlinePlace({
            dispatchExchangeSizeInputChangeAction,
            dispatchIncrementByQuickStakeAction,
            side: ExchangeSide.LAY,
            size: 1,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onQuickStakeTouch } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onQuickStakeTouch(5);
          });

          expect(dispatchExchangeSizeInputChangeAction).toHaveBeenCalledTimes(1);
          expect(dispatchExchangeSizeInputChangeAction).toHaveBeenCalledWith(
            "some runner",
            ExchangeSide.LAY,
            1.01,
            6.5,
          );
          expect(dispatchIncrementByQuickStakeAction).not.toHaveBeenCalled();
        });

        it("should decode grouped decimal values before adding quickStakeValue", () => {
          document.getElementById.mockImplementation((id) => {
            if (id === "some runner-size") {
              return { value: "1,000.5" };
            }
            return null;
          });

          const dispatchExchangeSizeInputChangeAction = jest.fn();
          const dispatchIncrementByQuickStakeAction = jest.fn();

          renderExchangeInlinePlace({
            dispatchExchangeSizeInputChangeAction,
            dispatchIncrementByQuickStakeAction,
            side: ExchangeSide.LAY,
            size: 1,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onQuickStakeTouch } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onQuickStakeTouch(5);
          });

          expect(dispatchExchangeSizeInputChangeAction).toHaveBeenCalledTimes(1);
          expect(dispatchExchangeSizeInputChangeAction).toHaveBeenCalledWith(
            "some runner",
            ExchangeSide.LAY,
            1.01,
            1005.5,
          );
          expect(dispatchIncrementByQuickStakeAction).not.toHaveBeenCalled();
        });

        it("should fall back to dispatchIncrementByQuickStakeAction when input value is invalid", () => {
          document.getElementById.mockImplementation((id) => {
            if (id === "some runner-size") {
              return { value: "..." };
            }
            return null;
          });

          const dispatchExchangeSizeInputChangeAction = jest.fn();
          const dispatchIncrementByQuickStakeAction = jest.fn();

          renderExchangeInlinePlace({
            dispatchExchangeSizeInputChangeAction,
            dispatchIncrementByQuickStakeAction,
            side: ExchangeSide.LAY,
            size: 1,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onQuickStakeTouch } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onQuickStakeTouch(5);
          });

          expect(dispatchExchangeSizeInputChangeAction).not.toHaveBeenCalled();
          expect(dispatchIncrementByQuickStakeAction).toHaveBeenCalledTimes(1);
          expect(dispatchIncrementByQuickStakeAction).toHaveBeenCalledWith(
            "some runner",
            ExchangeSide.LAY,
            5,
            "some currencySymbol",
          );
        });

        it("should fall back to dispatchIncrementByQuickStakeAction when input value is empty", () => {
          document.getElementById.mockImplementation((id) => {
            if (id === "some runner-size") {
              return { value: "" };
            }
            return null;
          });

          const dispatchIncrementByQuickStakeAction = jest.fn();

          renderExchangeInlinePlace({
            dispatchIncrementByQuickStakeAction,
            side: ExchangeSide.LAY,
            size: 1,
            price: 1.01,
            quickStakes: quickStakesMock,
          });

          const { onQuickStakeTouch } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onQuickStakeTouch(5);
          });

          expect(dispatchIncrementByQuickStakeAction).toHaveBeenCalledTimes(1);
          expect(dispatchIncrementByQuickStakeAction).toHaveBeenCalledWith(
            "some runner",
            ExchangeSide.LAY,
            5,
            "some currencySymbol",
          );
        });
      });
    });

    describe("and on onFreeBetsChange is called", () => {
      const dispatchExchangeBonusChangeAction = jest.fn();
      it("should delegate to bonusChange", () => {
        renderExchangeInlinePlace({
          dispatchExchangeBonusChangeAction,
          side: ExchangeSide.LAY,
          runner: "runner:urn",
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
          eligibleBonus: 10,
        });

        const { onFreeBetsChange } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onFreeBetsChange(true);
        });

        expect(dispatchExchangeBonusChangeAction).toHaveBeenCalledWith(true, "runner:urn", 10);
        expect(dispatchExchangeBonusChangeAction).toHaveBeenCalledTimes(1);
      });
    });

    describe("when there are notifications", () => {
      it("should provide mapped props to ExchangeInlinePlacePanel", () => {
        const clearNotifications = jest.fn();
        const notifications = { some: "notification" };

        useNotifications.mockReturnValue({
          clearNotifications,
          notifications,
        });

        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
          placeError: true,
        });

        expect(ExchangeInlinePlacePanel).toHaveBeenCalledWith(
          expect.objectContaining({
            hasPlaceError: true,
            notifications,
          }),
          undefined,
        );
      });

      it("should call useNotifications hook with correct props", () => {
        const marketError = { notification: "marketError" };
        const placeError = { notification: "placeError" };
        const runner = "some runner foo";

        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
          marketError,
          placeError,
          runner,
        });

        expect(useNotifications).toHaveBeenCalledWith(marketError.notification, placeError.notification, runner);
      });
    });
  });

  describe("when there is no side", () => {
    it("should not call ExchangeInlinePlacePanel", () => {
      renderExchangeInlinePlace({
        quickStakes: quickStakesMock,
      });

      expect(ExchangeInlinePlacePanel).not.toHaveBeenCalled();
    });
  });

  describe("when there is no quickStakes", () => {
    it("should not call ExchangeInlinePlacePanel", () => {
      renderExchangeInlinePlace({
        side: ExchangeSide.BACK,
      });

      expect(ExchangeInlinePlacePanel).not.toHaveBeenCalled();
    });
  });

  describe("when there is a place in progress", () => {
    it("should provide disabled as true to ExchangeInlinePlacePanel", () => {
      renderExchangeInlinePlace({
        side: ExchangeSide.LAY,
        quickStakes: quickStakesMock,
        isPlacing: true,
      });

      expect(ExchangeInlinePlacePanel).toHaveBeenCalledWith(expect.objectContaining({ disabled: true }), undefined);
    });
  });

  describe("isPlaceButtonDisabled", () => {
    describe("when there is size", () => {
      describe("when there is price", () => {
        describe("when there is priceError", () => {
          it("should provide isPlaceButtonDisabled as true to ExchangeInlinePlacePanel", () => {
            renderExchangeInlinePlace({
              side: ExchangeSide.LAY,
              quickStakes: quickStakesMock,
              price: 2,
              size: 2,
              priceError: priceErrorMock,
            });

            expect(ExchangeInlinePlacePanel).toHaveBeenCalledWith(
              expect.objectContaining({ isPlaceButtonDisabled: true }),
              undefined,
            );
          });
        });

        describe("when there is no priceError", () => {
          it("should provide isPlaceButtonDisabled as false to ExchangeInlinePlacePanel", () => {
            renderExchangeInlinePlace({
              side: ExchangeSide.LAY,
              quickStakes: quickStakesMock,
              price: 2,
              size: 2,
            });

            expect(ExchangeInlinePlacePanel).toHaveBeenCalledWith(
              expect.objectContaining({ isPlaceButtonDisabled: false }),
              undefined,
            );
          });
        });
      });

      describe("when there is no price", () => {
        it("should provide isPlaceButtonDisabled as true to ExchangeInlinePlacePanel", () => {
          renderExchangeInlinePlace({
            side: ExchangeSide.LAY,
            quickStakes: quickStakesMock,
            size: 2,
          });

          expect(ExchangeInlinePlacePanel).toHaveBeenCalledWith(
            expect.objectContaining({ isPlaceButtonDisabled: true }),
            undefined,
          );
        });
      });
    });

    describe("when there is no size", () => {
      it("should provide isPlaceButtonDisabled as true to ExchangeInlinePlacePanel", () => {
        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          quickStakes: quickStakesMock,
        });

        expect(ExchangeInlinePlacePanel).toHaveBeenCalledWith(
          expect.objectContaining({ isPlaceButtonDisabled: true }),
          undefined,
        );
      });
    });
  });
});
