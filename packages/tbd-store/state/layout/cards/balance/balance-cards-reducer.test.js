import balanceReducer from "./balance-cards-reducer";

const urn = "ppb:tbd:card:balance:myaccount#balanceCard";
const mock = {
  urn,
  typename: "BalanceCard",
  title: "Title",
  balance: [],
};
const stateMock = {
  [urn]: mock,
};
describe('"balance" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = balanceReducer(undefined, {});
      expect(state).toEqual({});
    });
  });
  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "recentForms"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: { BalanceCard: [mock] },
        },
      };
      const state = balanceReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });
  });
});
