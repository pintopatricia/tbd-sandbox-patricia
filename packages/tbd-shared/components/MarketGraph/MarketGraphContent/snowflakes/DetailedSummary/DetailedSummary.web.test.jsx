import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { DetailedSummary } from "./DetailedSummary.web";
import { GROUP_TITLE, ITEM_TITLE, ITEM_AMOUNT, DIVIDER } from "./DetailedSummary.web.selectors";

const mockBalances = [
  {
    title: "Cash Balance",
    groups: [
      {
        title: "Poker Wallet",
        amount: "£7.00",
      },
    ],
  },
];

function renderDetailedView(props) {
  return render(<DetailedSummary details={mockBalances} {...props} />);
}

describe("DetailedSummary", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the correct group title, wallet title and amount", () => {
    const { container } = renderDetailedView();

    expect(container.querySelector(GROUP_TITLE)).toHaveTextContent(/^Cash Balance$/);
    expect(container.querySelector(ITEM_TITLE)).toHaveTextContent(/^Poker Wallet$/);
    expect(container.querySelector(ITEM_AMOUNT)).toHaveTextContent(/^£7.00$/);
  });

  it("should render a divider when showHorizontalRule is true", () => {
    const { container } = renderDetailedView({ showHorizontalRule: true });

    expect(container.querySelector(DIVIDER)).toBeInTheDocument();
  });
});
