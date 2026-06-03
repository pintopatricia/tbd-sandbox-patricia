import { FunctionComponent } from "react";
import { BetSelectionDetails, InfoLabel, BetSegments, StatusLabel } from "@ppb/the-wall-web";
import { InfoLabelType, BetSegmentsSize, StatusLabelSizeType } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import styles from "./MarketBetSelectionCard.web.css";
import { BetInfoCollapse } from "../BetInfoCollapse/BetInfoCollapse.web";
import { buildBetInfoItems } from "./helper";

const MarketBetSelectionCard: FunctionComponent<ComponentProps> = ({
  side,
  sideLabel,
  sideTheme,
  informationSignpostLabel,
  runnerDesc,
  oddsLabel,
  oddsValue,
  stakeLabel,
  stakeValue,
  liabilityLabel,
  liabilityValue,
  profitLabel,
  profitValue,
  statusLabelText,
  statusLabelType,
  hasUnmatchedActions,
  betIdLabel,
  betId,
  runnerURN,
  marketId,
  exchangeLightMarketViewLink,
  marketURN,
  marketBetCardGroupURN,
  placedDateLabel,
  placedDateFormatted,
  matchedDateLabel,
  matchedDateFormatted,
  settledDateLabel,
  settledDateFormatted,
  deviceIdLabel,
  deviceId,
  dispatchUnmatchedBetEditPress,
  dispatchCancelBetPress,
  dispatchCopyBetIdAction,
  dispatchCopyDeviceIdAction,
}) => {
  const onSelectionEdit = hasUnmatchedActions
    ? (): void => {
        if (exchangeLightMarketViewLink) {
          dispatchUnmatchedBetEditPress({
            betId,
            marketUrn: marketURN,
            runner: runnerURN,
            side,
            exchangeLightMarketViewLink,
          });
        }
      }
    : undefined;

  const onSelectionRemove = hasUnmatchedActions
    ? (): void => {
        dispatchCancelBetPress(marketId, betId, runnerDesc, side, marketBetCardGroupURN);
      }
    : undefined;

  const betSelectionDetailsContainerStyle =
    statusLabelText && statusLabelType ? styles.betSelectionDetailsContainer : "";

  const betInfoItems = buildBetInfoItems({
    betIdLabel,
    betId,
    onCopyBetId: dispatchCopyBetIdAction,
    placedDateLabel,
    placedDateFormatted,
    matchedDateLabel,
    matchedDateFormatted,
    settledDateLabel,
    settledDateFormatted,
    deviceId,
    deviceIdLabel,
    onCopyDeviceId: dispatchCopyDeviceIdAction,
  });

  return (
    <div className={styles.marketBetSelectionCard}>
      {!!informationSignpostLabel && (
        <div>
          <InfoLabel label={informationSignpostLabel} infoLabelType={InfoLabelType.INFO} />
        </div>
      )}
      <div className={betSelectionDetailsContainerStyle}>
        <BetSelectionDetails
          sideLabel={sideLabel}
          sideTheme={sideTheme}
          title={runnerDesc}
          onSelectionEdit={onSelectionEdit}
          onSelectionRemove={onSelectionRemove}
        />
        {statusLabelText && statusLabelType && (
          <StatusLabel
            text={statusLabelText}
            statusLabelSize={StatusLabelSizeType.SMALL}
            statusLabelType={statusLabelType}
          />
        )}
      </div>

      <BetSegments
        leftLabel={oddsLabel}
        leftValue={oddsValue}
        midLabel={stakeLabel}
        midValue={stakeValue}
        midRightLabel={liabilityLabel}
        midRightValue={liabilityValue}
        rightLabel={profitLabel}
        rightValue={profitValue}
        size={BetSegmentsSize.SMALL}
      />

      {betInfoItems.length > 0 && <BetInfoCollapse items={betInfoItems} />}
    </div>
  );
};

export default MarketBetSelectionCard;
