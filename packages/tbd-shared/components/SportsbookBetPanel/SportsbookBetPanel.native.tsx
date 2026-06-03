import { memo, useCallback, type FunctionComponent } from "react";
import { Platform, View } from "react-native";

import { type BetSegmentInfo, StatusLabelSizeType } from "@ppb/the-wall-common/types";
import { SportsbookBetPanelViewModel } from "./SportsbookBetPanel.types";
import { SystemIconName } from "@ppb/the-wall-icons";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import {
  BetSegments,
  Divider,
  InfoLabel,
  Label,
  StatusLabel,
  Text,
  SupportingContentButton,
  Alert,
} from "@ppb/the-wall-native";

import {
  SPORTSBOOK_BET_PANEL,
  SPORTSBOOK_BET_PANEL_BOG_CONTAINER,
  SPORTSBOOK_BET_PANEL_SUBTITLE,
  SPORTSBOOK_BET_PANEL_SUPPORTING_TEXT,
  SPORTSBOOK_BET_PANEL_TITLE,
  SPORTSBOOK_BET_PANEL_TITLE_CONTAINER,
} from "./SportsbookBetPanel.native.selectors";
import styles from "./SportsbookBetPanel.native.styles";

/**
 * Internal component that renders the header section with title, subtitle, status label, and share button.
 */
const Header: FunctionComponent<
  Pick<
    SportsbookBetPanelViewModel,
    | "guaranteedPriceLabel"
    | "isGuaranteedPriceSelected"
    | "isMultiple"
    | "onShareIconTap"
    | "statusLabelIcon"
    | "statusLabelText"
    | "statusLabelType"
    | "subTitle"
    | "title"
    | "supportingText"
    | "notification"
  >
> = memo(
  ({
    guaranteedPriceLabel,
    isGuaranteedPriceSelected,
    isMultiple,
    onShareIconTap,
    statusLabelIcon,
    statusLabelText,
    statusLabelType,
    subTitle,
    title,
    supportingText,
    notification,
  }) => {
    const shouldDisplayStatusLabel = !!statusLabelText && !!statusLabelType;
    const shouldDisplaySubTitle = !!subTitle;
    const shouldDisplaySupportingText = !!supportingText;
    const shouldDisplayBOG = !isMultiple && isGuaranteedPriceSelected && !!guaranteedPriceLabel;
    const shouldDisplayNotification = !!notification;
    const shareButtonIcon = Platform.OS === "android" ? SystemIconName.SHARE_ANDROID : SystemIconName.SHARE;

    return (
      <View style={styles.headerContainer} {...getTestProps(SPORTSBOOK_BET_PANEL_TITLE_CONTAINER, false)}>
        <View style={styles.titleIndicatorsContainer}>
          <View style={styles.statusLabelContainer}>
            {shouldDisplayStatusLabel && (
              <StatusLabel
                text={statusLabelText}
                iconName={statusLabelIcon}
                statusLabelType={statusLabelType}
                statusLabelSize={StatusLabelSizeType.MEDIUM}
              />
            )}
            <Text {...getTestProps(SPORTSBOOK_BET_PANEL_TITLE)} style={styles.title}>
              {title}
            </Text>
          </View>

          {(onShareIconTap || shouldDisplayNotification) && (
            <View style={styles.buttonsContainer}>
              {onShareIconTap && (
                <SupportingContentButton
                  icon={shareButtonIcon}
                  onPress={onShareIconTap}
                  isHighlighted
                  style={styles.button}
                />
              )}
              {notification}
            </View>
          )}
        </View>
        {shouldDisplaySubTitle && (
          <Text {...getTestProps(SPORTSBOOK_BET_PANEL_SUBTITLE)} style={styles.subtitle}>
            {subTitle}
          </Text>
        )}
        {(shouldDisplaySupportingText || shouldDisplayBOG) && (
          <View style={styles.supportingTextContainer}>
            {shouldDisplaySupportingText && (
              <Text {...getTestProps(SPORTSBOOK_BET_PANEL_SUPPORTING_TEXT)} style={styles.supportingText}>
                {supportingText}
              </Text>
            )}
            {shouldDisplayBOG && (
              <View {...getTestProps(SPORTSBOOK_BET_PANEL_BOG_CONTAINER, false)}>
                <Label text={guaranteedPriceLabel} />
              </View>
            )}
          </View>
        )}
      </View>
    );
  },
);

const SegmentDataElement: FunctionComponent<Pick<SportsbookBetPanelViewModel, "segmentData" | "secondarySegmentData">> =
  memo(({ segmentData, secondarySegmentData }) => (
    <>
      <BetSegments {...segmentData} />

      {!!secondarySegmentData && (
        <>
          <Divider />
          <BetSegments {...secondarySegmentData} />
        </>
      )}
    </>
  ));

const BetInfoLabel: FunctionComponent<
  Pick<SportsbookBetPanelViewModel, "onOpenExternalUrl"> & { item: BetSegmentInfo }
> = memo(({ item, onOpenExternalUrl }) => {
  const { externalUrl, label, icon, iconPosition, infoLabelType, oddsValue, previousOddsValue } = item;

  const onClick = useCallback(() => {
    if (externalUrl && onOpenExternalUrl) {
      onOpenExternalUrl(externalUrl);
    }
  }, [externalUrl, onOpenExternalUrl]);

  return (
    <InfoLabel
      label={label}
      iconName={icon}
      iconPosition={iconPosition}
      infoLabelType={infoLabelType}
      oddsValue={oddsValue}
      previousOddsValue={previousOddsValue}
      onClick={onClick}
    />
  );
});

const BetSegmentsInfo: FunctionComponent<
  Pick<SportsbookBetPanelViewModel, "onOpenExternalUrl"> & { betSegmentInfos: BetSegmentInfo[] }
> = memo(({ betSegmentInfos, onOpenExternalUrl }) => {
  return (
    <View style={styles.betSegmentInfo}>
      {betSegmentInfos
        .filter((item) => item.label)
        .map((item, index) => (
          <BetInfoLabel key={`info-label-${index}`} item={item} onOpenExternalUrl={onOpenExternalUrl} />
        ))}
    </View>
  );
});

Header.displayName = "Header";
BetInfoLabel.displayName = "BetInfoLabel";
BetSegmentsInfo.displayName = "BetSegmentInfo";
SegmentDataElement.displayName = "SegmentDataElement";

export const SportsbookBetPanel: FunctionComponent<SportsbookBetPanelViewModel> = ({
  title,
  subTitle,
  supportingText,
  statusLabelText,
  statusLabelIcon,
  statusLabelType,
  isMultiple,
  isGuaranteedPriceSelected = false,
  guaranteedPriceLabel,
  segmentData,
  betSegmentInfos,
  children,
  onShareIconTap,
  onOpenExternalUrl,
  secondarySegmentData,
  notification,
  alert,
}) => {
  const hasSegmentData = !!segmentData;
  const hasBetSegmentInfo = !!betSegmentInfos?.length && betSegmentInfos.some(({ label }) => label);
  const hasDivider = hasBetSegmentInfo || hasSegmentData || !!children;

  return (
    <View style={styles.container} {...getTestProps(SPORTSBOOK_BET_PANEL, false)}>
      <Header
        guaranteedPriceLabel={guaranteedPriceLabel}
        isGuaranteedPriceSelected={isGuaranteedPriceSelected}
        isMultiple={isMultiple}
        onShareIconTap={onShareIconTap}
        statusLabelIcon={statusLabelIcon}
        statusLabelText={statusLabelText}
        statusLabelType={statusLabelType}
        subTitle={subTitle}
        title={title}
        supportingText={supportingText}
        notification={notification}
      />
      <View style={styles.containerBody}>
        {hasDivider && <Divider />}
        {children}
        {alert && (
          <Alert type={alert.type} message={alert.message} detail={alert.detail} iconOverload={alert.iconOverload} />
        )}
        {hasBetSegmentInfo && (
          <BetSegmentsInfo betSegmentInfos={betSegmentInfos} onOpenExternalUrl={onOpenExternalUrl} />
        )}
        {hasSegmentData && <SegmentDataElement segmentData={segmentData} secondarySegmentData={secondarySegmentData} />}
      </View>
    </View>
  );
};
