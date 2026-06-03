import { render, screen, fireEvent } from "@testing-library/react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { VerticalPosition } from "@ppb/the-wall-common/types/Tooltip/Tooltip.types";
import { SystemIconName } from "@ppb/the-wall-icons";
import { Tooltip } from "@ppb/the-wall-web";
import MyBetsHeaderTooltip from "./MyBetsHeaderTooltip.web";
import "jest-dom/extend-expect";

jest.mock("@ppb/the-wall-web", () => ({
  Tooltip: jest.fn(() => <div>Tooltip</div>),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

const tooltipToggle = jest.fn();

const defaultProps = {
  title: "Tooltip Title",
  description: "Tooltip Description",
  handleTooltipToggle: tooltipToggle,
};

describe("MyBetsHeaderTooltip component", () => {
  beforeEach(jest.clearAllMocks);

  it("renders the iconButton and does not show the tooltip initially", () => {
    render(<MyBetsHeaderTooltip {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(GenericIcon).toHaveBeenCalledWith(
      { name: SystemIconName.NOTIFICATION_INFO, color: "var(--my-bets-header-icon-right-colour)" },
      undefined,
    );
    expect(Tooltip).not.toHaveBeenCalled();
    const tooltip = screen.queryByText("Tooltip");
    expect(tooltip).not.toBeInTheDocument();
  });

  it("shows the tooltip when the button is clicked", () => {
    render(<MyBetsHeaderTooltip {...defaultProps} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(Tooltip).toHaveBeenCalledWith(
      {
        title: "Tooltip Title",
        description: "Tooltip Description",
        coachMark: {
          verticalPosition: VerticalPosition.Top,
          horizontalPosition: "calc(100% - 60px)",
        },
        onCloseClick: expect.any(Function),
      },
      undefined,
    );

    const tooltip = screen.getByText("Tooltip");
    expect(tooltip).toBeInTheDocument();

    expect(tooltipToggle).toHaveBeenCalledTimes(1);
  });
});
