import { render } from "@testing-library/react";
import ObbCardGroupPlaceholder from "./ObbCardGroupPlaceholder.web";

describe("ObbCardGroupPlaceholder", () => {
  it("should have a 3 section and 3 div", () => {
    const { container } = render(<ObbCardGroupPlaceholder />);
    const sections = container.getElementsByTagName("section");
    const divs = container.getElementsByTagName("div");
    expect(sections[0]).toBeTruthy();
    expect(divs[0]).toBeTruthy();
    expect(sections[1]).toBeTruthy();
    expect(divs[1]).toBeTruthy();
    expect(sections[2]).toBeTruthy();
    expect(divs[2]).toBeTruthy();
  });
});
