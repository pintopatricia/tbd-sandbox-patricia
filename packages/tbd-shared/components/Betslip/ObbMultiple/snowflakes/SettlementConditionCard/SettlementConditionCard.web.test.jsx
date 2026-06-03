import React from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import styles from "./SettlementConditionCard.web.css";
import { SettlementConditionCard } from "./SettlementConditionCard.web";

jest.mock("@ppb/the-wall-web", () => ({
  StatusLabel: jest.fn(() => <div data-testid="status-label" />),
  Slider: jest.fn(({ onChange }) => <button data-testid="slider" onClick={() => onChange(1)} />),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  StatusLabelType: { BRANDED: "branded" },
  StatusLabelSizeType: { SMALL: "small" },
}));

jest.mock("../../../../../helpers/i18n", () => ({
  i18n: ({ key, interpolationValues }) => {
    const translations = {
      "I18N.BETSLIP.OBB.SELECTIONS_TO_WIN": "Selections to Win",
      "I18N.COMMON.NEW": "New",
    };
    if (key === "I18N.BETSLIP.OBB.X_OF_N" && interpolationValues) {
      return `${interpolationValues.x} of ${interpolationValues.n}`;
    }
    return translations[key] || key;
  },
}));

const defaultPotentialBets = [
  { id: "bet-1", x: 1 },
  { id: "bet-2", x: 2 },
  { id: "bet-3", x: 3 },
];

function renderCard(props = {}) {
  return render(<SettlementConditionCard potentialBets={defaultPotentialBets} {...props} />);
}

describe("SettlementConditionCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render with correct css class", () => {
      const { container } = renderCard();
      const card = container.querySelector(`.${styles.container}`);
      expect(card).toHaveClass(styles.container);
    });

    it("should render title", () => {
      const { getByText } = renderCard();
      expect(getByText("Selections to Win")).toBeInTheDocument();
    });

    it("should render X of Y label", () => {
      const { getByText } = renderCard();
      expect(getByText("3 of 3")).toBeInTheDocument();
    });

    it("should render slider when potentialBets provided", () => {
      const { getByTestId } = renderCard();
      expect(getByTestId("slider")).toBeInTheDocument();
    });
  });

  describe("ReadOnly mode", () => {
    it("should not render slider in readonly mode", () => {
      const { queryByTestId } = renderCard({
        potentialBets: undefined,
        readOnlyProps: { selectionsToWin: 2, totalSelections: 5 },
      });
      expect(queryByTestId("slider")).toBeNull();
    });

    it("should show readOnlyProps values in label", () => {
      const { getByText } = renderCard({
        potentialBets: undefined,
        readOnlyProps: { selectionsToWin: 2, totalSelections: 5 },
      });
      expect(getByText("2 of 5")).toBeInTheDocument();
    });
  });

  describe("onChange callback", () => {
    it("should call onChange with potentialBetId when slider changes", () => {
      const onChange = jest.fn();
      const { getByTestId } = renderCard({ onChange });
      getByTestId("slider").click();
      expect(onChange).toHaveBeenCalledWith("bet-2", undefined, undefined);
    });
  });
});
