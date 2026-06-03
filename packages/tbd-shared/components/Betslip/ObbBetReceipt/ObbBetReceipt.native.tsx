import { FunctionComponent, useCallback } from "react";

import { ComponentProps } from "./props";
import { SportsbookReceiptPanel } from "../SportsbookReceipt/snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.native";

import ConnectedNotificationsSubscription from "../../NotificationsSubscription";
import NotificationsSubscription from "../../NotificationsSubscription/NotificationsSubscription.native";
import { NotificationsViewMode } from "../../NotificationsSubscription/map-to-props-factory";

export const ObbBetReceipt: FunctionComponent<ComponentProps> = ({
  i18n,
  totalReturns,
  totalStake,
  betSelections,
  singles,
  multiples,
  dispatchAccordionToggle,
}) => {
  const handleAccordionToggle = useCallback(
    (isExpanded: boolean) => {
      dispatchAccordionToggle?.(isExpanded);
    },
    [dispatchAccordionToggle],
  );

  const notificationsSubscription = (
    <ConnectedNotificationsSubscription
      viewMode={NotificationsViewMode.BET_RECEIPT}
      component={NotificationsSubscription}
    />
  );

  return (
    <SportsbookReceiptPanel
      selections={betSelections}
      singles={singles}
      displayAllSubtitleTextSingles={true}
      // NOTE: OBB multiples are considered as bet builders in the UI
      betBuilders={multiples}
      i18n={i18n}
      potentialReturns={totalReturns}
      totalStake={totalStake}
      notificationsSubscription={notificationsSubscription}
      showReuseSelectionsButton={false}
      onTitleClick={handleAccordionToggle}
      onReUseSelectionsClick={() => {}}
      onBetIdCopy={() => {}}
      onRegulatorBetIdCopy={() => {}}
      casts={[]}
      multiples={[]}
      boostedMultiples={[]}
    />
  );
};
