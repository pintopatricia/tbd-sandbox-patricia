import { FunctionComponent, ReactNode, useMemo } from "react";
import classnames from "classnames";
import { Styled } from "@ppb/the-wall-web";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { CounterColor } from "@ppb/the-wall-common/types";
import { i18n } from "../../../../../helpers/i18n";
import styles from "./CollapsedView.web.css";

import { Minimized as BetslipMinimized } from "../Minimized/Minimized.web";
import { ComponentProps } from "./props";

const sportsbookMinimizedTitleStyle = {
  stake: styles.minimizedTitle,
  odds: styles.minimizedTitle,
  potentialReturns: styles.minimizedTitle,
};

function buildSportsbookBetslipMinimizedTitle(title: string | null, isConfirm?: boolean): ReactNode {
  if (isConfirm) {
    return (
      <div>
        <span className={styles.minimizedTitle}>{i18n({ key: "I18N.BETSLIP.TITLE" })}</span>
        <span className={styles.minimizedSupportingText}>{` - ${i18n({
          key: "I18N.BETSLIP.CONFIRM_SELECTIONS",
        })}`}</span>
      </div>
    );
  }

  if (title) {
    return <Styled translation={title} styles={sportsbookMinimizedTitleStyle} />;
  }

  return <span className={styles.minimizedTitle}>{i18n({ key: "I18N.BETSLIP.TITLE" })}</span>;
}

function buildObbBetslipMinimizedTitle(totalSelections: number): ReactNode {
  if (totalSelections === 1) {
    return (
      <div>
        <span className={styles.minimizedTitle}>{i18n({ key: "I18N.OBB_BETSLIP.TITLE" })}</span>
        <span className={styles.minimizedSupportingText}>{` - ${i18n({
          key: "I18N.BETSLIP.ADD_MORE_SELECTIONS",
        })}`}</span>
      </div>
    );
  }

  return <span className={styles.minimizedTitle}>{i18n({ key: "I18N.OBB_BETSLIP.TITLE" })}</span>;
}

export const CollapsedView: FunctionComponent<ComponentProps> = ({
  title,
  activeBetslipType,
  totalSelections,
  isConfirm,
  hasFailures,
  onClick,
}) => {
  const content = useMemo(() => {
    if (hasFailures) {
      return (
        <BetslipMinimized counter={totalSelections} color={CounterColor.BlackAlternative}>
          <span className={styles.minimizedTitle}>{i18n({ key: "I18N.BETSLIP.NOT_COMBINABLE" })}</span>
        </BetslipMinimized>
      );
    }

    if (activeBetslipType === BetslipType.OBB) {
      return (
        <BetslipMinimized counter={totalSelections} color={CounterColor.Teal}>
          {buildObbBetslipMinimizedTitle(totalSelections)}
        </BetslipMinimized>
      );
    }

    return (
      <BetslipMinimized counter={totalSelections} color={CounterColor.Teal}>
        {buildSportsbookBetslipMinimizedTitle(title, isConfirm)}
      </BetslipMinimized>
    );
  }, [activeBetslipType, hasFailures, totalSelections, title, isConfirm]);

  const isWrapperView = window.__TBD_CLIENT_CONTEXT__?.webWrappedExperience;

  return (
    <button
      className={classnames(styles.collapsedHeader, { [styles.webWrappedVersion]: isWrapperView })}
      onClick={onClick}
    >
      <div className={styles.collapsedHeaderContent}>{content}</div>
      <div className={styles.collapsedHeaderAction}>
        <div className={styles.collapsedIcon}>
          <GenericIcon name={SystemIconName.CHEVRON_UP} color={"var(--receipt-title-icon-colour)"} />
        </div>
      </div>
    </button>
  );
};
