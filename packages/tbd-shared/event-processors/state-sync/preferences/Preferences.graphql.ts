import { gql } from "../../../types/__generated__";
import { getApolloClient } from "../../../apollo-client/client";
import { NormalizedCacheObject } from "@apollo/client";

type AppContextDetailsCache = {
  urn: string;
  __typename: "AppContextDetails";
};

export const AppContextPreferencesFragment = gql(`
  fragment AppContextPreferences on AppContextDetails {
    __typename
    urn
    preferences {
      confirmCashout {
        urn
        shouldConfirmCashout
      }
      exchangeConfirmBetPlacement {
        urn
        shouldConfirmBetPlacement
      }
      oddsMovement {
        urn
        shouldAcceptOddsMovement
      }
      showBalances {
        urn
        shouldShowBalances
      }
      quickStakes {
        urn
        selectedQuickStakes {
          stake
        }
      }
      exchangeOddsDisplay {
        urn
        selectedOddsDisplayFormat
      }
      sportsbookOddsDisplay {
        urn
        selectedOddsDisplayFormat
      }
      favoriteSports {
        urn
        selectedFavoriteSports {
          urn
          sportId
        }
      }
      defaultProduct {
        urn
        selectedDefaultProduct
      }
      exchangeDefaultProduct {
        urn
        selectedExchangeDefaultProduct
      }
      products {
        urn
        selectedProduct
      }
      lastViewedProduct {
        urn
        selectedLastViewedProduct
      }
      phoenixMigratedUser {
        urn
        isPhoenixMigratedUser
      }
      exchangeDefaultMode {
        urn
        selectedExchangeDefaultMode
      }
    }
  }
 `);

export const AppContextPreferencesQuery = gql(`
  query AppContextPreferences {
    AppContext {
      ...AppContextPreferences
    }
  }`);

function getAppContext(data: NormalizedCacheObject): AppContextDetailsCache | undefined {
  return Object.values(data).find(
    (elem): elem is AppContextDetailsCache =>
      elem !== undefined && "urn" in elem && elem?.__typename === "AppContextDetails",
  );
}

export async function updateApolloCacheWithNewPreferences() {
  const client = getApolloClient();
  const { cache } = client;
  const data = cache.extract() as NormalizedCacheObject;
  if (!data) return;

  const appContext: AppContextDetailsCache | null = getAppContext(data) ?? null;
  if (!appContext) return;
  const appContextPreferencesResponse = await client.query({
    query: AppContextPreferencesQuery,
    fetchPolicy: "no-cache",
  });

  if (!appContextPreferencesResponse.data?.AppContext) return;

  cache.writeQuery({
    query: AppContextPreferencesQuery,
    data: {
      AppContext: {
        ...appContextPreferencesResponse.data.AppContext,
      },
    },
  });
}
