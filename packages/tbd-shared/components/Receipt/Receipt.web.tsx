import type { JSX } from "react";
import { FunctionComponent } from "react";
import { Overlay } from "@ppb/the-wall-web";
import { useDisableBodyScroll } from "@ppb/the-wall-web/hooks/useDisableBodyScroll";
import { ComponentProps } from "./props";
import styles from "./Receipt.web.css";
import { ReceiptPanel } from "./snowflakes/ReceiptPanel/ReceiptPanel.web";

const Receipt: FunctionComponent<ComponentProps> = ({
  entityURN,
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
  // Block the interaction with body when an error message appears
  useDisableBodyScroll(!!errorMessage);

  return (
    <>
      {entityURN && (
        <div className={styles.receiptPanel}>
          {errorMessage ? <Overlay fullPageOverlay={true} /> : null}
          <div className={styles.receipt}>
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
          </div>
        </div>
      )}
    </>
  );
};

export default Receipt;
