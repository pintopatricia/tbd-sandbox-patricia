import { render, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { InlinePanelColor } from "./InlinePanel.types";
import { InlinePanel } from "./InlinePanel.native";
import { INLINE_PANEL, TITLE_PREFIX, TITLE, ACTION } from "./InlinePanel.native.selectors";

import styles from "./InlinePanel.native.styles";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => null),
}));

function renderInlinePanel({ titlePrefix, title, action, color, onAction } = {}) {
  const victim = render(
    <InlinePanel titlePrefix={titlePrefix} title={title} action={action} color={color} onAction={onAction} />,
  );
  const { rerender } = victim;

  const panelEl = victim.getByTestId(INLINE_PANEL);
  const titlePrefixEl = victim.queryByTestId(TITLE_PREFIX);
  const titleEl = victim.getByTestId(TITLE);
  const actionEl = victim.getByTestId(ACTION);

  return {
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
      it("should have the `inlinePanelBlue` style", () => {
        const { panelEl } = renderInlinePanel({ color: InlinePanelColor.Blue });

        expect(panelEl).toHaveStyle(styles.inlinePanelBlue);
      });
    });

    describe("when color is InlinePanelColor.Pink", () => {
      it("should have the `inlinePanelPink` style", () => {
        const { panelEl } = renderInlinePanel({ color: InlinePanelColor.Pink });

        expect(panelEl).toHaveStyle(styles.inlinePanelPink);
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
        { name: SystemIconName.CLOSE, color: tokens.NeutralsIconDefault },
        undefined,
      );
    });

    it("should call onAction when action button is pressed", () => {
      const onActionSpy = jest.fn();
      const { actionEl } = renderInlinePanel({ color: InlinePanelColor.Blue, action: "Test", onAction: onActionSpy });

      expect(actionEl).not.toBeNull();
      fireEvent.press(actionEl);

      expect(onActionSpy).toHaveBeenCalled();
    });
  });

  describe("children", () => {
    it("should render children content", () => {
      const victim = render(
        <InlinePanel title="With children" color={InlinePanelColor.Blue}>
          <Text testID="child">Child content</Text>
        </InlinePanel>,
      );

      const child = victim.getByTestId("child");
      expect(child).toHaveTextContent("Child content");
    });
  });
});
