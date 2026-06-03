import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { MarketSwitcher } from "./MarketSwitcher.web";
import styles from "./MarketSwitcher.web.css";
import { TITLE, BUTTON, TEST_ID, CHEVRON, LABEL } from "./MarketSwitcher.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
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

  it("should be rendered", () => {
    const { container } = renderMarketSwitcher(defaultProps);
    const comp = container.querySelector(TEST_ID);

    expect(comp).toBeDefined();
    expect(container.querySelector(LABEL).textContent).toEqual("Fake-label");
  });

  it("should have button with marketSwitcher class", () => {
    const { container } = renderMarketSwitcher(defaultProps);
    const button = container.querySelector(BUTTON);
    expect(button).toHaveClass(styles.marketSwitcher);
  });

  describe("when title is defined", () => {
    it("should have title class", () => {
      const { container } = renderMarketSwitcher({ ...defaultProps, title: "Fake title" });
      const title = container.querySelector(TITLE);
      expect(title).toHaveClass(styles.title);
    });
  });

  describe("arrow", () => {
    it("should display the arrow correctly", () => {
      const { container } = renderMarketSwitcher(defaultProps);

      expect(GenericIcon).toHaveBeenCalledTimes(1);
      expect(GenericIcon).toHaveBeenCalledWith(
        { name: SystemIconName.CHEVRON_DOWN, color: "var(--market-switcher-icon-colour)" },
        undefined,
      );
      expect(container.querySelector(CHEVRON)).toBeVisible();
    });
  });

  describe("when tap the market switcher", () => {
    beforeEach(() => {
      const { container } = renderMarketSwitcher(defaultProps);

      const button = container.querySelector(BUTTON);

      fireEvent.click(button);
    });

    it("should call onTap prop", () => {
      expect(onTapMock).toHaveBeenCalledTimes(1);
    });
  });
});
