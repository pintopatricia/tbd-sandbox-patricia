import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import {
  UserPreferences,
  UserPreferencesState,
  QuickStake,
  OddsDisplayPreference,
  ProductsOption,
  LastViewedProductOption,
  ExchangeDefaultModeOption,
} from "./UserPreferences.types";
import { isOnlineUserDetails, ProductExclusion } from "../index";
import { Entities } from "../Entities.types";
import { createShallowEqualSelector } from "../../../helpers/selectors";

function hasQuickStakesNotChanged(previous: QuickStake[] | undefined, current: QuickStake[] | undefined): boolean {
  if (!previous || !current) {
    return false;
  }
  return previous.length === current?.length && previous.every((val, index) => val.stake === current[index].stake);
}

export const createUserPreferencesQuickStakesSelector = () =>
  createSelectorCreator(defaultMemoize, hasQuickStakesNotChanged)(
    [(preferences: UserPreferencesState) => preferences.quickStakes],
    (quickStakes: QuickStake[] | undefined) => quickStakes,
  );

export const createUserPreferencesProductsSelector = () =>
  createShallowEqualSelector(
    [(preferences: UserPreferencesState) => preferences.products],
    (products: ProductsOption[] | undefined) => products,
  );

const createUserPreferencesFavoriteSportsSelector = () =>
  createShallowEqualSelector(
    [(preferences: UserPreferencesState) => preferences.favoriteSports],
    (favoriteSports: number[] | undefined) => favoriteSports,
  );

export const createUserPreferencesSelector = () => {
  const getUserPreferencesFavoriteSports = createUserPreferencesFavoriteSportsSelector();
  const getUserPreferencesProducts = createUserPreferencesProductsSelector();
  const getUserPreferencesQuickStakes = createUserPreferencesQuickStakesSelector();
  // This selector is split into 4 input selectors:
  // - one for primitive data structures (otherPreferences);
  // - two for applying shallow comparison over an array of primitive data types (numbers and enums in this case);
  // - one for applying a custom compare function to an array of objects.
  return createSelector(
    [
      (preferences: UserPreferencesState) => {
        const { favoriteSports, products, quickStakes, ...otherPreferences } = preferences;
        return otherPreferences;
      },
      (preferences: UserPreferencesState) => getUserPreferencesFavoriteSports(preferences),
      (preferences: UserPreferencesState) => getUserPreferencesProducts(preferences),
      (preferences: UserPreferencesState) => getUserPreferencesQuickStakes(preferences),
    ],
    (otherPreferences: UserPreferencesState, favoriteSports, products, quickStakes) => ({
      ...otherPreferences,
      favoriteSports,
      products,
      quickStakes,
    }),
  );
};

export const getProductExclusions = (entities: Entities): ProductExclusion[] => {
  if (!entities.userdetails) throw new Error("Non existent product exclusions");

  if (isOnlineUserDetails(entities.userdetails)) {
    return entities.userdetails?.productExclusions;
  }

  return [];
};

export const createTimeFormCollapsePreferenceSelector = () => {
  const getUserPreferences = createUserPreferencesSelector();
  return createSelector(
    [(preferences: UserPreferencesState) => getUserPreferences(preferences)],
    (preferences): boolean | undefined => preferences.isTimeFormCardCollapsed,
  );
};

export const createEmbeddedContentCollapsePreferenceSelector = () => {
  const getUserPreferences = createUserPreferencesSelector();
  return createSelector(
    [(preferences: UserPreferencesState) => getUserPreferences(preferences)],
    (preferences): boolean | undefined => preferences.isEmbeddedCardCollapsed,
  );
};

export const createSportsbookDisplayOddsPreferencesSelector = () => {
  const getUserPreferences = createUserPreferencesSelector();
  return createSelector(
    [(preferences: UserPreferencesState) => getUserPreferences(preferences)],
    (preferences): OddsDisplayPreference | undefined => preferences.sportsbookOddsDisplay,
  );
};

export const createLastViewedProductPreferencesSelector = () => {
  const getUserPreferences = createUserPreferencesSelector();
  return createSelector(
    [(preferences: UserPreferencesState) => getUserPreferences(preferences)],
    (preferences): LastViewedProductOption | undefined => preferences.lastViewedProduct,
  );
};

export const createUserPreferencesWithProductSwitcherSelector = () => {
  const getUserPreferences = createUserPreferencesSelector();

  return createSelector(
    [
      (preferences: UserPreferencesState): UserPreferences =>
        // @ts-expect-error because methods using it are not expecting a partial
        getUserPreferences(preferences),
    ],
    (preferences: UserPreferences) => {
      const { productSwitcherPreference } = preferences;

      if (!productSwitcherPreference) {
        return preferences;
      }
      const productsFiltered = preferences.products?.filter(
        (product: ProductsOption) => product !== ProductsOption.sportsbook && product !== ProductsOption.exchange,
      );

      if (!productsFiltered) {
        return preferences;
      }

      productsFiltered.unshift(productSwitcherPreference);

      return {
        ...preferences,
        products: productsFiltered,
      };
    },
  );
};

export const createProductPreferenceWithProductSwitcherSelector = () => {
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

  return createSelector(
    [(preferences: UserPreferencesState): UserPreferences => getUserPreferencesWithProductSwitcher(preferences)],
    ({ productSwitcherPreference, products }) =>
      productSwitcherPreference ??
      (products?.includes(ProductsOption.sportsbook) ? ProductsOption.sportsbook : ProductsOption.exchange),
  );
};

export const createMarketDepthSelector = () =>
  createSelector(
    (userPreferences: UserPreferencesState) => userPreferences.isMarketDepthActive,
    (exchangeMarketDepthActive): boolean => exchangeMarketDepthActive ?? false,
  );

export const createExchangeDefaultModeSelector = () => {
  const getUserPreferences = createUserPreferencesSelector();
  return createSelector(
    [(preferences: UserPreferencesState) => getUserPreferences(preferences)],
    (preferences): ExchangeDefaultModeOption | undefined => preferences.exchangeDefaultMode,
  );
};
