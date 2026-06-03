import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { InlinePanelColor } from "./InlinePanel.types";
import { InlinePanel } from "./InlinePanel.web";
import { TEST_ID, TITLE_PREFIX, TITLE, ACTION } from "./InlinePanel.web.selectors";

import styles from "./InlinePanel.web.css";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({ GenericIcon: jest.fn(() => <generic-icon-mock />) }));

function renderInlinePanel({ titlePrefix, title, action, color, onAction } = {}) {
  const { container, rerender } = render(
    <InlinePanel titlePrefix={titlePrefix} title={title} action={action} color={color} onAction={onAction} />,
  );

  const panelEl = container.querySelector(TEST_ID);
  const titlePrefixEl = container.querySelector(TITLE_PREFIX);
  const titleEl = container.querySelector(TITLE);
  const actionEl = container.querySelector(ACTION);

  return {
    container,
    panelEl,
    titlePrefixEl,
    titleEl,
    actionEl,
    rerender,
  };
}

describe("InlinePanel", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("color", () => {
    describe("when color is InlinePanelColor.Blue", () => {
      it("should have the `blue` class", () => {
        const { panelEl } = renderInlinePanel({ color: InlinePanelColor.Blue });

        expect(panelEl).toHaveClass(styles.blue);
      });
    });

    describe("when color is InlinePanelColor.Pink", () => {
      it("should have the `pink` class", () => {
        const { panelEl } = renderInlinePanel({ color: InlinePanelColor.Pink });

        expect(panelEl).toHaveClass(styles.pink);
      });
    });
  });

  describe("titlePrefix", () => {
    it("should set the titlePrefix in the header", () => {
      const { titlePrefixEl } = renderInlinePanel({ color: InlinePanelColor.Blue, titlePrefix: "Test Prefix" });

      expect(titlePrefixEl).toHaveTextContent("Test Prefix:");
    });
  });

  describe("title", () => {
    it("should set the title in the header", () => {
      const { titleEl } = renderInlinePanel({ color: InlinePanelColor.Blue, title: "Test" });

      expect(titleEl).toHaveTextContent("Test");
    });
  });

  describe("action", () => {
    it("should call GenericIcon", () => {
      const onActionSpy = jest.fn();
      renderInlinePanel({ color: InlinePanelColor.Blue, action: "Test", onAction: onActionSpy });

      expect(GenericIcon).toHaveBeenCalledWith(
        { name: SystemIconName.CLOSE, color: "var(--neutrals-icon-default)" },
        undefined,
      );
    });

    it("should call onAction when action button is clicked", () => {
      const onActionSpy = jest.fn();
      const { actionEl } = renderInlinePanel({ color: InlinePanelColor.Blue, action: "Test", onAction: onActionSpy });

      expect(actionEl).not.toBeNull();
      fireEvent.click(actionEl);

      expect(onActionSpy).toHaveBeenCalled();
    });
  });

  describe("children", () => {
    it("should render children content", () => {
      const { container } = render(
        <InlinePanel title="With children" color={InlinePanelColor.Blue}>
          <div data-testid="child">Child content</div>
        </InlinePanel>,
      );

      const child = container.querySelector('[data-testid="child"]');
      expect(child).toHaveTextContent("Child content");
    });
  });
});
