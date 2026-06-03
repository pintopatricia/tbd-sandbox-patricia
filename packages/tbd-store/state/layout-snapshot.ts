import { getStore } from "../create-store";
import { FetchCatalogueSuccessAction } from "../actions";
import { NavigationTabsTitle } from "../middlewares/tagging-resolvers/AnalyticsConstants";
import { NormalizersResult } from "../services/catalogue/normalizer/normalizer-engine";

type ChildrenItem = {
  urn: string;
  typename: string;
  items?: Array<ChildrenItem>;
};

type Snapshot = {
  parent?: string;
  parentTypename?: string;
  typename?: string;
  position: number;
  title?: string;
};

export type Metadata = {
  verticalPosition?: number;
  horizontalPosition?: number;
  tabName?: string;
  cardLayoutTitle?: string;
  cardGroupTitle?: string;
  cardGroupUrn?: string;
  pebbleCardGroupTitle?: string;
  viewTitle?: string;
  marketTitle?: string;
  viewUrn?: string;
  viewZoneTitle?: string;
  title?: string;
};

// Snapshot state
let layoutSnapshot: Record<string, Record<string, Snapshot>> = {};

/**
 * Extract the title from different formats
 *
 * @param data the data attribute for the current element
 * @param snapshot of the current element
 * @returns A string with the title
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function getTitle(data, snapshot: Snapshot): string | undefined {
  if (snapshot && "title" in snapshot && snapshot.title !== undefined) {
    return snapshot.title;
  }

  if ("title" in data) {
    const { title } = data;

    if (title) {
      if (typeof title === "string") {
        return title;
      }

      if ("translated" in title) {
        return title.translated || undefined;
      }
    }
  }

  if ("displayName" in data && data.displayName) {
    const { name, translationKey } = data.displayName;

    return name || translationKey;
  }

  return undefined;
}

/**
 * Extract data from children tree from layout snapshot.
 *
 * @param items - The children item list.
 * @param currentUrn - The current urn.
 * @param parent - The parent element data.
 */
function loadChildrenLayoutSnapshot(
  items: Array<ChildrenItem>,
  currentUrn: string,
  parent: { urn: string; typename: string },
) {
  items.forEach((item, index) => {
    layoutSnapshot[currentUrn][item.urn] = {
      ...layoutSnapshot[currentUrn][item.urn],
      typename: item.typename,
      parent: parent.urn,
      parentTypename: parent.typename,
      position: index + 1,
      title: getTitle(item, layoutSnapshot[currentUrn][item.urn]),
    };

    if (item.items) {
      loadChildrenLayoutSnapshot(item.items, currentUrn, { urn: item.urn, typename: item.typename });
    }
  });
}

/**
 * Based on the catalogue normalized output, try to build a flat tree with all available card and
 * their relations for the current view urn. This will be useful later to use for analytic's events.
 *
 * @param payload Normalizer output
 * @param currentUrn Current view urn
 * @returns The snapshop object in a key/value format
 */
export function generateLayoutSnapshot(payload: FetchCatalogueSuccessAction["payload"], currentUrn: string) {
  const keys = Object.keys(payload.data) as (keyof NormalizersResult)[];

  keys
    .filter((typename) => typename.search(/Card|Tab|View/) !== -1)
    .forEach((typename) => {
      const list = payload.data[typename];

      if (!list) {
        return;
      }

      list.forEach((data) => {
        if (!(data && "urn" in data)) {
          return;
        }

        if (!layoutSnapshot[currentUrn]) {
          layoutSnapshot[currentUrn] = {};
        }

        // Initialize
        layoutSnapshot[currentUrn][data.urn] = {
          ...layoutSnapshot[currentUrn][data.urn],
          typename,
          title: getTitle(data, layoutSnapshot[currentUrn][data.urn]),
        };

        // Go through all children components and update their parent information (urn and position)
        if ("items" in data && "typename" in data) {
          loadChildrenLayoutSnapshot(data.items, currentUrn, { urn: data.urn, typename: data.typename });
        }

        if ("partials" in data && data.partials.edges) {
          data.partials.edges.forEach((edge, index) => {
            if (edge && "node" in edge && "displayName" in edge && edge.node && "urn" in edge.node) {
              layoutSnapshot[currentUrn][edge.node.urn] = {
                ...layoutSnapshot[edge.node.urn],
                parent: data.urn,
                title: edge.displayName && "translationKey" in edge.displayName ? edge.displayName.translationKey : "",
                typename: edge.node.__typename,
                parentTypename: data.__typename,
                position: index + 1,
              };
            }
          });
        }

        if ("statsPebbleURN" in data && data.statsPebbleURN) {
          layoutSnapshot[currentUrn][data.statsPebbleURN] = {
            ...layoutSnapshot[currentUrn][data.statsPebbleURN],
            parent: data.urn,
            parentTypename: data.typename,
            position: 1,
          };
        }
      });
    });

  return layoutSnapshot;
}

export function findParentMetadata(
  typename: string,
  currentSnapshotNode: Snapshot,
  snapshotSlice: Record<string, Snapshot>,
  regexSearch?: boolean,
): Snapshot | null {
  if (
    (regexSearch && currentSnapshotNode.typename && new RegExp(typename).test(currentSnapshotNode.typename)) ||
    (!regexSearch && typename === currentSnapshotNode.typename)
  ) {
    return currentSnapshotNode;
  }

  if (currentSnapshotNode.parent) {
    return findParentMetadata(typename, snapshotSlice[currentSnapshotNode.parent], snapshotSlice, regexSearch);
  }

  return null;
}

/**
 * Helper function to get tabName from current tab
 *
 * @param currentUrn The current view urn
 * @param currentTabUrn The current tab urn
 * @param fallbackTitle Optional fallback title to use if currentTabUrn is falsy or snapshotItem is not found
 */
const getTabNameFromCurrentTab = (
  currentUrn: string,
  currentTabUrn: string | null,
  fallbackTitle?: string,
): string | undefined => {
  if (!currentTabUrn) {
    return fallbackTitle;
  }

  const snapshotItem = layoutSnapshot[currentUrn][currentTabUrn];

  if (!snapshotItem) {
    return fallbackTitle;
  }

  if (snapshotItem.typename === "FavouriteMarketsNavigationTab") {
    return NavigationTabsTitle.FAVOURITE_MARKETS;
  }

  return snapshotItem.title?.trim();
};

/**
 * Recursive function that search the snapshot layout and extract relevant data
 *
 * @param currentUrn The current view urn
 * @param currentTabUrn The current tab urn (or null if no tab is selected)
 * @param urn The card urn relative to the event
 * @param acc Accumulated metadata object (default: empty object)
 * @returns Metadata: position, tabName and cardGroupTitle
 */
function buildMetadata(
  currentUrn: string,
  currentTabUrn: string | null,
  urn: string,
  acc: Metadata = {},
): Metadata | undefined {
  const data = layoutSnapshot[currentUrn] ? layoutSnapshot[currentUrn][urn] : undefined;

  if (!data) {
    return acc;
  }

  if (Object.keys(acc).length === 0) {
    // Get the title only of the top element.
    acc.title = data.title;
  }

  // Start counting the vertical position if the card has vertical listing
  if (
    data.parentTypename === "NavigationTab" ||
    data.parentTypename === "FavouriteMarketsNavigationTab" ||
    data.parentTypename === "RacesByTimeRangeCardGroup" ||
    data.parentTypename === "FilteredCouponCardGroup" ||
    data.parentTypename === "FutureRacingCardGroup" ||
    data.parentTypename?.includes("View")
  ) {
    acc.verticalPosition = (acc.verticalPosition || 0) + data.position;
  }

  // Add tabName for StatsContentCardGroup
  if (data.parentTypename === "StatsContentCardGroup") {
    acc.tabName = data.title;
  }

  // Horizontal position is given by any SwimlaneCardGroup
  if (
    data.parentTypename === "SwimlaneCardGroup" ||
    data.parentTypename === "RacingSwimlaneCardGroup" ||
    data.parentTypename === "PopularSwimlaneCardGroup"
  ) {
    acc.horizontalPosition = data.position;
  }

  // The nearest card group title
  if (data.typename?.includes("CardGroup") && data.title && !acc.cardGroupTitle) {
    acc.cardGroupTitle = data.title;
    acc.cardGroupUrn = urn;
  }

  if (data.typename === "PebbleCardGroup") {
    acc.pebbleCardGroupTitle = data.title;
  }

  if (data.typename === "GamingCardGroup") {
    acc.viewZoneTitle = data.title;
  }

  if (data.typename === "EventMarketCard") {
    acc.marketTitle = data.title;
  }

  if (data.typename === "GameCard") {
    acc.horizontalPosition = data.position - 1;
  }

  // View title
  if (data.typename?.includes("View")) {
    acc.viewTitle = data.title;
    acc.viewUrn = urn;
  }

  if (data.typename === "ViewZone") {
    acc.viewZoneTitle = data.title;
  }

  if (data.typename === "ObbCreatedBetsCardGroup") {
    acc.title = "OBP created card";
  }

  if (data.typename === "ObbOnboardingCardsCardGroup") {
    acc.title = "onboarding card";
  }

  if (
    data.typename === "ObbSquadBetCard" ||
    data.typename === "ObbPvpCard" ||
    data.typename === "ObbSquadVsSquadCard"
  ) {
    const cardGroup = findParentMetadata("ObbCardGroup", data, layoutSnapshot[currentUrn]);
    const layout = findParentMetadata("^ObbCards.*Layout$", data, layoutSnapshot[currentUrn], true);

    if (layout) {
      acc.cardLayoutTitle = layout.title?.trim();
    }

    if (cardGroup) {
      acc.cardGroupTitle = cardGroup.title?.trim();
    }
  }

  const shouldGetTabNameFromCurrentTab =
    data.typename?.includes("NavigationTab") ||
    data.typename === "ObbCreatedBetsCardGroup" ||
    data.typename === "ObbCreatedBetsCard" ||
    data.typename === "ObbSquadBetCard" ||
    data.typename === "ObbSquadVsSquadCard" ||
    data.typename === "ObbPvpCard" ||
    data.typename === "ObbEventPopularsCard";

  if (shouldGetTabNameFromCurrentTab) {
    acc.tabName = getTabNameFromCurrentTab(currentUrn, currentTabUrn, acc.tabName || data.title);
  }

  if (!data.parent) {
    return acc;
  }

  return buildMetadata(currentUrn, currentTabUrn, data.parent, acc);
}

/**
 * Based on the current view urn snapshot build the metadata needed for analytic's events
 *
 * @param urn The card urn relative to the event
 * @returns Metadata: position, tabName and cardGroupTitle
 */
export function getLayoutMetadata(urn: string, apolloCurrentUrn?: string): Metadata {
  const { currentUrn, currentTabUrn } = getStore().getState().router;
  if (!currentUrn) {
    return {};
  }

  const currUrn = apolloCurrentUrn ?? currentUrn;

  const metadata = buildMetadata(currUrn, currentTabUrn, urn);

  if (!metadata) {
    return {};
  }

  return metadata;
}

export function getLayoutSnapshot(viewUrn: string): Record<string, Snapshot> | undefined {
  return layoutSnapshot[viewUrn];
}

export function resetSnapshot() {
  layoutSnapshot = {};
}
