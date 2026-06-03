import { type FunctionComponent, memo, useCallback } from "react";
import { BetSegmentInfo, StatusLabelSizeType } from "@ppb/the-wall-common/types";
import { SportsbookBetPanelViewModel } from "./SportsbookBetPanel.types";
import { SystemIconName } from "@ppb/the-wall-icons";

import { BetSegments, Label, StatusLabel, Divider, InfoLabel, SupportingContentButton, Alert } from "@ppb/the-wall-web";

import styles from "./SportsbookBetPanel.web.css";

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
  }) => {
    const shouldDisplayStatusLabel = !!statusLabelText && !!statusLabelType;
    const shouldDisplaySubTitle = !!subTitle;
    const shouldDisplayBOG = !isMultiple && isGuaranteedPriceSelected && !!guaranteedPriceLabel;
    const shouldDisplaySupportingText = !!supportingText;

    return (
      <div className={styles.headerContainer}>
        <div className={styles.titleIndicatorsContainer}>
          <div className={styles.statusLabelContainer}>
            {shouldDisplayStatusLabel && (
              <div>
                <StatusLabel
                  text={statusLabelText}
                  iconName={statusLabelIcon}
                  statusLabelType={statusLabelType}
                  statusLabelSize={StatusLabelSizeType.MEDIUM}
                />
              </div>
            )}
            <div className={styles.title}>{title}</div>
          </div>
          {onShareIconTap && (
            <div className={styles.buttonsContainer}>
              <SupportingContentButton icon={SystemIconName.SHARE} onPress={onShareIconTap} isHighlighted />
            </div>
          )}
        </div>

        {shouldDisplaySubTitle && <p className={styles.subtitle}>{subTitle}</p>}

        {(shouldDisplaySupportingText || shouldDisplayBOG) && (
          <div className={styles.supportingTextContainer}>
            {shouldDisplaySupportingText && <span className={styles.supportingText}>{supportingText}</span>}
            {shouldDisplayBOG && (
              <div className={styles.bog}>
                <Label text={guaranteedPriceLabel} />
              </div>
            )}
          </div>
        )}
      </div>
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
    <div className={styles.betSegmentInfo}>
      {betSegmentInfos
        .filter((item) => item.label)
        .map((item, index) => (
          <BetInfoLabel key={`info-label-${index}`} item={item} onOpenExternalUrl={onOpenExternalUrl} />
        ))}
    </div>
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
  alert,
}) => {
  const hasSegmentData = !!segmentData;
  const hasBetSegmentInfo = !!betSegmentInfos?.length && betSegmentInfos.some(({ label }) => label);
  const hasDivider = hasBetSegmentInfo || hasSegmentData || !!children;

  return (
    <section className={styles.container}>
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
      />
      <div className={styles.containerBody}>
        {hasDivider && <Divider />}
        {children}
        {alert && (
          <Alert type={alert.type} message={alert.message} detail={alert.detail} iconOverload={alert.iconOverload} />
        )}
        {hasBetSegmentInfo && (
          <BetSegmentsInfo betSegmentInfos={betSegmentInfos} onOpenExternalUrl={onOpenExternalUrl} />
        )}
        {hasSegmentData && <SegmentDataElement segmentData={segmentData} secondarySegmentData={secondarySegmentData} />}
      </div>
    </section>
  );
};
