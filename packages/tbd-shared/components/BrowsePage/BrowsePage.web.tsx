import { FunctionComponent, useCallback, useState, useMemo } from "react";
import { TabsGroupContentProps, TabsGroupHeaderProps } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import ConnectedGamingBrowse from "../GamingBrowse";
import GamingBrowse from "../GamingBrowse/GamingBrowse.web";
import RegulatoryCard from "../RegulatoryCard/RegulatoryCard.web";
import ConnectedRegulatoryCard from "../RegulatoryCard";
import ConnectedSportsBrowse from "../SportsBrowse";
import SportsBrowse from "../SportsBrowse/SportsBrowse.web";
import { CASINO_TAB_ID, SPORTS_TAB_ID } from "./map-to-props-factory";
import styles from "./BrowsePage.web.css";
import { SectionHeader } from "./snowflakes/SectionHeader/SectionHeader.web";

const BrowsePage: FunctionComponent<ComponentProps> = ({
  gamingTabUrl,
  gamingTabUrn,
  sportsTabUrl,
  sportsTabUrn,
  browsei18n,
  isGamesSelfExcludedUser,
  browseCasinoThrottles,
  dispatchSearchTabClickAction,
  dispatchFetchCatalogueBrowseTabAction,
  defaultTabId,
  dispatchTabRouteUpdateAction,
}) => {
  const [hasFetchedSportsTabDataFromCatalogue, shouldNotFetchSportsTabDataFromCatalogue] = useState<boolean>(
    defaultTabId === SPORTS_TAB_ID,
  );
  const [hasFetchedGamingTabDataFromCatalogue, shouldNotFetchGamingTabDataFromCatalogue] = useState<boolean>(
    defaultTabId === CASINO_TAB_ID,
  );
  const [prevDefaultTabId, setPrevDefaultTabId] = useState(defaultTabId);
  if (prevDefaultTabId !== defaultTabId) {
    setPrevDefaultTabId(defaultTabId);
    if (defaultTabId === SPORTS_TAB_ID) {
      shouldNotFetchSportsTabDataFromCatalogue(true);
    }
    if (defaultTabId === CASINO_TAB_ID) {
      shouldNotFetchGamingTabDataFromCatalogue(true);
    }
  }

  const onTabSwitch = useCallback(
    (tabdId: string, text: string) => {
      if (tabdId === SPORTS_TAB_ID) {
        dispatchTabRouteUpdateAction({ viewUrl: sportsTabUrl, viewUrn: sportsTabUrn });
        dispatchSearchTabClickAction(text);
        if (!hasFetchedSportsTabDataFromCatalogue) {
          shouldNotFetchSportsTabDataFromCatalogue(true);
          dispatchFetchCatalogueBrowseTabAction(sportsTabUrn);
        }
      }
      if (tabdId === CASINO_TAB_ID) {
        dispatchTabRouteUpdateAction({ viewUrl: gamingTabUrl, viewUrn: gamingTabUrn });
        dispatchSearchTabClickAction(text);
        if (!hasFetchedGamingTabDataFromCatalogue) {
          shouldNotFetchGamingTabDataFromCatalogue(true);
          dispatchFetchCatalogueBrowseTabAction(gamingTabUrn);
        }
      }
    },
    [
      dispatchTabRouteUpdateAction,
      sportsTabUrl,
      sportsTabUrn,
      dispatchSearchTabClickAction,
      hasFetchedSportsTabDataFromCatalogue,
      dispatchFetchCatalogueBrowseTabAction,
      gamingTabUrl,
      gamingTabUrn,
      hasFetchedGamingTabDataFromCatalogue,
    ],
  );

  const tabsHeaders = useMemo(() => {
    const headers: TabsGroupHeaderProps[] = [
      {
        id: SPORTS_TAB_ID,
        title: browsei18n.i18n.sportsTabLabel,
      },
    ];

    if (!isGamesSelfExcludedUser && browseCasinoThrottles.web.isActive) {
      headers.push({
        id: CASINO_TAB_ID,
        title: browsei18n.i18n.casinoTabLabel,
      });
    }

    return headers;
  }, [
    browsei18n.i18n.casinoTabLabel,
    browsei18n.i18n.sportsTabLabel,
    isGamesSelfExcludedUser,
    browseCasinoThrottles.web.isActive,
  ]);

  const tabsContents = useMemo(() => {
    const contents: TabsGroupContentProps[] = [
      {
        id: SPORTS_TAB_ID,
        content: (
          <section className={styles.panelContent}>
            <ConnectedSportsBrowse component={SportsBrowse} urn={sportsTabUrn} />
          </section>
        ),
      },
    ];

    if (!isGamesSelfExcludedUser && browseCasinoThrottles.web.isActive) {
      contents.push({
        id: CASINO_TAB_ID,
        content: (
          <section className={styles.panelContent}>
            <ConnectedGamingBrowse component={GamingBrowse} urn={gamingTabUrn} />
          </section>
        ),
      });
    }

    return contents;
  }, [gamingTabUrn, isGamesSelfExcludedUser, browseCasinoThrottles.web.isActive, sportsTabUrn]);

  return (
    <>
      <SectionHeader
        tabsHeaders={tabsHeaders}
        tabsContents={tabsContents}
        defaultTabId={defaultTabId}
        onTabSwitch={onTabSwitch}
        translations={browsei18n}
      />
      <div className={styles.regulatoryCard}>
        <ConnectedRegulatoryCard component={RegulatoryCard} urn={"ppb:tbd:card:regulatory:footer"} />
      </div>
    </>
  );
};

export default BrowsePage;
