import type { JSX } from "react";
import { FunctionComponent, useCallback, useEffect, useRef } from "react";
import { AppState, NativeEventSubscription, Platform, View } from "react-native";
import { Snackbar } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { LoyaltyMessageFullScreenTemplate } from "@ppb/tbd-store/state/entities/loyalty-messaging/LoyaltyMessaging.types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { navigate } from "@ppb/tbd-router/native";
import { LOYALTY_MESSAGES_TYPE } from "@ppb/tbd-store/state/constants";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { LoyaltyMessageModal } from "./snowflakes/LoyaltyMessageModal/LoyaltyMessageModal.native";
import { ComponentProps } from "./props";
import { TOAST, MODAL } from "./LoyaltyMessaging.native.selectors";
import { LOYALTY_MESSAGE_DISMISS_TIMEOUT } from "../../config/loyalty-messaging";
import { getModalParams, getParsedUrl, getTcUrl, getToastParams, isValidMessage } from "./LoyaltyMessaging.helper";
import styles from "./LoyaltyMessaging.native.styles";
import { getExternalLink } from "../../helpers/external-links";

const LoyaltyMessaging: FunctionComponent<ComponentProps> = ({
  message,
  userDetails,
  dispatchAcknowledgeMessage,
  dispatchAppVisibilityChange,
  dispatchDismissMessage,
  basePath,
}) => {
  const messageDismissTimeoutHandler = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appStateSubscription = useRef<NativeEventSubscription>(undefined);

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

    if (fullScreenTemplate?.buttonUrl && basePath) {
      const [, ...domainParts] = basePath.split(".");
      const domain = domainParts.join(".").replace("/", "");

      const parsedBasePath = `https://www.${domain}`;
      const viewUrl = getParsedUrl(fullScreenTemplate.buttonUrl, parsedBasePath);

      const isLoyaltyClubTrackerSpecific =
        viewUrl === getExternalLink("LOYALTY_CLUB", userDetails?.jurisdiction.jurisdiction);

      const containsPlayerProtection = /playerprotection\./.test(viewUrl);

      navigate({
        viewUrl,
        viewUrn: EntityType.ExternalView,
        viewDisplayMode:
          isLoyaltyClubTrackerSpecific || containsPlayerProtection ? DisplayMode.BlankWebview : DisplayMode.BlankInapp,
      });
      if ((isLoyaltyClubTrackerSpecific || containsPlayerProtection) && Platform.OS === "android") {
        dismissMessage();
      }
    }
  }, [message, basePath, dismissMessage, userDetails?.jurisdiction]);

  const onTcClick = useCallback(() => {
    const messageContent = message?.content;

    if (messageContent && userDetails) {
      const { tcUrl: viewUrl } = getTcUrl(messageContent, userDetails);

      if (viewUrl) {
        navigate({
          viewUrl,
          viewUrn: EntityType.ExternalView,
          viewDisplayMode: DisplayMode.BlankInapp,
        });
      }
    }
  }, [message, userDetails]);

  const getMessageTemplate = useCallback((): JSX.Element | null => {
    const messageContent = message?.content;

    if (!userDetails || !message || !message.isDisplayed || !messageContent || !isValidMessage(messageContent)) {
      return null;
    }

    switch (messageContent.message.displayType) {
      case LOYALTY_MESSAGES_TYPE.TOAST: {
        const messageTemplate = getToastParams(messageContent, userDetails);

        return (
          <View {...getTestProps(TOAST, false)} style={styles.messageContainer}>
            <Snackbar
              externalIcon={messageTemplate.icon}
              bigIcon={true}
              centeredIcon={true}
              title={messageTemplate.header}
              description={messageTemplate.text}
              onClose={dismissMessage}
            />
          </View>
        );
      }
      case LOYALTY_MESSAGES_TYPE.FULL_SCREEN: {
        const messageTemplate = getModalParams(messageContent, userDetails);

        return (
          <View {...getTestProps(MODAL, false)}>
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
          </View>
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

  useEffect(() => {
    if (!appStateSubscription.current && dispatchAppVisibilityChange) {
      appStateSubscription.current = AppState.addEventListener("change", (nextAppState) => {
        dispatchAppVisibilityChange(!nextAppState.match(/inactive|background/));
      });
    }

    return () => appStateSubscription.current?.remove();
  }, [appStateSubscription, dispatchAppVisibilityChange]);

  return getMessageTemplate();
};

export default LoyaltyMessaging;
