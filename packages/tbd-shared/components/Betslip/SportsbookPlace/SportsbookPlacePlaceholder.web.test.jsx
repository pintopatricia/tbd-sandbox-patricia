import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { SportsbookPlacePlaceholder } from "./SportsbookPlacePlaceholder.web";
import { TEST_ID } from "./SportsbookPlacePlaceholder.web.selectors";

function renderPlaceholder({ height = 500 }) {
  return render(<SportsbookPlacePlaceholder height={height} />);
}

describe("SportsbookSinglePlacePanel", () => {
  beforeEach(jest.clearAllMocks);

  it("should set the container height with an extra 100px", () => {
    const { container } = renderPlaceholder({
      height: 500,
    });

    expect(container.querySelector(TEST_ID).style.height).toBe("600px");
  });
});
