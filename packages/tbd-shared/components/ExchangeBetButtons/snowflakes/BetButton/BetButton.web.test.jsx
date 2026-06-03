import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { BetButtonColor, BetButtonType, BetButtonStatus } from "./BetButton.types";
import { BetButton } from "./BetButton.web";
import styles from "./BetButton.web.css";
import stylesDefinitionBetButton from "./BetButton.web.modules.json";

const TEST_ID = stylesDefinitionBetButton.betButton;
const PRIMARY_LABEL = stylesDefinitionBetButton.primaryLabel;
const SECONDARY_LABEL = stylesDefinitionBetButton.secondaryLabel;
const SECONDARY_LABEL_CONTAINER = stylesDefinitionBetButton.secondaryLabelContainer;
const SECONDARY_LABEL_HANDICAP = stylesDefinitionBetButton.secondaryLabelHandicap;
const ICON = stylesDefinitionBetButton.icon;

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

function renderBetButton({
  primary = "1.3",
  secondary,
  side,
  status,
  onClick,
  disabled,
  bgColor,
  type,
  isOddsboostMarketType = false,
  isSecondaryLabelStruckThrough = true,
  handicapLabel,
  icon,
}) {
  const { container } = render(
    <BetButton
      primaryLabel={primary}
      secondaryLabel={secondary}
      side={side}
      status={status}
      disabled={disabled}
      onClick={onClick}
      bgColor={bgColor}
      type={type}
      isOddsboostMarketType={isOddsboostMarketType}
      isSecondaryLabelStruckThrough={isSecondaryLabelStruckThrough}
      handicapLabel={handicapLabel}
      icon={icon}
    />,
  );

  const button = container.querySelector(TEST_ID);
  const primaryLabel = button.querySelector(PRIMARY_LABEL);
  const secondaryLabelContainer = button.querySelector(SECONDARY_LABEL_CONTAINER);
  const secondaryLabel = button.querySelector(SECONDARY_LABEL);
  const secondaryLabelHandicap = button.querySelector(SECONDARY_LABEL_HANDICAP);
  const iconContainer = button.querySelector(ICON);

  return { button, primaryLabel, secondaryLabelContainer, secondaryLabel, secondaryLabelHandicap, iconContainer };
}

describe("BetButton", () => {
  const fakeCallback = jest.fn();

  it("should draw the odd", () => {
    const { primaryLabel } = renderBetButton({});
    expect(primaryLabel).toHaveTextContent("1.3");
  });

  it("should draw the liquidity if provided", () => {
    const { secondaryLabelContainer } = renderBetButton({ secondary: "1000€", type: BetButtonType.Exc });
    expect(secondaryLabelContainer).toHaveTextContent("1000€");
  });

  it("should not draw the liquidity if not provided", () => {
    const { secondaryLabelContainer } = renderBetButton({});
    expect(secondaryLabelContainer).toBeNull();
  });

  describe("and the button is clicked", () => {
    it("should call the callback function", () => {
      const { button } = renderBetButton({
        onClick: fakeCallback,
      });
      fireEvent.click(button);
      expect(fakeCallback).toHaveBeenCalled();
    });
  });

  it("shouldn't be disabled", () => {
    const { button } = renderBetButton({});
    expect(button).not.toBeDisabled();
  });

  describe("and disabled prop is true", () => {
    it("should be disabled", () => {
      const { button } = renderBetButton({
        disabled: true,
      });
      expect(button).toBeDisabled();
    });
  });

  describe("and status prop is selected", () => {
    it("should be disabled", () => {
      const { button } = renderBetButton({
        disabled: false,
        status: BetButtonStatus.Selected,
      });
      expect(button).toHaveClass(styles.isSelected);
    });
  });

  describe("and the button is sportsbook", () => {
    let button;
    let secondaryLabelContainer;

    beforeAll(() => {
      ({ button, secondaryLabelContainer } = renderBetButton({
        secondary: "1000€",
        type: "sbk",
        bgColor: BetButtonColor.Grey,
        isOddsboostMarketType: true,
      }));
    });

    it("should add the lineThrough class to secondary label", () => {
      expect(secondaryLabelContainer).toHaveClass(styles.lineThrough);
    });

    it("should add the yellow700 if bgColor is Grey", () => {
      expect(button).toHaveClass(styles.yellow700);
    });
  });

  describe("and the icon is provided", () => {
    it("should render it with the expected styles", () => {
      const iconProps = { name: "some icon name", color: "some icon color" };

      const { button, primaryLabel } = renderBetButton({
        primary: "primaryLabel",
        icon: iconProps,
      });

      expect(GenericIcon).toHaveBeenCalledWith(iconProps, undefined);
      expect(primaryLabel).toHaveTextContent("primaryLabel");
      expect(button).toHaveClass(styles.horizontalBetButton);
    });
  });

  describe("and the button is price bet button for sportsbook", () => {
    const setup = ({ handicapLabel }) =>
      renderBetButton({
        secondary: "Futebol Clube do Porto",
        type: "sbk",
        bgColor: BetButtonColor.Grey,
        isOddsboostMarketType: true,
        isSecondaryLabelStruckThrough: false,
        handicapLabel,
      });

    describe("and the handicap label is not provided", () => {
      it("should not add the lineThrough class to secondary label", () => {
        const { secondaryLabelContainer } = setup({});

        expect(secondaryLabelContainer).not.toHaveClass(styles.lineThrough);
      });

      it("should draw the label", () => {
        const { secondaryLabel } = setup({});

        expect(secondaryLabel).toHaveTextContent("Futebol Clube do Porto");
      });

      it("should not draw the handicap", () => {
        const { secondaryLabelHandicap } = setup({});

        expect(secondaryLabelHandicap).toBeNull();
      });
    });

    describe("and the handicap label is provided", () => {
      it("should not add the lineThrough class to secondary label", () => {
        const { secondaryLabelContainer } = setup({ handicapLabel: "handicap" });

        expect(secondaryLabelContainer).not.toHaveClass(styles.lineThrough);
      });

      it("should draw the label", () => {
        const { secondaryLabel } = setup({ handicapLabel: "handicap" });

        expect(secondaryLabel).toHaveTextContent("Futebol Clube do Porto");
      });

      it("should draw the handicap", () => {
        const { secondaryLabelHandicap } = setup({ handicapLabel: "handicap" });

        expect(secondaryLabelHandicap).toHaveTextContent("handicap");
      });
    });
  });
});
