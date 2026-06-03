import extraWalletCardNormalizer from "./extra-wallet-card-normalizer";

const BFF_RESPONSE = {
  __typename: "ExtraWalletCard",
  urn: "ppb:tbd:card:extraWalletCard:22294781090",
  badges: [],
  extraWallet: {
    __typename: "ExtraWallet",
    urn: "ppb:extraWallet:22294781090",
    walletId: "22294781090",
    amount: 249,
    expirationDate: "2025-06-18T14:23:00.000Z",
  },
};
describe("extra wallet card normalizer", () => {
  describe("extraWalletCardNormalizer", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = extraWalletCardNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "ExtraWalletCard",
        urn: "ppb:tbd:card:extraWalletCard:22294781090",
        badges: [],
        extraWalletURN: "ppb:extraWallet:22294781090",
        restrictions: {
          single: false,
          acca: false,
          sameGameMulti: false,
        },
      });
    });

    describe("when badges and restrictions are defined", () => {
      it("should correctly transform and return the data object with badges and restrictions", () => {
        const { data } = extraWalletCardNormalizer({
          ...BFF_RESPONSE,
          badges: [null, "event 1", null, "competition 2"],
          restrictions: {
            single: true,
            acca: false,
            sameGameMulti: false,
          },
        });

        expect(data).toEqual({
          typename: "ExtraWalletCard",
          urn: "ppb:tbd:card:extraWalletCard:22294781090",
          badges: ["event 1", "competition 2"],
          extraWalletURN: "ppb:extraWallet:22294781090",
          restrictions: {
            single: true,
            acca: false,
            sameGameMulti: false,
          },
        });
      });
    });
  });
});
