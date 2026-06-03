import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import styles from "./RewardCard.web.module.css";
import { RewardCard } from "./RewardCard.web";
import { TITLE, TITLE_WRAPPER, ICON_WRAPPER, TEST_ID } from "./RewardCard.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <mock-checkmark />),
}));

function renderRewardCard(items) {
  return render(<RewardCard {...items} />);
}

describe("RewardCard", () => {
  it("should show the link with correct title", () => {
    const { container } = renderRewardCard({
      title: "Basic",
      benefits: ["Cash Race Access", "1.75% Commission"],
    });
    const titleWrapper = container.querySelector(TITLE_WRAPPER);
    const title = container.querySelector(TITLE);
    expect(title).toHaveClass(styles.title);
    expect(titleWrapper).toHaveClass(styles.titleWrapper);
    expect(title).toHaveTextContent("Basic");
  });

  it("should show render the correct number of benefits", () => {
    const { container } = renderRewardCard({
      title: "Basic",
      benefits: ["Cash Race Access", "1.75% Commission"],
    });
    const box = container.querySelector(TEST_ID);
    const benefits = container.querySelectorAll(`${TEST_ID} > div`);
    expect(box).toHaveClass(styles.box);
    expect(benefits).toHaveLength(2);
  });

  it("should render the icon", () => {
    const fakeIcon = <fake-icon />;

    const { container } = renderRewardCard({
      title: "Basic",
      icon: fakeIcon,
      benefits: ["Cash Race Access", "1.75% Commission"],
    });
    const icon = container.querySelector(`${ICON_WRAPPER} > *`);
    const iconWrapper = container.querySelector(ICON_WRAPPER);
    expect(iconWrapper).toHaveClass(styles.iconWrapper);
    expect(icon.tagName.toLowerCase()).toContain(fakeIcon.type);
  });
});
