import { render } from "@testing-library/react-native";

import { Alerts, PrimaryButton, SecondaryButton } from "@ppb/the-wall-native";

import { PlacedBetCard } from "../PlacedBetCard/PlacedBetCard.native";
import { ExchangeUnmatchedCard } from "./ExchangeUnmatchedCard.native";
import { ACTIONS_CONTAINER } from "./ExchangeUnmatchedCard.native.selectors";

jest.mock("../PlacedBetCard/PlacedBetCard.native", () => ({
  PlacedBetCard: jest.fn(() => <placed-bet-card-mock />),
}));
jest.mock("@ppb/the-wall-native", () => ({
  Alerts: jest.fn(() => <alerts-mock />),
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
}));
jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({ GenericIcon: jest.fn(() => <generic-icon-mock />) }));

function renderExchangeUnmatchedCard({
  type = "UNMATCHED",
  price = "3.00",
  stake = "£5.00",
  profit = "£10.00",
  liability = "£5.00",
  bonus = "Used Bonus £10",
  hasFreeBets = false,
  labels = {},
  notifications = [],
  onCancel,
  onEdit,
}) {
  const victim = render(
    <ExchangeUnmatchedCard
      price={price}
      stake={stake}
      profit={profit}
      liability={liability}
      bonus={bonus}
      hasFreeBets={hasFreeBets}
      labels={labels}
      notifications={notifications}
      onCancel={onCancel}
      onEdit={onEdit}
      type={type}
    ></ExchangeUnmatchedCard>,
  );

  render(PlacedBetCard.mock.calls[0][0].children);

  const actionsContainer = victim.queryByTestId(ACTIONS_CONTAINER);

  return {
    actionsContainer,
  };
}

describe("ExchangeUnmatchedCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should proxy to PlacedBetCard", () => {
    renderExchangeUnmatchedCard({});

    expect(PlacedBetCard).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "UNMATCHED",
        price: "3.00",
        stake: "£5.00",
        profit: "£10.00",
        liability: "£5.00",
        bonus: "Used Bonus £10",
        hasFreeBets: false,
        labels: {},
        children: expect.any(Object),
      }),
      undefined,
    );
  });

  describe("when displaying alerts", () => {
    it("should call Alerts with passed alerts", () => {
      renderExchangeUnmatchedCard({ notifications: [{ notification: "this me" }] });

      expect(Alerts).toHaveBeenCalledWith(
        expect.objectContaining({ alerts: [{ notification: "this me" }] }),
        undefined,
      );
    });
  });

  describe("when handling the display mode", () => {
    describe("when there is no actions", () => {
      it("should not call SecondaryButton", () => {
        renderExchangeUnmatchedCard({ onCancel: null, onEdit: null });

        expect(SecondaryButton).not.toHaveBeenCalled();
      });

      it("should not call PrimaryButton", () => {
        renderExchangeUnmatchedCard({ onCancel: null, onEdit: null });

        expect(PrimaryButton).not.toHaveBeenCalled();
      });

      it("should not have the actions container", () => {
        const { actionsContainer } = renderExchangeUnmatchedCard({ mode: null });

        expect(actionsContainer).toBeNull();
      });
    });

    describe("when all actions are present", () => {
      describe("cancel button", () => {
        it("should call SecondaryButton label with labels.cancel", () => {
          renderExchangeUnmatchedCard({ onCancel: jest.fn(), onEdit: jest.fn(), labels: { cancel: "cancel" } });

          expect(SecondaryButton).toHaveBeenCalledWith(expect.objectContaining({ label: "cancel" }), undefined);
        });

        it("should call SecondaryButton onTap with onCancel", () => {
          const onCancelSpy = jest.fn();
          renderExchangeUnmatchedCard({ onCancel: onCancelSpy, onEdit: jest.fn() });

          expect(SecondaryButton).toHaveBeenCalledWith(expect.objectContaining({ onTap: onCancelSpy }), undefined);
        });
      });

      describe("confirm button", () => {
        it("should call PrimaryButton text with labels.confirm", () => {
          renderExchangeUnmatchedCard({ onCancel: jest.fn(), onEdit: jest.fn(), labels: { confirm: "confirm" } });

          expect(PrimaryButton).toHaveBeenCalledWith(expect.objectContaining({ label: "confirm" }), undefined);
        });

        it("should call SecondaryButton onTap with onEdit", () => {
          const onEditSpy = jest.fn();
          renderExchangeUnmatchedCard({ onCancel: jest.fn(), onEdit: onEditSpy });

          expect(PrimaryButton).toHaveBeenCalledWith(expect.objectContaining({ onTap: onEditSpy }), undefined);
        });
      });
    });

    describe("when only cancel action is given", () => {
      describe("cancel button", () => {
        it("should call SecondaryButton label with labels.cancel", () => {
          renderExchangeUnmatchedCard({ onCancel: jest.fn(), labels: { cancel: "cancel" } });

          expect(SecondaryButton).toHaveBeenCalledWith(expect.objectContaining({ label: "cancel" }), undefined);
        });

        it("should call SecondaryButton onTap with onCancel", () => {
          const onCancelSpy = jest.fn();
          renderExchangeUnmatchedCard({ onCancel: onCancelSpy });

          expect(SecondaryButton).toHaveBeenCalledWith(expect.objectContaining({ onTap: onCancelSpy }), undefined);
        });
      });

      describe("confirm button", () => {
        it("should not call PrimaryButton", () => {
          renderExchangeUnmatchedCard({ mode: null });

          expect(PrimaryButton).not.toHaveBeenCalled();
        });
      });
    });

    describe("when cancel button is tapped", () => {
      it("should call the correct onCancel callback", () => {
        const onCancelSpy = jest.fn();
        renderExchangeUnmatchedCard({ onCancel: onCancelSpy });
        SecondaryButton.mock.calls[0][0].onTap();

        expect(onCancelSpy).toHaveBeenCalled();
      });
    });

    describe("when confirm button is tapped", () => {
      it("should call the correct onEdit callback", () => {
        const onEditSpy = jest.fn();
        renderExchangeUnmatchedCard({ onCancel: jest.fn(), onEdit: onEditSpy });
        PrimaryButton.mock.calls[0][0].onTap();

        expect(onEditSpy).toHaveBeenCalled();
      });
    });
  });
});
