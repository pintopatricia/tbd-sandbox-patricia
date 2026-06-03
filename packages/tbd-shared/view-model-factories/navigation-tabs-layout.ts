import { createSelector, type ParametricSelector, type Selector } from "reselect";

import { UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE } from "@ppb/tbd-store/actions/favourite-markets";
import { getStore } from "@ppb/tbd-store/create-store";
import { NavigationTabsTitle } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import type { ApplicationState, Entities, FavouriteMarkets } from "@ppb/tbd-store/state";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { createGetFavouriteMarketsCountMetadataByURNSelector } from "@ppb/tbd-store/state/entities/favourite-markets-count-metadata/favourite-markets-count-metadata-selectors";
import type URN from "@ppb/tbd-store/state/layout/URN";
import type {
  NavigationTabListContent,
  NavigationTabListHeader,
  NavigationTabListItemPartial,
  NavigationTabListProcessed,
} from "@ppb/tbd-store/state/layout/navigation-tabs-list/NavigationTabsList.types";
import { createNavigationTabsListByURNSelector } from "@ppb/tbd-store/state/layout/navigation-tabs-list/navigation-tabs-list-selectors";
import { createNavigationTabByURNSelector } from "@ppb/tbd-store/state/layout/navigation-tabs/navigation-tabs-selectors";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { i18n } from "../helpers/i18n";
import { buildTranslatableText } from "../helpers/translatable-text";

export type NavigationTabsLayout = Omit<NavigationTabListProcessed, "urn" | "typename">;

// tooltip is meant to be deleted in near future
// this is a temporary way to hide it until final decision
// cleanup in #INCGNT-633
const FAVOURITE_MARKETS_TOOLTIP_CLOSED_COUNTER_LIMIT = 0;

const closeFavouriteMarketsTooltip = (): void => {
  getStore().dispatch({
    type: UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE,
  });
};

const getTooltip = (
  item: NavigationTabListItemPartial,
  entities: Entities,
  favouriteMarkets: FavouriteMarkets,
  favouriteMarketsTab?: NavigationTabListItemPartial,
): NavigationTabListContent["tooltip"] | undefined => {
  const getThrottle = createGetThrottleSelector();

  if (favouriteMarketsTab?.typename === "FavouriteMarketsNavigationTab" && favouriteMarketsTab.metadataTotalURN) {
    const getFavouriteMarketsCountMetadataByURN = createGetFavouriteMarketsCountMetadataByURNSelector();
    const metadataTotal = getFavouriteMarketsCountMetadataByURN(
      entities.favouritemarketscountmetadatas,
      favouriteMarketsTab.metadataTotalURN,
    );

    const shouldAddFavouriteMarketsTooltip =
      getThrottle(entities.throttles, "FAVOURITE_MARKETS_TOOLTIP")?.isActive &&
      item.typename !== "FavouriteMarketsNavigationTab" &&
      metadataTotal?.currentCount === 0 &&
      favouriteMarkets.tooltipClosedCounter < FAVOURITE_MARKETS_TOOLTIP_CLOSED_COUNTER_LIMIT &&
      !favouriteMarkets.isTooltipClosed;

    if (shouldAddFavouriteMarketsTooltip) {
      return {
        title: i18n({ key: "I18N.FAVOURITE_MARKETS.TOOLTIP.TITLE" }),
        description: i18n({ key: "I18N.FAVOURITE_MARKETS.TOOLTIP.DESCRIPTION" }),
        onClose: closeFavouriteMarketsTooltip,
      };
    }
  }

  return undefined;
};

const isFavouritesTab = (item: NavigationTabListItemPartial): boolean =>
  item.typename === "FavouriteMarketsNavigationTab";

const createNavigationTabsListContentsByURNSelector = (): ParametricSelector<
  ApplicationState,
  NavigationTabListItemPartial[],
  NavigationTabListContent[]
> => {
  const getNavigationTab = createNavigationTabByURNSelector();

  return createSelector(
    [
      (state: ApplicationState): ApplicationState => state,
      (_: ApplicationState, items: NavigationTabListItemPartial[]): NavigationTabListItemPartial[] => items,
    ],
    (state, items): NavigationTabListContent[] => {
      const favouriteMarketsTab = items.find((item) => isFavouritesTab(item));
      const hasEmptyStateImage = !!state.entities.brandSettings?.ERROR_VIEW_IMAGE;

      return items.map((item): NavigationTabListContent => {
        const navigationTab = getNavigationTab(state.layouts.navigationtabs, item.urn);

        return {
          id: item.urn,
          items: navigationTab?.items || [],
          hasContent: navigationTab?.items ? navigationTab.items.length > 0 : true,
          isFavouriteMarketsTab: isFavouritesTab(item),
          hasEmptyStateImage: hasEmptyStateImage,
          tooltip: getTooltip(item, state.entities, state.favouriteMarkets, favouriteMarketsTab),
        };
      });
    },
  );
};

const createNavigationTabsListHeadersByURNSelector = (): Selector<
  NavigationTabListItemPartial[],
  NavigationTabListHeader[]
> =>
  createSelector([(items): NavigationTabListItemPartial[] => items], (items): NavigationTabListHeader[] =>
    items.map((item): NavigationTabListHeader => {
      const commonHeaderProps = {
        id: item.urn,
        title: buildTranslatableText(item.title) || "",
        statusLabelText: item.badgeText ? buildTranslatableText(item.badgeText) : undefined,
        viewLink: item.viewLink,
      };

      if (isFavouritesTab(item)) {
        return {
          ...commonHeaderProps,
          ariaLabel: NavigationTabsTitle.FAVOURITE_MARKETS,
          icon: IconsList.STAR_FILLED,
        };
      }

      return commonHeaderProps;
    }),
  );

/**
 * createNavigationTabsLayoutByURNSelector
 * For a given view URN, returns the corresponding navigationTabsLayout with the corresponding NavigationTab items
 */
export const createNavigationTabsLayoutByURNSelector = (): ParametricSelector<
  ApplicationState,
  { urn: URN; localeCode?: string },
  NavigationTabsLayout | undefined
> => {
  const getNavigationTabsList = createNavigationTabsListByURNSelector();
  const getNavigationTabsListHeaders = createNavigationTabsListHeadersByURNSelector();
  const getNavigationTabsListContents = createNavigationTabsListContentsByURNSelector();

  return createSelector(
    [
      (state: ApplicationState): ApplicationState => state,
      (_: ApplicationState, { urn }: { urn: URN; localeCode?: string }): URN => urn,
      /* The localeCode is required to handle language setting change on native application - this needs to trigger the
       ** translatableTexts, but we don't need localeCode value because i18n library is already updated with it */
      (_: ApplicationState, { localeCode }: { urn: URN; localeCode?: string }): string | undefined => localeCode,
    ],
    (state, urn): NavigationTabsLayout | undefined => {
      const { layouts } = state;
      const navigationTabsList = getNavigationTabsList(layouts.navigationtabslists, urn);

      if (!navigationTabsList?.items.length) {
        return undefined;
      }

      return {
        title: navigationTabsList.title,
        headers: getNavigationTabsListHeaders(navigationTabsList.items),
        contents: getNavigationTabsListContents(state, navigationTabsList.items),
        selectedTabUrn: navigationTabsList.selectedTabUrn,
      };
    },
  );
};
