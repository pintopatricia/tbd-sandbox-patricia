import { useCallback, useState, useEffect, useId } from "react";
import * as React from "react";

import { Alert, useOnIntersect } from "@ppb/the-wall-web";
import { AlertType, AzSwitcherProps } from "@ppb/the-wall-common/types";

import MarketBlurbsGA4Variants from "../../helpers/market-blurbs-ga4-variants";

import useShowMore from "../../hooks/useShowMore";
import useAlphabeticalSort from "../../hooks/useAlphabeticalSort";

import ConnectedMarketBlurb from "../MarketBlurb";
import MarketBlurb from "../MarketBlurb/MarketBlurb.web";
import ShowMoreComponent from "../ShowMore/ShowMore.web";

import GridCardRunner from "./GridCardRunner/GridCardRunner.web";
import { ComponentProps } from "./props";
import { GridCardLine } from "./map-to-props-factory";
import styles from "./GridCard.web.css";

const GridCard: React.FC<ComponentProps> = ({
  urn,
  lines,
  numberOfItemsToDisplay,
  marketUrn,
  layout,
  marketBlurb,
  infoBlurb,
  dispatchRefreshCard,
  dispatchToggleShowMoreRunners,
  dispatchAzSwitchClick,
}) => {
  const { isIntersecting } = useOnIntersect<HTMLDivElement>(null);
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null);

  const hasJerseys = layout === "VERTICAL_MARKETS" && lines.some((line) => line.jersey);
  const hasStats = layout === "VERTICAL_MARKETS" && lines.some((line) => !!line.statValue);

  const { isShowMoreAvailable, isItemsListCollapsed, onShowMoreChange } = useShowMore<GridCardLine>({
    items: lines,
    numberOfItemsToDisplay,
  });

  const onToggleShowMoreRunners = useCallback(
    (showMore: boolean) => dispatchToggleShowMoreRunners(urn, showMore, marketBlurb?.gaModuleSuffix),
    [dispatchToggleShowMoreRunners, marketBlurb?.gaModuleSuffix, urn],
  );

  const {
    azSwitcherLabel,
    isSorted,
    itemsToDisplay: linesToDisplay,
    onSwitch,
  } = useAlphabeticalSort<GridCardLine>({
    items: lines,
    numberOfItemsToDisplay,
    sortKey: "label",
    isItemsListCollapsed,
    dispatchAzSwitchClick,
  });

  const uniqueId = useId();

  const azSwitcherProps = {
    text: azSwitcherLabel,
    isLeftPosition: true,
    isChecked: isSorted,
    callback: onSwitch,
    checkboxId: `${marketUrn}-${uniqueId}`,
    checkboxName: `${marketUrn}-${uniqueId}`,
  };

  const azProps: AzSwitcherProps | undefined =
    layout === "VERTICAL_MARKETS" && isShowMoreAvailable ? azSwitcherProps : undefined;

  useEffect(() => {
    dispatchRefreshCard(urn, isIntersecting);
  }, [dispatchRefreshCard, urn, isIntersecting]);

  return (
    <div ref={setCardRef} className={styles.gridCardContainer}>
      {marketBlurb && (
        <div className={styles.marketBlurb}>
          <ConnectedMarketBlurb component={MarketBlurb} variant={MarketBlurbsGA4Variants.SUPER_SUB} {...marketBlurb} />
        </div>
      )}
      {infoBlurb && (
        <div className={styles.marketBlurb}>
          <Alert type={AlertType.Info} detail={infoBlurb} />
        </div>
      )}

      <div className={styles.gridCard}>
        <div className={styles.gridRunnerList}>
          {linesToDisplay.map(
            (
              { items, label: lineLabel, jersey, useFallbackJersey, statValue, statValueInterpolation, statLabel },
              lineIndex,
            ) => (
              <GridCardRunner
                items={items}
                lineIndex={lineIndex}
                lineLabel={lineLabel}
                urn={urn}
                key={`grid-card-line-${lineIndex}`}
                azSwitcherProps={azProps}
                jersey={jersey}
                useFallbackJersey={useFallbackJersey}
                hasJerseys={hasJerseys}
                hasStats={hasStats}
                statValue={statValue}
                statValueInterpolation={statValueInterpolation}
                statLabel={statLabel}
              />
            ),
          )}
        </div>

        <ShowMoreComponent
          cardRef={cardRef}
          numberOfItemsToDisplay={numberOfItemsToDisplay}
          numberOfLines={lines.length}
          setShowMore={onShowMoreChange}
          showMore={isItemsListCollapsed}
          onToggleShowMoreRunners={onToggleShowMoreRunners}
        />
      </div>
    </div>
  );
};

export default GridCard;
