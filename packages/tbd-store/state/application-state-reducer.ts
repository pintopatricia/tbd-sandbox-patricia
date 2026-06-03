import { bettingReducer } from "./betting/betting-reducer";
import bootReducer from "./boot/boot-slice";
import entitiesReducer from "./entities/entities-reducer";
import layoutReducer from "./layout/layout-reducer";
import confirmationReducer from "./confirmation/confirmation-reducer";
import modulesReducer from "./modules/modules-reducer";
import networkStatusReducer from "./network-status/network-status-reducer";
import notificationsReducer from "./entities/notifications/notifications-reducer";
import notificationsCenterReducer from "./notifications-center/notifications-center-reducer";
import routerReducer from "./router/router-slice";
import cookieConsentReducer from "./cookie-consent/cookie-consent-reducer";
import hamburgerMenuSlice from "./hamburger-menu/hamburger-menu-slice";
import predictsSlice from "./predicts/predicts-slice";
import favouriteMarketsReducer from "./favourite-markets/favourite-markets-reducer";
import myBetsReducer from "./my-bets/my-bets-reducer";

const tbdApp = {
  betting: bettingReducer,
  boot: bootReducer,
  entities: entitiesReducer,
  layouts: layoutReducer,
  modules: modulesReducer,
  network: networkStatusReducer,
  notifications: notificationsReducer,
  confirmation: confirmationReducer,
  router: routerReducer,
  cookieConsent: cookieConsentReducer,
  hamburgerMenu: hamburgerMenuSlice.reducer,
  predicts: predictsSlice.reducer,
  favouriteMarkets: favouriteMarketsReducer,
  myBets: myBetsReducer,
  notificationsCenter: notificationsCenterReducer,
};

export default tbdApp;
