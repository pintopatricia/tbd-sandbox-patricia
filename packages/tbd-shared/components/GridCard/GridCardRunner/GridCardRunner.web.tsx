import * as React from "react";
import { Runner } from "@ppb/the-wall-web";
import ConnectedGridCardItem from "../GridCardItem";
import GridCardItemComponent from "../GridCardItem/GridCardItem.web";
import RunnerListHeader from "../RunnerListHeader/RunnerListHeader.web";
import styles from "./GridCardRunner.web.css";
import FootballRunner from "../../FootballRunner/FootballRunner.web";
import { GridCardRunnerProps } from "./props";

const GridCardRunner: React.FC<GridCardRunnerProps> = ({
  lineIndex,
  lineLabel,
  items,
  urn,
  azSwitcherProps,
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
      {items.map(({ marketUrn, selectionId }) => (
        <div className={styles.betButtonWrapper} key={`${marketUrn}-${selectionId}`}>
          <ConnectedGridCardItem
            component={GridCardItemComponent}
            marketUrn={marketUrn}
            selectionId={selectionId}
            cardUrn={urn}
          />
        </div>
      ))}
    </>
  );

  return (
    <div className={styles.gridRunnerLine}>
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
    </div>
  );
};

export default GridCardRunner;
