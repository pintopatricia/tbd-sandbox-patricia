import { FunctionComponent, useCallback, useRef, useMemo } from "react";
import { Platform, View } from "react-native";
import { TabsGroupContentProps, TabsGroupHeaderProps } from "@ppb/the-wall-common/types";
import ConnectedSportsBrowse from "../SportsBrowse";
import SportsBrowse from "../SportsBrowse/SportsBrowse.native";
import ConnectedGamingBrowse from "../GamingBrowse";
import GamingBrowse from "../GamingBrowse/GamingBrowse.native";
import { SectionHeader } from "./snowflakes/SectionHeader/SectionHeader.native";
import styles from "./BrowsePage.native.styles";
import { ComponentProps } from "./props";
import { CASINO_TAB_ID, SPORTS_TAB_ID } from "./map-to-props-factory";

const BrowsePage: FunctionComponent<ComponentProps> = ({
  gamingTabUrn,
  sportsTabUrn,
  browsei18n,
  isGamesSelfExcludedUser,
  browseCasinoThrottles,
  dispatchSearchTabClickAction,
  defaultTabId,
}) => {
  const showCasinoTab =
    (Platform.OS === "android" && browseCasinoThrottles.android.isActive) ||
    (Platform.OS === "ios" && browseCasinoThrottles.ios.isActive);

  const currentTab = useRef<string>(defaultTabId);

  const onTabSwitch = useCallback(
    (value: string, text: string) => {
      currentTab.current = value;
      dispatchSearchTabClickAction(text);
    },
    [dispatchSearchTabClickAction],
  );

  const tabsHeaders = useMemo(() => {
    const headers: TabsGroupHeaderProps[] = [
      {
        id: SPORTS_TAB_ID,
        title: browsei18n.i18n.sportsTabLabel,
      },
    ];

    if (!isGamesSelfExcludedUser && showCasinoTab) {
      headers.push({
        id: CASINO_TAB_ID,
        title: browsei18n.i18n.casinoTabLabel,
      });
    }

    return headers;
  }, [browsei18n.i18n.casinoTabLabel, browsei18n.i18n.sportsTabLabel, isGamesSelfExcludedUser, showCasinoTab]);

  const tabsContent = useMemo(() => {
    const contents: TabsGroupContentProps[] = [
      {
        id: SPORTS_TAB_ID,
        content: (
          <View style={styles.panelContent}>
            <ConnectedSportsBrowse component={SportsBrowse} urn={sportsTabUrn} />
          </View>
        ),
      },
    ];

    if (!isGamesSelfExcludedUser && showCasinoTab) {
      contents.push({
        id: CASINO_TAB_ID,
        content: (
          <View style={styles.panelContent}>
            <ConnectedGamingBrowse component={GamingBrowse} urn={gamingTabUrn} />
          </View>
        ),
      });
    }

    return contents;
  }, [gamingTabUrn, isGamesSelfExcludedUser, showCasinoTab, sportsTabUrn]);

  return (
    <View style={styles.container}>
      <SectionHeader
        tabsHeaders={tabsHeaders}
        tabsContents={tabsContent}
        defaultTabId={defaultTabId}
        onTabSwitch={onTabSwitch}
        translations={browsei18n}
      />
    </View>
  );
};

export default BrowsePage;
