import { createSelector, createSelectorCreator, defaultMemoize, Selector } from "reselect";

import {
  ExchangeDefaultModeOption,
  ExchangeDefaultProductOption,
  ProductsOption,
} from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import {
  createExchangeDefaultModeSelector,
  createProductPreferenceWithProductSwitcherSelector,
  createUserPreferencesWithProductSwitcherSelector,
} from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import {
  createIsProductSwitcherActiveNativeSelector,
  createIsProductSwitcherActiveSelector,
} from "@ppb/tbd-store/state/application-state-selectors";
import { createGetExperimentSelector } from "@ppb/tbd-store/state/entities/experiments/experiments-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { getCanUsePhoenixExchange, getIsExchangeEnabled } from "@ppb/tbd-store/state/boot/boot-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  BottomBarTileTypes,
  ExperimentalBottomBarTileTypes,
} from "@ppb/the-wall-common/types/BottomBar/BottomBar.types";
import { BottomBarTile } from "@ppb/tbd-store/state/layout/cards/bottom-bar/BottomBarCard.types";

import { i18n } from "../../helpers/i18n";
import { getLaunchUrl } from "../../view-model-factories/game";
import { getCookie } from "../../helpers/cookies.web";

enum bottomBari18n {
  IN_PLAY = "I18N.SPORT_EVENT.IN_PLAY",
  HOME = "I18N.NAVIGATION_BAR.HOME",
  BROWSE = "I18N.NAVIGATION_BAR.BROWSE",
  SEARCH = "I18N.NAVIGATION_BAR.SEARCH",
  MY_BETS = "I18N.NAVIGATION_BAR.MY_BETS",
  GAMING = "I18N.NAVIGATION_BAR.GAMING",
  ROULETTE = "I18N.NAVIGATION_BAR.ROULETTE",
  LIVE_ROULETTE = "I18N.NAVIGATION_BAR.LIVE_ROULETTE",
  BLACKJACK = "I18N.NAVIGATION_BAR.BLACKJACK",
  LIVE_BLACKJACK = "I18N.NAVIGATION_BAR.LIVE_BLACKJACK",
  SKY_BET_CLUB = "I18N.NAVIGATION_BAR.SKY_BET_CLUB",
  PROMOTIONS = "I18N.NAVIGATION_BAR.PROMOTIONS",
}

type BottomBarWithLocale = {
  bottomBarTiles: BottomBarTile[] | undefined;
  localeCode: string | undefined;
};

function isBottomBarTileEqual(a: BottomBarTile, b: BottomBarTile): boolean {
  return (
    a.tileType === b.tileType &&
    a.viewLink?.viewUrn === b.viewLink?.viewUrn &&
    a.viewLink?.viewUrl === b.viewLink?.viewUrl
  );
}

function isBottomBarAndLocaleCodeEqual(previousItem: BottomBarWithLocale, currentItem: BottomBarWithLocale): boolean {
  if (previousItem?.localeCode !== currentItem?.localeCode) {
    return false;
  }

  const previous = previousItem?.bottomBarTiles as BottomBarTile[];
  const current = currentItem?.bottomBarTiles as BottomBarTile[];

  if (previous?.length !== current?.length) {
    return false;
  }

  return previous?.every((tile, i) => isBottomBarTileEqual(tile, current[i]));
}

function getBottomBarTileForExperiment(variantId: string | undefined): BottomBarTile | null {
  switch (variantId) {
    case "blackjack-variant":
      return {
        tileType: ExperimentalBottomBarTileTypes.BLACKJACK,
        viewLink: {
          viewUrl: getLaunchUrl("premium-bkjk-cashout-agg", "gp-ggn", "gaming", false, window.location?.href),
          viewUrn: "ppb:tbd:view:external",
        },
      };
    case "roulette-variant":
      return {
        tileType: ExperimentalBottomBarTileTypes.ROULETTE,
        viewLink: {
          viewUrl: getLaunchUrl("premium-european-rlt-agg", "gp-ggn", "gaming", false, window.location?.href),
          viewUrn: "ppb:tbd:view:external",
        },
      };
    case "variant-bottom-bar-inplay-button":
      return {
        tileType: ExperimentalBottomBarTileTypes.IN_PLAY,
        viewLink: {
          viewUrl: "inplay/d-inplay",
          viewUrn: "ppb:tbd:view:generic:inplay",
        },
        statusLabel: i18n({ key: "I18N.COMMON.NEW" }),
      };
    default:
      return null;
  }
}

const createBottomBarViewModelSelector = createSelectorCreator(defaultMemoize, isBottomBarAndLocaleCodeEqual);

export const createBottomBarViewModel = () => {
  const getExperiments = createGetExperimentSelector();
  const getThrottle = createGetThrottleSelector();

  return createBottomBarViewModelSelector(
    [
      (_, { bottomBarTiles }: BottomBarWithLocale) => bottomBarTiles,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (state: ApplicationState, _) => getExperiments(state.entities.experiments, "exp-search-bottom-bar"),
      (state: ApplicationState) => getExperiments(state.entities.experiments, "bottom-bar-game-launch"),
      (state: ApplicationState) => getExperiments(state.entities.experiments, "exp-bf-sport-bottom-bar-inplay-button"),
      (state: ApplicationState) => getThrottle(state.entities.throttles, "BROWSE_PAGE_PRISMIC")?.isActive,
    ],
    (
      bottomBarTiles = [],
      searchBarExperiment,
      bottomBarGameLaunchExperiment,
      bottomBarInPlayExperiment,
      isBrowsePagePrismic,
    ) => {
      const experimentBottomBarGame = getBottomBarTileForExperiment(bottomBarGameLaunchExperiment?.variant);
      const experimentalInPlayTile = getBottomBarTileForExperiment(bottomBarInPlayExperiment?.variant);

      const updatedBottomBarTiles = bottomBarTiles.slice(0, 3);

      if (experimentBottomBarGame && getCookie("language")?.startsWith("en")) {
        updatedBottomBarTiles.push(experimentBottomBarGame);
      }

      updatedBottomBarTiles.push(...bottomBarTiles.slice(3));

      if (experimentalInPlayTile) {
        const homeTileIndex = updatedBottomBarTiles.findIndex(({ tileType }) => tileType === BottomBarTileTypes.HOME);
        if (homeTileIndex !== -1) {
          updatedBottomBarTiles[homeTileIndex] = experimentalInPlayTile;
        }
      }

      const englishTranslations = updatedBottomBarTiles.map((tile: BottomBarTile) =>
        i18n({
          key: bottomBari18n[tile.tileType as keyof typeof bottomBari18n],
          interpolationValues: { lng: "en" },
        }),
      );

      const isVariantGroup = searchBarExperiment?.variant === "search-bottom-bar";
      const items = updatedBottomBarTiles?.map((tile: BottomBarTile) => ({
        tileType:
          BottomBarTileTypes[tile.tileType as keyof typeof BottomBarTileTypes] ||
          ExperimentalBottomBarTileTypes[tile.tileType as keyof typeof ExperimentalBottomBarTileTypes],
        viewLink: tile.viewLink,
        statusLabel: tile.statusLabel,
        title:
          tile.tileType === "BROWSE" && isVariantGroup
            ? i18n({ key: bottomBari18n.SEARCH })
            : i18n({ key: bottomBari18n[tile.tileType as keyof typeof bottomBari18n] }),
        ...(tile.tileType === "BROWSE" && isBrowsePagePrismic && { throttles: { isBrowsePagePrismic } }),
      }));

      return {
        items,
        englishTranslations,
      };
    },
  );
};

export type ProductSwitcherConfig =
  | {
      title: string;
      productPreference: ProductsOption;
      isXSell?: boolean;
      isProductSwitcherAvailable: {
        default: boolean;
        native: boolean;
      };
      isLoggedIn: boolean;
      isExcAllowedJurisdictionThrottleActive: boolean;
      showOnboardingNewLabel: boolean;
      onboardingLabelTitle: string;
      shouldShowXSellToPredicts: boolean;
    }
  | undefined;

export const createGetProductSwitcherConfigSelector = (): Selector<ApplicationState, ProductSwitcherConfig> => {
  const getIsProductSwitcherActive = createIsProductSwitcherActiveSelector();
  const getIsProductSwitcherNativeActive = createIsProductSwitcherActiveNativeSelector();
  const getUserProducts = createUserPreferencesWithProductSwitcherSelector();
  const getProductPreference = createProductPreferenceWithProductSwitcherSelector();
  const getThrottle = createGetThrottleSelector();
  const getExchangeDefaultMode = createExchangeDefaultModeSelector();

  return createSelector(
    [
      (state: ApplicationState) => getIsProductSwitcherActive(state),
      (state: ApplicationState) => getIsProductSwitcherNativeActive(state),
      ({ entities: { preferences } }: ApplicationState) => getUserProducts(preferences),
      ({ entities: { preferences } }: ApplicationState) => getProductPreference(preferences),
      (state: ApplicationState) => getIsExchangeEnabled(state),
      (state: ApplicationState) => !!getThrottle(state.entities.throttles, "EXC_ALLOWED_JURISDICTION")?.isActive,
      (state: ApplicationState) => getUserDetails(state).loggedIn,
      (state: ApplicationState) => getCanUsePhoenixExchange(state),
      (state: ApplicationState) => !!getThrottle(state.entities.throttles, "ENABLE_PREDICTS")?.isActive,
      ({ entities: { preferences } }: ApplicationState) => getExchangeDefaultMode(preferences),
    ],
    (
      isProductSwitcherActive,
      isProductSwitcherNativeActive,
      { products, exchangeDefaultProduct },
      productPreference,
      isExchangeEnabled,
      isExcAllowedJurisdictionThrottleActive,
      isLoggedIn,
      canUsePhoenixExchange,
      predictsThrottleActive,
      exchangeDefaultMode,
    ) => {
      if (!isProductSwitcherActive && !isProductSwitcherNativeActive) {
        return undefined;
      }

      const EXCHANGE_LABEL = i18n({ key: "I18N.EXCHANGE" });
      const SPORTSBOOK_LABEL = i18n({ key: "I18N.SPORTSBOOK" });
      const PREDICTS_LABEL = i18n({ key: "I18N.PREDICTS" });
      const ONBOARDING_LABEL = i18n({ key: "I18N.COMMON.NEW" });

      const isProductPrefExchange = productPreference === ProductsOption.exchange;
      const isProductPrefSportsbook = productPreference === ProductsOption.sportsbook;
      const isExcAvailable = isLoggedIn && canUsePhoenixExchange;

      const baseConfig = {
        isProductSwitcherAvailable: {
          default: isProductSwitcherActive,
          native: isProductSwitcherNativeActive,
        },
        isLoggedIn,
        isExcAllowedJurisdictionThrottleActive,
        onboardingLabelTitle: ONBOARDING_LABEL,
      };

      const shouldShowXSellToPredicts =
        predictsThrottleActive &&
        isProductPrefSportsbook &&
        exchangeDefaultMode === ExchangeDefaultModeOption.predicts &&
        !isExcAvailable;

      if (shouldShowXSellToPredicts) {
        return {
          ...baseConfig,
          title: PREDICTS_LABEL,
          productPreference,
          shouldShowXSellToPredicts,
          isXSell: true,
          showOnboardingNewLabel: false,
        };
      }

      const isPhoenixExcDefaultProduct = exchangeDefaultProduct === ExchangeDefaultProductOption.neme;
      const isSbkAvailable = products.includes(ProductsOption.sportsbook);
      const isXSell = isExcAvailable ? !isPhoenixExcDefaultProduct : !isExchangeEnabled && isSbkAvailable;
      const showOnboardingNewLabel =
        isExcAvailable &&
        isExcAllowedJurisdictionThrottleActive &&
        isPhoenixExcDefaultProduct &&
        !isProductPrefExchange;

      return {
        ...baseConfig,
        title: isProductPrefSportsbook ? EXCHANGE_LABEL : SPORTSBOOK_LABEL,
        productPreference,
        isXSell,
        showOnboardingNewLabel,
        shouldShowXSellToPredicts,
      };
    },
  );
};
