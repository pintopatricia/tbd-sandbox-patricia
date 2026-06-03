import { FunctionComponent, ReactNode } from "react";
import { Pressable, View } from "react-native";

import { CounterColor } from "@ppb/the-wall-common/types";
import { Styled, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { tokens } from "@ppb/the-wall-common/base-theme";

import { Minimized } from "../Minimized/Minimized.native";
import { i18n } from "../../../../../helpers/i18n";
import {
  MINIMIZED_ERROR_TITLE,
  MINIMIZED_STRONG_TITLE,
  MINIMIZED_WEAK_TITLE,
} from "../../RootBetslip.native.selectors";
import styles from "./CollapsedView.native.styles";
import {
  BETSLIP_COLLAPSED_VIEW,
  BETSLIP_COLLAPSED_VIEW_CONTENT,
  BETSLIP_COLLAPSED_VIEW_ACTION,
} from "./CollapsedView.native.selectors";
import { ComponentProps } from "./props";

const sportsbookMinimizedTitleStyle = {
  stake: styles.minimizedTitle,
  odds: styles.minimizedTitle,
  potentialReturns: styles.minimizedTitle,
};

function buildSportsbookMinimizedTitle({ isConfirm, title }: ComponentProps): ReactNode {
  if (isConfirm) {
    return (
      <View style={styles.row}>
        <Text
          {...getTestProps(MINIMIZED_STRONG_TITLE)}
          style={styles.minimizedTitle}
          accessibilityRole="summary"
          numberOfLines={2}
        >
          {i18n({ key: "I18N.BETSLIP.TITLE" })}
        </Text>
        <Text
          {...getTestProps(MINIMIZED_WEAK_TITLE)}
          style={styles.minimizedSupportingText}
          accessibilityRole="summary"
        >{` - ${i18n({
          key: "I18N.BETSLIP.CONFIRM_SELECTIONS",
        })}`}</Text>
      </View>
    );
  }

  if (title) {
    return (
      <Styled
        style={styles.minimizedSupportingText}
        numberOfLines={2}
        translation={title}
        styles={sportsbookMinimizedTitleStyle}
      />
    );
  }

  return (
    <Text
      {...getTestProps(MINIMIZED_STRONG_TITLE)}
      style={styles.minimizedTitle}
      accessibilityRole="summary"
      numberOfLines={2}
    >
      {i18n({ key: "I18N.BETSLIP.TITLE" })}
    </Text>
  );
}

function buildObbMinimizedTitle({ totalSelections }: ComponentProps): ReactNode {
  if (totalSelections === 1) {
    return (
      <View style={styles.row}>
        <Text {...getTestProps(MINIMIZED_STRONG_TITLE)} style={styles.minimizedTitle} accessibilityRole="summary">
          {i18n({ key: "I18N.OBB_BETSLIP.TITLE" })}
        </Text>
        <Text
          {...getTestProps(MINIMIZED_WEAK_TITLE)}
          style={styles.minimizedSupportingText}
          accessibilityRole="summary"
        >{` - ${i18n({
          key: "I18N.BETSLIP.ADD_MORE_SELECTIONS",
        })}`}</Text>
      </View>
    );
  }

  return (
    <Text {...getTestProps(MINIMIZED_STRONG_TITLE, false)} style={styles.minimizedTitle} accessibilityRole="summary">
      {i18n({ key: "I18N.OBB_BETSLIP.TITLE" })}
    </Text>
  );
}

function buildMinimized(props: ComponentProps) {
  const { activeBetslipType, hasFailures, totalSelections } = props;

  if (hasFailures) {
    return (
      <Minimized counter={totalSelections} color={CounterColor.BlackAlternative}>
        <Text {...getTestProps(MINIMIZED_ERROR_TITLE, false)} style={styles.minimizedTitle} numberOfLines={2}>
          {i18n({ key: "I18N.BETSLIP.NOT_COMBINABLE" })}
        </Text>
      </Minimized>
    );
  }

  if (activeBetslipType === BetslipType.OBB) {
    return (
      <Minimized counter={totalSelections} color={CounterColor.Teal}>
        {buildObbMinimizedTitle(props)}
      </Minimized>
    );
  }

  return (
    <Minimized counter={totalSelections} color={CounterColor.Teal}>
      {buildSportsbookMinimizedTitle(props)}
    </Minimized>
  );
}

export const CollapsedView: FunctionComponent<ComponentProps> = (props) => {
  const { onClick } = props;

  return (
    <Pressable style={styles.container} onPress={onClick} {...getTestProps(BETSLIP_COLLAPSED_VIEW, false)}>
      <View style={styles.content} {...getTestProps(BETSLIP_COLLAPSED_VIEW_CONTENT, false)}>
        {buildMinimized(props)}
      </View>
      <View style={styles.action} {...getTestProps(BETSLIP_COLLAPSED_VIEW_ACTION, false)}>
        <View style={styles.actionIcon}>
          <GenericIcon name={SystemIconName.CHEVRON_UP} color={tokens.ExpandableIconColour} />
        </View>
      </View>
    </Pressable>
  );
};
