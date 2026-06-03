import type { JSX } from "react";
import { FunctionComponent } from "react";
import { Modal, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Overlay } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import styles from "./Receipt.native.styles";
import { RECEIPT, RECEIPT_MODAL } from "./Receipt.native.selectors";
import { ReceiptPanel } from "./snowflakes/ReceiptPanel/ReceiptPanel.native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Receipt: FunctionComponent<ComponentProps> = ({
  entityURN,
  isLoggedIn,
  receiptTitle,
  detailTitle,
  detailSubtitle,
  segmentLeftLabel,
  segmentLeftValue,
  segmentRightLabel,
  segmentRightValue,
  buttonText,
  errorMessage,
  errorDetail,
  dispatchOnReceiptClose,
}): JSX.Element => {
  const insets = useSafeAreaInsets();

  const receiptContainer = (): JSX.Element => {
    const receiptContainerStyle = { flex: 1, marginBottom: insets.bottom || 0 };

    return (
      <View style={receiptContainerStyle}>
        {!!errorMessage && <Overlay />}
        <View style={styles.receiptPanel} {...getTestProps(RECEIPT, false)}>
          <ReceiptPanel
            receiptTitle={receiptTitle}
            detailTitle={detailTitle}
            detailSubtitle={detailSubtitle}
            segmentLeftLabel={segmentLeftLabel}
            segmentLeftValue={segmentLeftValue}
            segmentRightValue={segmentRightValue}
            segmentRightLabel={segmentRightLabel}
            buttonText={buttonText}
            errorMessage={errorMessage}
            errorDetail={errorDetail}
            onDismissPress={() => dispatchOnReceiptClose(entityURN)}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      {!!entityURN && (
        <>
          {/* We can't have more than one modal on the app at same time.
          To prevent this we only add Modal component when the user is logged in */}
          {isLoggedIn && (
            <GestureHandlerRootView>
              <Modal transparent {...getTestProps(RECEIPT_MODAL, false)}>
                {receiptContainer()}
              </Modal>
            </GestureHandlerRootView>
          )}
          {!isLoggedIn && receiptContainer()}
        </>
      )}
    </>
  );
};

export default Receipt;
