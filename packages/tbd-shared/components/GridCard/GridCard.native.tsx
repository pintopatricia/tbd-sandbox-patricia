import { FunctionComponent, memo, useCallback, useEffect, useRef } from "react";
import { View } from "react-native";

import { AlertType, AzSwitcherProps } from "@ppb/the-wall-common/types";
import { Alert } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import MarketBlurbsGA4Variants from "../../helpers/market-blurbs-ga4-variants";

import useShowMore from "../../hooks/useShowMore";
import useAlphabeticalSort from "../../hooks/useAlphabeticalSort";

import ConnectedMarketBlurb from "../MarketBlurb";
import MarketBlurb from "../MarketBlurb/MarketBlurb.native";
import ShowMoreComponent from "../ShowMore/ShowMore.native";

import GridCardRunner from "./GridCardRunner/GridCardRunner.native";
import { GridCardLine } from "./map-to-props-factory";
import { ComponentProps } from "./props";
import styles from "./GridCard.native.styles";
import { TEST_ID } from "./GridCard.native.selectors";

const MemoizedGridCard: FunctionComponent<ComponentProps> = memo(
  ({
    urn,
    lines,
    numberOfItemsToDisplay,
    layout,
    marketBlurb,
    infoBlurb,
    visible,
    dispatchToggleShowMoreRunners,
    dispatchAzSwitchClick,
  }) => {
    const scrollViewRef = useRef<View>(null);

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

    const azSwitcherProps = {
      text: azSwitcherLabel,
      isLeftPosition: true,
      isChecked: isSorted,
      callback: onSwitch,
    };

    const azProps: AzSwitcherProps | undefined =
      layout === "VERTICAL_MARKETS" && isShowMoreAvailable ? azSwitcherProps : undefined;

    return (
      <View ref={scrollViewRef} {...getTestProps(TEST_ID, false)} style={styles.container}>
        {marketBlurb && (
          <View style={styles.marketBlurb}>
            <ConnectedMarketBlurb
              component={MarketBlurb}
              variant={MarketBlurbsGA4Variants.SUPER_SUB}
              {...marketBlurb}
            />
          </View>
        )}
        {infoBlurb && (
          <View style={styles.marketBlurb}>
            <Alert type={AlertType.Info} detail={infoBlurb} />
          </View>
        )}

        <View style={styles.gridRunnerList}>
          {linesToDisplay.map(
            (
              { items, label: lineLabel, jersey, useFallbackJersey, statValue, statValueInterpolation, statLabel },
              lineIndex,
            ) => (
              <GridCardRunner
                key={`grid-card-line-${lineIndex}`}
                lineIndex={lineIndex}
                lineLabel={lineLabel}
                items={items}
                linesSize={lines.length}
                urn={urn}
                azSwitcherProps={azProps}
                visible={visible}
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
        </View>

        <ShowMoreComponent
          cardRef={scrollViewRef}
          numberOfItemsToDisplay={numberOfItemsToDisplay}
          numberOfLines={lines.length}
          showMore={isItemsListCollapsed}
          setShowMore={onShowMoreChange}
          onToggleShowMoreRunners={onToggleShowMoreRunners}
        />
      </View>
    );
  },
);
MemoizedGridCard.displayName = "MemoizedGridCard";

const GridCard: FunctionComponent<ComponentProps> = (props) => {
  const { urn, visible, dispatchRefreshCard } = props;

  useEffect(() => {
    dispatchRefreshCard(urn, !!visible);
  }, [dispatchRefreshCard, urn, visible]);

  return <MemoizedGridCard {...props} />;
};

export default GridCard;
