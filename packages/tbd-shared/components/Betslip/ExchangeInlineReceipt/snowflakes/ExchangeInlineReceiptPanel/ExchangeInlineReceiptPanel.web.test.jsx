import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { InlinePanelColorMap } from "../../../InlinePanel/InlinePanel.types";

import { ExchangeUnmatchedCard } from "../ExchangeUnmatchedCard/ExchangeUnmatchedCard.web";
import { ExchangeMatchedCard } from "../ExchangeMatchedCard/ExchangeMatchedCard.web";

import { ExchangeInlineReceiptPanel } from "./ExchangeInlineReceiptPanel.web";
import { InlinePanel } from "../../../InlinePanel/InlinePanel.web";

jest.mock("../ExchangeUnmatchedCard/ExchangeUnmatchedCard.web", () => ({
  ExchangeUnmatchedCard: jest.fn(() => <exc-unmatched-card-mock />),
}));
jest.mock("../ExchangeMatchedCard/ExchangeMatchedCard.web", () => ({
  ExchangeMatchedCard: jest.fn(() => <exc-unmatched-card-mock />),
}));
jest.mock("../../../InlinePanel/InlinePanel.web", () => ({
  InlinePanel: jest.fn(({ children }) => <inline-panel-mock>{children}</inline-panel-mock>),
}));

function renderExchangeInlineReceiptPanel({
  title = "Bet",
  side = "BACK",
  matched = { matchedProps: "matchedProps" },
  unmatched = { unmatchedProps: "unmatchedProps" },
  onDone,
  onCancel,
  onEdit,
}) {
  render(
    <ExchangeInlineReceiptPanel
      title={title}
      side={side}
      matched={matched}
      unmatched={unmatched}
      onDone={onDone}
      onCancel={onCancel}
      onEdit={onEdit}
    />,
  );
}

describe("ExchangeInlineReceiptPanel", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should call InlinePanel with title", () => {
    renderExchangeInlineReceiptPanel({ title: "Bet" });

    expect(InlinePanel).toHaveBeenCalledWith(expect.objectContaining({ title: "Bet" }), undefined);
  });

  it("should call InlinePanel onAction with onDone", () => {
    const onDoneSpy = jest.fn();
    renderExchangeInlineReceiptPanel({ onDone: onDoneSpy });

    expect(InlinePanel).toHaveBeenCalledWith(expect.objectContaining({ onAction: onDoneSpy }), undefined);
  });

  describe.each(Object.entries(InlinePanelColorMap))("when side is %s", (side, color) => {
    it(`should call InlinePanel with ${color} color`, () => {
      renderExchangeInlineReceiptPanel({ side });

      expect(InlinePanel).toHaveBeenCalledWith(expect.objectContaining({ color }), undefined);
    });
  });

  describe("when there is an unmatched bet", () => {
    it("should call ExchangeUnmatchedCard with spread props", () => {
      const onCancelSpy = jest.fn();
      const onEditSpy = jest.fn();

      renderExchangeInlineReceiptPanel({
        unmatched: { unmatchedProps: "unmatchedProps" },
        matched: null,
        side: "LAY",
        onCancel: onCancelSpy,
        onEdit: onEditSpy,
      });

      expect(ExchangeUnmatchedCard).toHaveBeenCalledWith(
        { unmatchedProps: "unmatchedProps", onCancel: onCancelSpy, onEdit: onEditSpy },
        undefined,
      );
    });
  });

  describe("when there is a matched bet", () => {
    it("should call ExchangeMatchedCard with spread props", () => {
      renderExchangeInlineReceiptPanel({
        unmatched: null,
        matched: { matchedProps: "matchedProps" },
        side: "LAY",
      });

      expect(ExchangeMatchedCard).toHaveBeenCalledWith({ matchedProps: "matchedProps" }, undefined);
    });
  });

  describe("titlePrefix", () => {
    it("should use matched titlePrefix when both matched and unmatched have titlePrefix", () => {
      renderExchangeInlineReceiptPanel({
        matched: { titlePrefix: "Matched Prefix" },
        unmatched: { titlePrefix: "Unmatched Prefix" },
      });

      expect(InlinePanel).toHaveBeenCalledWith(expect.objectContaining({ titlePrefix: "Matched Prefix" }), undefined);
    });

    it("should fall back to unmatched titlePrefix when matched has no titlePrefix", () => {
      renderExchangeInlineReceiptPanel({
        matched: { matchedProps: "matchedProps" },
        unmatched: { titlePrefix: "Unmatched Prefix" },
      });

      expect(InlinePanel).toHaveBeenCalledWith(expect.objectContaining({ titlePrefix: "Unmatched Prefix" }), undefined);
    });

    it("should fall back to unmatched titlePrefix when matched is null", () => {
      renderExchangeInlineReceiptPanel({
        matched: null,
        unmatched: { titlePrefix: "Unmatched Prefix" },
      });

      expect(InlinePanel).toHaveBeenCalledWith(expect.objectContaining({ titlePrefix: "Unmatched Prefix" }), undefined);
    });

    it("should be undefined when neither matched nor unmatched have titlePrefix", () => {
      renderExchangeInlineReceiptPanel({
        matched: { matchedProps: "matchedProps" },
        unmatched: { unmatchedProps: "unmatchedProps" },
      });

      expect(InlinePanel).toHaveBeenCalledWith(expect.objectContaining({ titlePrefix: undefined }), undefined);
    });
  });
});
