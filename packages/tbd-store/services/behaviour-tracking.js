import { httpInterface } from "./behaviour-service-interface";
import { getCBSChannelConfig } from "./client-factory";

export const TRACKING_EVENT_NAMES = {
  PAGE_VIEW: "pageView",
  GAME_LAUNCH: "launchGame",
  NAVIGATE: "navigate",
  EXPOSE: "expose",
};

export function BehaviourTracker() {
  this.behaviourLibrary = null;

  this.triggerEvent = (eventType, payload) => {
    if (this.behaviourLibrary) {
      switch (eventType) {
        case TRACKING_EVENT_NAMES.PAGE_VIEW:
          this.viewPage(payload);
          break;
        case TRACKING_EVENT_NAMES.GAME_LAUNCH:
          this.launchGame(payload);
          break;
        case TRACKING_EVENT_NAMES.NAVIGATE:
          this.navigate(payload);
          break;
        case TRACKING_EVENT_NAMES.EXPOSE:
          this.expose(payload);
          break;
        default:
          break;
      }
    }
  };

  this.initLibrary = async (endpoint, applicationKey) => {
    const setupBehaviourLibrary = await import(/* webpackChunkName: "BehaviourLibrary" */ "behaviour-library");
    const channel = getCBSChannelConfig() || "Betfair Rebuild Mobile";

    this.behaviourLibrary = setupBehaviourLibrary.default(httpInterface, { endpoint, applicationKey, channel });
  };

  this.launchGame = (payload) => {
    this.behaviourLibrary.launchGame(payload.gameId, payload.item);
  };

  this.viewPage = (payload) => {
    this.behaviourLibrary.viewPage(payload.uri, payload.urn);
  };

  this.navigate = (payload) => {
    this.behaviourLibrary.navigate(payload.uri);
  };

  this.expose = (payload) => {
    this.behaviourLibrary.exposed(payload);
  };
}
