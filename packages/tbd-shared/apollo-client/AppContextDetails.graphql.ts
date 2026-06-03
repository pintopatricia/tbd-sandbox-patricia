import { gql } from "../types/__generated__/gql";

export const AppContextDetailsFragment = gql(/* GraphQL */ `
  fragment AppContextDetails on AppContextDetails {
    __typename
    urn
    userdetails {
      accountId
      loggedIn
      jurisdiction {
        jurisdiction
      }
      region
      bucketId
      countryCode
      localeCode
      localeCodeBcp47
      timezone
      currencyCode
      excSettings {
        discount
        currencyDetails {
          minBspLiability
          minStake
          currencyCode
          currencyId
        }
      }
      firstName
      lastName
      accountOpenDate
      lastLoginDate
      jurisdictionalData {
        nationalIdentifier
        contractNumber
      }
      productExclusions
      migrationData {
        heritageAccountId
        heritageSecondaryAccountId
        heritageSystem
        migrationInformation
        migrationDate
      }
    }
    throttles {
      name
      isActive
    }
    brandSettings {
      name
      isActive
    }
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
    registration {
      joinNowLabel
      joinNowLink
    }
    pollcadences {
      ERO
      SMP
      WAS
      LBR
      SIB
      SER
      SCA {
        loggedIn {
          default {
            inPlay
            notInPlay
          }
        }
        loggedOut {
          default {
            inPlay
            notInPlay
          }
        }
      }
      COS {
        loggedIn {
          default {
            inPlay
            notInPlay
          }
          sports {
            sportId
            inPlay
            notInPlay
          }
        }
        loggedOut {
          default {
            inPlay
            notInPlay
          }
        }
      }
      JACKPOT_ZONE
      MY_BETS
      POPULAR_BETS
      REFRESH_CARDS
      POLLING_DEBOUNCE
    }
  }
`);

export const AppContextDetailsQuery = gql(/* GraphQL */ `
  query AppContextDetailsQuery {
    AppContext {
      ...AppContextDetails
    }
  }
`);
