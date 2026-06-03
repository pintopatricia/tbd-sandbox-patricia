import type { FunctionComponent } from "react";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { colors } from "@ppb/the-wall-common/base-theme";
import { RichTextType } from "@ppb/the-wall-common/types";
import { BottomSheet, RichTextComponent, Switch, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { i18n } from "../../../helpers/i18n";
import { ComponentProps } from "./props";
import styles from "./MatchMe.native.styles";
import {
  MATCH_ME,
  MATCH_ME_INFO_ICON,
  MATCH_ME_LABEL,
  MATCH_ME_ODDS_RANGE,
  MATCH_ME_TOGGLE,
} from "./MatchMe.native.selectors";

const infoModalContent = [
  { text: i18n({ key: "I18N.MATCH_ME.MODAL.CONTENT.HEADING_1" }), type: RichTextType.HEADING3 },
  { text: i18n({ key: "I18N.MATCH_ME.MODAL.CONTENT.TEXT_1" }), type: RichTextType.PARAGRAPH },
  { text: i18n({ key: "I18N.MATCH_ME.MODAL.CONTENT.HEADING_2" }), type: RichTextType.HEADING3 },
  { text: i18n({ key: "I18N.MATCH_ME.MODAL.CONTENT.TEXT_2" }), type: RichTextType.PARAGRAPH },
];

const MatchMe: FunctionComponent<ComponentProps> = ({ isEnabled, oddsRange, label, onToggle }) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleInfoOpen = () => setIsInfoModalOpen(true);
  const handleInfoClose = () => setIsInfoModalOpen(false);

  return (
    <>
      <View {...getTestProps(MATCH_ME, false)} style={styles.container}>
        <Pressable {...getTestProps(MATCH_ME_INFO_ICON, false)} onPress={handleInfoOpen} style={styles.infoIcon}>
          <GenericIcon name={SystemIconName.NOTIFICATION_INFO} color={colors.ActionTertiaryIconDefault} />
        </Pressable>
        <View style={styles.content}>
          <View style={styles.textContent}>
            <Text {...getTestProps(MATCH_ME_LABEL, false)} style={styles.label}>
              {label}
            </Text>
            {oddsRange && (
              <Text {...getTestProps(MATCH_ME_ODDS_RANGE, false)} style={styles.oddsRange}>
                {i18n({
                  key: "I18N.MATCH_ME.ODDS_RANGE",
                  interpolationValues: { min: oddsRange.min, max: oddsRange.max },
                })}
              </Text>
            )}
          </View>
          <View {...getTestProps(MATCH_ME_TOGGLE, false)}>
            <Switch isChecked={isEnabled} onChange={onToggle} />
          </View>
        </View>
      </View>
      {isInfoModalOpen && (
        <BottomSheet
          showOverlay
          withModal
          title={i18n({ key: "I18N.MATCH_ME.MODAL.TITLE" })}
          onHeaderIconTap={handleInfoClose}
        >
          <RichTextComponent list={infoModalContent} />
        </BottomSheet>
      )}
    </>
  );
};

export default MatchMe;
