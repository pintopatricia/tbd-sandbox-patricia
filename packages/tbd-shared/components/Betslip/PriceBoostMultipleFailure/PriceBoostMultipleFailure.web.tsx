import type { FunctionComponent } from "react";
import { useCallback, useMemo } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ValueIconName } from "@ppb/the-wall-icons";

import { BetslipBetControls, BetslipNotifications } from "@ppb/the-wall-web";
import { AlertType } from "@ppb/the-wall-common/types";
import styles from "./PriceBoostMultipleFailure.web.css";
import type { ComponentProps } from "./props";
import { ConnectedBetLegs } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.web";
import { ConnectedSelection } from "../Selection";
import { Selection } from "../Selection/Selection.web";
import { i18n } from "../../../helpers/i18n";

export const PriceBoostMultipleFailure: FunctionComponent<ComponentProps> = ({
  id,
  legIds,
  odds,
  labels,
  dispatchRemove,
}) => {
  const selection = useCallback(
    (legId: string) => <ConnectedSelection component={Selection} id={legId} isReadOnly />,
    [],
  );

  const onRemove = useCallback(() => {
    dispatchRemove(legIds);
  }, [legIds, dispatchRemove]);

  const alerts = useMemo(
    () => [{ type: AlertType.Error, message: i18n({ key: "I18N.BETSLIP.PRICE_BOOST_NOT_AVAILABLE" }) }],
    [],
  );

  return (
    <div className={styles.container}>
      <BetslipNotifications alerts={alerts} />
      <div className={styles.icon}>
        <GenericIcon name={ValueIconName.ODDBOOST} preserveAspectRatio="preserveAspectRatio" />
      </div>
      <ConnectedBetLegs
        component={BetLegs}
        legIds={legIds}
        isWarning={true}
        renderLeg={selection}
        onRemove={onRemove}
      />
      <section className={styles.controls}>
        <BetslipBetControls
          id={id}
          odds={odds}
          oddsLabel={labels.odds}
          stakeLabel={labels.stake}
          hasEachWay={false}
          hasAccaInsurance={false}
          isStakeValid
          isPanelDisabled
          returnsLabel=""
          displayReturns={false}
          isAccaInsuranceSelected={false}
          isStakeReadonly
        />
      </section>
    </div>
  );
};
