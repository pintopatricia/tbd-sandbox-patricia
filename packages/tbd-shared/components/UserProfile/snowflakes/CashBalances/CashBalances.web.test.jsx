import { render, fireEvent, act } from "@testing-library/react";
import "jest-dom/extend-expect";

import { CashBalances } from "./CashBalances.web";
import { BALANCE_TITLE, BALANCE_TOGGLE, ICON_CONTAINER, BALANCES_CONTAINER } from "./CashBalances.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock></generic-icon-mock>),
}));

const onEyeIconClickCb = jest.fn();
const onToggleSimpleDetailedViewClickCb = jest.fn();

function renderCashBalance(showBalances, balanceToggle = false, simpleViewBalances = [], detailedViewBalance = []) {
  const propsMock = {
    i18n: {
      cashBalancesTitleLabel: "Cash & Bonus Balances",
      hiddenLabel: "Hidden",
      showMoreLabel: "Show More",
      showLessLabel: "Show Less",
    },
    showBalances,
    simpleViewBalances,
    detailedViewBalance,
    balanceToggle,
    onEyeIconClick: onEyeIconClickCb,
    onToggleSimpleDetailedViewClick: onToggleSimpleDetailedViewClickCb,
  };

  return render(<CashBalances {...propsMock} />);
}

describe("CashBalances", () => {
  beforeEach(jest.clearAllMocks);

  it("should display the title", () => {
    const { container } = renderCashBalance(false);
    const title = container.querySelector(BALANCE_TITLE);

    expect(title).not.toBe(null);
  });

  it("should display the balances content", () => {
    const { container } = renderCashBalance(false);
    const balances = container.querySelector(BALANCES_CONTAINER);

    expect(balances).not.toBe(null);
  });

  it("should display balance toggle if the showBalance is set to true", () => {
    const { container } = renderCashBalance(true);
    const balanceToggle = container.querySelector(BALANCE_TOGGLE);

    expect(balanceToggle).not.toBe(null);
  });

  it("should display balance toggle if the showBalance is not set", () => {
    const { container } = renderCashBalance();
    const balanceToggle = container.querySelector(BALANCE_TOGGLE);

    expect(balanceToggle).not.toBe(null);
  });

  it("should not display balance toggle if the showBalance is set to false", () => {
    const { container } = renderCashBalance(false);
    const balanceToggle = container.querySelector(BALANCE_TOGGLE);

    expect(balanceToggle).toBe(null);
  });

  it("should display the show more text for the balance toggle when detailed view is not visible", () => {
    const { container } = renderCashBalance(true);
    const balanceToggle = container.querySelector(BALANCE_TOGGLE);

    expect(balanceToggle).toHaveTextContent(/^Show More$/);
  });

  it("should display the show less text for the balance toggle when detailed view is visible", () => {
    const { container } = renderCashBalance(true);
    const balanceToggle = container.querySelector(BALANCE_TOGGLE);

    fireEvent.click(balanceToggle);

    expect(balanceToggle).toHaveTextContent(/^Show Less$/);
  });

  it("should call onToggleSimpleDetailedViewClick one time with correct value", () => {
    const { container } = renderCashBalance(true);
    const balanceToggle = container.querySelector(BALANCE_TOGGLE);

    act(() => balanceToggle.click());

    expect(onToggleSimpleDetailedViewClickCb).toHaveBeenCalledTimes(1);
    expect(onToggleSimpleDetailedViewClickCb).toHaveBeenCalledWith(false);
  });

  it("should call onToggleSimpleDetailedViewClick 2 times with correct value", () => {
    const { container } = renderCashBalance(true);
    const balanceToggle = container.querySelector(BALANCE_TOGGLE);

    fireEvent.click(balanceToggle);
    fireEvent.click(balanceToggle);

    expect(onToggleSimpleDetailedViewClickCb).toHaveBeenCalledTimes(2);
    expect(onToggleSimpleDetailedViewClickCb).toHaveBeenNthCalledWith(2, true);
  });

  describe("when balanceToggle is false", () => {
    it("should not display the eye icon", () => {
      const { container } = renderCashBalance(false, false);
      const icons = container.querySelector(ICON_CONTAINER);

      expect(icons).toBe(null);
    });
  });

  describe("when balanceToggle is true", () => {
    it("should display the eye icon", () => {
      const { container } = renderCashBalance(false, true);
      const icons = container.querySelector(ICON_CONTAINER);

      expect(icons).not.toBe(null);
    });
    it("must call onEyeIconClickCb callback when click on the eye icon", () => {
      const component = renderCashBalance(false, true).container;
      const icon = component.querySelector(ICON_CONTAINER);

      fireEvent.click(icon);

      expect(onEyeIconClickCb).toHaveBeenCalledTimes(1);
    });
  });
});
