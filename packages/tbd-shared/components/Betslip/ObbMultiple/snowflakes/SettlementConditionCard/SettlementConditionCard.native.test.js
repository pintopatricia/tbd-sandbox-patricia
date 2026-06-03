import React from "react";
import { render } from "@testing-library/react-native";

import { SettlementConditionCard } from "./SettlementConditionCard.native";
import { CONTAINER, TITLE, LABEL } from "./SettlementConditionCard.native.selectors";

jest.mock("@ppb/the-wall-native", () => {
  const { View } = require("react-native");
  return {
    StatusLabel: jest.fn(() => null),
    Slider: jest.fn(() => null),
    Text: jest.fn(({ children, testID }) => <View testID={testID}>{children}</View>),
  };
});

jest.mock("@ppb/the-wall-common/types", () => ({
  StatusLabelType: { LOST: "lost" },
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

describe("SettlementConditionCard Native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render container", () => {
      const { getByTestId } = renderCard();
      expect(getByTestId(CONTAINER)).toBeTruthy();
    });

    it("should render title", () => {
      const { getByTestId } = renderCard();
      expect(getByTestId(TITLE).props.children).toBe("Selections to Win");
    });

    it("should render X of Y label", () => {
      const { getByTestId } = renderCard();
      const labelText = getByTestId(LABEL).props.children;
      expect(labelText).toBe("3 of 3");
    });
  });

  describe("ReadOnly mode", () => {
    it("should show readOnlyProps values in label", () => {
      const { getByTestId } = renderCard({
        potentialBets: undefined,
        readOnlyProps: { selectionsToWin: 2, totalSelections: 5 },
      });
      const labelText = getByTestId(LABEL).props.children;
      expect(labelText).toBe("2 of 5");
    });
  });
});
