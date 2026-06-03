import { lazy, FunctionComponent, Suspense, useContext } from "react";
import classnames from "classnames";
import { ComponentProps, LoadedComponentProps } from "./props";
import styles from "./GenericView.web.css";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import { ViewItem } from "../ViewItem/ViewItem.web";
import { ConfigContext } from "../Config/ConfigContext";
import PageHeaderPlaceholder from "../PageHeader/PageHeaderPlaceholder.web";

const PageHeader = lazy(() => import(/* webpackChunkName: "PageHeader" */ "../PageHeader"));

const ConnectedBackNavigationItem = lazy(
  () => import(/* webpackChunkName: "BackNavigationItem" */ "../BackNavigationItem"),
);

const BackNavigationItem = lazy(
  () => import(/* webpackChunkName: "BackNavigationItem" */ "../BackNavigationItem/BackNavigationItem.web"),
);

export const GenericViewPlaceholder: FunctionComponent<ComponentProps> = () => (
  <div>
    <SwimlaneCardGroupPlaceholder />
    <SwimlaneCardGroupPlaceholder />
    <SwimlaneCardGroupPlaceholder />
  </div>
);

// const RICH_CONTENT_CARDS = ["BroadcastsCard", "RunnersListCard", "FixtureCard"];
const EMPTY_MARGINS_CONTENT_CARDS = [
  "SwimlaneCardGroup",
  "RacingSwimlaneCardGroup",
  "PopularSwimlaneCardGroup",
  "GamingCardGroup",
  "ViewZone",
  "SearchZone",
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
  "RegulatoryCard",
  "GenericSwitcherCard",
  "RaceSwitcherCard",
  "PromotionsCardGroup",
  "StatsContentCardGroup",
];
const EMPTY_TOP_MARGIN_CONTENT_CARDS = [
  "RaceDetailsCard",
  "NavigationTabsList",
  "IncidentsCard",
  "GenericSwitcherCard",
  "RaceSwitcherCard",
];
const HIDDEN_DESKTOP_ITEMS = ["SportRibbonCardGroup"];

const getStyle = (typename: string, urn: string, isDesktopLayout: boolean): string =>
  classnames(styles.card, {
    [styles.emptyMargins]: EMPTY_MARGINS_CONTENT_CARDS.includes(typename),
    [styles.emptyTopMargin]: EMPTY_TOP_MARGIN_CONTENT_CARDS.includes(typename),
    [styles.hiddenDesktopItems]: isDesktopLayout && HIDDEN_DESKTOP_ITEMS.includes(typename),
  });

export const GenericView: FunctionComponent<LoadedComponentProps> = ({
  urn: viewUrn,
  root,
  items,
  itemsByTheme,
  isModalView,
  title,
  subtitle,
  badge,
  dispatchFetchCards,
  backNavigationTitle,
}) => {
  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchFetchCards(urn, items),
  });
  const { isDesktopLayout } = useContext(ConfigContext);

  const genericViewContainerStyle = classnames(styles.genericViewContainer, {
    [styles.settingsView]: viewUrn === "ppb:tbd:view:settings:settings",
  });

  const headerStyle = classnames(styles.header);

  return (
    <div className={genericViewContainerStyle}>
      {!isModalView && title && (
        <div className={headerStyle}>
          <Suspense fallback={<PageHeaderPlaceholder />}>
            <PageHeader title={title} subtitle={subtitle} icon={badge} />
          </Suspense>
        </div>
      )}
      {backNavigationTitle && (
        <Suspense fallback={<></>}>
          <ConnectedBackNavigationItem component={BackNavigationItem} urn={viewUrn}></ConnectedBackNavigationItem>
        </Suspense>
      )}
      <div className={styles.itemsList}>
        {itemsByTheme.map(({ theme, itemsThemed }, key) => (
          <div
            key={key}
            className={classnames({
              [styles.default]: theme == null || theme === "GAMING_SMALL_TILES",
              [styles.highlighted]: theme === "HIGHLIGHTED",
            })}
          >
            {itemsThemed.map(({ urn, typename }, index) => (
              <div
                key={`${urn}-${index}`}
                ref={(node) => {
                  observe(node, urn);
                }}
                className={getStyle(typename, urn, isDesktopLayout)}
              >
                <ViewItem urn={urn} typename={typename} sticky={root} visible={!!visibility[urn]} theme={theme} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
