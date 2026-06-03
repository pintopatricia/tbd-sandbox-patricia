import { FunctionComponent, useMemo } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { InfoLabelType, TrackingBarStatus } from "@ppb/the-wall-common/types";
import { View } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { PrimaryButton, InfoLabel, TrackingBar, Styled, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SkyBetClubTrackerProps } from "./SkyBetClubTracker.types";
import styles from "./SkyBetClubTracker.native.styles";
import {
  TRACKING_COUNTER_ICON,
  SKY_BET_CLUB_TRACKER,
  LOGO_TEXT_CONTAINER,
  LOGO_TEXT_SECOND_LINE_CONTAINER,
  SUPPORTING_TEXT,
} from "./SkyBetClubTracker.native.selectors";

const sportsbookMinimizedTitleStyle = {
  highlighted: styles.highlightedText,
};

/**
 * Sky Bet Club Tracker
 * Temporary component that will eventually be superseeded by
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
      <Text style={styles.contentText}>
        <Styled translation={firstLine} styles={sportsbookMinimizedTitleStyle} />
      </Text>
    ),
    [firstLine],
  );

  const trackingCounterValueStyles = useMemo(
    () => [
      styles.trackingCounterValue,
      sbcStatus === TrackingBarStatus.ACTIVE && styles.joinedStateLabel,
      sbcStatus === TrackingBarStatus.PENDING && styles.notJoinedStateLabel,
    ],
    [sbcStatus],
  );

  const valueNode = useMemo(
    () =>
      fulfilled ? (
        <View {...getTestProps(TRACKING_COUNTER_ICON)} style={styles.trackingCounterValueIconWrapper}>
          <GenericIcon name={SystemIconName.CHECK} color={tokens.TrackingBarEnhancedTrackingCounterIconColour} />
        </View>
      ) : (
        <Text style={trackingCounterValueStyles}>{counterLabel}</Text>
      ),
    [fulfilled, trackingCounterValueStyles, counterLabel],
  );

  return (
    <View {...getTestProps(SKY_BET_CLUB_TRACKER, false)} style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIconContainer}>
            {logo && (
              <View style={styles.logoIcon}>
                <GenericIcon name={logo} />
              </View>
            )}
          </View>
          <View {...getTestProps(LOGO_TEXT_CONTAINER, false)} style={styles.logoTextContainer}>
            {sbcStatus === TrackingBarStatus.PLACEHOLDER ? (
              firstLineStyled
            ) : (
              <>
                {firstLineStyled}
                <View
                  {...getTestProps(LOGO_TEXT_SECOND_LINE_CONTAINER, false)}
                  style={styles.logoTextSecondLineContainer}
                >
                  {infoLabelDays && <InfoLabel label={infoLabelDays} infoLabelType={InfoLabelType.BRANDED} />}
                  <Text style={styles.contentText}>{secondLine}</Text>
                </View>
              </>
            )}
          </View>
        </View>
        {sbcStatus !== "ERROR" && (
          <TrackingBar
            currentValue={current}
            goalValue={target}
            hideGoalLabel
            status={fulfilled ? TrackingBarStatus.ACTIVE : sbcStatus}
            valueNode={valueNode}
          />
        )}
      </View>
      {sbcStatus !== "ERROR" && !!onPrimaryButtonTap && (
        <PrimaryButton onTap={onPrimaryButtonTap} label={primaryButtonLabel} stopAnimation />
      )}
      {sbcStatus === TrackingBarStatus.PENDING && (
        <Text {...getTestProps(SUPPORTING_TEXT, false)} style={styles.supportingText}>
          {supportingText}
        </Text>
      )}
    </View>
  );
};
