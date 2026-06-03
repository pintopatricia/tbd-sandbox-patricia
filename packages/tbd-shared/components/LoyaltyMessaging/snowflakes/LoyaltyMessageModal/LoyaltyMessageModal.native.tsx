import { FunctionComponent } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@ppb/the-wall-native";
import { ModalNative } from "./Modal/Modal.native";
import { LoyaltyMessageModalProps } from "./LoyaltyMessageModal.types";
import styles from "./LoyaltyMessageModal.native.styles";

export const LoyaltyMessageModal: FunctionComponent<LoyaltyMessageModalProps> = ({
  title,
  message,
  onDismiss,
  tcText,
  tcUrl,
  onTcClick,
  buttonText,
  onTap,
  imageSrc,
  imageAlt,
  onInit,
}) => {
  if (onInit) {
    setTimeout(() => {
      onInit();
    }, 0);
  }

  return (
    <View style={styles.modalContainer}>
      <ModalNative
        title={title}
        onDismiss={onDismiss}
        dismissOnOutsideTap={false}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        buttonText={buttonText}
        onTap={onTap}
      >
        <View style={styles.messageContainer}>
          {message && <Text style={styles.message}>{message}</Text>}
          {!!tcText && !!tcUrl && onTcClick && (
            <Pressable onPress={onTcClick} style={styles.ctaButtonContainer}>
              <Text style={styles.tcLink}>{tcText}</Text>
            </Pressable>
          )}
        </View>
      </ModalNative>
    </View>
  );
};
