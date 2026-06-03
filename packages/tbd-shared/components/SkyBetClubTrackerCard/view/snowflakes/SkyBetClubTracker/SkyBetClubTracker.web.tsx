import { FunctionComponent, ReactNode, useMemo } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { InfoLabelType, TrackingBarStatus } from "@ppb/the-wall-common/types";
import { InfoLabel, TrackingBar, PrimaryButton, Styled } from "@ppb/the-wall-web";
import { SkyBetClubTrackerProps } from "./SkyBetClubTracker.types";
import styles from "./SkyBetClubTracker.web.css";

const TrackingCounterValue: FunctionComponent<Pick<SkyBetClubTrackerProps, "fulfilled" | "counterLabel">> = ({
  fulfilled,
  counterLabel,
}) =>
  fulfilled ? (
    <div className={styles.trackingCounterValueIconWrapper}>
      <GenericIcon name={SystemIconName.CHECK} color="var(--tracking-bar-enhanced-tracking-counter-icon-colour)" />
    </div>
  ) : (
    <>{counterLabel}</>
  );

const containerTextStyle = {
  highlighted: styles.highlightedText,
};

/**
 * Sky Bet Club Tracker
 * Temporary component that will eventually be superseded by
 * the new "Banner Card" component - https://www.figma.com/design/151p8J8eXc1TjZ0wHZX2zk/Cards?node-id=7008-162&t=cVtZ2yM7IRtkIsMT-0
 */
export const SkyBetClubTracker: FunctionComponent<SkyBetClubTrackerProps> = ({
  current,
  target,
  sbcStatus,
  fulfilled,
  counterLabel,
  onPrimaryButtonTap,
  i18n: { firstLine, secondLine, infoLabelDays, primaryButtonLabel, supportingText },
  logo,
}) => {
  const firstLineStyled = useMemo(
    () => (
      <p>
        <Styled translation={firstLine} styles={containerTextStyle} />
      </p>
    ),
    [firstLine],
  );

  const valueNode: ReactNode = useMemo(
    () => <TrackingCounterValue fulfilled={fulfilled} counterLabel={counterLabel} />,
    [fulfilled, counterLabel],
  );

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={styles.logoContainer}>
          {logo && (
            <div className={styles.logoIconContainer}>
              <GenericIcon name={logo} />
            </div>
          )}
          <div className={styles.logoTextContainer}>
            {sbcStatus === TrackingBarStatus.PLACEHOLDER ? (
              firstLineStyled
            ) : (
              <>
                {firstLineStyled}
                <div className={styles.logoTextSecondLineContainer}>
                  {infoLabelDays && <InfoLabel label={infoLabelDays} infoLabelType={InfoLabelType.BRANDED} />}
                  <p className={styles.logoTextSecondLineText}>{secondLine}</p>
                </div>
              </>
            )}
          </div>
        </div>
        {sbcStatus !== "ERROR" && (
          <TrackingBar
            currentValue={current}
            goalValue={target}
            hideGoalLabel
            status={fulfilled ? TrackingBarStatus.ACTIVE : sbcStatus}
            valueNode={valueNode}
            trackingCounterStyle={styles.trackingCounter}
          />
        )}
      </div>
      {sbcStatus !== "ERROR" && !!onPrimaryButtonTap && (
        <PrimaryButton onTap={onPrimaryButtonTap} label={primaryButtonLabel} />
      )}
      {sbcStatus === TrackingBarStatus.PENDING && <p className={styles.supportingText}>{supportingText}</p>}
    </div>
  );
};
