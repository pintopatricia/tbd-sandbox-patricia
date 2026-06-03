import { FunctionComponent, useCallback } from "react";
import { Pressable, View } from "react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { MyBetsHeaderAddOnViewModel } from "./MyBetsHeaderAddOn.types";
import styles from "./MyBetsHeaderAddOn.native.styles";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { navigate } from "@ppb/tbd-router";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { DisplayMode } from "@ppb/the-wall-common/types/ViewLink.types";
import { ActionLink } from "@ppb/the-wall-native";
import { ActionLinkColor, ActionLinkTypography } from "@ppb/the-wall-common/types";

export const MyBetsHeaderAddOn: FunctionComponent<MyBetsHeaderAddOnViewModel> = ({
  settlementLink,
  settlementLinkLabel,
  selectedOrderType,
  isHighlighted = true,
  dispatchSettlementLinkPageNavigationAction,
}) => {
  const handleSettlementLinkAction = useCallback(() => {
    navigate({
      viewUrl: settlementLink,
      viewUrn: EntityType.ExternalView,
      viewDisplayMode: DisplayMode.BlankWebview,
    });

    dispatchSettlementLinkPageNavigationAction(settlementLink, selectedOrderType);
  }, [settlementLink, dispatchSettlementLinkPageNavigationAction, selectedOrderType]);

  const iconColor = isHighlighted
    ? tokens.MyBetsHeaderAddOnHighlightedIconColour
    : tokens.MyBetsHeaderAddOnDefaultIconColour;

  const fontColor = isHighlighted ? ActionLinkColor.Highlighted : ActionLinkColor.Default;

  return (
    <View style={styles.helpLink}>
      <Pressable onPress={handleSettlementLinkAction}>
        <View style={styles.helpLinkButtonIcon}>
          <GenericIcon name={SystemIconName.NOTIFICATION_HELP} color={iconColor} />
        </View>
      </Pressable>
      <ActionLink
        text={settlementLinkLabel}
        onClick={handleSettlementLinkAction}
        color={fontColor}
        typography={ActionLinkTypography.Regular}
        capitalize={false}
        noPadding
      />
    </View>
  );
};
