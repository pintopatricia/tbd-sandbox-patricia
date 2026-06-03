import type { FunctionComponent } from "react";
import { useCallback, useMemo, useContext } from "react";
import { BetslipBetControls, BetslipNotifications, InfoLabel } from "@ppb/the-wall-web";
import { InfoLabelType } from "@ppb/the-wall-common/types";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { OthersIconName, ValueIconName } from "@ppb/the-wall-icons";

import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";
import { ConnectedBetLegsBetBuilder } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.web";
import { ConnectedSelectionBetBuilders } from "../Selection";
import { Selection } from "../Selection/Selection.web";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";

import type { ComponentProps } from "./props";
import styles from "./BetBuilder.web.css";

const PopularSignposting = ({ label }: { label: string }) => (
  <div className={styles.popularBadge}>
    <div className={styles.popularIcon}>
      <GenericIcon name={ValueIconName.POPULAR_BET_BUILDER} color={"var(--signposting-generosity-icon-default)"} />
    </div>
    <span className={`typography-h098 ${styles.popularLabel}`}>{label}</span>
  </div>
);

const PackagedCreatedBetsSignposting = ({ label }: { label: string }) => (
  <InfoLabel label={label} iconName={OthersIconName.ODDS_ON_THAT} infoLabelType={InfoLabelType.BRANDED} />
);

export const BetBuilder: FunctionComponent<ComponentProps> = ({
  id,
  title,
  subtitle,
  isPopular,
  isPackagedCreatedBets,
  betControlsExperimentVariant,
  shouldFocusStakeField,
  notifications,
  legIds,
  failedLegIds,
  i18n,
  odds,
}) => {
  const { isBetConfirmationStep } = useContext(RootBetslipContext);
  const betControlsOnTop = betControlsExperimentVariant === "betslip-bet-controls-on-top";

  const renderLeg = useCallback(
    (legId: string) => (
      <ConnectedSelectionBetBuilders component={Selection} id={legId} isReadOnly={isBetConfirmationStep} />
    ),
    [isBetConfirmationStep],
  );

  const renderBetControls = useMemo(() => {
    if (id) {
      return (
        <ConnectedBetControls
          component={BetControls}
          combinationId={id}
          shouldFocusStakeField={shouldFocusStakeField}
        />
      );
    }

    return (
      <BetslipBetControls
        id={id}
        odds={odds}
        oddsLabel={i18n.odds}
        stakeLabel={i18n.stake}
        hasEachWay={false}
        hasAccaInsurance={false}
        isStakeValid
        isPanelDisabled
        returnsLabel=""
        displayReturns={false}
        isAccaInsuranceSelected={false}
        isAccaInsuranceDisabled={isBetConfirmationStep}
        isStartingPriceDisabled={isBetConfirmationStep}
        isEachWayDisabled={isBetConfirmationStep}
        isStakeReadonly={isBetConfirmationStep}
      />
    );
  }, [id, odds, i18n, shouldFocusStakeField, isBetConfirmationStep]);

  return (
    <section className={styles.bet}>
      <div className={styles.description}>
        {title && (
          <div className={styles.titleContainer}>
            <h3 className={`typography-h280 ${styles.title}`}>{title}</h3>
            {isPopular && <PopularSignposting label={i18n.popular} />}
            {isPackagedCreatedBets && <PackagedCreatedBetsSignposting label={i18n.createdBets} />}
          </div>
        )}
        <span className={`typography-h152 ${styles.subtitle}`}>{subtitle}</span>
      </div>
      {betControlsOnTop && renderBetControls}
      {notifications?.length ? <BetslipNotifications alerts={notifications} /> : null}
      <ConnectedBetLegsBetBuilder component={BetLegs} legIds={failedLegIds} renderLeg={renderLeg} isWarning hasIcon />
      <ConnectedBetLegsBetBuilder component={BetLegs} legIds={legIds} renderLeg={renderLeg} />
      {!betControlsOnTop && renderBetControls}
    </section>
  );
};
