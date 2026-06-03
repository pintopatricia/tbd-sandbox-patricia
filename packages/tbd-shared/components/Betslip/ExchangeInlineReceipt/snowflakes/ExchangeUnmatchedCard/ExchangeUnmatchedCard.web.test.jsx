import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { BetslipNotifications, PrimaryButton, SecondaryButton } from "@ppb/the-wall-web";
import { PlacedBetCard } from "../PlacedBetCard/PlacedBetCard.web";

import { ExchangeUnmatchedCard } from "./ExchangeUnmatchedCard.web";
import { ACTIONS_CONTAINER } from "./ExchangeUnmatchedCard.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  BetslipNotifications: jest.fn(() => <betslip-notifications-mock />),
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
}));
jest.mock("../PlacedBetCard/PlacedBetCard.web", () => ({
  PlacedBetCard: jest.fn(() => <placed-bet-card-mock />),
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
  const { container } = render(
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

  const actionsContainer = container.querySelector(ACTIONS_CONTAINER);

  return {
    actionsContainer,
  };
}

describe("ExchangeUnmatchedCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should proxy to PlacedBetCard", () => {
    renderExchangeUnmatchedCard({});

    expect(PlacedBetCard).toHaveBeenCalledWith(
      {
        price: "3.00",
        stake: "£5.00",
        profit: "£10.00",
        liability: "£5.00",
        bonus: "Used Bonus £10",
        hasFreeBets: false,
        labels: {},
        type: "UNMATCHED",
        children: expect.any(Object),
      },
      undefined,
    );
  });

  describe("when displaying alerts", () => {
    it("should call Alerts with passed alerts", () => {
      renderExchangeUnmatchedCard({ notifications: [{ notification: "this me" }] });

      expect(BetslipNotifications).toHaveBeenCalledWith(
        expect.objectContaining({ alerts: [{ notification: "this me" }] }),
        undefined,
      );
    });
  });

  describe("when handling the mode", () => {
    describe("when there is no mode", () => {
      it("should not call SecondaryButton", () => {
        renderExchangeUnmatchedCard({});

        expect(SecondaryButton).not.toHaveBeenCalled();
      });

      it("should not call PrimaryButton", () => {
        renderExchangeUnmatchedCard({});

        expect(PrimaryButton).not.toHaveBeenCalled();
      });

      it("should not have the actions container", () => {
        const { actionsContainer } = renderExchangeUnmatchedCard({});

        expect(actionsContainer).toBeNull();
      });
    });

    describe("when mode is Full", () => {
      describe("cancel button", () => {
        it("should call SecondaryButton label with labels.cancel", () => {
          renderExchangeUnmatchedCard({ onEdit: jest.fn(), onCancel: jest.fn(), labels: { cancel: "cancel" } });

          expect(SecondaryButton).toHaveBeenCalledWith(expect.objectContaining({ label: "cancel" }), undefined);
        });

        it("should call SecondaryButton onTap with onCancel", () => {
          const onCancelSpy = jest.fn();
          renderExchangeUnmatchedCard({ onEdit: jest.fn(), onCancel: onCancelSpy });

          expect(SecondaryButton).toHaveBeenCalledWith(expect.objectContaining({ onTap: onCancelSpy }), undefined);
        });
      });

      describe("confirm button", () => {
        it("should call PrimaryButton label with labels.confirm", () => {
          renderExchangeUnmatchedCard({ onEdit: jest.fn(), onCancel: jest.fn(), labels: { confirm: "confirm" } });

          expect(PrimaryButton).toHaveBeenCalledWith(expect.objectContaining({ label: "confirm" }), undefined);
        });

        it("should call PrimaryButton onTap with onEdit", () => {
          const onEditSpy = jest.fn();
          renderExchangeUnmatchedCard({ onCancel: jest.fn(), onEdit: onEditSpy });

          expect(PrimaryButton).toHaveBeenCalledWith(expect.objectContaining({ onTap: onEditSpy }), undefined);
        });
      });
    });

    describe("when mode is Cancel", () => {
      describe("cancel button", () => {
        it("should call SecondaryButton label with labels.cancel", () => {
          renderExchangeUnmatchedCard({ onEdit: jest.fn(), onCancel: jest.fn(), labels: { cancel: "cancel" } });

          expect(SecondaryButton).toHaveBeenCalledWith(expect.objectContaining({ label: "cancel" }), undefined);
        });

        it("should call SecondaryButton onClick with onCancel", () => {
          const onCancelSpy = jest.fn();
          renderExchangeUnmatchedCard({ onEdit: jest.fn(), onCancel: onCancelSpy });

          expect(SecondaryButton).toHaveBeenCalledWith(expect.objectContaining({ onTap: onCancelSpy }), undefined);
        });
      });

      describe("confirm button", () => {
        it("should not call PrimaryButton", () => {
          renderExchangeUnmatchedCard({});

          expect(PrimaryButton).not.toHaveBeenCalled();
        });
      });
    });

    describe("when cancel button is tapped", () => {
      it("should call the correct onCancel callback", () => {
        const onCancelSpy = jest.fn();
        renderExchangeUnmatchedCard({ onEdit: jest.fn(), onCancel: onCancelSpy });
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
