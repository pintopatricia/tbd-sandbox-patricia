import { FunctionComponent, useCallback } from "react";

import { BetInfoItem, BetInfoItemWithCopyOption, BetInfoItemMode } from "@ppb/the-wall-common/types";
import { BetInfo, Divider, SportsbookBetButton } from "@ppb/the-wall-web";
import { SystemIconName } from "@ppb/the-wall-icons";

import { ComponentProps } from "./props";
import styles from "./SportsbookBetInfoCard.web.css";

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
    <>
      {!!betSelections?.length && product && showReuseSelectionsButton && (
        <>
          <div className={styles.reUseSelectionsButtonContainer}>
            <SportsbookBetButton
              animated={false}
              onClick={onReUseSelectionsClick}
              label={labels.reUseSelections}
              icon={SystemIconName.ACC_ADD}
            />
          </div>
          <Divider />
        </>
      )}
      <BetInfo items={betInfoItems} />
    </>
  );
};

export default SportsbookBetInfoCard;
