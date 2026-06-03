import { createRef } from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { Logo } from "../Logo/Logo.native";

import { ScreenshotFrame } from "./ScreenshotFrame.native";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {
    AgnosticNeutralsTextDefault: "AgnosticNeutralsTextDefault",
  },
  spacings: {},
}));

jest.mock("../Logo/Logo.native", () => ({
  Logo: jest.fn((props) => <logo-mock {...props} />),
}));

const SCREENSHOT_REF_MOCK = createRef();
const CHILDREN_MOCK = <Text testID="children-testid">Some children</Text>;

const renderScreenshotFrame = ({ screenshotRef = SCREENSHOT_REF_MOCK, children = CHILDREN_MOCK } = {}) =>
  render(<ScreenshotFrame screenshotRef={screenshotRef}>{children}</ScreenshotFrame>);

describe("ScreenshotFrame", () => {
  beforeEach(jest.clearAllMocks);

  it("should render a Logo component with the correct color", () => {
    renderScreenshotFrame();

    expect(Logo).toHaveBeenCalledTimes(1);
    expect(Logo).toHaveBeenCalledWith(
      {
        color: "AgnosticNeutralsTextDefault",
      },
      undefined,
    );
  });

  it("should render the component with children", () => {
    const { queryByTestId } = renderScreenshotFrame();

    expect(queryByTestId("children-testid")).toHaveTextContent("Some children");
  });
});
