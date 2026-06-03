import { Runner, MarketBlurbs } from "@ppb/the-wall-native";
import { useCallback, useState, useRef, useMemo } from "react";
import * as React from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import { TEST_ID, COLUMN } from "./CorrectScoreCard.native.selectors";
import styles from "./CorrectScoreCard.native.styles";
import CorrectScoreItem from "./CorrectScoreCardItem/CorrectScoreCardItem.native";
import ConnectedCorrectScoreCardItem from "./CorrectScoreCardItem";
import { CorrectScoreCardItem } from "./map-to-props-factory";
import ShowMoreComponent from "../ShowMore/ShowMore.native";

const CorrectScoreCard: React.FC<ComponentProps> = ({
  urn,
  columns,
  numberOfItemsToDisplay,
  numberOfLines,
  marketUrn,
  visible,
  dispatchToggleShowMoreRunners,
}) => {
  const [showMore, setShowMore] = useState(numberOfItemsToDisplay < numberOfLines);
  const scrollViewRef = useRef<View>(null);

  const onToggleShowMoreRunners = useCallback(
    (showMoreProp: boolean) => dispatchToggleShowMoreRunners(urn, showMoreProp),
    [dispatchToggleShowMoreRunners, urn],
  );

  const lines = useMemo(
    () =>
      showMore
        ? columns.map((line) => ({ label: line.label, runners: line.runners.slice(0, numberOfItemsToDisplay) }))
        : columns,
    [columns, numberOfItemsToDisplay, showMore],
  );

  const betButtonsContainerStyle = (itemsIndex: number, itemsSize: number) => {
    if (itemsIndex === 0) return { borderTopRightRadius: 4, borderTopLeftRadius: 4 };
    if (itemsIndex === itemsSize - 1) return { borderBottomRightRadius: 4, borderBottomLeftRadius: 4 };

    return {};
  };

  const RunnerListHeader: React.FC<{ items: string[] }> = ({ items }) => (
    <View style={styles.marketHeader}>
      <MarketBlurbs columns={items} columnGrid={true} />
    </View>
  );

  const CorrectScoreColumn: React.FC<{ label: string; items: CorrectScoreCardItem[]; columnIndex: number }> = ({
    label,
    items,
    columnIndex,
  }) => (
    <View {...getTestProps(COLUMN, false)} key={`${COLUMN}-${columnIndex}`}>
      <RunnerListHeader items={[label]} />
      {items.map(({ label: name, runnerUrn, selectionId }, index) => (
        <View style={styles.correctScoreRunnerLine} key={`${runnerUrn}-${selectionId}`}>
          <Runner name={name}>
            <View style={[styles.betButtonWrapper, betButtonsContainerStyle(index, items.length)]}>
              <ConnectedCorrectScoreCardItem
                component={CorrectScoreItem}
                marketUrn={marketUrn}
                runnerUrn={runnerUrn}
                cardUrn={urn}
                visible={visible}
              />
            </View>
          </Runner>
        </View>
      ))}
    </View>
  );

  return (
    <View ref={scrollViewRef} {...getTestProps(TEST_ID, false)} style={styles.container}>
      <View style={styles.column}>
        {lines.map(({ runners, label }, columnIndex) => (
          <CorrectScoreColumn items={runners} label={label} columnIndex={columnIndex} key={columnIndex} />
        ))}
      </View>
      <ShowMoreComponent
        cardRef={scrollViewRef}
        numberOfLines={numberOfLines}
        onToggleShowMoreRunners={onToggleShowMoreRunners}
        numberOfItemsToDisplay={numberOfItemsToDisplay}
        showMore={showMore}
        setShowMore={setShowMore}
      />
    </View>
  );
};

export default CorrectScoreCard;
