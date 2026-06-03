import { render } from "@testing-library/react";
import { Divider, Placeholder } from "@ppb/the-wall-web";
import ObbCreatedBetsCardPlaceholder from "./ObbCreatedBetsCardPlaceholder.web";

jest.mock("@ppb/the-wall-web", () => ({
  Placeholder: jest.fn(() => <placeholder-mock data-testid="placeholder-mock" />),
  Divider: jest.fn(() => <divider-mock data-testid="divider-mock" />),
}));

describe("ObbCreatedBetsCardPlaceholder", () => {
  it("should have a section and a div", () => {
    const { container } = render(<ObbCreatedBetsCardPlaceholder />);
    const header = container.getElementsByClassName("header");
    const outcomesContainer = container.getElementsByClassName("outcomes-container");
    const footer = container.getElementsByClassName("footer");

    expect(header).toBeTruthy();
    expect(outcomesContainer).toBeTruthy();
    expect(footer).toBeTruthy();

    expect(Divider).toHaveBeenCalledTimes(2);
    expect(Placeholder).toHaveBeenCalledTimes(11);
  });
});
