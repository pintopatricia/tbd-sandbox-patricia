import { FC, useCallback, useEffect, useState } from "react";
import { DeviceEventEmitter, View } from "react-native";

import { PYWEventActions } from "@ppb/tbd-store/state/entities/PaymentsWeb.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { colors } from "@ppb/the-wall-common/base-theme";

import { goBack } from "@ppb/tbd-router/native";
import { Text } from "@ppb/the-wall-native";
import { ComponentProps } from "./props";
import * as selectors from "./Transactions.native.selectors";
import styles from "./Transactions.native.styles";

const DEPOSIT_SUCCESSFUL_MSG_TIMEOUT = 3000;

/**
 * Handles logic for the succesful deposit event
 */
const useDepositSuccess = (isDepositRedirect: boolean, dispatchDepositSuccessful: () => void): boolean => {
  const [showDepositSuccess, setShowDepositSuccess] = useState(false);

  useEffect(() => {
    const eventSubscription = DeviceEventEmitter.addListener(PYWEventActions.DEPOSIT_SUCCESS, () => {
      if (!isDepositRedirect) {
        return;
      }

      setShowDepositSuccess(true);
      goBack(); // dismiss deposit screen
      dispatchDepositSuccessful();

      setTimeout(() => {
        setShowDepositSuccess(false);
      }, DEPOSIT_SUCCESSFUL_MSG_TIMEOUT);
    });

    return () => {
      eventSubscription?.remove();
    };
  }, [isDepositRedirect, setShowDepositSuccess, dispatchDepositSuccessful]);

  return showDepositSuccess;
};

const noop = (): void => {};

/**
 * Transactions refers to Deposit & Place.
 * After a successful deposit, show info screen and request bet placement.
 */
export const Transactions: FC<ComponentProps> = ({
  labels,
  isDepositRedirect,
  activeProduct,
  origin,
  excRunner,
  excMarket,
  excBetId,
  dispatchSbkDepositSuccessful,
  dispatchExcDepositSuccessful,
}) => {
  const dispatchDepositSuccessful = useCallback(() => {
    if (activeProduct === "SPORTSBOOK") {
      return dispatchSbkDepositSuccessful();
    }

    if (activeProduct === "EXCHANGE" && (origin === "PLACE_POTENTIAL" || origin === "CONFIRM_POTENTIAL") && excRunner) {
      return dispatchExcDepositSuccessful(origin, excRunner);
    }

    if (activeProduct === "EXCHANGE" && origin === "EDIT_UNMATCHED" && excRunner && excMarket && excBetId) {
      return dispatchExcDepositSuccessful(origin, excRunner, excMarket, excBetId);
    }

    return noop;
  }, [
    activeProduct,
    dispatchSbkDepositSuccessful,
    dispatchExcDepositSuccessful,
    origin,
    excRunner,
    excMarket,
    excBetId,
  ]);

  const showDepositSuccess = useDepositSuccess(isDepositRedirect, dispatchDepositSuccessful);

  if (!showDepositSuccess) {
    return null;
  }

  return (
    <View {...getTestProps(selectors.TRANSACTIONS, false)} style={styles.banner}>
      <View style={styles.wrap}>
        <View style={styles.icon} {...getTestProps(selectors.TRANSACTIONS_ICON_ID, false)}>
          <GenericIcon name={SystemIconName.NOTIFICATION_SUCCESS} color={colors.MessagingSuccessIconDefault} />
        </View>
        <Text style={styles.title} {...getTestProps(selectors.TRANSACTIONS_TITLE_ID)}>
          {labels.depositSuccessful}
        </Text>
        <Text style={styles.subtitle} {...getTestProps(selectors.TRANSACTIONS_SUBTITLE_ID)}>
          {labels.placingBet}
        </Text>
      </View>
    </View>
  );
};
