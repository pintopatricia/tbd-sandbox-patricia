/* eslint-disable no-undef */
import { fireEvent, render } from "@testing-library/react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { VerticalPosition } from "@ppb/the-wall-common/types/Tooltip/Tooltip.types";
import { SystemIconName } from "@ppb/the-wall-icons";
import { Tooltip } from "@ppb/the-wall-native";
import MyBetsHeaderTooltip from "./MyBetsHeaderTooltip.native";

jest.mock("@ppb/the-wall-native", () => ({
  Tooltip: jest.fn(() => <tooltip-mock />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: { MyBetsHeaderIconRightColour: "#ffffff" },
}));
const tooltipToggle = jest.fn();

const defaultProps = {
  title: "Tooltip Title",
  description: "Tooltip Description",
  handleTooltipToggle: tooltipToggle,
};

function renderTooltip() {
  return render(<MyBetsHeaderTooltip {...defaultProps} />);
}

describe("MyBetsHeaderTooltip component", () => {
  let infoButton;
  let queryByTestId;

  beforeEach(() => {
    ({ queryByTestId, getByText } = renderTooltip());
    infoButton = queryByTestId("info-button");
  });

  it("renders the iconButton and does not show the tooltip initially", () => {
    expect(infoButton).not.toBeNull();
    expect(GenericIcon).toHaveBeenCalledWith({ name: SystemIconName.NOTIFICATION_INFO, color: "#ffffff" }, undefined);
    expect(Tooltip).not.toHaveBeenCalled();
  });

  it("shows the tooltip when the button is pressed", () => {
    expect(infoButton).not.toBeNull();
    fireEvent.press(infoButton);

    expect(Tooltip).toHaveBeenCalledWith(
      {
        title: "Tooltip Title",
        description: "Tooltip Description",
        coachMark: {
          verticalPosition: VerticalPosition.Top,
          horizontalPosition: "90%",
        },
        onClosePress: expect.any(Function),
      },
      undefined,
    );
    expect(tooltipToggle).toHaveBeenCalledTimes(1);
  });
});
