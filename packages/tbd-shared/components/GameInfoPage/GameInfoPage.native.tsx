import { FunctionComponent, useCallback } from "react";
import { View, Platform } from "react-native";
import { useLogin } from "@flutter-global/react-native-cet-framework";
import { PrimaryButton, SecondaryButton } from "@ppb/the-wall-native";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { navigateWithThirdPartyScreenName, ScreenName } from "@ppb/tbd-router/native";
import { PartialItem } from "@ppb/tbd-store";
import { FlatList, RenderItem } from "../FlatList.native";
import styles from "./GameInfoPage.native.styles";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import { ComponentProps } from "./props";
import { getLaunchUrl } from "../../view-model-factories/game";
import {
  GAME_INFO_PLAY_NOW_BUTTON_CONTAINER,
  GAME_INFO_PLAY_NOW_BUTTON_LINK,
  GAME_INFO_PLAY_NOW_BUTTON,
  GAME_INFO_PLAY_DEMO_BUTTON,
} from "./GameInfoPage.native.selectors";
import { i18n } from "../../helpers/i18n";
import { useAppBrand } from "../../hooks/useAppBrand";
import { updateGamingSearchHistory } from "../../helpers/search-history-helper.native";
import ConnectedBackNavigationItem from "../BackNavigationItem";
import BackNavigationItem from "../BackNavigationItem/BackNavigationItem.native";

const ConnectedGameInfoPage: FunctionComponent<ComponentProps> = ({
  urn,
  view,
  gameLaunchId,
  providerUid,
  mainProduct,
  dispatchLaunchGame,
  isLoggedIn,
  dispatchGameLaunchRefresh,
  gameCardUrn,
  hasDemo,
  topLevelDomain,
  inputSearchTerm,
}) => {
  const playNow = i18n({ key: "I18N.GAME_TILE.PLAY_NOW_BUTTON" });
  const playDemo = i18n({ key: "I18N.GAME_TILE.PLAY_DEMO_BUTTON" });
  const login = useLogin();
  const domain = useAppBrand();

  const onTapCallback = useCallback(
    (isDemo: boolean) => {
      if (!isLoggedIn && Platform.OS === "ios") {
        login();
        return;
      }

      if (dispatchLaunchGame) {
        let viewLink = { viewUrn: "", viewUrl: "" };

        if (gameLaunchId && providerUid && mainProduct) {
          viewLink = {
            viewUrn: view?.urn ?? urn,
            viewUrl: getLaunchUrl(
              gameLaunchId,
              providerUid,
              mainProduct,
              true,
              `https://launcher.${domain}.${topLevelDomain}/?goToOrigin=true`,
              isDemo,
            ),
          };
        }

        const trimmedSearchTerm = inputSearchTerm?.trim();
        if (trimmedSearchTerm) updateGamingSearchHistory(trimmedSearchTerm);
        dispatchLaunchGame(viewLink, urn, PlatformType.Native);
        dispatchGameLaunchRefresh({ urn: gameCardUrn, typename: "CardGame" });
        navigateWithThirdPartyScreenName(ScreenName.GameLaunchScreen, {
          viewLink,
        });
      }
    },
    [
      isLoggedIn,
      dispatchLaunchGame,
      login,
      urn,
      view?.urn,
      dispatchGameLaunchRefresh,
      gameCardUrn,
      gameLaunchId,
      providerUid,
      mainProduct,
      domain,
      topLevelDomain,
      inputSearchTerm,
    ],
  );

  const renderGameInfoPageItem = useCallback<RenderItem<PartialItem>>(
    ({ item }) => (
      <View style={styles.gameInfoViewContainer}>
        <ConnectedCard
          key={`card-${item.urn}`}
          urn={item.urn}
          component={Card}
          typename={item.typename}
          visible={item.visible}
        />
      </View>
    ),
    [],
  );

  const backNavigationTitle = view?.navigationItem?.title;

  return (
    <>
      <View style={styles.gameInfoPage}>
        {backNavigationTitle && <ConnectedBackNavigationItem component={BackNavigationItem} urn={view?.urn} />}
        <FlatList data={view?.items} renderItem={renderGameInfoPageItem} />
      </View>
      <View style={styles.buttonContainer} {...getTestProps(GAME_INFO_PLAY_NOW_BUTTON_CONTAINER)}>
        {hasDemo && (
          <View style={styles.link} {...getTestProps(GAME_INFO_PLAY_NOW_BUTTON_LINK)}>
            <SecondaryButton
              label={playDemo}
              onTap={() => onTapCallback(true)}
              stopAnimation={true}
              {...getTestProps(GAME_INFO_PLAY_DEMO_BUTTON)}
            />
          </View>
        )}
        <View style={styles.link} {...getTestProps(GAME_INFO_PLAY_NOW_BUTTON_LINK)}>
          <PrimaryButton
            label={playNow}
            onTap={() => onTapCallback(false)}
            stopAnimation={true}
            {...getTestProps(GAME_INFO_PLAY_NOW_BUTTON)}
          />
        </View>
      </View>
    </>
  );
};

export default ConnectedGameInfoPage;
