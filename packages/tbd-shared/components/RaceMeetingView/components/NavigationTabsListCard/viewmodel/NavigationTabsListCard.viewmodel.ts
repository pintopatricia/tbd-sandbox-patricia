import { useState } from "react";
import { getEventRegistry } from "eventemitter3-singleton";
import { useNavigationTabsListCardQuery } from "../model/NavigationTabsListCard.graphql";

type ViewLink = {
  viewUrn: string;
  viewUrl: string;
};

export type TabItem = {
  urn: string;
  typename: string;
};

export type TabData = {
  id: string;
  title: string;
  viewLink: ViewLink | null;
  items: TabItem[];
};

type TabHeader = {
  id: string;
  title: string;
};

type NavigationTabsListCardEvents = {
  "@@UI/NAVIGATION_TABS_LIST_CARD_TAB_CLICKED": { label: string; urn: string };
  "@@UI/NAVIGATION_TABS_LIST_CARD_TAB_SWITCHED": {
    tabsListUrn: string;
    selectedTabUrn: string;
    viewLink?: ViewLink;
  };
};

const { emit } = getEventRegistry<NavigationTabsListCardEvents>();

type ProcessedTabsData = {
  title: string;
  tabs: TabData[];
  headers: TabHeader[];
  selectedTabUrn: string;
};

export function useNavigationTabsListCardVM(urn: string) {
  const {
    loading,
    data: { navigationTabsList },
  } = useNavigationTabsListCardQuery(urn);

  const tabs: TabData[] = (navigationTabsList?.items.edges ?? []).reduce<TabData[]>((acc, edge) => {
    const node = edge?.node;
    if (!node || !("urn" in node)) return acc;

    const items: TabItem[] = (node.items.edges ?? []).reduce<TabItem[]>((itemsAcc, itemEdge) => {
      const itemNode = itemEdge?.node;
      if (itemNode?.urn && itemNode.__typename) {
        itemsAcc.push({ urn: itemNode.urn, typename: itemNode.__typename });
      }
      return itemsAcc;
    }, []);

    acc.push({
      id: node.urn,
      title: node.title.translated ?? "",
      viewLink: node.viewLink ? { viewUrn: node.viewLink.viewUrn, viewUrl: node.viewLink.viewUrl } : null,
      items,
    });

    return acc;
  }, []);

  const headers: TabHeader[] = tabs.map((tab) => ({
    id: tab.id,
    title: tab.title,
  }));

  const selectedTabUrn = tabs[0]?.id ?? "";
  const title = navigationTabsList?.title ?? "";
  const processedData: ProcessedTabsData = { title, tabs, headers, selectedTabUrn };

  const [prevNavigationTabsList, setPrevNavigationTabsList] = useState(navigationTabsList);
  const [staleData, setStaleData] = useState<ProcessedTabsData>(processedData);
  const [staleDataUrn, setStaleDataUrn] = useState(urn);

  if (navigationTabsList !== prevNavigationTabsList) {
    setPrevNavigationTabsList(navigationTabsList);
    if (processedData.headers.length > 0) {
      setStaleData(processedData);
      setStaleDataUrn(urn);
    }
  }

  const hasPreviousData = staleData.headers.length > 0;
  const effectiveData = loading && hasPreviousData ? staleData : processedData;
  const staleDataBelongsToDifferentUrn = staleDataUrn !== urn;

  const onTabClick = (label: string) => {
    emit("@@UI/NAVIGATION_TABS_LIST_CARD_TAB_CLICKED", { label, urn });
  };

  const onTabSwitch = (tabsListUrn: string, selectedTabUrn: string, viewLink?: ViewLink) => {
    emit("@@UI/NAVIGATION_TABS_LIST_CARD_TAB_SWITCHED", { tabsListUrn, selectedTabUrn, viewLink });
  };

  return {
    loading: loading && !hasPreviousData,
    transitioning: staleDataBelongsToDifferentUrn && loading,
    vm: {
      data: {
        title: effectiveData.title,
        tabs: effectiveData.tabs,
        headers: effectiveData.headers,
        selectedTabUrn: effectiveData.selectedTabUrn,
      },
      events: {
        onTabClick,
        onTabSwitch,
      },
    },
  };
}
