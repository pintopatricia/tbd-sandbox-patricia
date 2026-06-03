import { render } from "@testing-library/react";
import { SystemIconName } from "@ppb/the-wall-icons";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import "jest-dom/extend-expect";
import { ProgressBar } from "@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar";
import { StatusLabel } from "@ppb/the-wall-web/components/bricks/Indicators/StatusLabel/StatusLabel";
import { TEST_ID, SPEND_TEXT } from "./BudgetStats.web.selectors";
import { BudgetStats } from "./BudgetStats.web";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/Indicators/StatusLabel/StatusLabel", () => ({
  StatusLabel: jest.fn(() => <status-label-mock />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar", () => ({
  ProgressBar: jest.fn(() => <progress-bar-mock />),
}));

const statusLabelText = "Set by Betfair";

function renderBudgetStats(
  amount = 500,
  remain = 400,
  currencyValue = "$400",
  remainingText = "remaining",
  statusLabel = statusLabelText,
) {
  const { container } = render(
    <BudgetStats
      amount={amount}
      remain={remain}
      currencyValue={currencyValue}
      remainingText={remainingText}
      statusLabel={statusLabel}
    />,
  );
  return container.querySelector(TEST_ID);
}

describe("render component", () => {
  const budgetCardStats = renderBudgetStats();

  it("should display remainingAmount 'remaining'", () => {
    const paragraph = budgetCardStats.querySelector(SPEND_TEXT);
    const spans = paragraph.querySelectorAll("span");

    expect(spans.length).toBe(2);
    expect(spans[0]).toHaveTextContent("$400");
    expect(spans[1]).toHaveTextContent("remaining");
  });

  it("should call StatusLabel component with correct props", () => {
    expect(StatusLabel).toHaveBeenCalledWith(
      {
        text: statusLabelText,
        iconName: SystemIconName.SAFER_GAMBLING,
        statusLabelSize: StatusLabelSizeType.SMALL,
        statusLabelType: StatusLabelType.BRANDED,
      },
      undefined,
    );
  });

  describe("call ProgressBar component with correct props", () => {
    beforeEach(jest.clearAllMocks);

    describe("when remain is >= amount", () => {
      it("home(remainWidths) should be 0 and away(amountWidths) should be 100", () => {
        renderBudgetStats(500, 600);

        expect(ProgressBar).toHaveBeenCalledWith(
          {
            away: 100,
            awayColor: "var(--neutrals-background-elevation5)",
            home: 0,
            homeColor: "transparent",
            variant: "budget-stats",
          },
          undefined,
        );
        expect(ProgressBar).toHaveBeenCalledTimes(1);
      });
    });

    describe("when remain is 0", () => {
      it("home(remainWidths) should be 100 and away(amountWidths) should be 0", () => {
        renderBudgetStats(600, 0);

        expect(ProgressBar).toHaveBeenCalledWith(
          {
            away: 0,
            awayColor: "var(--neutrals-background-elevation5)",
            home: 100,
            homeColor: "transparent",
            variant: "budget-stats",
          },
          undefined,
        );
        expect(ProgressBar).toHaveBeenCalledTimes(1);
      });
    });

    describe("when remain is < amount", () => {
      it("should calculate correct widths", () => {
        renderBudgetStats(500, 400);

        expect(ProgressBar).toHaveBeenCalledWith(
          {
            away: 80,
            awayColor: "var(--neutrals-background-elevation5)",
            home: 20,
            homeColor: "transparent",
            variant: "budget-stats",
          },
          undefined,
        );
        expect(ProgressBar).toHaveBeenCalledTimes(1);
      });
    });
  });
});
