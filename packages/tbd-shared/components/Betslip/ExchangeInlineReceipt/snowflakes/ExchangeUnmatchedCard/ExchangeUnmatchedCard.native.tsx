import { FunctionComponent } from "react";
import { View } from "react-native";

import { ActionButtonOnTap } from "@ppb/the-wall-common/types";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Alerts, PrimaryButton, SecondaryButton } from "@ppb/the-wall-native";

import { PlacedBetCard } from "../PlacedBetCard/PlacedBetCard.native";
import { ExchangeUnmatchedCardViewModel } from "./ExchangeUnmatchedCard.types";
import {
  ACTIONS_CONTAINER,
  CANCEL,
  CONFIRM,
  EXCHANGE_UNMATCHED_CARD,
  NOTIFICATIONS,
} from "./ExchangeUnmatchedCard.native.selectors";

import styles from "./ExchangeUnmatchedCard.native.styles";

export const ExchangeUnmatchedCard: FunctionComponent<ExchangeUnmatchedCardViewModel> = ({
  price,
  stake,
  liability,
  profit,
  bonus,
  hasFreeBets,
  notifications,
  labels,
  onCancel,
  onEdit,
  type,
}) => {
  const hasActions = !!onCancel || !!onEdit;
  const isFullMode = !!onCancel && !!onEdit;
  const isCancelMode = !isFullMode && !!onCancel;
  const notificationsStyle = hasActions ? styles.notificationsSpaced : undefined;

  return (
    <PlacedBetCard
      price={price}
      stake={stake}
      liability={liability}
      profit={profit}
      bonus={bonus}
      hasFreeBets={hasFreeBets}
      labels={labels}
      type={type}
      {...getTestProps(EXCHANGE_UNMATCHED_CARD, false)}
    >
      <View style={notificationsStyle} {...getTestProps(NOTIFICATIONS, false)}>
        <Alerts alerts={notifications} />
      </View>
      {!!hasActions && (
        <View style={styles.actions} {...getTestProps(ACTIONS_CONTAINER, false)}>
          {(isCancelMode || isFullMode) && (
            <View style={styles.actionItemSecondary} {...getTestProps(CANCEL, false)}>
              <SecondaryButton label={labels.cancel} onTap={onCancel} />
            </View>
          )}
          {isFullMode && (
            <View style={styles.actionItem} {...getTestProps(CONFIRM, false)}>
              <PrimaryButton label={labels.confirm} onTap={onEdit as ActionButtonOnTap} />
            </View>
          )}
        </View>
      )}
    </PlacedBetCard>
  );
};
