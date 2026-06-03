import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ScrollableSwimlane, useOnIntersect } from "@ppb/the-wall-web";
import { BACK_SELECTIONS, LAY_SELECTIONS, GROUPS } from "./InlineExchangeMarket.web.selectors";
import { InlineExchangeMarket } from "./InlineExchangeMarket.web";

jest.mock("@ppb/the-wall-web", () => ({
  useOnIntersect: jest.fn(() => ({})),
  ScrollableSwimlane: jest.fn(({ children, ...props }) => <scrollable-mock {...props}>{children}</scrollable-mock>),
}));

window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const marketRunners = [
  {
    urn: "urn:catalogue:runner:1.166528788:19:0",
    selectionId: 19,
    name: "Runner 1",
  },
  {
    urn: "urn:catalogue:runner:1.166528788:20:0",
    selectionId: 20,
    name: "Runner 2",
  },
  {
    urn: "urn:catalogue:runner:1.166528788:21:0",
    selectionId: 21,
    name: "Runner 3",
  },
];

const EXCHANGE_MARKET = {
  marketURN: "market:urn",
  marketStatus: "OPEN",
  disabled: false,
  runners: marketRunners,
};

const renderBackBetBtnsMock = <back-bet-button class="back-bet-btn" />;
const renderLayBetBtnsMock = <lay-bet-button class="lay-bet-btn" />;

function renderInlineExchangeMarket({ market = EXCHANGE_MARKET, renderBetslip } = {}) {
  useOnIntersect.mockReturnValue({ isIntersecting: true });
  return render(
    <InlineExchangeMarket
      {...market}
      renderBetslip={renderBetslip}
      labels={{ marketClosed: "CLOSED", marketSuspended: "SUSPENDED" }}
      renderBackBetBtns={renderBackBetBtnsMock}
      renderLayBetBtns={renderLayBetBtnsMock}
    />,
  );
}

describe("InlineExchangeMarket", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the swimlane", () => {
    renderInlineExchangeMarket({});
    expect(ScrollableSwimlane).toHaveBeenCalled();
  });

  it("should render 2 groups", () => {
    const { container } = renderInlineExchangeMarket({});
    const betButtonGroups = container.querySelectorAll(GROUPS);
    expect(betButtonGroups.length).toBe(2);
  });

  it("should render 'Back' selections/bet buttons in the first group", () => {
    const { container } = renderInlineExchangeMarket({});
    const firstGroup = container.querySelector(BACK_SELECTIONS);
    expect(firstGroup.querySelector(".back-bet-btn")).not.toBe(null);
  });

  it("should render 'Lay' selections/bet buttons in the last group", () => {
    const { container } = renderInlineExchangeMarket({});
    const firstGroup = container.querySelector(LAY_SELECTIONS);
    expect(firstGroup.querySelector(".lay-bet-btn")).not.toBe(null);
  });
});
