import { render, fireEvent } from "@testing-library/react-native";

import { colors } from "@ppb/the-wall-common/base-theme";
import { BottomSheet, RichTextComponent, Switch, Text } from "@ppb/the-wall-native";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import MatchMe from "./MatchMe.native";
import {
  MATCH_ME,
  MATCH_ME_INFO_ICON,
  MATCH_ME_LABEL,
  MATCH_ME_ODDS_RANGE,
  MATCH_ME_TOGGLE,
} from "./MatchMe.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  __esModule: true,
  Text: jest.fn(({ children, testID }) => <mock-text testID={testID}>{children}</mock-text>),
  Switch: jest.fn(() => null),
  BottomSheet: jest.fn(({ children }) => children),
  RichTextComponent: jest.fn(() => null),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  __esModule: true,
  GenericIcon: jest.fn(() => null),
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

describe("MatchMe Native Component", () => {
  afterEach(jest.clearAllMocks);

  it("should render the container with testID", () => {
    const { getByTestId } = renderMatchMe();

    expect(getByTestId(MATCH_ME)).toBeDefined();
  });

  it("should render the info icon with the correct color", () => {
    renderMatchMe();

    expect(GenericIcon).toHaveBeenCalledWith(
      { name: SystemIconName.NOTIFICATION_INFO, color: colors.ActionTertiaryIconDefault },
      undefined,
    );
  });

  it("should render the label", () => {
    const { getByTestId } = renderMatchMe();

    expect(getByTestId(MATCH_ME_LABEL)).toBeDefined();
  });

  describe("when oddsRange is provided", () => {
    it("should render the odds range text", () => {
      const { getByTestId } = renderMatchMe({ oddsRange: { min: 1.56, max: 1.51 } });

      expect(getByTestId(MATCH_ME_ODDS_RANGE)).toBeDefined();
    });
  });

  describe("when oddsRange is null", () => {
    it("should not render the odds range text", () => {
      const { queryByTestId } = renderMatchMe({ oddsRange: null });

      expect(queryByTestId(MATCH_ME_ODDS_RANGE)).toBeNull();
    });
  });

  it("should render Switch with isChecked false when disabled", () => {
    renderMatchMe({ isEnabled: false });

    expect(Switch).toHaveBeenCalledWith(expect.objectContaining({ isChecked: false }), undefined);
  });

  it("should render Switch with isChecked true when enabled", () => {
    renderMatchMe({ isEnabled: true });

    expect(Switch).toHaveBeenCalledWith(expect.objectContaining({ isChecked: true }), undefined);
  });

  it("should pass onToggle to Switch onChange", () => {
    const onToggle = jest.fn();
    renderMatchMe({ onToggle });

    expect(Switch).toHaveBeenCalledWith(expect.objectContaining({ onChange: onToggle }), undefined);
  });

  describe("info bottom sheet", () => {
    it("should not render BottomSheet by default", () => {
      renderMatchMe();

      expect(BottomSheet).not.toHaveBeenCalled();
    });

    it("should render BottomSheet when info icon is pressed", () => {
      const { getByTestId } = renderMatchMe();

      fireEvent.press(getByTestId(MATCH_ME_INFO_ICON));

      expect(BottomSheet).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "I18N.MATCH_ME.MODAL.TITLE",
          showOverlay: true,
          withModal: true,
          onHeaderIconTap: expect.any(Function),
        }),
        undefined,
      );
    });

    it("should render RichTextComponent inside BottomSheet with i18n content", () => {
      const { getByTestId } = renderMatchMe();

      fireEvent.press(getByTestId(MATCH_ME_INFO_ICON));

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
