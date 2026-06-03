import { render, fireEvent } from "@testing-library/react-native";

import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { MarketSwitcher } from "./MarketSwitcher.native";
import {
  MARKET_SWITCHER,
  MARKET_SWITCHER_TITLE,
  MARKET_SWITCHER_LABEL,
  MARKET_SWITCHER_BUTTON,
  MARKET_SWITCHER_ICON,
} from "./MarketSwitcher.native.selectors";
import styles from "./MarketSwitcher.native.styles";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("./MarketSwitcher.native.styles", () => ({
  styles: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const onTapMock = jest.fn();

const defaultProps = {
  onTap: onTapMock,
  label: "Fake-label",
  value: "fake-value",
};

const renderMarketSwitcher = ({ onTap, title, label, value } = {}) =>
  render(<MarketSwitcher onTap={onTap} title={title} label={label} value={value} />);

describe("MarketSwitcher", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render component", () => {
    const { queryByTestId } = renderMarketSwitcher(defaultProps);
    const comp = queryByTestId(MARKET_SWITCHER);
    const label = queryByTestId(MARKET_SWITCHER_LABEL);

    expect(comp).toBeDefined();
    expect(label).toHaveTextContent("Fake-label");
  });

  it("should have button with marketSwitcher style", () => {
    const { queryByTestId } = renderMarketSwitcher(defaultProps);
    const button = queryByTestId(MARKET_SWITCHER_BUTTON);

    expect(button).toHaveStyle(styles.marketSwitcher);
  });

  describe("when title is defined", () => {
    it("should have style title", () => {
      const { queryByTestId } = renderMarketSwitcher({ ...defaultProps, title: "Fake title" });
      const title = queryByTestId(MARKET_SWITCHER_TITLE);

      expect(title).toHaveStyle(styles.title);
    });
  });

  describe("arrow", () => {
    it("should display the arrow correctly", () => {
      const { queryByTestId } = renderMarketSwitcher(defaultProps);
      const icon = queryByTestId(MARKET_SWITCHER_ICON);

      expect(GenericIcon).toHaveBeenCalledTimes(1);
      expect(GenericIcon).toHaveBeenCalledWith(
        { name: SystemIconName.CHEVRON_DOWN, color: tokens.MarketSwitcherIconColour },
        undefined,
      );
      expect(icon).toBeDefined();
    });
  });

  describe("when tap the market switcher", () => {
    beforeEach(() => {
      const { queryByTestId } = renderMarketSwitcher(defaultProps);
      const button = queryByTestId(MARKET_SWITCHER_BUTTON);

      fireEvent.press(button);
    });

    it("should call onTap prop", () => {
      expect(onTapMock).toHaveBeenCalledTimes(1);
    });
  });
});
