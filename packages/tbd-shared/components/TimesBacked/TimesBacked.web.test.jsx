import { render } from "@testing-library/react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Styled } from "@ppb/the-wall-web";
import { TimesBacked } from "./TimesBacked.web";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <div data-testid="mock-icon" />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Styled: jest.fn(({ translation }) => <span data-testid="mock-styled">{translation}</span>),
}));

describe("TimesBacked", () => {
  it("should render GenericIcon and Styled with correct props", () => {
    const props = {
      label: "backed.count",
      icon: "System--check",
      iconColor: "#ff0000",
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
        styles: { count: expect.any(String) },
      },
      undefined,
    );
  });
});
