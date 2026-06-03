import { FunctionComponent, useCallback, useMemo } from "react";
import { View, Pressable } from "react-native";
import { useDispatch } from "react-redux";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName, NavigationIconName } from "@ppb/the-wall-icons";
import { colors } from "@ppb/the-wall-common/base-theme";
import { navigate } from "@ppb/tbd-router/native";
import { NavigateToMobileWeb, UI__NAVIGATE_TO_MOBILE_WEB } from "@ppb/tbd-store/actions/navigation";
import { Text } from "@ppb/the-wall-native";
import {
  TERRITORY_BLOCKING_PAGE,
  LOGO,
  TITLE,
  MESSAGE,
  INFO,
  HELP_ICON,
} from "./BetfairTerritoryBlockingPage.native.selectors";
import styles from "./BetfairTerritoryBlockingPage.native.styles";

type BetfairTerritoryBlockingPageProps = {
  title: string;
  message: string;
  info: string;
};

export const BetfairTerritoryBlockingPage: FunctionComponent<BetfairTerritoryBlockingPageProps> = ({
  title,
  message,
  info,
}) => {
  const dispatch = useDispatch();

  // Temporarily redirecting the user to the Rebuild Web version, until the Native app doesn't support juridictions
  const handleHelpCenterOnPress = useCallback(() => {
    const viewUrl = "https://www.betfair.com/sport/";

    navigate({
      viewUrl,
      viewUrn: "ppb:tbd:view:external",
      viewDisplayMode: DisplayMode.BlankBrowser,
    });

    dispatch<NavigateToMobileWeb>({
      type: UI__NAVIGATE_TO_MOBILE_WEB,
      payload: {
        label: info,
        url: viewUrl,
      },
    });
  }, [info, dispatch]);

  const help = useMemo(() => <GenericIcon name={NavigationIconName.ARROWS} color={colors.NeutralsIconDefault} />, []);

  return (
    <View {...getTestProps(TERRITORY_BLOCKING_PAGE, false)}>
      <View style={styles.betfairLogoContainer}>
        <View {...getTestProps(LOGO, false)} style={styles.logoImageContainer}>
          <GenericIcon name={NavigationIconName.BETFAIR} color={colors.ComponentsNavigationHeaderTextDefault} />
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.blockedTerritoryIconContainer}>
          <GenericIcon name={AssetsIconName.BLOCKED_TERRITORY} />
        </View>
        <Text {...getTestProps(TITLE, false)} style={styles.title}>
          {title}
        </Text>
        <Text {...getTestProps(MESSAGE, false)} style={styles.message}>
          {message}
        </Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoBackground}>
            <Pressable {...getTestProps(HELP_ICON, false)} style={styles.infoIcon} onPress={handleHelpCenterOnPress}>
              {help}
            </Pressable>
          </View>
          <Text {...getTestProps(INFO, false)} style={styles.infoText}>
            {info}
          </Text>
        </View>
      </View>
    </View>
  );
};
