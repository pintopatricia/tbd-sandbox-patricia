import { FunctionComponent, memo, useMemo } from "react";
import { Pressable, View } from "react-native";
import { ShadowedView } from "react-native-fast-shadow";

import { SportIcon } from "@ppb/the-wall-icons/SportIcon/SportIcon";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { StatusLabel, Text } from "@ppb/the-wall-native";

import { FreezeCardProps, FreezeCardStates, FreezeCardStatuses, getStatusLabelData } from "./shared";
import styles from "./FreezeCard.native.styles";
import {
  FREEZE_CARD,
  FREEZE_CARD_TOP,
  FREEZE_CARD_BOTTOM,
  FREEZE_CARD_DIVIDER,
  FREEZE_CARD_CONTENT,
  FREEZE_CARD_DYNAMIC,
  FREEZE_CARD_ICON,
  FREEZE_CARD_LABEL,
  FREEZE_CARD_CONTENT_TEXT,
  FREEZE_CARD_STATUS_LABEL,
  FREEZE_DROP_SHADOW,
} from "./FreezeCard.native.selectors";

export const FreezeCard: FunctionComponent<FreezeCardProps> = memo(
  ({ status, state, statusLabel, text, contentText, children, onClick }) => {
    const freezeCardStyle = useMemo(
      () => [
        styles.freezeCard,
        state === FreezeCardStates.SUSPENDED && styles.freezeCardSuspended,
        state === FreezeCardStates.ACTIVE && styles.freezeCardActive,
        state === FreezeCardStates.SELECTED && styles.freezeCardSelected,
        state === FreezeCardStates.INELIGIBLE && styles.freezeCardIneligible,
        status === FreezeCardStatuses.FINISHED && styles.freezeCardFinished,
      ],
      [state, status],
    );

    const iconColour = useMemo(() => {
      if (status === FreezeCardStatuses.FINISHED) return tokens.FreezeCardFinishedIconColour;

      if (state === FreezeCardStates.SUSPENDED) return tokens.FreezeCardSuspendedIconColour;
      if (state === FreezeCardStates.ACTIVE) return tokens.FreezeCardActiveIconColour;
      if (state === FreezeCardStates.SELECTED) return tokens.FreezeCardSelectedIconColour;
      if (state === FreezeCardStates.INELIGIBLE) return tokens.FreezeCardIneligibleIconColour;

      return tokens.FreezeCardDefaultIconColour;
    }, [state, status]);

    const labelStyle = useMemo(
      () => [
        styles.label,
        state === FreezeCardStates.SUSPENDED && styles.labelSuspended,
        state === FreezeCardStates.ACTIVE && styles.labelActive,
        state === FreezeCardStates.SELECTED && styles.labelSelected,
        state === FreezeCardStates.INELIGIBLE && styles.labelIneligible,
        status === FreezeCardStatuses.FINISHED && styles.labelFinished,
      ],
      [state, status],
    );

    const contentTextStyle = useMemo(
      () => [
        styles.contentText,
        state === FreezeCardStates.SUSPENDED && styles.contentTextSuspended,
        state === FreezeCardStates.ACTIVE && styles.contentTextActive,
        state === FreezeCardStates.SELECTED && styles.contentTextSelected,
        state === FreezeCardStates.INELIGIBLE && styles.contentTextIneligible,
        status === FreezeCardStatuses.FINISHED && styles.contentTextFinished,
      ],
      [state, status],
    );

    const statusLabelData = getStatusLabelData(state, status);

    return (
      <ShadowedView style={styles.dropShadow} {...getTestProps(FREEZE_DROP_SHADOW, false)}>
        <Pressable {...getTestProps(FREEZE_CARD)} style={freezeCardStyle} onPress={onClick}>
          <View {...getTestProps(FREEZE_CARD_TOP, false)} style={styles.top}>
            {children}
          </View>
          <View {...getTestProps(FREEZE_CARD_BOTTOM, false)} style={styles.bottom}>
            <View {...getTestProps(FREEZE_CARD_DIVIDER, false)} style={styles.divider} />

            <View {...getTestProps(FREEZE_CARD_CONTENT, false)} style={styles.content}>
              <View {...getTestProps(FREEZE_CARD_DYNAMIC, false)} style={styles.dynamic}>
                <View {...getTestProps(FREEZE_CARD_ICON, false)} style={styles.icon}>
                  <SportIcon sportId="1" color={iconColour} />
                </View>
                <Text
                  {...getTestProps(FREEZE_CARD_LABEL, false)}
                  style={labelStyle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {text}
                </Text>
                <Text {...getTestProps(FREEZE_CARD_CONTENT_TEXT, false)} style={contentTextStyle}>
                  {contentText}
                </Text>
              </View>

              {statusLabel && (
                <View {...getTestProps(FREEZE_CARD_STATUS_LABEL, false)} style={styles.statusLabel}>
                  {statusLabelData && <StatusLabel {...statusLabelData} />}
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </ShadowedView>
    );
  },
  (prev, next) =>
    prev.contentText === next.contentText &&
    prev.state === next.state &&
    prev.status === next.status &&
    prev.statusLabel === next.statusLabel &&
    prev.text === next.text,
);
FreezeCard.displayName = "FreezeCard";
