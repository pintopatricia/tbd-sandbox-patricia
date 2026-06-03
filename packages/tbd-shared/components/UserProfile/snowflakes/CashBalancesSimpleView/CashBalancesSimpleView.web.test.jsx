import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { CashBalancesSimpleView } from "./CashBalancesSimpleView.web";
import { BALANCE_AMOUNT, BALANCE_TITLE, BALANCE_HIDDEN } from "./CashBalancesSimpleView.web.selectors";

function renderSimpleView(showBalances, subTitle = "") {
  const mockProps = {
    balances: [
      {
        title: "Cash Balance",
        subTitle,
        amount: "$450,000.00",
      },
    ],
    hiddenLabel: "Hidden",
    showBalances: false,
  };

  const props = { ...mockProps, showBalances };
  return render(<CashBalancesSimpleView {...props} />);
}

describe("CashBalancesSimpleView", () => {
  beforeEach(jest.clearAllMocks);

  it("should render correct title", () => {
    const { container } = renderSimpleView(false);

    expect(container.querySelector(BALANCE_TITLE)).toHaveTextContent(/^Cash Balance$/);
  });

  it("should render correct title and subtitle", () => {
    const subTitle = "Free Bets";
    const { container } = renderSimpleView(true, "Free Bets");

    expect(container.querySelector(BALANCE_TITLE)).toHaveTextContent(`Cash Balance${subTitle}`);
  });

  it("amount balance should be hidden", () => {
    const { container } = renderSimpleView(false);

    expect(container.querySelector(BALANCE_HIDDEN)).toHaveTextContent(/^Hidden$/);
  });

  it("should render correct amount", () => {
    const { container } = renderSimpleView(true);

    expect(container.querySelector(BALANCE_AMOUNT)).toHaveTextContent("$450,000.00");
  });
});
