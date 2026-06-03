import { FunctionComponent, useCallback, useContext } from "react";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";

import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import { ConnectedSelection } from "../Selection";
import { Selection } from "../Selection/Selection.web";
import { ConnectedBetLegs } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.web";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";
import { withJurisdiction } from "../withJurisdiction/withJurisdiction";
import ConnectedPreview from "../Preview";
import { Preview } from "../Preview/Preview.web";

import styles from "./MultiLinesMultiples.web.css";
import { ComponentProps } from "./props";

const JurisdictionalConnectedPreview = withJurisdiction(ConnectedPreview, { jurisdictions: [Jurisdiction.ITALY] });

export const MultiLinesMultiples: FunctionComponent<ComponentProps> = ({
  multiples,
  shouldFocusStakeField,
  shouldRenderBetLegs = false,
}) => {
  const { isBetConfirmationStep } = useContext(RootBetslipContext);
  const selection = useCallback(
    (legId: string) => <ConnectedSelection component={Selection} id={legId} isReadOnly={isBetConfirmationStep} />,
    [isBetConfirmationStep],
  );

  return (
    <div className={styles.container}>
      {shouldRenderBetLegs && <ConnectedBetLegs component={BetLegs} renderLeg={selection} hasIcon />}
      {multiples?.map((multiple, index) => (
        <div key={multiple.id} className={styles.multiple}>
          <section className={styles.controls}>
            <ConnectedBetControls
              component={BetControls}
              combinationId={multiple.id}
              shouldFocusStakeField={shouldFocusStakeField && !index}
            />
          </section>
          <JurisdictionalConnectedPreview id={multiple.id} component={Preview} />
        </div>
      ))}
    </div>
  );
};
