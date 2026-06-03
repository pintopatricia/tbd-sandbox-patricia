import type { JSX } from "react";
import { FunctionComponent, useCallback, useEffect, useRef } from "react";
import { Snackbar } from "@ppb/the-wall-web";
import { LOYALTY_MESSAGES_TYPE } from "@ppb/tbd-store/state/constants";
import { LoyaltyMessageFullScreenTemplate } from "@ppb/tbd-store/state/entities/loyalty-messaging/LoyaltyMessaging.types";
import { ComponentProps } from "./props";
import { LOYALTY_MESSAGE_DISMISS_TIMEOUT } from "../../config/loyalty-messaging";
import { getModalParams, getParsedUrl, getTcUrl, getToastParams, isValidMessage } from "./LoyaltyMessaging.helper";
import styles from "./LoyaltyMessaging.web.css";
import { getPromoUrlWithReturnURL } from "../../helpers/promotion-helper";
import { LoyaltyMessageModal } from "./snowflakes/LoyaltyMessageModal/LoyaltyMessageModal.web";

const LoyaltyMessaging: FunctionComponent<ComponentProps> = ({
  message,
  userDetails,
  dispatchAcknowledgeMessage,
  dispatchExternalPushAction,
  dispatchDismissMessage,
}) => {
  const messageDismissTimeoutHandler = useRef<ReturnType<typeof setTimeout> | null>(null);

  const acknowledgeLoyaltyMessage = useCallback(() => {
    const messageContent = message?.content;

    if (!message?.acknowledged && messageContent) {
      dispatchAcknowledgeMessage(messageContent);
    }
  }, [dispatchAcknowledgeMessage, message]);

  const dismissMessage = useCallback(() => {
    if (messageDismissTimeoutHandler.current) {
      clearTimeout(messageDismissTimeoutHandler.current);
      messageDismissTimeoutHandler.current = null;
    }

    const content = message?.content;

    if (content) {
      dispatchDismissMessage(content);
    }
  }, [dispatchDismissMessage, message]);

  const onClickHandler = useCallback(() => {
    const fullScreenTemplate = message?.content?.message?.template as LoyaltyMessageFullScreenTemplate;

    if (fullScreenTemplate?.buttonUrl) {
      const url = getParsedUrl(fullScreenTemplate.buttonUrl, `//${window.location.hostname}`);

      if (url && dispatchExternalPushAction) {
        dispatchExternalPushAction(url);
      }
    }
  }, [dispatchExternalPushAction, message]);

  const onTcClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      const messageContent = message?.content;

      if (messageContent && userDetails) {
        const { tcUrl } = getTcUrl(messageContent, userDetails);

        if (tcUrl && dispatchExternalPushAction) {
          const tcUrlWithReturn = getPromoUrlWithReturnURL(tcUrl, window.location.href);
          dispatchExternalPushAction(tcUrlWithReturn);
        }
      }
    },
    [dispatchExternalPushAction, message, userDetails],
  );

  const getMessageTemplate = useCallback((): JSX.Element | null => {
    const messageContent = message?.content;

    if (!userDetails || !message || !message.isDisplayed || !messageContent || !isValidMessage(messageContent)) {
      return null;
    }

    switch (messageContent.message.displayType) {
      case LOYALTY_MESSAGES_TYPE.TOAST: {
        const messageTemplate = getToastParams(messageContent, userDetails);

        return (
          <div className={styles.toastContainer}>
            <Snackbar
              externalIcon={messageTemplate.icon}
              bigIcon={true}
              centeredIcon={true}
              title={messageTemplate.header}
              description={messageTemplate.text}
              onClose={dismissMessage}
            />
          </div>
        );
      }
      case LOYALTY_MESSAGES_TYPE.FULL_SCREEN: {
        const messageTemplate = getModalParams(messageContent, userDetails);

        return (
          <div>
            <LoyaltyMessageModal
              title={messageTemplate.header}
              message={messageTemplate.text}
              onDismiss={dismissMessage}
              tcText={messageTemplate.tcText}
              tcUrl={messageTemplate.tcUrl}
              onTcClick={onTcClick}
              buttonText={messageTemplate.buttonText}
              onTap={onClickHandler}
              imageSrc={messageTemplate.image}
              imageAlt={messageTemplate.imageAlt}
            />
          </div>
        );
      }
      default:
        return null;
    }
  }, [message, userDetails, dismissMessage, onTcClick, onClickHandler]);

  useEffect(() => {
    if (message && message.isDisplayed && message.content?.message.displayType === LOYALTY_MESSAGES_TYPE.TOAST) {
      messageDismissTimeoutHandler.current = setTimeout(dismissMessage, LOYALTY_MESSAGE_DISMISS_TIMEOUT);
    }
  }, [dismissMessage, message, messageDismissTimeoutHandler]);

  useEffect(() => {
    if (message && message.isDisplayed) {
      acknowledgeLoyaltyMessage();
    }
  }, [message, acknowledgeLoyaltyMessage]);

  return getMessageTemplate();
};

export default LoyaltyMessaging;
