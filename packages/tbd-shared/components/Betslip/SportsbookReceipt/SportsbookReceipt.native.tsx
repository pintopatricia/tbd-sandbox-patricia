import { FunctionComponent, useCallback, useMemo } from "react";

import { ComponentProps } from "./props";

import ConnectedNotificationsSubscription from "../../NotificationsSubscription";
import NotificationsSubscription from "../../NotificationsSubscription/NotificationsSubscription.native";
import { NotificationsViewMode } from "../../NotificationsSubscription/map-to-props-factory";

import SkyBetClubTrackerCard from "../../SkyBetClubTrackerCard/view/SkyBetClubTrackerCard.native";
import { SportsbookReceiptPanel } from "./snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.native";

export const SportsbookReceipt: FunctionComponent<ComponentProps> = ({
  selections,
  multiples,
  boostedMultiples,
  singles,
  oneLineBets,
  casts,
  betBuilders,
  multiBetBuilder,
  multiBetBuilderGroups,
  i18n,
  potentialReturns,
  isOddsBoosted,
  hasShownReceiptIds,
  hasBoostSignposting,
  showTopContent,
  isTrapIconThrottleActive,
  totalOriginalReturns,
  totalStake,
  dispatchAccordionToggle,
  dispatchReUseSelections,
  dispatchCopyBetIdAction,
  dispatchCopyRegulatorBetIdAction,
}) => {
  const hasOnlyOneLineBets = useMemo(() => singles.length === 0 && !!oneLineBets?.length, [oneLineBets, singles]);

  const handleAccordionToggle = useCallback(
    (isExpanded: boolean) => {
      dispatchAccordionToggle?.(isExpanded);
    },
    [dispatchAccordionToggle],
  );
  const handleReUseSelectionsClick = useCallback(() => {
    dispatchReUseSelections(selections);
  }, [dispatchReUseSelections, selections]);

  const onBetIdCopy = useCallback(() => {
    dispatchCopyBetIdAction();
  }, [dispatchCopyBetIdAction]);

  const onRegulatorBetIdCopy = useCallback(() => {
    dispatchCopyRegulatorBetIdAction();
  }, [dispatchCopyRegulatorBetIdAction]);

  const notificationsSubscription = (
    <ConnectedNotificationsSubscription
      viewMode={NotificationsViewMode.BET_RECEIPT}
      component={NotificationsSubscription}
    />
  );

  return (
    <SportsbookReceiptPanel
      selections={selections}
      multiples={multiples}
      boostedMultiples={boostedMultiples}
      singles={singles}
      oneLineBets={oneLineBets}
      casts={casts}
      betBuilders={betBuilders}
      multiBetBuilder={multiBetBuilder}
      multiBetBuilderGroups={multiBetBuilderGroups}
      i18n={i18n}
      potentialReturns={potentialReturns}
      totalOriginalReturns={totalOriginalReturns}
      totalStake={totalStake}
      isOddsBoosted={isOddsBoosted}
      hasBoostSignposting={hasBoostSignposting}
      hasShownReceiptIds={hasShownReceiptIds}
      notificationsSubscription={notificationsSubscription}
      showReuseSelectionsButton={!hasOnlyOneLineBets}
      onTitleClick={handleAccordionToggle}
      onReUseSelectionsClick={handleReUseSelectionsClick}
      onBetIdCopy={onBetIdCopy}
      onRegulatorBetIdCopy={onRegulatorBetIdCopy}
      topContent={showTopContent ? <SkyBetClubTrackerCard /> : null}
      isTrapIconThrottleActive={isTrapIconThrottleActive}
    />
  );
};
