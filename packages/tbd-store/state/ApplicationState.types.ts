import { BetslipState } from "./betslip";
import { BootState } from "./boot";
import { RouterState } from "./router";
import { Entities, NotificationsState } from "./entities";
import { Layouts } from "./layout";
import { Betting } from "./betting";
import { ConfirmationState } from "./confirmation";
import { RatingState } from "./rating";
import { ModulesState } from "./modules";
import { NetworkStatusState } from "./network-status";
import { CookieConsentState } from "./cookie-consent";
import { HamburgerMenuState } from "./hamburger-menu/HamburgerMenuState.types";
import { PredictsState } from "./predicts/PredictsState.types";
import { UserFavouriteGamesState } from "./entities/favouriteGames/user-favourite-games-reducer";
import { FavouriteMarkets } from "./favourite-markets";
import { MyBetsState } from "./my-bets";
import { NotificationsCenterState } from "./notifications-center";

/**
 * The client application state (the root reducer interface)
 */
export type ApplicationState = {
  readonly betslip?: BetslipState; // Lazy loaded
  readonly betting: Betting;
  readonly boot: BootState;
  readonly entities: Entities;
  readonly layouts: Layouts;
  readonly modules: ModulesState;
  readonly network: NetworkStatusState;
  readonly notifications: NotificationsState;
  readonly notificationsCenter: NotificationsCenterState;
  readonly rating: RatingState;
  readonly router: RouterState;
  readonly confirmation: ConfirmationState;
  readonly cookieConsent: CookieConsentState;
  readonly hamburgerMenu: HamburgerMenuState;
  readonly predicts: PredictsState;
  readonly userFavouriteGames: UserFavouriteGamesState;
  readonly favouriteMarkets: FavouriteMarkets;
  readonly myBets: MyBetsState;
};
