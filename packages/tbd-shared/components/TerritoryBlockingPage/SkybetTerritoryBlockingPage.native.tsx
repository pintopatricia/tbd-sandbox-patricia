import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import { NavigateToMobileWeb, UI__NAVIGATE_TO_MOBILE_WEB } from "@ppb/tbd-store/actions/navigation";
import { PrimaryButton, Text } from "@ppb/the-wall-native";
import { TERRITORY_BLOCKING_PAGE, TITLE, MESSAGE, INFO } from "./SkybetTerritoryBlockingPage.native.selectors";
import styles from "./SkybetTerritoryBlockingPage.native.styles";

type SkybetTerritoryBlockingPageProps = {
  title: string;
  message: string;
  info: string;
};

export const SkybetTerritoryBlockingPage: FunctionComponent<SkybetTerritoryBlockingPageProps> = ({
  title,
  message,
  info,
}) => {
  const dispatch = useDispatch();

  const handleFindOutMoreOnTap = useCallback(() => {
    const viewUrl = "https://support.skybet.com/app/answers/detail/accepted-countries-using-your-account-abroad/";

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

  return (
    <View {...getTestProps(TERRITORY_BLOCKING_PAGE, false)}>
      <View style={styles.container}>
        <Text {...getTestProps(TITLE, false)} style={styles.title}>
          {title}
        </Text>
        <Text {...getTestProps(MESSAGE, false)} style={styles.message}>
          {message}
        </Text>
        <View style={styles.infoContainer}>
          <PrimaryButton {...getTestProps(INFO, false)} label={info} onTap={handleFindOutMoreOnTap} />
        </View>
      </View>
    </View>
  );
};
