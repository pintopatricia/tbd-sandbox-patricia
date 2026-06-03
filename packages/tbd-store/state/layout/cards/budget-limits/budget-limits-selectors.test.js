import { createNextBreachableLimitSelector } from "./budget-limits-selectors";

describe("when the createNextBreachableLimitSelector selector is called", () => {
  it("should return expected data", () => {
    const getBudgetNdlLimits = createNextBreachableLimitSelector();
    const urn = "ppb:tbd:card:budgetLimitsCard:myaccount#budgetLimitsCard";
    let expected;
    let mockedState;

    mockedState = {
      layouts: {
        cards: {
          budgetLimits: {
            [urn]: {
              limits: [
                {
                  amount: 3,
                  category: "NDL",
                  remain: 2,
                  reset: "reset",
                  nextBreachable: false,
                },
                {
                  amount: 4,
                  category: "NDL_REACTIVATION",
                  remain: 3,
                  reset: "reset",
                  nextBreachable: true,
                },
                {
                  amount: 2,
                  category: "PDL",
                  remain: 1,
                  reset: "reset",
                  nextBreachable: false,
                },
              ],
              typename: "BudgetLimitsCard",
            },
          },
        },
      },
    };

    expected = {
      amount: 4,
      category: "NDL_REACTIVATION",
      remain: 3,
      reset: "reset",
      nextBreachable: true,
    };
    expect(getBudgetNdlLimits(mockedState.layouts.cards, urn)).toStrictEqual(expected);

    mockedState = {
      layouts: {
        cards: {
          budgetLimits: {
            [urn]: {
              limits: ["mockedLimits"],
              typename: "MockedCard",
            },
          },
        },
      },
    };

    expected = null;
    expect(getBudgetNdlLimits(mockedState.layouts.cards, urn)).toStrictEqual(expected);
  });
});
