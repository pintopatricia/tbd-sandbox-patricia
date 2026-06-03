import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { UserProfileHeader } from "./UserProfileHeader.web";
import { BACK, BALANCE, CLOSE, USER_PROFILE_HEADER } from "./UserProfileHeader.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

const onBackClickMock = jest.fn();
const onCloseClickMock = jest.fn().mockImplementation((ev) => ev.preventDefault());

function renderHeader({ accountBalance, freeBetsBalance, showBalances, showBack = true, title = "test" }) {
  return render(
    <UserProfileHeader
      accountBalance={accountBalance}
      freeBetsBalance={freeBetsBalance}
      showBalances={showBalances}
      showBack={showBack}
      title={title}
      freeBetsLabel={"Free Bets"}
      onCloseClick={onCloseClickMock}
      onBackClick={onBackClickMock}
    />,
  );
}

describe("Header", () => {
  it("should display header component", () => {
    const { container } = renderHeader({});

    const header = container.querySelector(USER_PROFILE_HEADER);

    expect(header).toBeDefined();
  });

  it("should display close", () => {
    const { container } = renderHeader({});
    const close = container.querySelector(CLOSE);

    expect(close).not.toBe(null);
  });

  it("should display the back button", () => {
    const { container } = renderHeader({});
    const backBtn = container.querySelector(BACK);

    expect(backBtn).toBeDefined();
  });

  describe("when an account balance is provided", () => {
    const accountBalance = "€ 1,234.56";

    it("should display the provided account balance", () => {
      const { getByText } = renderHeader({ accountBalance });
      const balanceLabel = getByText(accountBalance);

      expect(balanceLabel).toHaveTextContent("€ 1,234.56");
    });

    it("should not display the account balance when showBalances preference is false", () => {
      const { queryByText } = renderHeader({ accountBalance: "€ 1,234.56", showBalances: false });
      const balanceLabel = queryByText(accountBalance);

      expect(balanceLabel).toBe(null);
    });

    it("should display the account balance when showBalances preference is true", () => {
      const { getByText } = renderHeader({ accountBalance: "€ 1,234.56", showBalances: true });
      const balanceLabel = getByText(accountBalance);

      expect(balanceLabel).toHaveTextContent(accountBalance);
    });
  });

  describe("when an account free bets balance is provided", () => {
    const freeBetsBalance = "Free Bets: € 10.56";

    it("should display the provided free bets balance", () => {
      const { getByText } = renderHeader({ freeBetsBalance: "€ 10.56" });
      const freeBetsBalanceLabel = getByText(freeBetsBalance);

      expect(freeBetsBalanceLabel).toHaveTextContent("Free Bets: € 10.56");
    });

    it("should not display the free bets balance when showBalances preference is false", () => {
      const { queryByText } = renderHeader({ freeBetsBalance: "€ 10.56", showBalances: false });
      const freeBetsBalanceLabel = queryByText(freeBetsBalance);

      expect(freeBetsBalanceLabel).toBe(null);
    });

    it("should display the free bets balance when showBalances preference is true", () => {
      const { getByText } = renderHeader({ freeBetsBalance: "€ 10.56", showBalances: true });
      const freeBetsBalanceLabel = getByText(freeBetsBalance);

      expect(freeBetsBalanceLabel).toHaveTextContent(freeBetsBalance);
    });

    it("should not display free bets balance when its not defined", () => {
      const { queryByText } = renderHeader({ freeBetsBalance: undefined, showBalances: true });
      const freeBetsBalanceLabel = queryByText(freeBetsBalance);

      expect(freeBetsBalanceLabel).toBe(null);
    });
  });

  describe("if no account balance is provided", () => {
    it("should display 'NA'", () => {
      const NA = "NA";
      const { getByText } = renderHeader({});
      const balanceLabel = getByText(NA);

      expect(balanceLabel).toHaveTextContent(NA);
    });

    it("should not display the account balance when showBalances preference is false", () => {
      const { queryByTestId } = renderHeader({ showBalances: false });
      const balanceLabel = queryByTestId(BALANCE);

      expect(balanceLabel).toBe(null);
    });
  });

  describe("when click on back button", () => {
    it("must call onBackClick callback", () => {
      const { container } = renderHeader({ accountBalance: "€ 1,234.56", isUserProfileOpen: true });
      container.querySelector(BACK).click();

      expect(onBackClickMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("when click on close button", () => {
    it("must call onCloseClick callback", () => {
      const { container } = renderHeader({ accountBalance: "€ 1,234.56" });

      container.querySelector(CLOSE).click();

      expect(onCloseClickMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("when showBack is false", () => {
    it("should not display back button", () => {
      const { container } = renderHeader({ accountBalance: "€ 1,234.56", showBack: false });

      const backBtn = container.querySelector(BACK);

      expect(backBtn).toBeNull();
    });
  });
});
