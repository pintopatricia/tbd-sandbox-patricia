import { withInlineBetslipAgnostic } from "./withInlineBetslipAgnostic";
import { withInlineBetslip } from "./withInlineBetslip.native";

jest.mock("../RootInlineBetslip/RootInlineBetslip.native", () => jest.fn(() => <component-mock></component-mock>));

jest.mock("./withInlineBetslipAgnostic", () => ({
  withInlineBetslipAgnostic: jest.fn(() => "some result"),
}));

describe("withInlineBetslip.native", () => {
  beforeEach(jest.clearAllMocks);

  it("should delegate to withInlineBetslipAgnostic with native component", () => {
    const result = withInlineBetslip("wrapped component");

    expect(withInlineBetslipAgnostic).toHaveBeenCalledWith("wrapped component", expect.any(Object));
    expect(withInlineBetslipAgnostic).toHaveBeenCalledTimes(1);
    expect(result).toBe("some result");
  });
});
