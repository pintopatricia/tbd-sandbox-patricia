import { FunctionComponent, useCallback, useContext } from "react";

import classNames from "classnames";
import { ComponentProps } from "./props";
import styles from "./ObbBetReceipt.web.css";
import { SportsbookReceiptPanel as BetslipSportsbookReceiptPanel } from "../SportsbookReceipt/snowflakes/SportsbookReceiptPanel/SportsbookReceiptPanel.web";
import { ConfigContext } from "../../Config/ConfigContext";

export const ObbBetReceipt: FunctionComponent<ComponentProps> = ({
  i18n,
  totalReturns,
  totalStake,
  betSelections,
  singles,
  multiples,
  dispatchAccordionToggle,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);

  const handleAccordionToggle = useCallback(
    (isExpanded: boolean) => {
      dispatchAccordionToggle?.(isExpanded);
    },
    [dispatchAccordionToggle],
  );

  const betslipReceiptClass = classNames(styles.scrollableReceipt, {
    [styles.scrollableReceiptDesktop]: isDesktopLayout,
    [styles.scrollableReceiptModal]: !isDesktopLayout,
  });

  return (
    <div>
      <div className={betslipReceiptClass}>
        <BetslipSportsbookReceiptPanel
          selections={betSelections}
          singles={singles}
          // NOTE: OBB multiples are considered as bet builders in the UI
          betBuilders={multiples}
          displayAllSubtitleTextSingles={true}
          i18n={i18n}
          potentialReturns={totalReturns}
          totalStake={totalStake}
          isDesktop={isDesktopLayout}
          showReuseSelectionsButton={false}
          onTitleClick={handleAccordionToggle}
          onReUseSelectionsClick={() => {}}
          onBetIdCopy={() => {}}
          onRegulatorBetIdCopy={() => {}}
          multiples={[]}
          boostedMultiples={[]}
          casts={[]}
        />
      </div>
    </div>
  );
};
