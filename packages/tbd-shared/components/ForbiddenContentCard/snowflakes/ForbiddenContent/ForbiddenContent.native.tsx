import { ComponentTheme } from "@ppb/the-wall-common/types";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import type { JSX, FunctionComponent } from "react";
import { type TextProps, View } from "react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ForbiddenCardSize, type ForbiddenContentBaseProps } from "./ForbiddenContent.types";
import { FORBIDDEN_CONTENT, FORBIDDEN_CONTENT_LABEL_CONTAINER } from "./ForbiddenContent.native.selectors";
import styles, { darkTheme, lightTheme, cardSize } from "./ForbiddenContent.native.styles";

export type ForbiddenContentProps = {
  content: (labelStyles: TextProps["style"], linkStyles: TextProps["style"]) => JSX.Element;
} & ForbiddenContentBaseProps;

export const ForbiddenContent: FunctionComponent<ForbiddenContentProps> = ({
  content,
  theme = ComponentTheme.Dark,
  size = ForbiddenCardSize.Default,
}) => {
  // FIXME: the `lightTheme` should have been deleted when this component was deleted from the betslip
  const containerStyles = [
    styles.container,
    theme === ComponentTheme.Light ? lightTheme.lightBg : {},
    theme === ComponentTheme.Dark ? darkTheme.darkBg : {},
    size === ForbiddenCardSize.Default ? cardSize.default : {},
    size === ForbiddenCardSize.Small ? cardSize.small : {},
  ];

  const labelStyles = [
    styles.label,
    [ComponentTheme.Light, ComponentTheme.LightTransparent].includes(theme) ? lightTheme.light : {},
    [ComponentTheme.Dark, ComponentTheme.DarkTransparent].includes(theme) ? darkTheme.dark : {},
  ];

  const linkStyles = [
    [ComponentTheme.Light, ComponentTheme.LightTransparent].includes(theme) ? lightTheme.link : {},
    [ComponentTheme.Dark, ComponentTheme.DarkTransparent].includes(theme) ? darkTheme.link : {},
  ];

  return (
    <View style={containerStyles} {...getTestProps(FORBIDDEN_CONTENT, false)}>
      <View style={styles.lock}>
        <GenericIcon name={SystemIconName.LOCK_BIG} color={tokens.ForbiddenContentIconColour} />
      </View>
      <View {...getTestProps(FORBIDDEN_CONTENT_LABEL_CONTAINER, false)}>{content(labelStyles, linkStyles)}</View>
    </View>
  );
};
