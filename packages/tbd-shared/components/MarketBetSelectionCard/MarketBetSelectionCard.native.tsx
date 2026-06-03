import { FunctionComponent } from "react";
import { View } from "react-native";

import { BetSegments, BetSelectionDetails, InfoLabel, StatusLabel } from "@ppb/the-wall-native";
import { BetSegmentsSize, InfoLabelType, StatusLabelSizeType } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import {
  MARKET_BET_SELECTION_CARD,
  MARKET_BET_SELECTION_CARD_BET_SEGMENTS_CONTAINER,
} from "./MarketBetSelectionCard.native.selectors";
import styles from "./MarketBetSelectionCard.native.styles";
import { BetInfoCollapse } from "../BetInfoCollapse/BetInfoCollapse.native";
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
    statusLabelText && statusLabelType ? styles.betSelectionDetailsContainer : {};

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
    <View {...getTestProps(MARKET_BET_SELECTION_CARD, false)}>
      {!!informationSignpostLabel && (
        <View style={styles.infoSignpost}>
          <InfoLabel label={informationSignpostLabel} infoLabelType={InfoLabelType.INFO} />
        </View>
      )}
      <View style={betSelectionDetailsContainerStyle}>
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
      </View>
      <View
        style={styles.betSegmentsContainer}
        {...getTestProps(MARKET_BET_SELECTION_CARD_BET_SEGMENTS_CONTAINER, false)}
      >
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
      </View>
      {betInfoItems.length > 0 && <BetInfoCollapse items={betInfoItems} />}
    </View>
  );
};

export default MarketBetSelectionCard;
