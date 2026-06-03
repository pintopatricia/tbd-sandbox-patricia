import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { RewardBenefit } from "./RewardBenefit.web";
import { TEST_ID } from "./RewardBenefit.web.selectors";

function renderIconText({ icon, title }) {
  return render(<RewardBenefit title={title} icon={icon} />);
}

describe("RewardBenefit", () => {
  it("should have the correct test id", () => {
    const fakeIcon = <fake-icon />;
    const { container } = renderIconText({
      title: "test",
      icon: fakeIcon,
    });
    const iconText = container.querySelector(TEST_ID);
    expect(iconText).toBeDefined();
  });

  it("should have the correct title", () => {
    const fakeIcon = <fake-icon />;
    const { container } = renderIconText({
      title: "test",
      icon: fakeIcon,
    });
    const iconText = container.querySelector(TEST_ID);
    expect(iconText).toHaveTextContent("test");
  });
});
