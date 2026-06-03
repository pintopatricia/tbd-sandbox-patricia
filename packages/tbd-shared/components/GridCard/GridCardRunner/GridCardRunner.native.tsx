import * as React from "react";
import { View } from "react-native";
import { Runner } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import ConnectedGridCardItem from "../GridCardItem";
import GridCardItemComponent from "../GridCardItem/GridCardItem.native";
import RunnerListHeader from "../RunnerListHeader/RunnerListHeader.native";
import styles from "./GridCardRunner.native.styles";
import { TEST_ID as GRID_CARD_RUNNER } from "./GridCardRunner.native.selectors";
import FootballRunner from "../../FootballRunner/FootballRunner.native";
import { GridCardRunnerProps } from "./props";

type BetButtonsContainerStyle = (
  lineIndex: number,
  itemsIndex: number,
  itemsSize: number,
  linesSize: number,
) =>
  | { borderTopLeftRadius: number }
  | { borderTopRightRadius: number }
  | { borderBottomLeftRadius: number }
  | { borderBottomRightRadius: number }
  | {};

const betButtonsContainerStyle: BetButtonsContainerStyle = (lineIndex, itemsIndex, itemsSize, linesSize) => {
  if (lineIndex === 0) {
    if (itemsIndex === 0) return { borderTopLeftRadius: 4 };
    if (itemsIndex === itemsSize - 1) return { borderTopRightRadius: 4 };
  }

  if (lineIndex === linesSize - 1) {
    if (itemsIndex === 0) return { borderBottomLeftRadius: 4 };
    if (itemsIndex === itemsSize - 1) return { borderBottomRightRadius: 4 };
  }

  return {};
};

const GridCardRunner: React.FC<GridCardRunnerProps & { linesSize: number; visible?: boolean }> = ({
  lineIndex,
  lineLabel,
  items,
  linesSize,
  urn,
  azSwitcherProps,
  visible,
  jersey,
  useFallbackJersey,
  hasJerseys,
  hasStats,
  statValue,
  statValueInterpolation,
  statLabel,
}) => {
  const betButtons = (
    <>
      {items.map(({ marketUrn, selectionId }, index) => (
        <View
          style={[styles.gridHeaderItem, betButtonsContainerStyle(lineIndex, index, items.length, linesSize)]}
          key={`${marketUrn}-${selectionId}`}
        >
          <ConnectedGridCardItem
            component={GridCardItemComponent}
            marketUrn={marketUrn}
            selectionId={selectionId}
            cardUrn={urn}
            visible={visible}
          />
        </View>
      ))}
    </>
  );
  return (
    <View
      {...getTestProps(GRID_CARD_RUNNER, false)}
      style={[styles.gridRunnerLine, lineIndex === 0 && styles.gridRunnerLineFirst]}
    >
      {lineIndex === 0 && <RunnerListHeader items={items} azSwitcherProps={azSwitcherProps} />}
      {hasJerseys || hasStats ? (
        <FootballRunner
          runnerName={lineLabel}
          rightColumn={betButtons}
          jersey={jersey}
          useFallbackJersey={useFallbackJersey}
          statValue={statValue}
          statValueInterpolation={statValueInterpolation}
          statLabel={statLabel}
          shouldRenderJerseySpace={hasJerseys}
        />
      ) : (
        <Runner name={lineLabel}>{betButtons}</Runner>
      )}
    </View>
  );
};

export default GridCardRunner;
