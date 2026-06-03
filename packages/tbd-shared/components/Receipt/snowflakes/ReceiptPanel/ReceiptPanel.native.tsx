import type { FunctionComponent } from "react";
import { View } from "react-native";
import { ShadowedView } from "react-native-fast-shadow";
import { AlertType, BetDetailsAction, BetDetailsColor } from "@ppb/the-wall-common/types";

import { ReceiptTitle } from "@ppb/the-wall-native/components/BetReceipt/ReceiptTitle/ReceiptTitle";
import { Alert } from "@ppb/the-wall-native/components/Alert/Alert";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { BetSegments } from "@ppb/the-wall-native/components/BetReceipt/BetSegments/BetSegments";
import { BetDetails } from "@ppb/the-wall-native/components/BetDetails/BetDetails";
import styles from "./ReceiptPanel.native.styles";
import { RECEIPT_PANEL, RECEIPT, RECEIPT_PANEL_DROPSHADOW } from "./ReceiptPanel.native.selectors";
import { ReceiptPanelViewModel } from "./ReceiptPanel.types";
import { i18n } from "../../../../helpers/i18n";

export const ReceiptPanel: FunctionComponent<ReceiptPanelViewModel> = ({
  receiptTitle,
  detailTitle,
  detailSubtitle,
  segmentLeftValue,
  segmentLeftLabel,
  segmentRightValue,
  segmentRightLabel,
  buttonText,
  onDismissPress,
  errorMessage,
  errorDetail,
  children,
}) => (
  <ShadowedView style={styles.receiptDropShadow} {...getTestProps(RECEIPT_PANEL_DROPSHADOW, false)}>
    <View {...getTestProps(RECEIPT_PANEL, false)} style={styles.receipt}>
      <ReceiptTitle title={receiptTitle} buttonText={buttonText} onButtonPress={onDismissPress} />
      {!children && (
        <View style={styles.container}>
          {!errorMessage && (
            <View {...getTestProps(RECEIPT, false)} style={styles.betReceiptContainer}>
              <BetDetails
                title={detailTitle}
                subtitle={detailSubtitle}
                color={BetDetailsColor.Grey}
                action={BetDetailsAction.None}
                i18n={{
                  Remove: i18n({
                    key: "I18N.ACCESSIBILITY.REMOVE_BET_SELECTION",
                  }),
                  Edit: i18n({
                    key: "I18N.ACCESSIBILITY.EDIT_BET",
                  }),
                  None: i18n({
                    key: "I18N.ACCESSIBILITY.NO_ACTION_AVAILABLE",
                  }),
                }}
              />
              {segmentLeftValue && segmentLeftLabel && segmentRightValue && segmentRightLabel && (
                <View style={styles.segmentsWrap}>
                  <BetSegments
                    leftValue={segmentLeftValue}
                    leftLabel={segmentLeftLabel}
                    rightValue={segmentRightValue}
                    rightLabel={segmentRightLabel}
                  />
                </View>
              )}
            </View>
          )}
          {!!errorMessage && <Alert type={AlertType.Error} message={errorMessage} detail={errorDetail} />}
        </View>
      )}
      {children}
    </View>
  </ShadowedView>
);
