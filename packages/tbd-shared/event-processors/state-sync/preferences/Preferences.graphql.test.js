import { getApolloClient } from "../../../apollo-client/client";
import { updateApolloCacheWithNewPreferences } from "./Preferences.graphql";

const APP_CONTEXT_EXTRACT_MOCK = {
  "AppContextDetails:ppb:tbd:appContext:appContext": {
    __typename: "AppContextDetails",
    urn: "ppb:tbd:appContext:appContext",
  },
};
const extract = jest.fn();
const APP_CONTEXT_PREFERENCES_RESPONSE_QUERY_MOCK = {
  data: {
    AppContext: {
      __typename: "AppContextDetails",
      urn: "ppb:tbd:appContext:appContext",
      preferences: {
        confirmCashout: {
          urn: "confirmCashoutURN",
          shouldConfirmCashout: true,
        },
        exchangeConfirmBetPlacement: {
          urn: "exchangeConfirmBetPlacementURN",
          shouldConfirmBetPlacement: true,
        },
        oddsMovement: {
          urn: "oddsMovementURN",
          shouldAcceptOddsMovement: true,
        },
        showBalances: {
          urn: "showBalancesURN",
          shouldShowBalances: true,
        },
        quickStakes: {
          urn: "quickStakesURN",
          selectedQuickStakes: {},
        },
        exchangeOddsDisplay: {
          urn: "exchangeOddsDisplayURN",
          selectedOddsDisplayFormat: "FRACTIONAL",
        },
        sportsbookOddsDisplay: {
          urn: "sportsbookOddsDisplayURN",
          selectedOddsDisplayFormat: "DECIMAL",
        },
        favoriteSports: {
          urn: "favoriteSportsURN",
          selectedFavoriteSports: {
            urn: "selectedFavoriteSportsURN",
            sportId: 7,
          },
        },
        defaultProduct: {
          urn: "defaultProductURN",
          selectedDefaultProduct: "SPORTSBOOK",
        },
        exchangeDefaultProduct: {
          urn: "exchangeDefaultProductURN",
          selectedExchangeDefaultProduct: "EMS",
        },
        products: {
          urn: "productsURN",
          selectedProduct: ["SPORTSBOK"],
        },
        lastViewedProduct: {
          urn: "lastViewedProductURN",
          selectedLastViewedProduct: "SPORTSBOOK",
        },
      },
    },
  },
};

jest.mock("../../../apollo-client/client", () => {
  const identify = jest.fn();
  const writeQuery = jest.fn();
  const query = jest.fn(() => APP_CONTEXT_PREFERENCES_RESPONSE_QUERY_MOCK);
  return {
    getApolloClient: jest.fn(() => ({
      query,
      cache: {
        extract,
        identify,
        writeQuery,
      },
    })),
  };
});

describe("Preferences.graphql", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there is AppContext data in cache", () => {
    it("should invoke cache extract", async () => {
      extract.mockReturnValueOnce(APP_CONTEXT_EXTRACT_MOCK);
      await updateApolloCacheWithNewPreferences();

      expect(getApolloClient().cache.extract).toHaveBeenCalledTimes(1);
    });
    it("should invoke client.query with correct parameters ", async () => {
      extract.mockReturnValueOnce(APP_CONTEXT_EXTRACT_MOCK);
      await updateApolloCacheWithNewPreferences();

      expect(getApolloClient().query).toHaveBeenCalledWith({
        query: expect.any(Object),
        fetchPolicy: "no-cache",
      });
    });
    it("should invoke writeQuery with correct parameters", async () => {
      extract.mockReturnValueOnce(APP_CONTEXT_EXTRACT_MOCK);
      await updateApolloCacheWithNewPreferences();

      expect(getApolloClient().cache.writeQuery).toHaveBeenCalledWith({
        query: expect.any(Object),
        data: {
          AppContext: {
            ...APP_CONTEXT_PREFERENCES_RESPONSE_QUERY_MOCK.data.AppContext,
          },
        },
      });
    });
  });
  describe("when there is no AppContext data in cache", () => {
    it("should invoke cache extract but not query nor apollo writeQuery", async () => {
      extract.mockReturnValueOnce(undefined);
      await updateApolloCacheWithNewPreferences();

      expect(getApolloClient().cache.extract).toHaveBeenCalledTimes(1);
      expect(getApolloClient().query).not.toHaveBeenCalled();
      expect(getApolloClient().cache.writeQuery).not.toHaveBeenCalled();
    });
  });
});
