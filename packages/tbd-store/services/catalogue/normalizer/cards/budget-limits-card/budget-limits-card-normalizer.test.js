import normalizer from "./budget-limits-card-normalizer";

const BFF_RESPONSE = {
  __typename: "BudgetLimitsCard",
  urn: "ppb:tbd:card:budgetLimitsCard:myaccount#budgetLimitsCard",
  limits: [
    {
      amount: 500,
      category: "NDL",
      remain: 400,
      reset: "02/03/2021, 00:00",
    },
  ],
};

describe("Budget limits card normalizer", () => {
  describe("normalizeBudgetLimitsCardFragmentIntoBudgetLimitsCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "BudgetLimitsCard",
        urn: "ppb:tbd:card:budgetLimitsCard:myaccount#budgetLimitsCard",
        limits: [
          {
            amount: 500,
            category: "NDL",
            remain: 400,
            reset: "02/03/2021, 00:00",
          },
        ],
      });
    });
  });
});
