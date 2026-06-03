import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";

import { BetInfoItem, BetInfoItemWithCopyOption, BetInfoItemMode } from "@ppb/the-wall-common/types";
import { BetInfo, Divider, SportsbookBetButton } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SystemIconName } from "@ppb/the-wall-icons";

import { ComponentProps } from "./props";
import { SPORTSBOOK_BET_INFO_CARD } from "./SportsbookBetInfoCard.native.selectors";
import styles from "./SportsbookBetInfoCard.native.styles";

const getBetInfoItemWithCopy = (
  title: BetInfoItemWithCopyOption["title"],
  copyContent: BetInfoItemWithCopyOption["copyContent"],
): BetInfoItemWithCopyOption => ({
  title,
  copyContent,
  mode: BetInfoItemMode.WITH_COPY,
});

const SportsbookBetInfoCard: FunctionComponent<ComponentProps> = ({
  labels,
  betId,
  regulatorBetId,
  placedDateItem,
  settledDateItem,
  deviceId,
  showReuseSelectionsButton,
  betSelections,
  product,
  isSettledView,
  dispatchCopyBetIdAction,
  dispatchCopyRegulatorBetIdAction,
  dispatchCopyDeviceIdAction,
  dispatchMyBetsSbkAddPreviousSelections,
}) => {
  const betInfoItems: BetInfoItem[] = [
    getBetInfoItemWithCopy(labels.betId, { label: betId, onCopy: dispatchCopyBetIdAction }),
  ];

  if (regulatorBetId) {
    betInfoItems.push(
      getBetInfoItemWithCopy(labels.regulatorBetId, {
        label: regulatorBetId,
        onCopy: dispatchCopyRegulatorBetIdAction,
      }),
    );
  }

  betInfoItems.push(placedDateItem);

  if (settledDateItem) {
    betInfoItems.push(settledDateItem);
  }

  if (deviceId) {
    betInfoItems.push(
      getBetInfoItemWithCopy(labels.deviceId, { label: deviceId, truncate: true, onCopy: dispatchCopyDeviceIdAction }),
    );
  }

  const onReUseSelectionsClick = useCallback(() => {
    if (betSelections?.length && product) {
      dispatchMyBetsSbkAddPreviousSelections(betSelections, product, isSettledView);
    }
  }, [product, betSelections, dispatchMyBetsSbkAddPreviousSelections, isSettledView]);

  return (
    <View {...getTestProps(SPORTSBOOK_BET_INFO_CARD, false)}>
      {!!betSelections?.length && product && showReuseSelectionsButton && (
        <>
          <View style={styles.reUseSelectionsButtonContainer}>
            <SportsbookBetButton
              animated={false}
              onClick={onReUseSelectionsClick}
              label={labels.reUseSelections}
              icon={SystemIconName.ACC_ADD}
            />
          </View>
          <Divider />
        </>
      )}
      <BetInfo items={betInfoItems} />
    </View>
  );
};

export default SportsbookBetInfoCard;
