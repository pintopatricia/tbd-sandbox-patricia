import { render } from "@testing-library/react";
import ObbCardPlaceholder from "./ObbSquadBetCardPlaceholder.web";

describe("ObbSquadBetCardPlaceholder", () => {
  it("should have a section and a div", () => {
    const { container } = render(<ObbCardPlaceholder />);
    const section = container.getElementsByTagName("section");
    const div = container.getElementsByTagName("div");
    expect(section).toBeTruthy();
    expect(div).toBeTruthy();
  });
});
