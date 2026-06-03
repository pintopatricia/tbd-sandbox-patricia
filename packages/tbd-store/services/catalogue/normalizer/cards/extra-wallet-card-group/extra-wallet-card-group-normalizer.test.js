import extraWalletCardGroupNormalizer from "./extra-wallet-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "ExtraWalletCardGroup",
  urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
  amount: 499,
  helpUrl: "helpURL_mock",
  bonusPageUrl: "bonusPageURL_mock",
  full: {
    edges: [
      {
        node: {
          __typename: "ExtraWalletCard",
          urn: "ppb:tbd:card:extraWalletCard:22294781090",
          badges: [],
          extraWallet: {
            __typename: "ExtraWallet",
            urn: "ppb:extraWallet:22294781090",
            walletId: "22294781090",
            indexedId: "22294781090",
            amount: 249,
            expirationDate: "2025-06-18T14:23:00.000Z",
            walletType: "BONUS_CASH",
          },
        },
      },
      {
        node: {
          __typename: "ExtraWalletCard",
          urn: "ppb:tbd:card:extraWalletCard:22294781091",
          badges: [],
          extraWallet: {
            __typename: "ExtraWallet",
            urn: "ppb:extraWallet:22294781091",
            walletId: "22294781091",
            indexedId: "22294781091",
            amount: 250,
            expirationDate: "2025-06-18T15:23:00.000Z",
            walletType: "BONUS_CASH",
          },
        },
      },
      {
        node: {
          __typename: "ExtraWalletCard",
          urn: "ppb:tbd:card:extraWalletCard:22294781092#1",
          badges: [],
          extraWallet: {
            __typename: "ExtraWallet",
            urn: "ppb:extraWallet:22294781092#1",
            walletId: "22294781092",
            indexedId: "22294781092#1",
            amount: 250,
            expirationDate: "2025-06-18T15:23:00.000Z",
            walletType: "ACCA_INSURANCE_TOKEN",
            lostLegs: 1,
            maxReturn: 10.0,
          },
        },
      },
      {
        node: {
          __typename: "ExtraWalletCard",
          urn: "ppb:tbd:card:extraWalletCard:22294781093#1",
          badges: [],
          extraWallet: {
            __typename: "ExtraWallet",
            urn: "ppb:extraWallet:22294781093#1",
            walletId: "22294781093",
            indexedId: "22294781093#1",
            expirationDate: "2025-06-18T16:23:00.000Z",
            walletType: "GHOST_LEG_TOKEN",
          },
        },
      },
    ],
  },
};

describe("Extra wallet card group normalizer", () => {
  describe("extraWalletCardGroupNormalizer", () => {
    describe("when has all fields filled", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = extraWalletCardGroupNormalizer(BFF_RESPONSE);

        expect(data).toEqual({
          typename: "ExtraWalletCardGroup",
          urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
          amount: 499,
          helpUrl: "helpURL_mock",
          bonusPageUrl: "bonusPageURL_mock",
          items: [
            {
              typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:22294781090",
            },
            {
              typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:22294781091",
            },
            {
              typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:22294781092#1",
            },
            {
              typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:22294781093#1",
            },
          ],
        });
      });
    });

    describe("and when doesn't have all fields filled", () => {
      it("should correctly transform and return the data", () => {
        const { data } = extraWalletCardGroupNormalizer({
          ...BFF_RESPONSE,
          helpUrl: undefined,
          bonusPageUrl: undefined,
        });

        expect(data).toEqual({
          typename: "ExtraWalletCardGroup",
          urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
          amount: 499,
          helpUrl: undefined,
          bonusPageUrl: undefined,
          items: [
            {
              typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:22294781090",
            },
            {
              typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:22294781091",
            },
            {
              typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:22294781092#1",
            },
            {
              typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:22294781093#1",
            },
          ],
        });
      });
    });
    describe("when a partial edge doesn't have a full edge match", () => {
      it("should correctly transform and return the data object with only the ones with the full edge", () => {
        BFF_RESPONSE.full.edges[1] = null;

        const { data } = extraWalletCardGroupNormalizer(BFF_RESPONSE);

        expect(data).toEqual({
          typename: "ExtraWalletCardGroup",
          urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
          amount: 499,
          helpUrl: "helpURL_mock",
          bonusPageUrl: "bonusPageURL_mock",
          items: [
            {
              typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:22294781090",
            },
            {
              typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:22294781092#1",
            },
            {
              typename: "ExtraWalletCard",
              urn: "ppb:tbd:card:extraWalletCard:22294781093#1",
            },
          ],
        });
      });
    });
  });
});
