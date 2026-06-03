import normalizer from "./my-account-view-normalizer";

const BFF_RESPONSE = {
  urn: "ppb:tbd:view:myAccountView:90",
  url: "navigation/90",
  wizardUrl: "https://playerprotection.betfair.com/",
  __typename: "MyAccountView",
  items: {
    edges: [
      {
        node: { urn: "urn1", __typename: "BalanceCard" },
      },
    ],
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
};

describe("My account view normalizer", () => {
  describe("normalizeMyAccountViewFragmentIntoMyAccountView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizer(BFF_RESPONSE);

      expect(data).toEqual({
        urn: "ppb:tbd:view:myAccountView:90",
        url: "navigation/90",
        wizardUrl: "https://playerprotection.betfair.com/",
        typename: "MyAccountView",
        items: [{ urn: "urn1", typename: "BalanceCard" }],
      });
    });
  });
});
