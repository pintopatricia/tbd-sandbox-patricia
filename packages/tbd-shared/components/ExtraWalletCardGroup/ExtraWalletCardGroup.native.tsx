import { FunctionComponent, Fragment, useCallback } from "react";
import { View } from "react-native";
import { Alert, Divider, Option } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { AlertType } from "@ppb/the-wall-common/types";
import { DisplayMode } from "@ppb/the-wall-common/types/ViewLink.types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { navigate } from "@ppb/tbd-router";
import { ComponentProps } from "./props";
import styles from "./ExtraWalletCardGroup.native.styles";
import ConnectedExtraWalletCard from "../ExtraWalletCard";
import ExtraWalletCard from "../ExtraWalletCard/ExtraWalletCard.native";
import {
  EXTRA_WALLET_CARD_GROUP,
  EXTRA_WALLET_CARD_GROUP_FREE_BETS_AMOUNT,
} from "./ExtraWalletCardGroup.native.selectors";

const ExtraWalletCardGroup: FunctionComponent<ComponentProps> = ({
  items,
  optionTitle,
  optionIcon,
  optionWallets,
  onOptionWalletsUpdate,
  dispatchHelpNavigationAction,
  i18nLabels,
  showAlert,
  helpUrl,
  currentPebble,
  isFromBetslip,
}) => {
  const lastCardIndex = items.length - 1;

  const onAlertClosePress = useCallback(() => {
    if (helpUrl) {
      dispatchHelpNavigationAction(helpUrl, currentPebble, isFromBetslip);
      navigate({
        viewUrl: helpUrl,
        viewUrn: EntityType.ExternalView,
        viewDisplayMode: DisplayMode.BlankWebview,
      });
    }
  }, [dispatchHelpNavigationAction, helpUrl, currentPebble, isFromBetslip]);

  return (
    <View style={styles.extraWalletCardGroup} {...getTestProps(EXTRA_WALLET_CARD_GROUP, false)}>
      {helpUrl && showAlert && (
        <Alert
          type={AlertType.Info}
          message={i18nLabels.helpMessage}
          dismissLabel={i18nLabels.helpButtonLabel}
          onClose={onAlertClosePress}
        />
      )}

      {optionTitle && (
        <View
          style={styles.extraWalletCardGroupOption}
          {...getTestProps(EXTRA_WALLET_CARD_GROUP_FREE_BETS_AMOUNT, false)}
        >
          <Option icon={optionIcon} iconSize="small" title={optionTitle} isSelected={false} isReadOnly={true} />
        </View>
      )}

      {items.map((urn, index) => (
        <Fragment key={urn}>
          <ConnectedExtraWalletCard
            urn={urn}
            component={ExtraWalletCard}
            onOptionWalletsUpdate={onOptionWalletsUpdate}
            optionWallets={optionWallets}
            currentPebble={currentPebble}
          />

          {index !== lastCardIndex && <Divider />}
        </Fragment>
      ))}
    </View>
  );
};

export default ExtraWalletCardGroup;
