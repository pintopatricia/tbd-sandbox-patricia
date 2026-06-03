import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Placeholder, ProgressBar } from "@ppb/the-wall-web";
import { ProgressBarVariant } from "@ppb/the-wall-common/types";
import { StatsGroup } from "./StatsGroup.web";

import { MAIN_LABEL, SECONDARY_LABEL, STAT_LABEL } from "./StatsGroup.web.selectors";

import styles from "./StatsGroup.web.css";

jest.mock("@ppb/the-wall-web", () => ({
  ProgressBar: jest.fn((props) => <progress-bar-mock {...props} />),
  Placeholder: jest.fn((props) => <placeholder-mock {...props} />),
}));

const defaultProps = {
  label: "Goals",
  secondaryLabel: "per game",
  left: { color: "red", value: 0.23 },
  right: { color: "green", value: 1.46 },
  maxValue: 2,
};

function renderComponent({ label, secondaryLabel, left, right, disabled, placeholder, maxValue } = defaultProps) {
  return render(
    <StatsGroup
      label={label}
      secondaryLabel={secondaryLabel}
      left={left}
      right={right}
      disabled={disabled}
      placeholder={placeholder}
      maxValue={maxValue}
    />,
  );
}

describe("StatsGroup", () => {
  beforeEach(jest.clearAllMocks);

  it("should render with default props", () => {
    const { container } = renderComponent(defaultProps);

    expect(container.querySelector(MAIN_LABEL)).toHaveTextContent(defaultProps.label);
    expect(ProgressBar).toHaveBeenNthCalledWith(
      1,
      {
        away: 11.5,
        awayColor: "red",
        barStat: true,
        home: 88.5,
        variant: "awayStat",
      },
      undefined,
    );
    expect(ProgressBar).toHaveBeenNthCalledWith(
      2,
      {
        away: 27,
        barStat: true,
        home: 73,
        homeColor: "green",
        variant: "homeStat",
      },
      undefined,
    );
  });
  describe("when disabled is `true`", () => {
    it("should render titles as `disabled`", () => {
      const { container } = renderComponent({ ...defaultProps, disabled: true });

      expect(container.querySelector(MAIN_LABEL)).toHaveClass(styles.disabled);
      expect(container.querySelector(SECONDARY_LABEL)).toHaveClass(styles.disabled);
    });
  });

  describe("when stats bar has `PLACEHOLDER` status", () => {
    it("should render labels as `placeholder`", () => {
      renderComponent({
        ...defaultProps,
        placeholder: true,
      });

      expect(Placeholder).toHaveBeenCalled();
      expect(ProgressBar).toHaveBeenNthCalledWith(1, { variant: ProgressBarVariant.PLACEHOLDER }, undefined);
      expect(ProgressBar).toHaveBeenNthCalledWith(2, { variant: ProgressBarVariant.PLACEHOLDER }, undefined);
    });
  });

  describe("with left and right players data", () => {
    it("should render labels as `placeholder`", () => {
      const { container } = renderComponent({
        ...defaultProps,
      });

      const labels = container.querySelectorAll(STAT_LABEL);

      expect(labels[0].textContent).toEqual("0.23");
      expect(labels[1].textContent).toEqual("1.46");
    });
  });
});
