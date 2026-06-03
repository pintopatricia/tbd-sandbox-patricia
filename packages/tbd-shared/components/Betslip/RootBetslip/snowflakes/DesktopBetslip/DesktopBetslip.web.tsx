import { FunctionComponent, useCallback } from "react";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { DesktopBetslipProps } from "@ppb/tbd-store/state/betslip/Betslip.types";
import classnames from "classnames";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import betslipStyles from "./DesktopBetslip.web.css";
import { i18n } from "../../../../../helpers/i18n";
import ConnectedObbBetslip from "../../../ObbBetslip";
import { ObbBetslip } from "../../../ObbBetslip/ObbBetslip.web";
import { SportsbookBetslip } from "../../../SportsbookBetslip/SportsbookBetslip.web";
import ConnectedSportsbookBetslip from "../../../SportsbookBetslip";
import { ConfirmationDrawer } from "../../../ConfirmationDrawer/ConfirmationDrawer.web";
import ConnectedConfirmationDrawer from "../../../ConfirmationDrawer";

export const DesktopBetslip: FunctionComponent<DesktopBetslipProps> = ({
  activeBetslipType,
  step,
  hasConfirmation,
  onClose,
}) => {
  const getHeaderTranslationKey = useCallback(() => {
    if (activeBetslipType === BetslipType.OBB) {
      return "I18N.OBB_BETSLIP.TITLE";
    }

    return step === "CANCEL_BET" ? "I18N.BETSLIP.REVIEW_AND_CONFIRM_BET" : "I18N.BETSLIP.TITLE";
  }, [activeBetslipType, step]);

  const headerTranslationKey = getHeaderTranslationKey();

  return (
    <div className={classnames(betslipStyles.betslipContainer, betslipStyles.betslipContainerDesktop)}>
      <div className={classnames(betslipStyles.betslipContentWrapper, betslipStyles.inputDesktopWrapper)}>
        <div className={betslipStyles.headerDesktop}>
          <div className={classnames(betslipStyles.headerContentDesktop, "typography-h370")}>
            {i18n({ key: headerTranslationKey })}
          </div>
          {onClose && (
            <button className={betslipStyles.closeButton} onClick={onClose}>
              <GenericIcon name={SystemIconName.CLOSE} color={"var(--neutrals-text-default)"} />
            </button>
          )}
        </div>
        {activeBetslipType === BetslipType.OBB ? (
          <ConnectedObbBetslip component={ObbBetslip} />
        ) : (
          <ConnectedSportsbookBetslip component={SportsbookBetslip} />
        )}
        {hasConfirmation && <ConnectedConfirmationDrawer component={ConfirmationDrawer} />}
      </div>
    </div>
  );
};
