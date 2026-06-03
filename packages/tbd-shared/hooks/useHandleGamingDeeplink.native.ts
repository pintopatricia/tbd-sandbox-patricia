import * as React from "react";
import { Platform } from "react-native";
import { useRoute, CommonActions, RouteProp } from "@react-navigation/native";
import { CetContext } from "@flutter-global/react-native-cet-framework";
import { navigationRef } from "@ppb/tbd-router";
import { EntityType } from "@ppb/tbd-urn-codecs";
import GamingContext from "../components/GamingPage/GamingContext";
import appConfiguration from "../config/app-configuration.native";
import { getValidGameLaunchPatterns } from "../helpers/gaming.native";

type ParamList = {
  GamingNavigator: {
    params?: {
      viewLink?: {
        viewUrl?: string;
        viewUrn: string;
      };
      isDeepLink: boolean;
    };
  };
};

export const useHandleGamingDeeplink = () => {
  const deepLinkScreen = useRoute<RouteProp<ParamList, "GamingNavigator">>();
  const viewLinkUrl = deepLinkScreen.params?.params?.viewLink?.viewUrl;
  const viewLinkUrn = deepLinkScreen.params?.params?.viewLink?.viewUrn;
  const isDeepLink = deepLinkScreen.params?.params?.isDeepLink;
  const { setDeepLinkUrl, setDeepLinkUrn } = React.useContext(GamingContext);
  const { setGameInfo } = React.useContext(CetContext);

  const extractGameId = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.searchParams.get("gameId");
    } catch {
      return "";
    }
  };

  React.useEffect(() => {
    if (Platform.OS === "ios") {
      if (!viewLinkUrl) {
        setDeepLinkUrl(undefined);
        setDeepLinkUrn(undefined);
      } else if (viewLinkUrl?.match(appConfiguration.deeplinkConfiguration.gameCollectionUrnPattern)) {
        setDeepLinkUrn(viewLinkUrl.split("/").filter(Boolean).pop());
      } else if (viewLinkUrn && viewLinkUrn.includes(EntityType.GamingCategoryView)) {
        setDeepLinkUrn(viewLinkUrn.split(":").pop());
      } else if (viewLinkUrl?.match(/^http(s)?/)) {
        if (getValidGameLaunchPatterns().some((pattern) => viewLinkUrl.match(pattern))) {
          setGameInfo({ gameId: extractGameId(viewLinkUrl) ?? "", isFromCpp: false, type: "", gameUrl: viewLinkUrl });
        } else {
          setDeepLinkUrl(viewLinkUrl);
        }
      }
      navigationRef.current?.dispatch({
        ...CommonActions.setParams({ params: undefined }),
        source: deepLinkScreen.key,
      });
    }
  }, [viewLinkUrl, setDeepLinkUrl, deepLinkScreen.key, isDeepLink, setDeepLinkUrn, setGameInfo]);
};
