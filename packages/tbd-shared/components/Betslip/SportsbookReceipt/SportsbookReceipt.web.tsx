import { FunctionComponent, useCallback, useContext, useMemo } from "react";
import classNames from "classnames";
import { SportsbookReceiptPanel as BetslipSportsbookReceiptPanel } from "./snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.web";
import styles from "./SportsbookReceipt.web.css";
import { ComponentProps } from "./props";
import { ConfigContext } from "../../Config/ConfigContext";
import SkyBetClubTrackerCard from "../../SkyBetClubTrackerCard/view/SkyBetClubTrackerCard.web";

export const SportsbookReceipt: FunctionComponent<ComponentProps> = ({
  selections,
  boostedMultiples,
  multiples,
  singles,
  oneLineBets,
  casts,
  betBuilders,
  multiBetBuilder,
  multiBetBuilderGroups,
  i18n,
  potentialReturns,
  totalOriginalReturns,
  totalStake,
  isOddsBoosted,
  hasShownReceiptIds,
  hasBoostSignposting,
  showTopContent,
  isTrapIconThrottleActive,
  dispatchAccordionToggle,
  dispatchReUseSelections,
  dispatchCopyBetIdAction,
  dispatchCopyRegulatorBetIdAction,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);

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

  const betslipReceiptClass = classNames(styles.scrollableReceipt, {
    [styles.scrollableReceiptDesktop]: isDesktopLayout,
    [styles.scrollableReceiptModal]: !isDesktopLayout,
  });

  return (
    <div className={betslipReceiptClass}>
      <BetslipSportsbookReceiptPanel
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
        onTitleClick={handleAccordionToggle}
        onReUseSelectionsClick={handleReUseSelectionsClick}
        showReuseSelectionsButton={!hasOnlyOneLineBets}
        onBetIdCopy={onBetIdCopy}
        onRegulatorBetIdCopy={onRegulatorBetIdCopy}
        hasBoostSignposting={hasBoostSignposting}
        hasShownReceiptIds={hasShownReceiptIds}
        isDesktop={isDesktopLayout}
        topContent={showTopContent ? <SkyBetClubTrackerCard /> : null}
        isTrapIconThrottleActive={isTrapIconThrottleActive}
      />
    </div>
  );
};
