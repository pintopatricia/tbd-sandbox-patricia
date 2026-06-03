import { FunctionComponent, useCallback } from "react";
import { GestureResponderEvent, Pressable, View } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { CasinoIconName, NavigationIconName, SystemIconName } from "@ppb/the-wall-icons";

import LinearView from "@ppb/the-wall-native/helpers/LinearView";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { useUpdateScrollOffsetContext } from "@ppb/the-wall-native/helpers/ScrollContext";
import { PrimaryButton, SecondaryButton, StatusLabel, Text } from "@ppb/the-wall-native";
import { i18n } from "../../../../helpers/i18n";
import { LogoProduct } from "../../../BetSharingCardGroup/snowflakes/Logo/Logo.types";
import { Logo } from "../../../BetSharingCardGroup/snowflakes/Logo/Logo.native";

import {
  HEADER,
  HEADER_BACK_BUTTON,
  HEADER_BALANCE_BUTTON,
  HEADER_BALANCE_PRESSABLE,
  HEADER_BALANCE_LABEL,
  HEADER_USER_PROFILE,
  HEADER_LOGO,
  JOIN_NOW_BUTTON,
  LOGIN_BUTTON,
  LOGIN_CONTAINER,
  HEADER_GENEROSITY_WALLET_PRESSABLE,
  HEADER_MENU_BUTTON,
  HEADER_GAMES_LOGO,
} from "./Header.native.selectors";
import styles from "./Header.native.styles";

import { HeaderCommonProps } from "./Header.types";
import { NotificationsIcon } from "../Notifications/NotificationsIcon";
import { useNotifications } from "@flutter-global/react-native-cet-framework";

type HeaderOnBalanceButtonPress = (event: GestureResponderEvent) => void;
type HeaderonGenerosityWalletButtonPress = (event: GestureResponderEvent) => void;
type HeaderOnBackPress = (event: GestureResponderEvent) => void;
type HeaderOnLogoPress = (event: GestureResponderEvent) => void;
type HeaderLoginButtonTap = () => void;
type HeaderJoinNowButtonTap = () => void;
type HeaderOnMenuPress = (event: GestureResponderEvent) => void;

export type HeaderNativeViewModel = HeaderCommonProps & {
  isLoading?: boolean;
  /**
   * Hides the Join Now button
   * @todo Remove when new register initiative is completed
   * @see CHCKMT-245 for more details
   */
  hasJoinNowButton?: boolean;
  onBackPress?: HeaderOnBackPress;
  onLogoPress?: HeaderOnLogoPress;
  onBalanceButtonPress: HeaderOnBalanceButtonPress;
  onGenerosityWalletButtonPress: HeaderonGenerosityWalletButtonPress | HeaderOnBalanceButtonPress;
  onLoginButtonTap?: HeaderLoginButtonTap;
  onJoinNowButtonTap?: HeaderJoinNowButtonTap;
  onMenuPress?: HeaderOnMenuPress;
};

const logoTestIdMap: Record<LogoProduct, string> = {
  [LogoProduct.GAMING]: HEADER_GAMES_LOGO,
  [LogoProduct.BETFAIR_EXCHANGE]: HEADER_LOGO,
  [LogoProduct.NONE]: HEADER_LOGO,
};

type HeaderBalanceSectionProps = Pick<
  HeaderNativeViewModel,
  "showBalances" | "accountBalance" | "onBalanceButtonPress" | "onGenerosityWalletButtonPress"
> & {
  headerWalletLabel: HeaderNativeViewModel["labels"]["headerWalletLabel"];
};

const HeaderBalanceSection: FunctionComponent<HeaderBalanceSectionProps> = ({
  showBalances,
  accountBalance,
  headerWalletLabel,
  onBalanceButtonPress,
  onGenerosityWalletButtonPress,
}) => {
  return (
    <View style={styles.balanceBtn}>
      <View style={styles.balanceContainer}>
        {showBalances && (
          <Pressable
            {...getTestProps(HEADER_BALANCE_PRESSABLE, false, accountBalance)}
            accessibilityRole="link"
            accessibilityHint={i18n({ key: "I18N.ACCESSIBILITY.BALANCE_LINK_HINT" })}
            onPress={onBalanceButtonPress}
          >
            <Text {...getTestProps(HEADER_BALANCE_LABEL, false)} style={styles.balanceLabel} numberOfLines={1}>
              {accountBalance}
            </Text>
          </Pressable>
        )}
        {showBalances && !!headerWalletLabel && (
          <Pressable
            {...getTestProps(HEADER_GENEROSITY_WALLET_PRESSABLE, true, headerWalletLabel)}
            onPress={onGenerosityWalletButtonPress}
            accessibilityRole="button"
            accessibilityHint={i18n({ key: "I18N.ACCESSIBILITY.PROMOS_WALLET_BUTTON_HINT" })}
          >
            <StatusLabel
              accessible={false}
              text={headerWalletLabel}
              iconName={CasinoIconName.PROMOTIONS}
              statusLabelType={StatusLabelType.GENEROSITY}
              statusLabelSize={StatusLabelSizeType.SMALL}
            />
          </Pressable>
        )}
      </View>
      <View {...getTestProps(HEADER_USER_PROFILE, false)} style={styles.userIconContainer}>
        <GenericIcon name={NavigationIconName.ACCOUNT} color={tokens.HeaderIconProfileIconColour} />
      </View>
    </View>
  );
};

export const Header: FunctionComponent<HeaderNativeViewModel> = ({
  isLoading = false,
  isLoggedIn,
  isMaintenance,
  logoProduct = LogoProduct.NONE,
  showBalances = true,
  accountBalance = "NA",
  showMenu,
  onBackPress,
  onLogoPress,
  onBalanceButtonPress,
  onGenerosityWalletButtonPress,
  onLoginButtonTap,
  onJoinNowButtonTap,
  onMenuPress,
  hasJoinNowButton = true,
  labels: { loginButtonLabel, joinNowButtonLabel, headerWalletLabel },
  hasUnreadNotifications,
  isNotificationsCenterEnabled,
}) => {
  const { openNotifications } = useNotifications();
  const hasLoginSection = !isMaintenance && !isLoggedIn && !isLoading && onLoginButtonTap && onJoinNowButtonTap;

  const setOffset = useUpdateScrollOffsetContext();

  const goBackAndResetOffset = useCallback(
    (event: GestureResponderEvent): void => {
      if (onBackPress) {
        setOffset(0);
        onBackPress(event);
      }
    },
    [onBackPress, setOffset],
  );

  return (
    <View {...getTestProps(HEADER, false)} style={styles.header}>
      <LinearView background={tokens.HeaderBackgroundPrimaryColour} style={styles.accountHeaderContainer}>
        <View style={styles.headerWithActions}>
          {!isMaintenance && showMenu && (
            <Pressable
              {...getTestProps(HEADER_MENU_BUTTON, true, i18n({ key: "I18N.SEARCH.TITLE" }))}
              style={styles.actionIconContainer}
              onPress={onMenuPress}
              accessibilityRole="button"
              accessibilityHint={i18n({ key: "I18N.ACCESSIBILITY.BROWSE_BUTTON_HINT" })}
            >
              <View style={styles.menuButtonIcon}>
                <GenericIcon name={SystemIconName.MENU} color={tokens.HeaderIconActionIconLeftDefaultColour} />
              </View>
            </Pressable>
          )}
          {!isMaintenance && !!onBackPress && (
            <Pressable
              {...getTestProps(HEADER_BACK_BUTTON, false, i18n({ key: "I18N.LABEL.BACK" }))}
              accessibilityHint={i18n({ key: "I18N.ACCESSIBILITY.PREVIOUS_PAGE" })}
              style={styles.actionIconContainer}
              onPress={goBackAndResetOffset}
              accessibilityRole="button"
            >
              <View style={styles.backButtonIcon}>
                <GenericIcon name={SystemIconName.CHEVRON_LEFT} color={tokens.HeaderIconBackIconColour} />
              </View>
            </Pressable>
          )}
          <Pressable
            {...getTestProps(logoTestIdMap[logoProduct], false, i18n({ key: "I18N.ACCESSIBILITY.HOMEPAGE" }))}
            onPress={onLogoPress}
            accessibilityRole="link"
          >
            <View style={styles.logoImageContainer}>
              <Logo product={logoProduct} />
            </View>
          </Pressable>
        </View>

        <View style={styles.myAccountActions}>
          {isLoggedIn && !isLoading && !isMaintenance && (
            <>
              <Pressable {...getTestProps(HEADER_BALANCE_BUTTON, false)} onPress={onBalanceButtonPress}>
                <HeaderBalanceSection
                  showBalances={showBalances}
                  accountBalance={accountBalance}
                  headerWalletLabel={headerWalletLabel}
                  onBalanceButtonPress={onBalanceButtonPress}
                  onGenerosityWalletButtonPress={onGenerosityWalletButtonPress}
                />
              </Pressable>
              {isNotificationsCenterEnabled && (
                <Pressable onPress={openNotifications}>
                  <View>
                    <NotificationsIcon unreadNotifications={hasUnreadNotifications} />
                  </View>
                </Pressable>
              )}
            </>
          )}
        </View>
      </LinearView>
      {hasLoginSection && (
        <View {...getTestProps(LOGIN_CONTAINER, false)} style={styles.loginContainer}>
          <View {...getTestProps(LOGIN_BUTTON, false)} style={styles.loginContainerButton}>
            <SecondaryButton label={loginButtonLabel} onTap={onLoginButtonTap} stopAnimation />
          </View>
          {hasJoinNowButton && (
            <View {...getTestProps(JOIN_NOW_BUTTON, false)} style={styles.loginContainerButton}>
              <PrimaryButton label={joinNowButtonLabel} onTap={onJoinNowButtonTap} stopAnimation />
            </View>
          )}
        </View>
      )}
    </View>
  );
};
