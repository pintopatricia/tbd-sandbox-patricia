import { DeviceEventEmitter } from "react-native";
import { render, act } from "@testing-library/react-native";
import { CUSTOM_KEYBOARD__VALUE_UPDATE } from "@ppb/the-wall-common/types/Keyboard/Keyboard.types";

import { InlinePanel } from "../InlinePanel/InlinePanel.native";
import { InlinePanelColorMap } from "../InlinePanel/InlinePanel.types";
import { navigateDeposit } from "@ppb/tbd-router/native";

import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { NotificationKeys, useNotifications } from "../../../hooks/useNotifications";
import { useScrollIntoView } from "../../../hooks/useScrollIntoView.native";
import { JurisdictionalOperatorInfo } from "../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.native";

import { ExchangeInlinePlacePanel } from "./snowflakes/ExchangeInlinePlacePanel/ExchangeInlinePlacePanel.native";
import { ExchangeInlinePlace } from "./ExchangeInlinePlace.native";
import styles from "./ExchangeInlinePlace.native.styles";

const mockSetFocusedKeyboardControls = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    focusedKeyboardControls: {
      focusedInputId: "focusedInputId",
    },
    setFocusedKeyboardControls: mockSetFocusedKeyboardControls,
  })),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
}));

const mockLogin = jest.fn();
jest.mock("../../../hooks/useLoginWithPendingState.native", () => ({
  __esModule: true,
  default: jest.fn(() => mockLogin),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Styled: jest.fn(() => <styled-mock />),
}));

jest.mock("../InlinePanel/InlinePanel.native", () => ({
  InlinePanel: jest.fn(({ children }) => <inline-panel-panel-mock>{children}</inline-panel-panel-mock>),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  heights: { "inline-keyboard": 124 },
  spacings: { "spacing-1": 4 },
  colors: {},
  typography: {},
  tokens: {
    SmSpacingXxxSmall: 1,
  },
}));

jest.mock("../../../hooks/useNotifications", () => ({
  ...jest.requireActual("../../../hooks/useNotifications"),
  useNotifications: jest.fn(() => ({
    addNotifications: jest.fn(() => "addNotifications"),
    clearNotifications: jest.fn(() => "clearNotifications"),
  })),
}));

jest.mock("../Keyboard/KeyboardContext", () => ({
  KeyboardContext: "KeyboardContext",
}));

jest.mock("../Keyboard/withKeyboardExc.native", () => ({
  withKeyboardExc: jest.fn((component) => component),
}));

jest.mock("../../../hooks/useScrollIntoView.native");

jest.mock("@ppb/tbd-router/native", () => ({
  navigateDeposit: jest.fn(),
}));

jest.mock("../../../config/endpoints", () => ({
  getEndpoint: jest.fn(() => "depositEndpoint"),
}));

jest.mock("./snowflakes/ExchangeInlinePlacePanel/ExchangeInlinePlacePanel.native", () => ({
  ExchangeInlinePlacePanel: jest.fn(() => <exchange-inline-place-panel-mock />),
}));

jest.mock("../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.native", () => ({
  JurisdictionalOperatorInfo: jest.fn(() => <jurisdictional-operator-info-mock />),
}));

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
  prefersConfirm: false,
  betDelay: 0,
  placeBtnLabel: "some placeBtnLabel",
  pricePlaceholder: "some pricePlaceholder",
  sizePlaceholder: "some sizePlaceholder",
  loadingLabel: "some loadingLabel",
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

  it("should call useScrollIntoView", () => {
    renderExchangeInlinePlace();

    expect(useScrollIntoView).toHaveBeenCalledWith({ current: null });
  });

  describe("when there is a side and quickStakes", () => {
    it("should provide mapped props to ExchangeInlinePlacePanel", () => {
      renderExchangeInlinePlace({
        side: ExchangeSide.LAY,
        size: 2,
        price: 1.01,
        quickStakes: quickStakesMock,
      });

      expect(ExchangeInlinePlacePanel).toHaveBeenCalledWith(
        {
          sizeInputId: "some runner-size",
          priceInputId: "some runner-price",
          disabled: false,
          currencySymbol: "some currencySymbol",
          hasFreeBets: false,
          isFreeBetsSelected: false,
          isPlaceButtonDisabled: false,
          quickStakes: [
            { displayStake: "+5", stake: 5 },
            { displayStake: "+10", stake: 10 },
            { displayStake: "+20", stake: 20 },
            { displayStake: "+50", stake: 50 },
          ],
          betDelay: 0,
          freeBetsLabel: "some freeBetsLabel",
          price: 1.01,
          profitLabel: "some profitLabel",
          profitValue: "some profitValue",
          profitRawValue: 111,
          size: 2,
          hasPlaceError: false,
          loadingLabel: "some loadingLabel",
          placeBtnLabel: expect.anything(),
          pricePlaceholder: "some pricePlaceholder",
          sizePlaceholder: "some sizePlaceholder",
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
          styles: { depositTo: styles.depositTo },
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

      it("should not clear the input value", () => {
        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onPriceNudgeUp, onPriceFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];
        const dispatchExchangePriceInputChangeAction = jest.fn();

        const originalNow = Date.now;
        let mockTime = 1000;
        Date.now = jest.fn(() => mockTime);

        act(() => {
          onPriceNudgeUp();
          onPriceFocus();
        });

        expect(dispatchExchangePriceInputChangeAction).not.toHaveBeenCalled();

        Date.now = originalNow;
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

      it("should not clear the input value", () => {
        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onPriceNudgeDown, onPriceFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];
        const dispatchExchangePriceInputChangeAction = jest.fn();

        const originalNow = Date.now;
        let mockTime = 1000;
        Date.now = jest.fn(() => mockTime);

        act(() => {
          onPriceNudgeDown();
          onPriceFocus();
        });

        expect(dispatchExchangePriceInputChangeAction).not.toHaveBeenCalled();

        Date.now = originalNow;
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

      it("should not clear the input value", () => {
        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onSizeNudgeUp, onSizeFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];
        const dispatchExchangeSizeInputChangeAction = jest.fn();

        const originalNow = Date.now;
        let mockTime = 1000;
        Date.now = jest.fn(() => mockTime);

        act(() => {
          onSizeNudgeUp();
          onSizeFocus();
        });

        expect(dispatchExchangeSizeInputChangeAction).not.toHaveBeenCalled();

        Date.now = originalNow;
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

      it("should not clear the input value", () => {
        renderExchangeInlinePlace({
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onSizeNudgeDown, onSizeFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];
        const dispatchExchangeSizeInputChangeAction = jest.fn();

        const originalNow = Date.now;
        let mockTime = 1000;
        Date.now = jest.fn(() => mockTime);

        act(() => {
          onSizeNudgeDown();
          onSizeFocus();
        });

        expect(dispatchExchangeSizeInputChangeAction).not.toHaveBeenCalled();

        Date.now = originalNow;
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
        const dispatchLoginToPlaceBetAction = jest.fn();
        it("should call dispatchLoginToPlaceBetAction and dispatchLogin with the correct payload", () => {
          renderExchangeInlinePlace({
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            isLoggedIn: false,
            dispatchLoginToPlaceBetAction,
          });

          ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();

          expect(dispatchLoginToPlaceBetAction).toHaveBeenCalledWith(ExchangeSide.LAY);

          expect(mockLogin).toHaveBeenCalled();
        });

        describe("when don't have prop side defined", () => {
          it("should call dispatchLogin and not dispatchLoginToPlaceBetAction", () => {
            renderExchangeInlinePlace({
              side: ExchangeSide.BACK,
              size: 2,
              price: 1.01,
              quickStakes: quickStakesMock,
              isLoggedIn: false,
              dispatchLoginToPlaceBetAction,
            });

            ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();

            expect(dispatchLoginToPlaceBetAction).toHaveBeenCalledWith(ExchangeSide.BACK);

            expect(mockLogin).toHaveBeenCalled();
          });
        });
      });

      describe("and isDepositRequired is true", () => {
        it("should call navigateDeposit", () => {
          renderExchangeInlinePlace({
            side: ExchangeSide.LAY,
            quickStakes: quickStakesMock,
            isDepositRequired: true,
            isLoggedIn: true,
            dispatchDepositRedirect: () => {},
          });

          act(() => {
            ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();
          });

          expect(navigateDeposit).toHaveBeenCalledWith("depositEndpoint");
          expect(navigateDeposit).toHaveBeenCalledTimes(1);
        });

        it("should call dispatchDepositRedirect", () => {
          const dispatchDepositRedirect = jest.fn();
          renderExchangeInlinePlace({
            isLoggedIn: true,
            isDepositRequired: true,
            dispatchDepositRedirect,
            side: ExchangeSide.LAY,
            quickStakes: quickStakesMock,
          });

          act(() => {
            ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();
          });

          expect(dispatchDepositRedirect).toHaveBeenCalledWith();
          expect(dispatchDepositRedirect).toHaveBeenCalledTimes(1);
        });

        it("should not dispatch an update action", () => {
          const dispatchExchangePlaceBetAction = jest.fn();
          renderExchangeInlinePlace({
            dispatchExchangePlaceBetAction,
            dispatchDepositRedirect: () => {},
            side: ExchangeSide.LAY,
            quickStakes: quickStakesMock,
            isDepositRequired: true,
            isLoggedIn: true,
          });

          act(() => {
            ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();
          });

          expect(dispatchExchangePlaceBetAction).toHaveBeenCalledTimes(0);
        });
      });

      describe("and isDepositRequired is false", () => {
        it("should not call navigateDeposit", () => {
          renderExchangeInlinePlace({
            prefersConfirm: true,
            side: ExchangeSide.LAY,
            size: 2,
            price: 1.01,
            quickStakes: quickStakesMock,
            isDepositRequired: false,
            isLoggedIn: true,
          });

          act(() => {
            ExchangeInlinePlacePanel.mock.calls[0][0].onPlaceClick();
          });

          expect(navigateDeposit).toHaveBeenCalledTimes(0);
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
      const clearNotifications = jest.fn();
      const dispatchExchangePriceInputChangeAction = jest.fn();
      const mockDeviceEventEmitterEmit = jest.fn();

      beforeEach(() => {
        useNotifications.mockReturnValue({ clearNotifications });
        jest.spyOn(DeviceEventEmitter, "emit").mockImplementation(mockDeviceEventEmitterEmit);

        renderExchangeInlinePlace({
          dispatchExchangePriceInputChangeAction,
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });
      });

      describe("when called after nudge press", () => {
        beforeEach(() => {
          const { onPriceNudgeUp, onPriceFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onPriceNudgeUp();
            onPriceFocus();
          });
        });

        it("should clear notifications but NOT clear the input value", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Price);

          expect(dispatchExchangePriceInputChangeAction).not.toHaveBeenCalled();
          expect(mockDeviceEventEmitterEmit).not.toHaveBeenCalledWith(
            "CUSTOM_KEYBOARD__INPUT_VALUE_RESET",
            expect.anything(),
          );
        });
      });

      describe("when called on input press", () => {
        beforeEach(() => {
          const { onPriceFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onPriceFocus();
          });
        });

        it("should clear notifications and clear the input value", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Price);
          expect(dispatchExchangePriceInputChangeAction).toHaveBeenCalledWith(
            "some runner",
            ExchangeSide.LAY,
            undefined,
            2,
          );
          expect(mockDeviceEventEmitterEmit).toHaveBeenCalledWith(
            "CUSTOM_KEYBOARD__INPUT_VALUE_RESET",
            expect.objectContaining({
              id: "some runner-price",
              value: "",
            }),
          );
        });
      });
    });

    describe("and when onSizeFocus is called", () => {
      const clearNotifications = jest.fn();
      const dispatchExchangeSizeInputChangeAction = jest.fn();
      const mockDeviceEventEmitterEmit = jest.fn();

      beforeEach(() => {
        jest.spyOn(DeviceEventEmitter, "emit").mockImplementation(mockDeviceEventEmitterEmit);
        useNotifications.mockReturnValue({ clearNotifications });

        renderExchangeInlinePlace({
          dispatchExchangeSizeInputChangeAction,
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });
      });

      describe("when called after nudge press", () => {
        beforeEach(() => {
          const { onSizeNudgeUp, onSizeFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onSizeNudgeUp();
            onSizeFocus();
          });
        });

        it("should clear notifications but NOT clear the input value", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Size);

          expect(dispatchExchangeSizeInputChangeAction).not.toHaveBeenCalled();
          expect(mockDeviceEventEmitterEmit).not.toHaveBeenCalledWith(
            "CUSTOM_KEYBOARD__INPUT_VALUE_RESET",
            expect.anything(),
          );
        });
      });

      describe("when called on input press", () => {
        beforeEach(() => {
          const { onSizeFocus } = ExchangeInlinePlacePanel.mock.calls[0][0];

          act(() => {
            onSizeFocus();
          });
        });

        it("should clear notifications and clear the input value", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Size);
          expect(dispatchExchangeSizeInputChangeAction).toHaveBeenCalledWith(
            "some runner",
            ExchangeSide.LAY,
            1.01,
            undefined,
          );
          expect(mockDeviceEventEmitterEmit).toHaveBeenCalledWith(
            "CUSTOM_KEYBOARD__INPUT_VALUE_RESET",
            expect.objectContaining({
              id: "some runner-size",
              value: "",
            }),
          );
        });
      });
    });

    describe("and on onQuickStakeTouch is called", () => {
      it("should call dispatchIncrementByQuickStakeAction", () => {
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

      it("should emit CUSTOM_KEYBOARD__VALUE_UPDATE with optimistic new size", () => {
        const mockDeviceEventEmitterEmit = jest.fn();
        jest.spyOn(DeviceEventEmitter, "emit").mockImplementation(mockDeviceEventEmitterEmit);

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

        expect(mockDeviceEventEmitterEmit).toHaveBeenCalledWith(CUSTOM_KEYBOARD__VALUE_UPDATE, {
          id: "some runner-size",
          value: "12",
        });
      });

      it("should not emit CUSTOM_KEYBOARD__VALUE_UPDATE when runner is missing", () => {
        const mockDeviceEventEmitterEmit = jest.fn();
        jest.spyOn(DeviceEventEmitter, "emit").mockImplementation(mockDeviceEventEmitterEmit);

        renderExchangeInlinePlace({
          runner: undefined,
          side: ExchangeSide.LAY,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        const { onQuickStakeTouch } = ExchangeInlinePlacePanel.mock.calls[0][0];

        act(() => {
          onQuickStakeTouch(10);
        });

        expect(mockDeviceEventEmitterEmit).not.toHaveBeenCalledWith(
          CUSTOM_KEYBOARD__VALUE_UPDATE,
          expect.objectContaining({ id: "some runner-size" }),
        );
      });

      it("should not emit CUSTOM_KEYBOARD__VALUE_UPDATE when side is missing", () => {
        const mockDeviceEventEmitterEmit = jest.fn();
        jest.spyOn(DeviceEventEmitter, "emit").mockImplementation(mockDeviceEventEmitterEmit);

        renderExchangeInlinePlace({
          side: undefined,
          size: 2,
          price: 1.01,
          quickStakes: quickStakesMock,
        });

        expect(ExchangeInlinePlacePanel).not.toHaveBeenCalled();

        expect(mockDeviceEventEmitterEmit).not.toHaveBeenCalledWith(
          CUSTOM_KEYBOARD__VALUE_UPDATE,
          expect.objectContaining({ id: "some runner-size" }),
        );
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
      const side = ExchangeSide.LAY;

      renderExchangeInlinePlace({
        side,
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
            const side = ExchangeSide.LAY;

            renderExchangeInlinePlace({
              side,
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
            const side = ExchangeSide.LAY;

            renderExchangeInlinePlace({
              side,
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
          const side = ExchangeSide.LAY;

          renderExchangeInlinePlace({
            side,
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
        const side = ExchangeSide.LAY;

        renderExchangeInlinePlace({
          side,
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
