import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { TEST_ID, RESET_MESSAGE, BUDGET_LINK } from "./Budget.web.selectors";
import { Budget } from "./Budget.web";

function renderNDLMonth() {
  const myBudget = {
    amount: 500,
    remain: 400,
    currencyValue: "$400",
    remainText: "remaining",
    itemLink: {
      viewLink: {
        viewUrl: "https://myspendbudget.betfair.com/my-budget?prod=90&showHeader=0",
        viewUrn: "",
      },
      target: "_self",
      isTextLink: true,
    },
    reset: "Resets: 02.03.2021, 00:00",
    linkText: "Go to My Spend Budget",
    statusLabel: "Set by Betfair",
  };

  const { container } = render(<Budget budgetLimit={myBudget} />);
  return container.querySelector(TEST_ID);
}

describe("Budget", () => {
  const ndlMonthComponent = renderNDLMonth();

  it("should display resets datetime", () => {
    const resetMessage = ndlMonthComponent.querySelector(RESET_MESSAGE);
    expect(resetMessage).toHaveTextContent("Resets: 02.03.2021, 00:00");
  });

  it("should display Go to My Budget link", () => {
    const link = ndlMonthComponent.querySelector(BUDGET_LINK);
    expect(link).toHaveTextContent("Go to My Spend Budget");
  });
});
