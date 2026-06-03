import URN from "@ppb/tbd-store/state/layout/URN";
import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { getGameByURN } from "@ppb/tbd-store/state/entities/games/game-selectors";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { GameInfoCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { LaunchGameFromGameInfoPage, UI__LAUNCH_GAME_FROM_GAME_INFO } from "@ppb/tbd-store/actions/navigation";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { Jurisdiction, jurisdictionToTopLevelDomainMap } from "@ppb/tbd-store/config/Jurisdiction";
import { GameLaunchAction, GAME_LAUNCH } from "@ppb/tbd-store/actions/game-feeds";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { GameView, GameViews } from "@ppb/tbd-store/state/layout/views/View.types";

export type ContainerProps = {
  urn: URN;
  gameCardUrn: string;
};

type CardProps = {
  urn?: string;
  uid?: string;
  view: GameView | null;
  gameLaunchId?: string;
  providerUid?: string;
  mainProduct?: string;
  isLoggedIn: boolean;
  gameCardUrn: string;
  hasDemo?: boolean;
  topLevelDomain: string;
  inputSearchTerm: string;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGameInfoViewbyURN = createViewByURNSelector<GameViews, URN>();
  const getGameInfoCard = createCardByURNSelector<GameInfoCards, URN>();

  return function mapStateToProps(state: ApplicationState, { urn, gameCardUrn }: ContainerProps): StateProps {
    try {
      const gameInfoView = getGameInfoViewbyURN(state.layouts.views.game, urn);
      const gameInfoItem = gameInfoView?.items?.filter((item) => item.typename === "GameInfoCard").pop();
      const { loggedIn, jurisdiction } = <UserDetails>getUserDetails(state);
      const topLevelDomain = jurisdictionToTopLevelDomainMap[jurisdiction.jurisdiction as Jurisdiction];

      const gamingSearchState = state.layouts.gamingSearch;
      const matchingEntry = Object.values(gamingSearchState ?? {}).find((entry) => {
        if (!entry || typeof entry !== "object") {
          return false;
        }
        const result = entry?.result;
        return Array.isArray(result) && result.some((searchedGame) => searchedGame?.urn === gameCardUrn);
      });
      const inputSearchTerm = matchingEntry?.inputSearchTerm || "";

      if (!gameInfoItem) {
        return {
          view: getGameInfoViewbyURN(state.layouts.views.game, urn),
          isLoggedIn: loggedIn,
          gameCardUrn,
          topLevelDomain,
          inputSearchTerm,
        };
      }

      const gameInfoCard = getGameInfoCard(state.layouts.cards.gameinfos, gameInfoItem.urn);

      if (!gameInfoCard) {
        return {
          view: getGameInfoViewbyURN(state.layouts.views.game, urn),
          isLoggedIn: loggedIn,
          gameCardUrn,
          topLevelDomain,
          inputSearchTerm,
        };
      }
      const game = getGameByURN(state.entities.games, gameInfoCard.game);

      if (!game) {
        return {
          view: getGameInfoViewbyURN(state.layouts.views.game, urn),
          isLoggedIn: loggedIn,
          gameCardUrn,
          topLevelDomain,
          inputSearchTerm,
        };
      }

      return {
        urn: game.urn,
        uid: game.uid,
        view: getGameInfoViewbyURN(state.layouts.views.game, urn),
        gameLaunchId: game.launchId,
        providerUid: game.provider.uid,
        mainProduct: game.mainProduct,
        isLoggedIn: loggedIn,
        gameCardUrn,
        hasDemo: game.hasDemo,
        topLevelDomain,
        inputSearchTerm,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

const dispatchLaunchGame = (
  urn: ViewLink,
  gameUrn: string,
  platformType: PlatformType,
): LaunchGameFromGameInfoPage => ({
  type: UI__LAUNCH_GAME_FROM_GAME_INFO,
  payload: { href: urn.viewUrl, gameUrn, platformType },
});

const dispatchGameLaunchRefresh = (launchedGame: PartialItem): GameLaunchAction => ({
  type: GAME_LAUNCH,
  payload: { ...launchedGame },
});

export type DispatchProps = {
  dispatchLaunchGame?: typeof dispatchLaunchGame;
  dispatchGameLaunchRefresh: typeof dispatchGameLaunchRefresh;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchLaunchGame,
  dispatchGameLaunchRefresh,
};
