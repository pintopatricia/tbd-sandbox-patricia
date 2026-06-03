import { useMemo } from "react";
import { BetslipTab, SportsbookPlaceTabsPanelViewModel, TabsResolvers } from "./SportsbookPlaceTabsPanel.types";
import { TabsGroupProps } from "@ppb/the-wall-common/types/web";

function resolveTabs(props: SportsbookPlaceTabsPanelViewModel): BetslipTab[] {
  const TABS: BetslipTab[] = ["BET_BUILDER", "MULTIPLES", "CAST_BET", "SINGLES"];

  return props.experimentVariant === "without-all" ? TABS : ["ALL", ...TABS];
}

export function useTabsViewModel(
  props: SportsbookPlaceTabsPanelViewModel,
  tabsResolvers: TabsResolvers,
): Pick<TabsGroupProps, "headers" | "contents"> {
  return useMemo(() => {
    const tabs = resolveTabs(props).filter((tab) => tabsResolvers[tab].visible(props));

    const headers = tabs.map((tab) => ({ id: tab, title: tabsResolvers[tab].title(props) }));
    const contents = tabs.map((tab) => {
      return {
        id: tab,
        content: tabsResolvers[tab].content(props),
      };
    });

    return {
      headers,
      contents,
    };
  }, [props, tabsResolvers]);
}
