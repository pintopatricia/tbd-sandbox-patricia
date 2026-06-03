import * as React from "react";
import classnames from "classnames";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { i18n } from "../../helpers/i18n";
import { ComponentProps } from "./props";
import styles from "./LeftSidebar.web.css";
import { ViewItem } from "../ViewItem/ViewItem.web";
import ConnectedSportsBrowse from "../SportsBrowse";
import SportsBrowse from "../SportsBrowse/SportsBrowse.web";

const getStyle = (typename: string): string => {
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
  ];

  return classnames(styles.card, {
    [styles.groupContainer]: groups.includes(typename),
  });
};

const LeftSidebar: React.FC<ComponentProps> = ({ items, isDesktop = true }) => (
  <div className={styles.itemsList}>
    <div className={styles.searchBar}>
      <h2 className={`${styles.searchTitle} typography-h380`}>{i18n({ key: "I18N.NAVIGATION_BAR.SEARCH" })}</h2>
      <ConnectedSportsBrowse component={SportsBrowse} isDesktop={isDesktop} />
    </div>
    {items.map(({ urn, typename }: PartialItem) => (
      <div key={urn} className={getStyle(typename)}>
        <ViewItem urn={urn} typename={typename} visible={true} />
      </div>
    ))}
  </div>
);

export default LeftSidebar;
