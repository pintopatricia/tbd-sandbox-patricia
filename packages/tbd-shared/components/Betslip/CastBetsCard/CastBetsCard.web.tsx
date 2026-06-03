import { Fragment, FunctionComponent } from "react";

import { ComponentProps } from "./props";

import ConnectedCastBet from "../CastBet";
import { CastBet } from "../CastBet/CastBet.web";
import styles from "./CastBetsCard.web.css";

export const CastBetsCard: FunctionComponent<ComponentProps> = ({ castGroupIds, shouldFocusStakeField }) => {
  if (!castGroupIds.length) {
    return null;
  }

  return (
    <div className={styles.castBetsCard}>
      {castGroupIds.map((castGroupId, index) => (
        <Fragment key={castGroupId}>
          <ConnectedCastBet
            component={CastBet}
            castGroupId={castGroupId}
            shouldFocusStakeField={shouldFocusStakeField && !index}
          />
        </Fragment>
      ))}
    </div>
  );
};
