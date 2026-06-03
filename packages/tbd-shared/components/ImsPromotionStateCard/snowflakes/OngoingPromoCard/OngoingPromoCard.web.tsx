import { FunctionComponent } from "react";
import { ActionLinkColor, ActionLinkTypography } from "@ppb/the-wall-common/types";
import classnames from "classnames";
import { CasinoIconName, SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ActionLink } from "@ppb/the-wall-web";
import { ProgressBar } from "@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar";

import { OngoingBadge } from "../OngoingBadge/OngoingBadge.web";
import styles from "./OngoingPromoCard.web.css";
import { OngoingPromoCardProps, OngoingPromoCardTypes, AdditionalMessageType } from "./OngoingPromoCard.types";

const LEGACY_COLORS = {
  white: "#FFFFFF",
};

export const OngoingPromoCard: FunctionComponent<OngoingPromoCardProps> = ({
  title,
  type,
  additionalMessage,
  tcText,
  requirements,
  backgroundImage,
  remainingHeader,
  remainingSubheader,
  footerValue,
  pendingWinnings,
  i18N,
  progressValue,
  disableRefresh,
  onCancel,
  onRefresh,
}) => {
  const isOptIn = type === OngoingPromoCardTypes.OPTIN;
  const isFreeSpins = type === OngoingPromoCardTypes.FREE_SPINS;
  const footerTextValue = footerValue !== "" ? `${i18N.footerText}: ${footerValue}` : undefined;

  let FooterIcon;
  let RemainingIcon;
  let footerText: string | undefined;

  switch (type) {
    case OngoingPromoCardTypes.FREE_SPINS:
      RemainingIcon = CasinoIconName.FREE_SPINS;
      footerText = footerTextValue;
      FooterIcon = CasinoIconName.IN_GAME;
      break;
    case OngoingPromoCardTypes.GOLDEN_CHIPS:
      RemainingIcon = CasinoIconName.TABLE_GAMES;
      FooterIcon = CasinoIconName.JACKPOT;
      footerText = `${i18N.pendingWinnings}: ${pendingWinnings}`;
      break;
    default:
      RemainingIcon = CasinoIconName.FEATURES;
      FooterIcon = CasinoIconName.IN_GAME;
      footerText = footerTextValue;
  }
  return (
    <div
      className={styles.promoCard}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <OngoingBadge label={i18N.badgeLabel} />
      <div className={styles.promoCardContent}>
        {additionalMessage?.text && (
          <div className={classnames("typography-h120", styles.promotionCompletedContainer)}>
            {additionalMessage.type === AdditionalMessageType.SUCCESS && (
              <GenericIcon name={SystemIconName.CHECKBOX_ACTIVE} color={"var(--brand-casino-icon-default)"} />
            )}
            {additionalMessage.type === AdditionalMessageType.WARNING && (
              <GenericIcon name={SystemIconName.NOTIFICATION_WARNING} color={"var(--messaging-warning-icon-default)"} />
            )}
            {additionalMessage.text}
          </div>
        )}
        <h5 className="typography-h280">{title}</h5>
        <div className={classnames("typography-h082", styles.tcTextContainer)}>{tcText}</div>
        {!isOptIn && (
          <>
            {requirements && (
              <div className={classnames("typography-h120", styles.requirementsText)}>{requirements}</div>
            )}
            <div className={styles.remainingTextContainer}>
              <GenericIcon name={RemainingIcon} color={LEGACY_COLORS.white} />
              <div className={styles.remainingText}>
                {remainingSubheader && <p className={"typography-h120"}>{remainingSubheader}</p>}
                {remainingHeader && <p className={"typography-h180"}>{remainingHeader}</p>}
              </div>
            </div>
            {type === OngoingPromoCardTypes.GOLDEN_CHIPS && (
              <div className={styles.remainingTextContainer}>
                <GenericIcon name={CasinoIconName.IN_GAME} color={LEGACY_COLORS.white} />
                <div className={styles.remainingTextFooter}>
                  {footerText && <p className={"typography-h180"}>{footerTextValue}</p>}
                </div>
              </div>
            )}
            {!isFreeSpins && (
              <div className={styles.progressBar}>
                <ProgressBar
                  home={progressValue}
                  away={100 - progressValue}
                  homeColor={"var(--brand-casino-icon-default)"}
                  awayColor={"var(--agnostic-neutrals-icon-default)"}
                />
              </div>
            )}
          </>
        )}
        <div
          className={classnames(styles.linkControlsContainer, {
            [styles.freeSpinsPromo]: isFreeSpins,
          })}
        >
          {!isOptIn && (
            <ActionLink
              text={i18N.cancel}
              onClick={onCancel}
              color={ActionLinkColor.Gold}
              typography={ActionLinkTypography.Small}
              noPadding={true}
            />
          )}
          {footerText && (
            <div
              className={classnames(styles.footerTextContainer, {
                [styles.optInPromo]: isOptIn,
              })}
            >
              <GenericIcon name={FooterIcon} color={LEGACY_COLORS.white} />
              <p className={"typography-h180"}>{footerText}</p>
            </div>
          )}
          {!isOptIn && (
            <ActionLink
              text={i18N.refresh}
              onClick={onRefresh}
              disabled={disableRefresh}
              color={ActionLinkColor.Gold}
              typography={ActionLinkTypography.Small}
              noPadding={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};
