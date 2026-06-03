import type { JSX } from "react";
import { useCallback, useState } from "react";
import * as React from "react";
import classnames from "classnames";

import { Tooltip } from "@ppb/the-wall-web";

import { useVisibilityObserver } from "../../../hooks/useVisibilityObserver.web";
import { NavigationTabItem } from "../../NavigationTabItem/NavigationTabItem.web";

import type { TabContentProps } from "./TabContent.types";
import styles from "./TabContent.web.css";

const groupsWithSidePadding = [
  "SwimlaneCardGroup",
  "PopularSwimlaneCardGroup",
  "RacingSwimlaneCardGroup",
  "GamingCardGroup",
  "FilteredCouponCardGroup",
  "RacesByTimeRangeCardGroup",
  "FutureRacingCardGroup",
  "VirtualEventDetailsCard",
  "QuicklinksGridCardGroup",
  "BroadcastsCard",
  "LottoCard",
  "PromotionsCardGroup",
  "ObbEventPopularsCard",
  "ObbOnboardingCardsCardGroup",
];

const externalSettingsViews = ["ppb:tbd:card:embeddedView:personalDetails", "ppb:tbd:card:embeddedView:notifications"];

export const TabContent: React.FC<TabContentProps> = ({
  items,
  isFavouriteMarketsTab,
  tooltip,
  dispatchFetchCardsFromList,
}): JSX.Element => {
  const [isTooltipVisible, setTooltipVisible] = useState(!!tooltip);

  const onTooltipClose = useCallback((): void => {
    setTooltipVisible(false);

    if (tooltip) {
      tooltip.onClose();
    }
  }, [tooltip]);

  const observerShowCallback = useCallback(
    (urn: string): void => dispatchFetchCardsFromList(urn, items),
    [items, dispatchFetchCardsFromList],
  );

  const { observe, visibility } = useVisibilityObserver(
    isFavouriteMarketsTab ? { onShow: observerShowCallback } : { onFirstShow: observerShowCallback },
  );

  return (
    <div className={styles.tabContent}>
      {tooltip && isTooltipVisible && (
        <div className={styles.tooltip}>
          <Tooltip title={tooltip.title} description={tooltip.description} onCloseClick={onTooltipClose} />
        </div>
      )}
      {items.map(({ urn, typename }, index): JSX.Element => {
        const tabItemStyle = classnames(styles.tabItem, {
          [styles.cardItem]: !groupsWithSidePadding.includes(typename),
          [styles.externalSettingsView]: externalSettingsViews.includes(urn),
        });

        return (
          <div
            key={`${index}-${urn}`}
            ref={(node): void => {
              observe(node, urn);
            }}
            className={tabItemStyle}
            data-urn={urn}
          >
            <NavigationTabItem urn={urn} typename={typename} visible={!!visibility[urn]} />
          </div>
        );
      })}
    </div>
  );
};
