import { createRef } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { Logo } from "../Logo/Logo.web";

import { ScreenshotFrame } from "./ScreenshotFrame.web";

jest.mock("../Logo/Logo.web", () => ({
  Logo: jest.fn((props) => <logo-mock {...props} />),
}));

const SCREENSHOT_REF_MOCK = createRef();
const CHILDREN_MOCK = <div data-testid="children-testid">{"Some children"}</div>;

const renderScreenshotFrame = ({ screenshotRef = SCREENSHOT_REF_MOCK, children = CHILDREN_MOCK } = {}) =>
  render(<ScreenshotFrame screenshotRef={screenshotRef}>{children}</ScreenshotFrame>);

describe("ScreenshotFrame", () => {
  beforeEach(jest.clearAllMocks);

  it("should render a Logo component with the correct color", () => {
    renderScreenshotFrame();

    expect(Logo).toHaveBeenCalledTimes(1);
    expect(Logo).toHaveBeenCalledWith(
      {
        color: "var(--agnostic-neutrals-text-default)",
      },
      undefined,
    );
  });

  it("should render the component with children", () => {
    const { queryByTestId } = renderScreenshotFrame();

    expect(queryByTestId("children-testid")).toHaveTextContent("Some children");
  });
});
