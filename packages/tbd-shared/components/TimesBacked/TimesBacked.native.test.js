import { render } from "@testing-library/react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Styled } from "@ppb/the-wall-native";
import { TimesBacked } from "./TimesBacked.native";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  ...jest.requireActual("@ppb/the-wall-icons/GenericIcon/GenericIcon"),
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Styled: jest.fn(({ translation }) => <styled-mock>{translation}</styled-mock>),
  Text: jest.requireActual("react-native").Text,
}));

describe("TimesBacked", () => {
  it("renders GenericIcon and Styled with correct props", () => {
    const props = {
      label: "times.backed",
      icon: "System--star",
      iconColor: "#0000ff",
    };

    render(<TimesBacked {...props} />);

    expect(GenericIcon).toHaveBeenCalledWith(
      {
        name: props.icon,
        color: props.iconColor,
      },
      undefined,
    );

    expect(Styled).toHaveBeenCalledWith(
      {
        translation: props.label,
        styles: { count: expect.anything() },
      },
      undefined,
    );
  });
});
