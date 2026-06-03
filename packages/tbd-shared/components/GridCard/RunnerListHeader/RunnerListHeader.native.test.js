import { render } from "@testing-library/react-native";
import { MarketBlurbs } from "@ppb/the-wall-native";

import RunnerListHeader from "./RunnerListHeader.native";

jest.mock("@ppb/the-wall-native", () => ({
  MarketBlurbs: jest.fn(() => <market-blurbs-mock />),
}));

function renderRunnerListHeader(props) {
  return render(<RunnerListHeader {...props} />);
}

describe("RunnerListHeader", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the MarketBlurbs component", () => {
    renderRunnerListHeader({
      items: [{ label: "this is sparta!", marketUrn: "1.123456789", selectionId: "123456789" }],
      azSwitcherProps: {},
    });

    expect(MarketBlurbs).toHaveBeenCalledTimes(1);
    expect(MarketBlurbs).toHaveBeenCalledWith(
      { azSwitcherProps: {}, columnGrid: true, columns: ["this is sparta!"] },
      undefined,
    );
  });
});
