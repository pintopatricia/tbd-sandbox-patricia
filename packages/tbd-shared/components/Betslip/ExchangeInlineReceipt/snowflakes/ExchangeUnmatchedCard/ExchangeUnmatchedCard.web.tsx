import { FunctionComponent } from "react";

import { BetslipNotifications, PrimaryButton, SecondaryButton } from "@ppb/the-wall-web";

import { PlacedBetCard } from "../PlacedBetCard/PlacedBetCard.web";
import { ExchangeUnmatchedCardViewModel } from "./ExchangeUnmatchedCard.types";

import styles from "./ExchangeUnmatchedCard.web.css";

export const ExchangeUnmatchedCard: FunctionComponent<ExchangeUnmatchedCardViewModel> = ({
  type,
  price,
  stake,
  liability,
  profit,
  bonus,
  hasFreeBets,
  notifications,
  labels,
  onCancel,
  onEdit,
}) => {
  const hasActions = !!onCancel || !!onEdit;
  const isFullMode = !!onCancel && !!onEdit;
  const isCancelMode = !isFullMode && !!onCancel;

  return (
    <PlacedBetCard
      type={type}
      price={price}
      stake={stake}
      liability={liability}
      profit={profit}
      bonus={bonus}
      hasFreeBets={hasFreeBets}
      labels={labels}
    >
      <div className={styles.notifications}>
        <BetslipNotifications alerts={notifications} />
      </div>
      {hasActions && (
        <div className={styles.actions}>
          {(isCancelMode || isFullMode) && (
            <div className={styles.actionItem}>
              <SecondaryButton label={labels.cancel} onTap={onCancel} />
            </div>
          )}
          {isFullMode && (
            <div className={styles.actionItem}>
              <PrimaryButton label={labels.confirm} onTap={onEdit} />
            </div>
          )}
        </div>
      )}
    </PlacedBetCard>
  );
};
