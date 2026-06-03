import { FunctionComponent, useCallback, useState } from "react";
import { FullScreenModal } from "@ppb/the-wall-web";
import { GenericView, GenericViewPlaceholder } from "../GenericView/GenericView.web";
import ConnectedGenericView from "../GenericView";
import { ComponentProps } from "./props";

const ImsPromotionModal: FunctionComponent<ComponentProps> = ({ view, title, returnViewLink, dispatchGoBack }) => {
  const [isModalClosed, setIsModalClosed] = useState(false);

  const setModalAsClosed = useCallback(() => {
    dispatchGoBack(returnViewLink);
    setIsModalClosed(true);
  }, [dispatchGoBack, setIsModalClosed, returnViewLink]);

  return (
    <div>
      {!isModalClosed && (
        <FullScreenModal title={title} onDismiss={setModalAsClosed} showHeaderAndBottomBar={true}>
          {/* {/*
      // @ts-expect-error TODO Universal integration with placeholders still break on ts-jest */}
          <ConnectedGenericView urn={view} component={GenericView} placeholder={GenericViewPlaceholder} />
        </FullScreenModal>
      )}
    </div>
  );
};

export default ImsPromotionModal;
