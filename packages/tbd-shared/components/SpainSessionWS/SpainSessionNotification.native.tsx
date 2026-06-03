import { FunctionComponent } from "react";
import { View } from "react-native";
import { PrimaryButton, Text } from "@ppb/the-wall-native";
import styles from "./SpainSessionNotification.native.styles";
import { NotificationMessage } from "./utils";

type NotificationProps = {
  message: NotificationMessage;
  handleCloseNotification: () => void;
};

const SpainSessionNotification: FunctionComponent<NotificationProps> = ({
  message: { title, body, action },
  handleCloseNotification,
}) => (
  <View style={styles.popupBox}>
    <View style={styles.popupContent}>
      <Text style={styles.popupTitle}>{title}</Text>
      <Text style={styles.popupBody}>{body}</Text>
      <View style={styles.separator} />
      <View style={styles.buttonsContainer}>
        <PrimaryButton onTap={handleCloseNotification} label={action} />
      </View>
    </View>
  </View>
);

export default SpainSessionNotification;
