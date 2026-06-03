import { FunctionComponent, useEffect, useCallback } from "react";
import { Modal } from "@ppb/the-wall-web";
import { ComponentProps } from "./props";

const WebMessagePopup: FunctionComponent<ComponentProps> = ({
  webMessage,
  dispatchFetchWebMessages,
  dispatchReadWebMessage,
}) => {
  useEffect(() => {
    dispatchFetchWebMessages();
  }, [dispatchFetchWebMessages]);

  const onDismiss = useCallback(() => {
    if (webMessage?.urn) {
      dispatchReadWebMessage(webMessage?.urn);
    }
  }, [dispatchReadWebMessage, webMessage?.urn]);

  return (
    <>
      {webMessage && (
        <Modal title={""} onDismiss={onDismiss}>
          {webMessage.templateUrl ? (
            <iframe
              src={webMessage.templateUrl}
              title={webMessage.title || ""}
              width={webMessage.templateWidth}
              height={webMessage.templateHeight}
            />
          ) : (
            <></>
          )}
        </Modal>
      )}
    </>
  );
};

export default WebMessagePopup;
