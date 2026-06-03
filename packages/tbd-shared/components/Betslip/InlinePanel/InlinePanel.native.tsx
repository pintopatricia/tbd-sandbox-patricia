import { FunctionComponent } from "react";
import { Pressable, View } from "react-native";

import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Text } from "@ppb/the-wall-native/components/Text/Text";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { InlinePanelColor, InlinePanelViewModel } from "./InlinePanel.types";
import { ACTION, CONTENT, INLINE_PANEL, TITLE_PREFIX, TITLE } from "./InlinePanel.native.selectors";

import styles from "./InlinePanel.native.styles";

export const InlinePanel: FunctionComponent<InlinePanelViewModel> = ({
  titlePrefix,
  title,
  color,
  onAction,
  children,
}) => {
  const panelStyles = [
    styles.inlinePanel,
    color === InlinePanelColor.Pink && styles.inlinePanelPink,
    color === InlinePanelColor.Blue && styles.inlinePanelBlue,
  ];

  return (
    <View style={panelStyles} {...getTestProps(INLINE_PANEL, false)}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {titlePrefix && (
            <Text style={styles.titlePrefix} {...getTestProps(TITLE_PREFIX)}>
              {titlePrefix}:
            </Text>
          )}
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail" {...getTestProps(TITLE)}>
            {title}
          </Text>
        </View>
        <Pressable style={styles.action} {...getTestProps(ACTION, false)} onPress={onAction}>
          <GenericIcon name={SystemIconName.CLOSE} color={tokens.NeutralsIconDefault} />
        </Pressable>
      </View>
      <View style={styles.content} {...getTestProps(CONTENT, false)}>
        {children}
      </View>
    </View>
  );
};
