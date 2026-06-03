import extraWalletNormalizer from "./extra-wallet-normalizer";

const BFF_RESPONSE = {
  __typename: "ExtraWallet",
  urn: "ppb:extraWallet:22294781090",
  walletId: "22294781090",
  indexedId: "22294781090#1",
  amount: 0,
  expirationDate: "2025-06-18T14:23:00.000Z",
  walletType: "walletTypemock",
  lostLegs: 4,
  maxReturn: 10.0,
  maxFinPos: 4.0,
  ghostLegs: 2,
  fixedOdds: 2.5,
};

describe("extra wallet normalizer", () => {
  describe("when has all fields filled", () => {
    it("should correctly transform and return the data", () => {
      const { data } = extraWalletNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "ExtraWallet",
        urn: "ppb:extraWallet:22294781090",
        walletId: "22294781090",
        indexedId: "22294781090#1",
        amount: 0,
        expirationDate: "2025-06-18T14:23:00.000Z",
        walletType: "walletTypemock",
        lostLegs: 4,
        maxReturn: 10.0,
        maxFinPos: 4.0,
        ghostLegs: 2,
        fixedOdds: 2.5,
      });
    });
  });

  describe("when doesn't have all fields filled", () => {
    it("should correctly transform and return the data", () => {
      const { data } = extraWalletNormalizer({
        ...BFF_RESPONSE,
        amount: 249,
        expirationDate: undefined,
        walletType: undefined,
        lostLegs: undefined,
        maxReturn: undefined,
        maxFinPos: undefined,
        ghostLegs: undefined,
        fixedOdds: undefined,
      });

      expect(data).toEqual({
        typename: "ExtraWallet",
        urn: "ppb:extraWallet:22294781090",
        walletId: "22294781090",
        indexedId: "22294781090#1",
        amount: 249,
        expirationDate: undefined,
        walletType: undefined,
        ghostLegs: undefined,
        lostLegs: undefined,
        maxReturn: undefined,
        maxFinPos: undefined,
        fixedOdds: undefined,
      });
    });
  });
});
