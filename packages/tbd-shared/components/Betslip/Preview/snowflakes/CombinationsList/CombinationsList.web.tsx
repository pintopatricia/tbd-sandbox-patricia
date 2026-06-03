import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import classnames from "classnames";
import { Children, FunctionComponent, useCallback, useMemo, useState } from "react";
import { CombinationsListProps, ListCombinationLine } from "./CombinationsList.types";
import styles from "./CombinationsList.web.css";

const Icon: FunctionComponent<{ isOpen: boolean }> = ({ isOpen }) => (
  <div className={classnames(styles.icon, styles.iconSize)}>
    <GenericIcon
      name={isOpen ? SystemIconName.CHEVRON_UP : SystemIconName.CHEVRON_DOWN}
      color={"var(--action-sportsbook-icon-default)"}
    />
  </div>
);

const Header: FunctionComponent<Pick<CombinationsListProps, "isOpen" | "onToggle" | "i18n">> = ({
  isOpen,
  onToggle,
  i18n,
}) => (
  <button className={styles.header} onClick={onToggle}>
    <span className={classnames(styles.headerCell, styles.headerId, { [styles.headerClosed]: !isOpen })}></span>
    <span className={classnames(styles.headerCell, styles.headerTitleContainer)}>
      <Icon isOpen={isOpen} />
      <span className={classnames(styles.headerTitle, "typography-h098")}>{i18n.title}</span>
    </span>
    <span className={classnames(styles.headerCell, styles.headerOdd, styles.centerText, "typography-h098")}>
      {isOpen && i18n.odd}
    </span>
    <span
      className={classnames(styles.headerCell, styles.headerPayout, styles.centerText, "typography-h098", {
        [styles.headerPayoutClosed]: !isOpen,
      })}
    >
      {isOpen && i18n.payout}
    </span>
  </button>
);

export const CombinationsListLine: FunctionComponent<ListCombinationLine> = ({ id, children, odd, payout }) => (
  <div className={styles.line}>
    <span className={classnames(styles.contentCell, styles.id, styles.centerText, "typography-h098")}>{id}</span>
    <span className={classnames(styles.contentCell, styles.content)}>{children}</span>
    <span className={classnames(styles.contentCell, styles.odd, styles.centerText, "typography-h098")}>{odd}</span>
    <span className={classnames(styles.contentCell, styles.payout, styles.centerText, "typography-h098")}>
      {payout}
    </span>
  </div>
);

export const CombinationsList: FunctionComponent<CombinationsListProps> = ({
  isOpen,
  shortViewCount,
  children,
  i18n,
  onToggle,
}) => {
  const [isShortView, setIsShortView] = useState(true);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setIsShortView(true);
    }
  }

  const visibleChildren = useMemo(() => {
    if (isShortView) {
      const childrenSet = Children.toArray(children);
      const size = Math.min(shortViewCount, childrenSet.length);
      return childrenSet.slice(0, size);
    }

    return children;
  }, [isShortView, children, shortViewCount]);
  const isThereMoreToShow = !isShortView || Children.count(visibleChildren) < Children.count(children);

  const onMoreHandler = useCallback(() => setIsShortView((isShort) => !isShort), []);

  return (
    <div
      className={classnames(styles.combinationsList, {
        [styles.withoutMore]: !isThereMoreToShow,
      })}
    >
      <div className={styles.combinationsGrid}>
        <Header isOpen={isOpen} onToggle={onToggle} i18n={i18n} />
        {isOpen && <div className={styles.lines}>{visibleChildren}</div>}
      </div>
      {isOpen && isThereMoreToShow && (
        <button className={styles.moreButton} onClick={onMoreHandler}>
          <div className={styles.moreIcon}>
            <GenericIcon
              name={isShortView ? SystemIconName.NUDGE_PLUS : SystemIconName.NUDGE_MINUS}
              color={"var(--action-sportsbook-icon-default)"}
            />
          </div>
          <span className="typography-h158">{isShortView ? i18n.more : i18n.less}</span>
        </button>
      )}
    </div>
  );
};
