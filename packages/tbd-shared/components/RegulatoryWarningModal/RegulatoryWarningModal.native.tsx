import { useCallback, useEffect, useState } from "react";
import type { FunctionComponent, JSX } from "react";
import { ImageBackground, View } from "react-native";

import { navigate } from "@ppb/tbd-router";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { GenericIcon, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Styled, Text, CustomModal } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import styles from "./RegulatoryWarningModal.native.styles";
import type { ComponentProps } from "./props";

import {
  REGULATORY_WARNING_CONTAINER,
  REGULATORY_WARNING_TITLE,
  REGULATORY_WARNING_MESSAGE_TITLE,
  REGULATORY_WARNING_MESSAGE_LINK,
} from "./RegulatoryWarningModal.native.selectors";

const AUTO_DISMISS_TIMEOUT_MS = 5000;
const ITALIC_CLIP_SPACE_FIX = " "; // Adding space to fix Font italic clipped on Android

const createRegulatoryWarningCustomRender = (handleLinkPress: () => void) => ({
  link: (text: string): JSX.Element => (
    <Text
      style={styles.warningMessageLink}
      onPress={handleLinkPress}
      key={REGULATORY_WARNING_MESSAGE_LINK}
      {...getTestProps(REGULATORY_WARNING_MESSAGE_LINK)}
    >
      {text}
    </Text>
  ),
});

const RegulatoryWarningModal: FunctionComponent<ComponentProps> = ({
  labels,
  warningMessageLink,
}): JSX.Element | null => {
  const [displayModal, setDisplayModal] = useState(true);

  useEffect(() => {
    const autoDismissTimeout = setTimeout(() => {
      setDisplayModal(false);
    }, AUTO_DISMISS_TIMEOUT_MS);

    return () => {
      clearTimeout(autoDismissTimeout);
    };
  }, []);

  const onDismiss = useCallback(() => {
    setDisplayModal(false);
  }, []);

  const handleLinkPress = useCallback(() => {
    navigate({
      viewUrn: EntityType.ExternalView,
      viewUrl: `${warningMessageLink}`,
      viewDisplayMode: DisplayMode.BlankInapp,
    });
  }, [warningMessageLink]);

  if (!displayModal || !labels.warningMessageText || !warningMessageLink) {
    return null;
  }

  return (
    <CustomModal title={labels.modalTitle} dismissOnOutsideTap={false} onDismiss={onDismiss}>
      <View style={styles.modalContent}>
        <ImageBackground
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require("../../assets/images/regulatory-warning-modal-background.png")}
          resizeMode={"cover"}
          style={styles.modalContentWrapper}
          {...getTestProps(REGULATORY_WARNING_CONTAINER, false)}
        >
          <View style={styles.modalContentHeader}>
            <View style={styles.modalContentHeaderIcon}>
              <GenericIcon name={IconsList.SAFER_GAMBLING} color={styles.modalContentHeaderIcon.color} />
            </View>
            <Text style={styles.modalContentHeaderTitle} {...getTestProps(REGULATORY_WARNING_TITLE)}>
              {ITALIC_CLIP_SPACE_FIX}
              {labels.modalContentHeaderTitle}
            </Text>
          </View>
          <View style={styles.warningMessageOuterBorder}>
            <View style={styles.warningMessageContainer}>
              <Text style={styles.warningMessageTitle} {...getTestProps(REGULATORY_WARNING_MESSAGE_TITLE)}>
                {labels.warningMessageTitle}
              </Text>
              <Text style={styles.warningMessageText}>
                <Styled
                  translation={labels.warningMessageText}
                  customRender={createRegulatoryWarningCustomRender(handleLinkPress)}
                />
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </CustomModal>
  );
};

export default RegulatoryWarningModal;
