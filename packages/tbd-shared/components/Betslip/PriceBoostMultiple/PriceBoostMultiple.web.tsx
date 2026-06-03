import type { FunctionComponent } from "react";
import { useCallback } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ValueIconName } from "@ppb/the-wall-icons";

import styles from "./PriceBoostMultiple.web.css";
import classnames from "classnames";
import type { ComponentProps } from "./props";
import { ConnectedBetLegs } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.web";
import { ConnectedSelection } from "../Selection";
import { Selection } from "../Selection/Selection.web";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";

export const PriceBoostMultiple: FunctionComponent<ComponentProps> = ({
  id,
  legIds,
  title,
  betControlsExperimentVariant,
  shouldFocusStakeField,
  dispatchRemove,
}) => {
  const selection = useCallback(
    (legId: string) => <ConnectedSelection component={Selection} id={legId} isReadOnly />,
    [],
  );
  const betControlsOnTop = betControlsExperimentVariant === "betslip-bet-controls-on-top";

  const headerContainer = classnames(styles.header, {
    [styles.headerExperiment]: betControlsOnTop,
  });

  const onRemove = useCallback(() => {
    dispatchRemove(legIds);
  }, [legIds, dispatchRemove]);

  const betControls = (
    <ConnectedBetControls
      component={BetControls}
      title={title}
      combinationId={id}
      shouldFocusStakeField={shouldFocusStakeField}
    />
  );

  return (
    <div className={styles.container}>
      {betControlsOnTop && betControls}
      <div className={headerContainer}>
        <div className={styles.headerIcon}>
          <GenericIcon name={ValueIconName.ODDBOOST} preserveAspectRatio="preserveAspectRatio" />
        </div>
      </div>
      <ConnectedBetLegs component={BetLegs} legIds={legIds} renderLeg={selection} onRemove={onRemove} hasIcon />
      {!betControlsOnTop && <section className={styles.controls}>{!betControlsOnTop && betControls}</section>}
    </div>
  );
};
