import { FunctionComponent, useCallback } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import styles from "./MyBetsHeaderAddOn.web.css";
import { MyBetsHeaderAddOnViewModel } from "./MyBetsHeaderAddOn.types";
import { ActionLink } from "@ppb/the-wall-web";
import { ActionLinkColor, ActionLinkTypography } from "@ppb/the-wall-common/types";

export const MyBetsHeaderAddOn: FunctionComponent<MyBetsHeaderAddOnViewModel> = ({
  settlementLink,
  settlementLinkLabel,
  selectedOrderType,
  dispatchSettlementLinkAction,
  isHighlighted = true,
  dispatchSettlementLinkPageNavigationAction,
}) => {
  const handleSettlementLinkAction = useCallback(() => {
    dispatchSettlementLinkAction?.(settlementLink);
    dispatchSettlementLinkPageNavigationAction(settlementLink, selectedOrderType);
  }, [settlementLink, dispatchSettlementLinkAction, dispatchSettlementLinkPageNavigationAction, selectedOrderType]);

  const iconColor = isHighlighted
    ? "var(--my-bets-header-add-on-highlighted-icon-colour)"
    : "var(--my-bets-header-add-on-default-icon-colour)";

  const fontColor = isHighlighted ? ActionLinkColor.Highlighted : ActionLinkColor.Default;

  return (
    <div className={styles.helpLink}>
      <button
        className={styles.helpLinkButtonIcon}
        onClick={handleSettlementLinkAction}
        aria-label={settlementLinkLabel}
      >
        <GenericIcon name={SystemIconName.NOTIFICATION_HELP} color={iconColor} />
      </button>
      <ActionLink
        text={settlementLinkLabel}
        onClick={handleSettlementLinkAction}
        color={fontColor}
        typography={ActionLinkTypography.Regular}
        capitalize={false}
        noPadding
      />
    </div>
  );
};
