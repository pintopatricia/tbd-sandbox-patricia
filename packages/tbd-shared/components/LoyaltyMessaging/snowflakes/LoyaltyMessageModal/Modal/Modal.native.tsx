import { FunctionComponent, useCallback } from "react";
import { View, Modal, TouchableWithoutFeedback, Image } from "react-native";
import { ActionLinkTypography } from "@ppb/the-wall-common/types";
import { ActionLink } from "@ppb/the-wall-native/components/ActionLink/ActionLink";
import { PrimaryButton, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ModalProps } from "./Modal.types";
import { styles } from "./Modal.native.styles";
import { OVERLAY, ACTION_LINK, PRIMARY_BUTTON, MODAL } from "./Modal.native.selectors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const ModalNative: FunctionComponent<ModalProps> = ({
  title,
  children,
  onDismiss,
  dismissOnOutsideTap = true,
  imageSrc,
  imageAlt,
  buttonText,
  onTap,
}) => {
  const onOverlayPress = useCallback(() => {
    if (dismissOnOutsideTap) {
      onDismiss();
    }
  }, [onDismiss, dismissOnOutsideTap]);

  const onCloseBtnPress = useCallback(() => onDismiss(), [onDismiss]);

  return (
    <GestureHandlerRootView>
      <Modal transparent animationType="fade" visible onRequestClose={onDismiss}>
        <TouchableWithoutFeedback onPress={onOverlayPress}>
          <View style={styles.overlay} {...getTestProps(OVERLAY, false)}>
            <View style={styles.modal} {...getTestProps(MODAL, false)}>
              {imageSrc && <Image style={styles.image} source={{ uri: imageSrc }} accessibilityLabel={imageAlt} />}
              <View style={styles.content}>
                <View>
                  <Text style={styles.title}>{title}</Text>
                  {children}
                </View>
                {buttonText && onTap && (
                  <View {...getTestProps(PRIMARY_BUTTON, false)}>
                    <PrimaryButton label={buttonText} onTap={onTap} stopAnimation />
                  </View>
                )}
                <View style={styles.actionLink} {...getTestProps(ACTION_LINK, false)}>
                  <ActionLink text="Dismiss" onClick={onCloseBtnPress} typography={ActionLinkTypography.Large} />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </GestureHandlerRootView>
  );
};
