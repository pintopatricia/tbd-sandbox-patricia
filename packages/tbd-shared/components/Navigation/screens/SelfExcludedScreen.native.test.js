import { render } from "@testing-library/react-native";
import { resetNavigationStack } from "@ppb/tbd-router";
import { SelfExcludedScreen } from "./SelfExcludedScreen.native";
import GenericScreen from "./GenericScreen.native";

jest.mock("./GenericScreen.native", () => ({
  __esModule: true,
  default: jest.fn(() => <generic-screen />),
}));

jest.mock("@ppb/tbd-router", () => ({
  __esModule: true,
  resetNavigationStack: jest.fn(),
}));

function setup() {
  return render(<SelfExcludedScreen />);
}

describe("SelfExcludedScreen", () => {
  setup();

  it("should render the GenericScreen", () => {
    expect(GenericScreen).toHaveBeenCalled();
  });

  it("should reset the navigation stack", () => {
    expect(resetNavigationStack).toHaveBeenCalled();
  });
});
