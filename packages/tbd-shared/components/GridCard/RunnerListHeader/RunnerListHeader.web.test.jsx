import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { MarketBlurbs } from "@ppb/the-wall-web";

import RunnerListHeader from "./RunnerListHeader.web";

jest.mock("@ppb/the-wall-web", () => ({ MarketBlurbs: jest.fn(() => <market-blurbs-mock />) }));

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
