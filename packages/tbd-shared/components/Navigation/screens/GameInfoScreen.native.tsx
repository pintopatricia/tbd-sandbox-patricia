import type { JSX } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import ConnectedGameInfoPage from "../../GameInfoPage/index";
import GameInfoPage from "../../GameInfoPage/GameInfoPage.native";

function GameInfoScreen(): JSX.Element {
  type ParamList = {
    GameInfoScreen: {
      viewLink: ViewLink;
      params: {
        gameCardUrn: string;
      };
    };
  };

  const route = useRoute<RouteProp<ParamList, "GameInfoScreen">>();
  const { viewLink, params } = route.params;

  return <ConnectedGameInfoPage urn={viewLink.viewUrn} component={GameInfoPage} gameCardUrn={params.gameCardUrn} />;
}

export default GameInfoScreen;
