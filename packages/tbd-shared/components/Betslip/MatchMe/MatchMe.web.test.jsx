import "jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import { Modal, RichTextComponent } from "@ppb/the-wall-web";
import { Switch } from "@ppb/the-wall-web/components/bricks/Switch/Switch";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import MatchMe from "./MatchMe.web";
import styles from "./MatchMe.web.css";
import { TEST_ID, INFO_ICON, LABEL, ODDS_RANGE } from "./MatchMe.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  __esModule: true,
  Modal: jest.fn(({ children }) => <modal-mock>{children}</modal-mock>),
  RichTextComponent: jest.fn(() => <rich-text-mock />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/Switch/Switch", () => ({
  __esModule: true,
  Switch: jest.fn(({ children }) => <switch-mock>{children}</switch-mock>),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  __esModule: true,
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const defaultProps = {
  isEnabled: false,
  oddsRange: null,
  label: "MatchMe",
  onToggle: jest.fn(),
  selectionUrn: "ppb:selection:123",
};

const renderMatchMe = (props = {}) => render(<MatchMe {...defaultProps} {...props} />);

describe("MatchMe Web Component", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the container", () => {
    const { container } = renderMatchMe();
    const mainContainer = container.querySelector(TEST_ID);

    expect(mainContainer).toBeDefined();
    expect(mainContainer).toHaveClass(styles.container);
  });

  it("should render the info icon with the correct color", () => {
    renderMatchMe();

    expect(GenericIcon).toHaveBeenCalledWith(
      { name: SystemIconName.NOTIFICATION_INFO, color: "var(--action-tertiary-icon-default)" },
      undefined,
    );
  });

  it("should render the label", () => {
    const { container } = renderMatchMe();
    const labelElement = container.querySelector(LABEL);

    expect(labelElement).toHaveTextContent("MatchMe");
  });

  describe("when oddsRange is provided", () => {
    it("should render the odds range text", () => {
      const { container } = renderMatchMe({ oddsRange: { min: 1.56, max: 1.51 } });
      const oddsRangeElement = container.querySelector(ODDS_RANGE);

      expect(oddsRangeElement).toHaveTextContent("I18N.MATCH_ME.ODDS_RANGE");
    });
  });

  describe("when oddsRange is null", () => {
    it("should not render the odds range text", () => {
      const { container } = renderMatchMe({ oddsRange: null });
      const oddsRangeElement = container.querySelector(ODDS_RANGE);

      expect(oddsRangeElement).toBeNull();
    });
  });

  it("should render Switch with isChecked false when disabled", () => {
    renderMatchMe({ isEnabled: false });

    expect(Switch).toHaveBeenCalledWith(
      expect.objectContaining({
        isChecked: false,
        label: "",
        checkboxId: "match-me-toggle",
        checkboxName: "match-me-toggle",
      }),
      undefined,
    );
  });

  it("should render Switch with isChecked true when enabled", () => {
    renderMatchMe({ isEnabled: true });

    expect(Switch).toHaveBeenCalledWith(
      expect.objectContaining({
        isChecked: true,
      }),
      undefined,
    );
  });

  it("should pass onToggle to Switch onChange", () => {
    const onToggle = jest.fn();
    renderMatchMe({ onToggle });

    expect(Switch).toHaveBeenCalledWith(
      expect.objectContaining({
        onChange: onToggle,
      }),
      undefined,
    );
  });

  describe("info modal", () => {
    it("should not render Modal by default", () => {
      renderMatchMe();

      expect(Modal).not.toHaveBeenCalled();
    });

    it("should render Modal when info icon is clicked", () => {
      const { container } = renderMatchMe();
      const infoButton = container.querySelector(INFO_ICON);

      fireEvent.click(infoButton);

      expect(Modal).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "I18N.MATCH_ME.MODAL.TITLE",
          onDismiss: expect.any(Function),
        }),
        undefined,
      );
    });

    it("should render RichTextComponent inside Modal with i18n content", () => {
      const { container } = renderMatchMe();
      const infoButton = container.querySelector(INFO_ICON);

      fireEvent.click(infoButton);

      expect(RichTextComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          list: expect.arrayContaining([
            expect.objectContaining({ text: "I18N.MATCH_ME.MODAL.CONTENT.HEADING_1" }),
            expect.objectContaining({ text: "I18N.MATCH_ME.MODAL.CONTENT.TEXT_1" }),
            expect.objectContaining({ text: "I18N.MATCH_ME.MODAL.CONTENT.HEADING_2" }),
            expect.objectContaining({ text: "I18N.MATCH_ME.MODAL.CONTENT.TEXT_2" }),
          ]),
        }),
        undefined,
      );
    });
  });
});
