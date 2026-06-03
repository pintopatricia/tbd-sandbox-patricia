import { render } from "@testing-library/react-native";

import { InlinePanelColorMap } from "../../../InlinePanel/InlinePanel.types";

import { InlinePanel } from "../../../InlinePanel/InlinePanel.native";

import { ExchangeMatchedCard } from "../ExchangeMatchedCard/ExchangeMatchedCard.native";
import { ExchangeUnmatchedCard } from "../ExchangeUnmatchedCard/ExchangeUnmatchedCard.native";
import { ExchangeInlineReceiptPanel } from "./ExchangeInlineReceiptPanel.native";

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("../ExchangeUnmatchedCard/ExchangeUnmatchedCard.native", () => ({
  ExchangeUnmatchedCard: jest.fn(() => <exc-unmatched-card-mock />),
}));
jest.mock("../ExchangeMatchedCard/ExchangeMatchedCard.native", () => ({
  ExchangeMatchedCard: jest.fn(() => <exc-matched-card-mock />),
}));
jest.mock("../../../InlinePanel/InlinePanel.native", () => ({ InlinePanel: jest.fn(() => <inline-panel-mock />) }));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
}));

function renderExchangeInlineReceiptPanel({
  title = "Bet",
  side = "Back",
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

  render(InlinePanel.mock.calls[0][0].children);
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
        side: "Lay",
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
        side: "Lay",
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
