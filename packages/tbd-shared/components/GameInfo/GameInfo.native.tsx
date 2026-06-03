import { FunctionComponent, useCallback, useEffect, useMemo } from "react";

import { BadgeType } from "@ppb/the-wall-common/types";
import { useLogin } from "@flutter-global/react-native-cet-framework";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { navigateWithThirdPartyScreenName, ScreenName } from "@ppb/tbd-router/native";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { ComponentProps } from "./props";
import useTicker from "../../hooks/useTicker";
import { getLaunchUrl } from "../../view-model-factories/game";
import { getJackpotLogo } from "../../view-model-factories/game-native";
import { i18n } from "../../helpers/i18n";
import { GameInfo } from "./snowflakes/GameInfo/GameInfo.native";

const ConnectedGameInfo: FunctionComponent<ComponentProps & { gameUrn: string }> = ({
  urn,
  gameUrn,
  currencyCode,
  currencySymbol,
  localeCodeBcp47,
  gameLaunchId,
  providerUid,
  mainProduct,
  gameInfoProps,
  dispatchLaunchGame,
  dispatchSubscribeToUpdateGameFeedResults,
  dispatchUnsubscribeToUpdateGameFeedResults,
  jackpotAmount,
  tableNames,
  isBetslipContainerDisplayed,
  isLoggedIn,
  visible,
}) => {
  const launchUrl = useMemo(
    () => ({
      viewUrn: urn,
      viewUrl: getLaunchUrl(gameLaunchId, providerUid, mainProduct, true, "''"),
    }),
    [gameLaunchId, providerUid, mainProduct, urn],
  );
  const login = useLogin();

  const incremental = currencyFormatWithDecimalPlaces({
    currencyCode,
    localeCodeBcp47,
    value: useTicker(jackpotAmount ? Number(jackpotAmount) : 0, 300, false).ticker,
  });

  const playNowButtonOnTap = useCallback(() => {
    if (!isLoggedIn) {
      login();
      return;
    }
    dispatchLaunchGame(launchUrl, gameUrn, urn, PlatformType.Native);
    navigateWithThirdPartyScreenName(ScreenName.GameLaunchScreen, {
      viewLink: { viewUrl: launchUrl.viewUrl, viewUrn: launchUrl.viewUrn },
    });
  }, [dispatchLaunchGame, isLoggedIn, launchUrl, login, urn, gameUrn]);

  useEffect(() => {
    if (visible) {
      dispatchSubscribeToUpdateGameFeedResults(urn, tableNames, currencyCode);
    } else {
      dispatchUnsubscribeToUpdateGameFeedResults(urn, tableNames, currencyCode);
    }
  }, [
    currencyCode,
    dispatchSubscribeToUpdateGameFeedResults,
    dispatchUnsubscribeToUpdateGameFeedResults,
    urn,
    visible,
    tableNames,
  ]);

  const jackpotLogoType = gameInfoProps?.jackpotLogo || "";
  const jackpotLogo = getJackpotLogo(jackpotLogoType);
  let newGameInfoProps = { ...gameInfoProps, jackpotLogo };

  if (gameInfoProps?.badge?.type === BadgeType.JACKPOT) {
    newGameInfoProps = {
      ...gameInfoProps,
      jackpotLogo,
      badge: {
        type: BadgeType.JACKPOT,
        label: jackpotAmount ? incremental : i18n({ key: "I18N.GAME_CARD.BADGE.JACKPOT" }).toUpperCase(),
      },
    };
  }

  return (
    <GameInfo
      {...newGameInfoProps}
      playNowButtonOnClick={playNowButtonOnTap}
      launchUrl={launchUrl}
      isBetslipContainerDisplayed={isBetslipContainerDisplayed}
      currencySymbol={currencySymbol}
    />
  );
};

export default ConnectedGameInfo;
