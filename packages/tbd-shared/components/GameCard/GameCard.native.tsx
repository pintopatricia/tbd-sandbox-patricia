import { FunctionComponent, useEffect, useCallback, useMemo } from "react";
import { Pressable, Keyboard, Platform } from "react-native";
import { useLogin } from "@flutter-global/react-native-cet-framework";
import { BadgeType } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { navigateWithThirdPartyScreenName, ScreenName } from "@ppb/tbd-router/native";
import { GameTile } from "./snowflakes/GameTile/GameTile.native";
import selectors from "./GameCard.native.selectors";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import useTicker from "../../hooks/useTicker";
import styles from "./GameCard.native.styles";
import { ComponentProps } from "./props";
import { getLaunchUrl } from "../../view-model-factories/game";
import { getJackpotLogo } from "../../view-model-factories/game-native";
import { i18n } from "../../helpers/i18n";
import { useAppBrand } from "../../hooks/useAppBrand";
import { updateGamingSearchHistory } from "../../helpers/search-history-helper.native";

const GameCard: FunctionComponent<ComponentProps> = ({
  gameTileProps,
  isRoundGameTile,
  gameLaunchId,
  providerUid,
  mainProduct,
  currencyCode,
  localeCodeBcp47,
  gameUrn,
  gameInfoViewUrl,
  dispatchSubscribeToUpdateGameFeedResults,
  dispatchUnsubscribeToUpdateGameFeedResults,
  tableNames,
  dispatchLaunchGame,
  urn,
  dispatchNavigateToGameInfoView,
  isLoggedIn,
  topLevelDomain,
  visible,
  inputSearchTerm,
  isGameWidget,
  dispatchLaunchGameFromWidget,
  isXmallGameTile,
}) => {
  const login = useLogin();
  const domain = useAppBrand();

  const viewLink = useMemo(
    () => ({
      viewUrn: "",
      viewUrl: getLaunchUrl(
        gameLaunchId,
        providerUid,
        mainProduct,
        true,
        `https://launcher.${domain}.${topLevelDomain}/?goToOrigin=true`,
      ),
    }),
    [gameLaunchId, mainProduct, providerUid, domain, topLevelDomain],
  );

  useEffect(() => {
    if (visible) {
      dispatchSubscribeToUpdateGameFeedResults(gameUrn, tableNames, currencyCode);
    } else {
      dispatchUnsubscribeToUpdateGameFeedResults(gameUrn, tableNames, currencyCode);
    }
  }, [
    currencyCode,
    dispatchSubscribeToUpdateGameFeedResults,
    dispatchUnsubscribeToUpdateGameFeedResults,
    gameUrn,
    visible,
    tableNames,
    topLevelDomain,
  ]);

  const onGameTilePress = useCallback((): void => {
    if (!isLoggedIn && Platform.OS === "ios") {
      login();
      return;
    }

    if (!viewLink) {
      return;
    }

    if (isGameWidget) {
      dispatchLaunchGameFromWidget(viewLink, gameUrn, urn, PlatformType.Native);
    } else {
      dispatchLaunchGame(viewLink, gameUrn, urn, PlatformType.Native);
    }

    if (inputSearchTerm) updateGamingSearchHistory(inputSearchTerm.trim());

    // always hide the keyboard when launch a game
    Keyboard.dismiss();
    navigateWithThirdPartyScreenName(ScreenName.GameLaunchScreen, {
      viewLink,
      params: {
        urn,
      },
    });
  }, [
    isLoggedIn,
    viewLink,
    dispatchLaunchGame,
    dispatchLaunchGameFromWidget,
    isGameWidget,
    gameUrn,
    urn,
    login,
    inputSearchTerm,
  ]);

  const onInfoButtonTap = useCallback((): void => {
    dispatchNavigateToGameInfoView(gameInfoViewUrl, gameUrn, urn);
    navigateWithThirdPartyScreenName(ScreenName.GameInfoScreen, {
      viewLink: gameInfoViewUrl,
      params: {
        gameCardUrn: urn,
      },
    });
  }, [dispatchNavigateToGameInfoView, gameInfoViewUrl, gameUrn, urn]);

  const shouldDisplayJackpotBanner = gameTileProps?.badge?.type === BadgeType.JACKPOT;
  const jackpotAmount = shouldDisplayJackpotBanner && gameTileProps?.badge?.label;
  const { ticker } = useTicker(jackpotAmount ? Number(jackpotAmount) : 0, 300, false);

  const jackpotLogoType = gameTileProps?.jackpotLogo || "";
  const jackpotLogo = getJackpotLogo(jackpotLogoType);

  const newGameTileProps = useMemo(() => {
    if (shouldDisplayJackpotBanner) {
      const incremental = currencyFormatWithDecimalPlaces({
        currencyCode,
        localeCodeBcp47,
        value: ticker,
      });
      return {
        ...gameTileProps,
        jackpotLogo,
        badge: {
          type: BadgeType.JACKPOT,
          label: jackpotAmount ? incremental : i18n({ key: "I18N.GAME_CARD.BADGE.JACKPOT" }).toUpperCase(),
        },
      };
    }
    return { ...gameTileProps, jackpotLogo };
  }, [shouldDisplayJackpotBanner, gameTileProps, jackpotLogo, jackpotAmount, ticker, currencyCode, localeCodeBcp47]);

  const renderGameTile = useMemo(
    () => (
      <GameTile
        {...newGameTileProps}
        isRoundGameTile={isRoundGameTile}
        onInfoButtonTap={onInfoButtonTap}
        isGameWidget={isGameWidget}
        isXmallGameTile={isXmallGameTile}
      />
    ),
    [isRoundGameTile, newGameTileProps, onInfoButtonTap, isGameWidget, isXmallGameTile],
  );

  return (
    <Pressable onPress={onGameTilePress} style={styles.gameTilePressable} {...getTestProps(selectors.GAME_CARD, false)}>
      {renderGameTile}
    </Pressable>
  );
};

export default GameCard;
