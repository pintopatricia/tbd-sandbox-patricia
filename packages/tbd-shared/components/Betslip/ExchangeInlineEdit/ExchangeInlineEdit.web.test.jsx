import { render, act } from "@testing-library/react";
import { Styled } from "@ppb/the-wall-web";
import { InlinePanel } from "../InlinePanel/InlinePanel.web";
import { InlinePanelColorMap } from "../InlinePanel/InlinePanel.types";

import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { NotificationKeys, useNotifications } from "../../../hooks/useNotifications";
import { useWindowScrollIntoView } from "../../../hooks/useScrollIntoView.web";
import { JurisdictionalOperatorInfo } from "../JurisdictionalOperatorInfo/JurisdictionalOperatorInfo.web";

import { ExchangeInlineEditPanel } from "./snowflakes/ExchangeInlineEditPanel/ExchangeInlineEditPanel.web";
import { ExchangeInlineEdit } from "./ExchangeInlineEdit.web";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    focusedKeyboardControls: {
      focusedInputId: "focusedInputId",
    },
  })),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Styled: jest.fn(() => <styled-mock />),
}));
jest.mock("../InlinePanel/InlinePanel.web", () => ({
  InlinePanel: jest.fn(({ children }) => (
    <inline-panel-panel-mock data-testid="inline-panel">{children}</inline-panel-panel-mock>
  )),
}));

jest.mock("../betslip-mapper", () => ({
  isNotification: () => jest.fn(),
}));

jest.mock("../../../hooks/useNotifications", () => ({
  ...jest.requireActual("../../../hooks/useNotifications"),
  useNotifications: jest.fn().mockReturnValue({}),
}));

jest.mock("../Keyboard/withKeyboard.web", () => ({
  withKeyboard: jest.fn((component) => component),
}));

jest.mock("../betslip-deposit-redirect-mapper", () => ({
  buildDepositRedirectPayload: jest.fn(() => ({ viewUrn: "viewUrn", viewUrl: "viewUrl" })),
}));

jest.mock("../Keyboard/KeyboardContext", () => ({
  KeyboardContext: "KeyboardContext",
}));

jest.mock("../../../hooks/useScrollIntoView.web", () => ({
  useWindowScrollIntoView: jest.fn().mockReturnValue(() => {}),
}));

jest.mock("./snowflakes/ExchangeInlineEditPanel/ExchangeInlineEditPanel.web", () => ({
  ExchangeInlineEditPanel: jest.fn(() => <exchange-inline-edit-panel-mock />),
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

const defaultPersistenceListTypes = [{ id: "LAPSE", text: "CancelBet" }];

function renderConnectedExchangeInlineEdit({
  market,
  runner,
  titlePrefix,
  title,
  profitLabel,
  profitValue,
  profitRawValue,
  side,
  price,
  size,
  currencySymbol,
  betId = "BET_ID",
  persistenceListTypes = defaultPersistenceListTypes,
  persistenceListSelectedKey = "LAPSE",
  isPriceDisabled = false,
  isSizeDisabled = false,
  isUpdateButtonDisabled = true,
  isPersistenceTypeMenuExpanded = false,
  betDelay,
  priceError,
  sizeError,
  placeError,
  marketError,
  labels = {
    cancel: "cancel",
    price: "price",
    size: "size",
    persistence: "persistence",
  },
  placeLabel = "placeLabel",
  loadingLabel = "loadingLabel",
  isDepositRequired = false,
  dispatchUnmatchedCancel = jest.fn(),
  dispatchUnmatchedUpdate = jest.fn(),
  dispatchUnmatchedDone = jest.fn(),
  dispatchUnmatchedPersistenceItemClick = jest.fn(),
  dispatchUnmatchedPersistenceListClick = jest.fn(),
  dispatchEditPriceInputChange = jest.fn(),
  dispatchEditPriceInputBlur = jest.fn(),
  dispatchEditSizeInputChange = jest.fn(),
  dispatchEditSizeInputBlur = jest.fn(),
  dispatchEditPriceNudgeUp = jest.fn(),
  dispatchEditPriceNudgeDown = jest.fn(),
  dispatchEditSizeNudgeUp = jest.fn(),
  dispatchEditSizeNudgeDown = jest.fn(),
  dispatchDepositRedirect = jest.fn(),
  dispatchNavigate = jest.fn(),
} = {}) {
  return render(
    <ExchangeInlineEdit
      titlePrefix={titlePrefix}
      title={title}
      profitLabel={profitLabel}
      profitValue={profitValue}
      profitRawValue={profitRawValue}
      market={market}
      runner={runner}
      side={side}
      size={size}
      price={price}
      priceError={priceError}
      sizeError={sizeError}
      placeError={placeError}
      marketError={marketError}
      currencySymbol={currencySymbol}
      betId={betId}
      persistenceListTypes={persistenceListTypes}
      persistenceListSelectedKey={persistenceListSelectedKey}
      isPriceDisabled={isPriceDisabled}
      isSizeDisabled={isSizeDisabled}
      isUpdateButtonDisabled={isUpdateButtonDisabled}
      isPersistenceTypeMenuExpanded={isPersistenceTypeMenuExpanded}
      betDelay={betDelay}
      labels={labels}
      placeLabel={placeLabel}
      loadingLabel={loadingLabel}
      isDepositRequired={isDepositRequired}
      dispatchUnmatchedCancel={dispatchUnmatchedCancel}
      dispatchUnmatchedUpdate={dispatchUnmatchedUpdate}
      dispatchUnmatchedDone={dispatchUnmatchedDone}
      dispatchUnmatchedPersistenceItemClick={dispatchUnmatchedPersistenceItemClick}
      dispatchUnmatchedPersistenceListClick={dispatchUnmatchedPersistenceListClick}
      dispatchEditPriceInputChange={dispatchEditPriceInputChange}
      dispatchEditPriceInputBlur={dispatchEditPriceInputBlur}
      dispatchEditSizeInputChange={dispatchEditSizeInputChange}
      dispatchEditSizeInputBlur={dispatchEditSizeInputBlur}
      dispatchEditPriceNudgeUp={dispatchEditPriceNudgeUp}
      dispatchEditPriceNudgeDown={dispatchEditPriceNudgeDown}
      dispatchEditSizeNudgeUp={dispatchEditSizeNudgeUp}
      dispatchEditSizeNudgeDown={dispatchEditSizeNudgeDown}
      dispatchDepositRedirect={dispatchDepositRedirect}
      dispatchNavigate={dispatchNavigate}
    />,
  );
}

describe("ExchangeInlineEdit", () => {
  beforeEach(jest.clearAllMocks);

  it("should call useWindowScrollIntoView", () => {
    renderConnectedExchangeInlineEdit();

    expect(useWindowScrollIntoView).toHaveBeenCalledWith({ offset: 156 });
    expect(useWindowScrollIntoView).toHaveBeenCalledTimes(1);
  });

  describe("InlinePanel", () => {
    describe.each(Object.entries(InlinePanelColorMap))("with %s side", (side, color) => {
      it(`should be called with expected values and ${color} color`, () => {
        renderConnectedExchangeInlineEdit({
          side,
          title: `${side} Bet`,
          currencySymbol: "€",
          betDelay: 3,
          price: 1.23,
          size: 1,
          profitLabel: "This is a profit label",
          profitValue: "This is a profit value",
          profitRawValue: 111,
          dispatchUnmatchedDone: jest.fn(),
        });

        expect(InlinePanel).toHaveBeenCalledWith(
          {
            children: expect.anything(),
            color,
            onAction: expect.any(Function),
            title: `${side} Bet`,
          },
          undefined,
        );
        expect(InlinePanel).toHaveBeenCalledTimes(1);
      });
    });

    describe("Jurisdictional Operator Info", () => {
      beforeEach(() => {
        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          title: "Lay Bet",
          currencySymbol: "€",
          betDelay: 3,
          price: 1.23,
          size: 1,
          profitLabel: "This is a profit label",
          profitValue: "This is a profit value",
          profitRawValue: 111,
        });
      });

      it("should render the JurisdictionalOperatorInfo component", () => {
        expect(JurisdictionalOperatorInfo).toHaveBeenCalled();
      });
    });
  });

  describe("when initializing", () => {
    it("should provide props to ExchangeInlineEditPanel", () => {
      useNotifications.mockReturnValue({ notifications: "someNotifications" });
      renderConnectedExchangeInlineEdit({
        runner: "runner",
        side: ExchangeSide.LAY,
        title: "Lay Bet",
        currencySymbol: "€",
        betDelay: 3,
        price: 1.23,
        size: 1,
        profitLabel: "This is a profit label",
        profitValue: "This is a profit value",
        profitRawValue: 111,
        placeError: { notification: "somePlaceNotification" },
      });

      expect(ExchangeInlineEditPanel).toHaveBeenCalledWith(
        {
          sizeInputId: "runner-size",
          priceInputId: "runner-price",
          price: 1.23,
          size: 1,
          currencySymbol: "€",
          profitLabel: "This is a profit label",
          profitValue: "This is a profit value",
          profitRawValue: 111,
          isPersistenceMenuOpen: false,
          isPriceDisabled: false,
          isSizeDisabled: false,
          isUpdateDisabled: true,
          betDelay: 3,
          quickStakes: [],
          persistenceOptions: defaultPersistenceListTypes,
          persistenceSelectedId: "LAPSE",
          labels: {
            cancel: "cancel",
            persistence: "persistence",
            price: "price",
            size: "size",
          },
          placeLabel: expect.anything(),
          loadingLabel: "loadingLabel",
          hasPlaceError: true,
          notifications: "someNotifications",
          focusedInputId: "focusedInputId",
          onPriceNudgeUp: expect.any(Function),
          onPriceNudgeDown: expect.any(Function),
          onSizeNudgeUp: expect.any(Function),
          onSizeNudgeDown: expect.any(Function),
          onPersistenceChange: expect.any(Function),
          onPersistenceToggle: expect.any(Function),
          onPriceChange: expect.any(Function),
          onPriceBlur: expect.any(Function),
          onPriceFocus: expect.any(Function),
          onSizeChange: expect.any(Function),
          onSizeBlur: expect.any(Function),
          onSizeFocus: expect.any(Function),
          onCancel: expect.any(Function),
          onQuickStakeAdd: expect.any(Function),
          onUpdate: expect.any(Function),
          onSizeMouseDown: expect.any(Function),
          onPriceMouseDown: expect.any(Function),
        },
        undefined,
      );
    });
  });

  it("should pass Styled with correct parameters in placeLabel prop", () => {
    renderConnectedExchangeInlineEdit({
      side: ExchangeSide.LAY,
      market: "market:urn",
      runner: "urn",
      betId: "BET_ID",
      title: "Lay Bet",
      currencySymbol: "€",
      price: 1.23,
    });

    render(ExchangeInlineEditPanel.mock.calls[0][0].placeLabel);

    expect(Styled).toHaveBeenCalledWith(
      {
        translation: "placeLabel",
        styles: { depositTo: "typography-h220" },
      },
      undefined,
    );
  });

  describe("when performing interactions from ExchangeInlineEditPanel", () => {
    describe("when changing price", () => {
      it("should clear price notifications", () => {
        const clearNotificationsSpy = jest.fn();

        useNotifications.mockReturnValue({
          clearNotifications: clearNotificationsSpy,
          addNotifications: jest.fn(),
        });

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          size: 1.23,
        });

        ExchangeInlineEditPanel.mock.calls[0][0].onPriceChange(2.22);

        expect(clearNotificationsSpy).toHaveBeenCalledTimes(1);
        expect(clearNotificationsSpy).toHaveBeenCalledWith(NotificationKeys.Price);
      });

      it("should dispatch a price input change action when onPriceChange is called", () => {
        const dispatchEditPriceInputChangeSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          size: 1.23,
          dispatchEditPriceInputChange: dispatchEditPriceInputChangeSpy,
        });

        ExchangeInlineEditPanel.mock.calls[0][0].onPriceChange(2.22);

        expect(dispatchEditPriceInputChangeSpy).toHaveBeenCalledTimes(1);
        expect(dispatchEditPriceInputChangeSpy).toHaveBeenCalledWith("urn", "BET_ID", ExchangeSide.LAY, 2.22, 1.23);
      });

      it("should not dispatch a price input change action when there is no runner", () => {
        const dispatchEditPriceInputChangeSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          size: 1.23,
          dispatchEditPriceInputChange: dispatchEditPriceInputChangeSpy,
        });

        ExchangeInlineEditPanel.mock.calls[0][0].onPriceChange(2.22);

        expect(dispatchEditPriceInputChangeSpy).not.toHaveBeenCalled();
      });

      it("should not dispatch a price input change action when there is no bet id", () => {
        const dispatchEditPriceInputChangeSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          betId: null,
          runner: "urn",
          title: "Lay Bet",
          currencySymbol: "€",
          size: 1.23,
          dispatchEditPriceInputChange: dispatchEditPriceInputChangeSpy,
        });

        ExchangeInlineEditPanel.mock.calls[0][0].onPriceChange(2.22);

        expect(dispatchEditPriceInputChangeSpy).not.toHaveBeenCalled();
      });
    });

    describe("when changing size", () => {
      it("should clear size notifications", () => {
        const clearNotificationsSpy = jest.fn();

        useNotifications.mockReturnValue({
          clearNotifications: clearNotificationsSpy,
          addNotifications: jest.fn(),
        });

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
        });

        ExchangeInlineEditPanel.mock.calls[0][0].onSizeChange(3);

        expect(clearNotificationsSpy).toHaveBeenCalledTimes(1);
        expect(clearNotificationsSpy).toHaveBeenCalledWith(NotificationKeys.Size);
      });

      it("should dispatch a size input change action when onSizeChange is called", () => {
        const dispatchEditSizeInputChangeSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
          dispatchEditSizeInputChange: dispatchEditSizeInputChangeSpy,
        });

        ExchangeInlineEditPanel.mock.calls[0][0].onSizeChange(3);

        expect(dispatchEditSizeInputChangeSpy).toHaveBeenCalledTimes(1);
        expect(dispatchEditSizeInputChangeSpy).toHaveBeenCalledWith("urn", "BET_ID", ExchangeSide.LAY, 3, 1.23);
      });

      it("should not dispatch a size input change action when there is no runner", () => {
        const dispatchEditSizeInputChangeSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
          dispatchEditSizeInputChange: dispatchEditSizeInputChangeSpy,
        });

        ExchangeInlineEditPanel.mock.calls[0][0].onSizeChange(3);

        expect(dispatchEditSizeInputChangeSpy).not.toHaveBeenCalled();
      });

      it("should not dispatch a size input change action when there is no bet id", () => {
        const dispatchEditSizeInputChangeSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          runner: "urn",
          betId: null,
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
          dispatchEditSizeInputChange: dispatchEditSizeInputChangeSpy,
        });

        ExchangeInlineEditPanel.mock.calls[0][0].onSizeChange(3);

        expect(dispatchEditSizeInputChangeSpy).not.toHaveBeenCalled();
      });
    });

    describe("when blurring price", () => {
      it("should add a price error notification", () => {
        const addNotificationsSpy = jest.fn();

        useNotifications.mockReturnValue({ clearNotifications: jest.fn(), addNotifications: addNotificationsSpy });

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          priceError: { newPrice: 1.22, notification: "notification" },
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
        });
        const [ExchangeInlineEditPanelInitial] = ExchangeInlineEditPanel.mock.calls[0];

        act(() => {
          ExchangeInlineEditPanelInitial.onPriceBlur();
        });

        expect(addNotificationsSpy).toHaveBeenCalledWith({ price: "notification" });
      });

      it("should dispatch a price input blur", () => {
        const dispatchEditPriceInputBlurSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          priceError: { newPrice: 1.22, notification: "notification" },
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          size: 3,
          dispatchEditPriceInputBlur: dispatchEditPriceInputBlurSpy,
        });
        const [ExchangeInlineEditPanelInitial] = ExchangeInlineEditPanel.mock.calls[0];

        act(() => {
          ExchangeInlineEditPanelInitial.onPriceBlur();
        });

        expect(dispatchEditPriceInputBlurSpy).toHaveBeenCalledWith("urn", "BET_ID", ExchangeSide.LAY, 1.22, 3);
      });
    });

    describe("when blurring size", () => {
      it("should add a size error notification", () => {
        const addNotificationsSpy = jest.fn();

        useNotifications.mockReturnValue({ clearNotifications: jest.fn(), addNotifications: addNotificationsSpy });

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          sizeError: { newSize: 4, notification: "notification" },
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          size: 2,
        });
        const [ExchangeInlineEditPanelInitial] = ExchangeInlineEditPanel.mock.calls[0];

        act(() => {
          ExchangeInlineEditPanelInitial.onSizeBlur();
        });

        expect(addNotificationsSpy).toHaveBeenCalledWith({ size: "notification" });
      });

      it("should dispatch a price input blur", () => {
        const dispatchEditPriceInputBlurSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          priceError: { newPrice: 1.22, notification: "notification" },
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          size: 3,
          dispatchEditPriceInputBlur: dispatchEditPriceInputBlurSpy,
        });
        const [ExchangeInlineEditPanelInitial] = ExchangeInlineEditPanel.mock.calls[0];

        act(() => {
          ExchangeInlineEditPanelInitial.onPriceBlur();
        });

        expect(dispatchEditPriceInputBlurSpy).toHaveBeenCalledWith("urn", "BET_ID", ExchangeSide.LAY, 1.22, 3);
      });
    });

    describe("when nudging price", () => {
      describe("when down", () => {
        it("should dispatch a nudge down action", () => {
          const dispatchEditPriceNudgeDownSpy = jest.fn();

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            dispatchEditPriceNudgeDown: dispatchEditPriceNudgeDownSpy,
          });

          act(() => {
            ExchangeInlineEditPanel.mock.calls[0][0].onPriceNudgeDown();
          });

          expect(dispatchEditPriceNudgeDownSpy).toHaveBeenCalledTimes(1);
          expect(dispatchEditPriceNudgeDownSpy).toHaveBeenCalledWith("urn", "BET_ID", ExchangeSide.LAY);
        });

        it("should clear notifications", () => {
          const clearNotificationsSpy = jest.fn();
          const dispatchEditPriceNudgeDownSpy = jest.fn();

          useNotifications.mockReturnValue({ clearNotifications: clearNotificationsSpy, addNotifications: jest.fn() });

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            dispatchEditPriceNudgeDown: dispatchEditPriceNudgeDownSpy,
          });
          const [ExchangeInlineEditPanelInitial] = ExchangeInlineEditPanel.mock.calls[0];

          act(() => {
            ExchangeInlineEditPanelInitial.onPriceNudgeDown();
          });

          expect(clearNotificationsSpy).toHaveBeenCalledWith(NotificationKeys.Price);
        });
      });

      describe("when up", () => {
        it("should dispatch a nudge up action", () => {
          const dispatchEditPriceNudgeUpSpy = jest.fn();

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            dispatchEditPriceNudgeUp: dispatchEditPriceNudgeUpSpy,
          });

          act(() => {
            ExchangeInlineEditPanel.mock.calls[0][0].onPriceNudgeUp();
          });

          expect(dispatchEditPriceNudgeUpSpy).toHaveBeenCalledTimes(1);
          expect(dispatchEditPriceNudgeUpSpy).toHaveBeenCalledWith("urn", "BET_ID", ExchangeSide.LAY);
        });

        it("should clear notifications", () => {
          const clearNotificationsSpy = jest.fn();
          const dispatchEditPriceNudgeUpSpy = jest.fn();

          useNotifications.mockReturnValue({ clearNotifications: clearNotificationsSpy, addNotifications: jest.fn() });

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            dispatchEditPriceNudgeUp: dispatchEditPriceNudgeUpSpy,
          });
          const [ExchangeInlineEditPanelInitial] = ExchangeInlineEditPanel.mock.calls[0];

          act(() => {
            ExchangeInlineEditPanelInitial.onPriceNudgeUp();
          });

          expect(clearNotificationsSpy).toHaveBeenCalledWith(NotificationKeys.Price);
        });
      });
    });

    describe("when nudging size", () => {
      describe("when down", () => {
        it("should dispatch a nudge down action", () => {
          const dispatchEditSizeNudgeDownSpy = jest.fn();

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            dispatchEditSizeNudgeDown: dispatchEditSizeNudgeDownSpy,
          });

          act(() => {
            ExchangeInlineEditPanel.mock.calls[0][0].onSizeNudgeDown();
          });

          expect(dispatchEditSizeNudgeDownSpy).toHaveBeenCalledTimes(1);
          expect(dispatchEditSizeNudgeDownSpy).toHaveBeenCalledWith("urn", "BET_ID");
        });

        it("should clear notifications", () => {
          const clearNotificationsSpy = jest.fn();
          const dispatchEditSizeNudgeDownSpy = jest.fn();

          useNotifications.mockReturnValue({ clearNotifications: clearNotificationsSpy, addNotifications: jest.fn() });

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            dispatchEditSizeNudgeDown: dispatchEditSizeNudgeDownSpy,
          });
          const [ExchangeInlineEditPanelInitial] = ExchangeInlineEditPanel.mock.calls[0];

          act(() => {
            ExchangeInlineEditPanelInitial.onSizeNudgeDown();
          });

          expect(clearNotificationsSpy).toHaveBeenCalledWith(NotificationKeys.Size);
        });
      });

      describe("when up", () => {
        it("should dispatch a nudge up action", () => {
          const dispatchEditSizeNudgeUpSpy = jest.fn();

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            dispatchEditSizeNudgeUp: dispatchEditSizeNudgeUpSpy,
          });

          act(() => {
            ExchangeInlineEditPanel.mock.calls[0][0].onSizeNudgeUp();
          });

          expect(dispatchEditSizeNudgeUpSpy).toHaveBeenCalledTimes(1);
          expect(dispatchEditSizeNudgeUpSpy).toHaveBeenCalledWith("urn", "BET_ID");
        });

        it("should clear notifications", () => {
          const clearNotificationsSpy = jest.fn();
          const dispatchEditSizeNudgeUpSpy = jest.fn();

          useNotifications.mockReturnValue({ clearNotifications: clearNotificationsSpy, addNotifications: jest.fn() });

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            dispatchEditSizeNudgeUp: dispatchEditSizeNudgeUpSpy,
          });
          const [ExchangeInlineEditPanelInitial] = ExchangeInlineEditPanel.mock.calls[0];

          act(() => {
            ExchangeInlineEditPanelInitial.onSizeNudgeUp();
          });

          expect(clearNotificationsSpy).toHaveBeenCalledWith(NotificationKeys.Size);
        });
      });
    });

    describe("and when onPriceFocus is called", () => {
      describe("when clicking from a nudge button (inputMouseDownRef is false)", () => {
        const clearNotifications = jest.fn();
        const dispatchEditPriceInputChange = jest.fn();

        beforeEach(() => {
          useNotifications.mockReturnValue({ clearNotifications });

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            dispatchEditPriceInputChange,
          });

          const { onPriceFocus } = ExchangeInlineEditPanel.mock.calls[0][0];

          act(() => {
            onPriceFocus();
          });
        });

        it("should clear notifications", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Price);
        });

        it("should NOT clear the input value", () => {
          expect(dispatchEditPriceInputChange).not.toHaveBeenCalled();
        });
      });

      describe("when clicking directly on the input (inputMouseDownRef is true)", () => {
        const clearNotifications = jest.fn();
        const dispatchEditPriceInputChange = jest.fn();

        beforeEach(() => {
          useNotifications.mockReturnValue({ clearNotifications });

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            size: 2,
            dispatchEditPriceInputChange,
          });

          const { onPriceMouseDown, onPriceFocus } = ExchangeInlineEditPanel.mock.calls[0][0];

          act(() => {
            onPriceMouseDown({ target: { closest: () => null } }); // target is not a button
            onPriceFocus();
          });
        });

        it("should clear notifications", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Price);
        });

        it("should clear the input value", () => {
          expect(dispatchEditPriceInputChange).toHaveBeenCalledWith("urn", "BET_ID", "LAY", undefined, 2);
        });
      });
    });

    describe("and when onSizeFocus is called", () => {
      describe("when clicking from a nudge button (inputMouseDownRef is false)", () => {
        const clearNotifications = jest.fn();
        const dispatchEditSizeInputChange = jest.fn();

        beforeEach(() => {
          useNotifications.mockReturnValue({ clearNotifications });

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            dispatchEditSizeInputChange,
          });

          const { onSizeFocus } = ExchangeInlineEditPanel.mock.calls[0][0];

          act(() => {
            onSizeFocus();
          });
        });

        it("should clear notifications", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Size);
        });

        it("should NOT clear the input value", () => {
          expect(dispatchEditSizeInputChange).not.toHaveBeenCalled();
        });
      });

      describe("when clicking directly on the input (inputMouseDownRef is true)", () => {
        const clearNotifications = jest.fn();
        const dispatchEditSizeInputChange = jest.fn();

        beforeEach(() => {
          useNotifications.mockReturnValue({ clearNotifications });

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            dispatchEditSizeInputChange,
          });

          const { onSizeMouseDown, onSizeFocus } = ExchangeInlineEditPanel.mock.calls[0][0];

          act(() => {
            onSizeMouseDown({ target: { closest: () => null } });
            onSizeFocus();
          });
        });

        it("should clear notifications", () => {
          expect(clearNotifications).toHaveBeenCalledWith(NotificationKeys.Size);
        });

        it("should clear the input value", () => {
          expect(dispatchEditSizeInputChange).toHaveBeenCalledWith("urn", "BET_ID", "LAY", undefined, 1.23);
        });
      });
    });

    describe("when changing persistence", () => {
      it("should dispatch a persistenceType change action when onPersistenceTypeOptionChange is called", () => {
        const dispatchUnmatchedPersistenceItemClickSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
          dispatchUnmatchedPersistenceItemClick: dispatchUnmatchedPersistenceItemClickSpy,
        });

        act(() => {
          ExchangeInlineEditPanel.mock.calls[0][0].onPersistenceChange("PERSIST");
        });

        expect(dispatchUnmatchedPersistenceItemClickSpy).toHaveBeenCalledTimes(1);
        expect(dispatchUnmatchedPersistenceItemClickSpy).toHaveBeenCalledWith("BET_ID", "PERSIST");
      });

      it("should not dispatch a persistenceType change action when there is no betId", () => {
        const dispatchUnmatchedPersistenceItemClickSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          runner: "urn",
          betId: null,
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
          dispatchUnmatchedPersistenceItemClick: dispatchUnmatchedPersistenceItemClickSpy,
        });

        act(() => {
          ExchangeInlineEditPanel.mock.calls[0][0].onPersistenceChange({
            target: {
              id: "PERSIST",
            },
          });
        });

        expect(dispatchUnmatchedPersistenceItemClickSpy).not.toHaveBeenCalled();
      });
    });

    describe("when toggling persistence", () => {
      it("should dispatch a the collapsed menu state change action when onPersistenceToggle is called", () => {
        const dispatchUnmatchedPersistenceListClickSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
          dispatchUnmatchedPersistenceListClick: dispatchUnmatchedPersistenceListClickSpy,
        });

        act(() => {
          ExchangeInlineEditPanel.mock.calls[0][0].onPersistenceToggle();
        });

        expect(dispatchUnmatchedPersistenceListClickSpy).toHaveBeenCalledTimes(1);
        expect(dispatchUnmatchedPersistenceListClickSpy).toHaveBeenCalledWith("BET_ID", true);
      });

      it("should clear notifications when onPersistenceToggle is called", () => {
        const clearNotificationsSpy = jest.fn();

        useNotifications.mockReturnValue({ clearNotifications: clearNotificationsSpy, addNotifications: jest.fn() });

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
        });
        const [ExchangeInlineEditPanelInitial] = ExchangeInlineEditPanel.mock.calls[0];

        act(() => {
          ExchangeInlineEditPanelInitial.onPersistenceToggle();
        });

        expect(clearNotificationsSpy).toHaveBeenCalledWith(NotificationKeys.Price, NotificationKeys.Size);
      });
    });

    describe("when done editing", () => {
      it("should dispatch a done action when onDone is called", () => {
        const dispatchUnmatchedDoneSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
          dispatchUnmatchedDone: dispatchUnmatchedDoneSpy,
        });

        act(() => {
          InlinePanel.mock.calls[0][0].onAction();
        });

        expect(dispatchUnmatchedDoneSpy).toHaveBeenCalledTimes(1);
        expect(dispatchUnmatchedDoneSpy).toHaveBeenCalled();
      });
    });

    describe("when updating", () => {
      it("should dispatch an update action when onUpdate is called", () => {
        const dispatchUnmatchedUpdateSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          market: "market:urn",
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
          dispatchUnmatchedUpdate: dispatchUnmatchedUpdateSpy,
        });

        act(() => {
          ExchangeInlineEditPanel.mock.calls[0][0].onUpdate();
        });

        expect(dispatchUnmatchedUpdateSpy).toHaveBeenCalledTimes(1);
        expect(dispatchUnmatchedUpdateSpy).toHaveBeenCalledWith(
          "BET_ID",
          "market:urn",
          "urn",
          "https://www.betfair.com/betting",
        );
      });

      describe("and isDepositRequired is true", () => {
        it("should call dispatchDepositRedirect", () => {
          const dispatchDepositRedirect = jest.fn();
          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            market: "market:urn",
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            isDepositRequired: true,
            dispatchDepositRedirect,
          });

          act(() => {
            ExchangeInlineEditPanel.mock.calls[0][0].onUpdate();
          });

          expect(dispatchDepositRedirect).toHaveBeenCalledTimes(1);
        });

        it("should call dispatchNavigate", () => {
          const dispatchNavigate = jest.fn();
          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            market: "market:urn",
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            isDepositRequired: true,
            dispatchNavigate,
          });

          act(() => {
            ExchangeInlineEditPanel.mock.calls[0][0].onUpdate();
          });

          expect(dispatchNavigate).toHaveBeenCalledTimes(1);
          expect(dispatchNavigate).toHaveBeenCalledWith("viewUrn", "viewUrl");
        });

        it("should not dispatch an update action when onUpdate is called", () => {
          const dispatchUnmatchedUpdateSpy = jest.fn();

          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            market: "market:urn",
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            isDepositRequired: true,
            dispatchUnmatchedUpdate: dispatchUnmatchedUpdateSpy,
          });

          act(() => {
            ExchangeInlineEditPanel.mock.calls[0][0].onUpdate();
          });

          expect(dispatchUnmatchedUpdateSpy).toHaveBeenCalledTimes(0);
        });
      });

      describe("and isDepositRequired is false", () => {
        it("should not call dispatchDepositRedirect", () => {
          const dispatchDepositRedirect = jest.fn();
          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            market: "market:urn",
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            isDepositRequired: false,
            dispatchDepositRedirect,
          });

          act(() => {
            ExchangeInlineEditPanel.mock.calls[0][0].onUpdate();
          });

          expect(dispatchDepositRedirect).toHaveBeenCalledTimes(0);
        });

        it("should not call dispatchNavigate", () => {
          const dispatchNavigate = jest.fn();
          renderConnectedExchangeInlineEdit({
            side: ExchangeSide.LAY,
            market: "market:urn",
            runner: "urn",
            betId: "BET_ID",
            title: "Lay Bet",
            currencySymbol: "€",
            price: 1.23,
            isDepositRequired: false,
            dispatchNavigate,
          });

          act(() => {
            ExchangeInlineEditPanel.mock.calls[0][0].onUpdate();
          });

          expect(dispatchNavigate).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe("when cancelling", () => {
      it("should dispatch a cancel action when onCancel is called", () => {
        const dispatchUnmatchedCancelSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          market: "market:urn",
          runner: "urn",
          betId: "BET_ID",
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
          dispatchUnmatchedCancel: dispatchUnmatchedCancelSpy,
        });

        act(() => {
          ExchangeInlineEditPanel.mock.calls[0][0].onCancel();
        });

        expect(dispatchUnmatchedCancelSpy).toHaveBeenCalledTimes(1);
        expect(dispatchUnmatchedCancelSpy).toHaveBeenCalledWith(["BET_ID"], "urn");
      });

      it("should not dispatch a cancel action when there is no betId", () => {
        const dispatchUnmatchedCancelSpy = jest.fn();

        renderConnectedExchangeInlineEdit({
          side: ExchangeSide.LAY,
          market: "market:urn",
          runner: "urn",
          betId: null,
          title: "Lay Bet",
          currencySymbol: "€",
          price: 1.23,
          dispatchUnmatchedCancel: dispatchUnmatchedCancelSpy,
        });

        act(() => {
          ExchangeInlineEditPanel.mock.calls[0][0].onCancel();
        });

        expect(dispatchUnmatchedCancelSpy).not.toHaveBeenCalled();
      });
    });
  });
});
