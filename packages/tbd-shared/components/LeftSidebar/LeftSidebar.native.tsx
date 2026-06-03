import * as React from "react";
import { View, ScrollView } from "react-native";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { Text } from "@ppb/the-wall-native";
import { i18n } from "../../helpers/i18n";
import { ComponentProps } from "./props";
import ConnectedSportsBrowse from "../SportsBrowse";
import SportsBrowse from "../SportsBrowse/SportsBrowse.native";
import { ViewItem } from "../ViewItem/ViewItem.native";
import styles from "./LeftSidebar.native.styles";

const getStyle = (typename: string) => {
  const groups = [
    "SwimlaneCardGroup",
    "GamingCardGroup",
    "ViewZone",
    "GamingPrizeMachineCard",
    "GamingPlayNewCard",
    "NavigationTabsList",
    "FilteredCouponCardGroup",
    "RacesByTimeRangeCardGroup",
    "FutureRacingCardGroup",
    "QuicklinksGridCardGroup",
    "RaceViewLinksCard",
    "GameInfoCard",
    "FixtureCard",
    "BroadcastsCard",
    "RaceDetailsCard",
    "SportRibbonCardGroup",
    "RacingSwimlaneCardGroup",
  ];

  return groups.includes(typename) ? styles.groupContainer : styles.card;
};

const LeftSidebar: React.FC<ComponentProps> = ({ items }) => (
  <ScrollView style={styles.itemsList} keyboardShouldPersistTaps="handled">
    <View style={styles.searchBar}>
      <Text style={styles.searchTitle}>{i18n({ key: "I18N.NAVIGATION_BAR.SEARCH" })}</Text>
      <ConnectedSportsBrowse component={SportsBrowse} isDesktop={true} />
    </View>
    {items.map(({ urn, typename }: PartialItem) => (
      <View key={urn} style={getStyle(typename)}>
        <ViewItem urn={urn} typename={typename} visible={true} />
      </View>
    ))}
  </ScrollView>
);

export default LeftSidebar;
