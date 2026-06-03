import { withInlineBetslip } from "./withInlineBetslip.web";
import { withInlineBetslipAgnostic } from "./withInlineBetslipAgnostic";

jest.mock("../RootInlineBetslip/RootInlineBetslip.web", () => jest.fn(() => <component-mock></component-mock>));

jest.mock("./withInlineBetslipAgnostic", () => ({
  withInlineBetslipAgnostic: jest.fn(() => "some result"),
}));

describe("withInlineBetslip.web", () => {
  beforeEach(jest.clearAllMocks);

  it("should delegate to withInlineBetslipAgnostic with web component", async () => {
    const result = withInlineBetslip("wrapped component");

    expect(withInlineBetslipAgnostic).toHaveBeenCalledWith("wrapped component", expect.any(Object));
    expect(withInlineBetslipAgnostic).toHaveBeenCalledTimes(1);
    expect(result).toBe("some result");
  });
});
