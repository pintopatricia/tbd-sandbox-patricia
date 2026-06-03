import SportsbookMarketPricesObservable from "@ppb/tbd-store/middlewares/sportsbook-market-prices-observable";
import subscribeEvent from "../../event-broker/event-subscriber";
import { runnerLiveDataResolver, updateRunnerLiveData } from "./resolvers/runner-live-data-resolver";
import { updateMarketLiveData } from "./resolvers/sportsbook-market-live-data-resolver";

const register = () => {
  // register subscriber to "sportsbookMarketPricesObservable" which produces messages every time
  // there's an update from the polling mechanism
  const sportsbookMarketPricesObservable = SportsbookMarketPricesObservable.getInstance();

  sportsbookMarketPricesObservable.subscribe((response) => {
    if (response.updates?.runners) {
      updateRunnerLiveData(response.updates);
    }

    if (response.updates?.markets) {
      updateMarketLiveData(response.updates);
    }
  });

  subscribeEvent("@@UI/LOTTO_CARD_MOUNTED", (payload) => {
    payload.marketsIds.forEach((marketId: string) => {
      sportsbookMarketPricesObservable.addMarket({
        marketId,
        subscriberId: payload.cardUrn,
        isRacing: false,
      });
    });
  });

  subscribeEvent("@@UI/LOTTO_CARD_UNMOUNTED", (payload) => {
    const subscriberId = payload.cardUrn;

    payload.marketsIds.forEach((marketId: string) => {
      sportsbookMarketPricesObservable.removeMarket(marketId, subscriberId);
    });
  });

  subscribeEvent("@@UI/SELECTION_PROMO_CARD_VISIBILITY_CHANGED", ({ visible, marketUrn, isRaceMarket, refId }) => {
    runnerLiveDataResolver(visible, marketUrn, isRaceMarket, refId);
  });

  subscribeEvent("@@UI/SPORTSBOOK_BET_BUTTON_VISIBILITY_CHANGED", ({ visible, marketUrn, isRaceMarket, refId }) => {
    runnerLiveDataResolver(visible, marketUrn, isRaceMarket, refId);
  });

  subscribeEvent("@@UI/POPULAR_SELECTIONS_VISIBILITY_CHANGED", ({ visible, marketUrn, refId }) => {
    runnerLiveDataResolver(visible, marketUrn, false, refId);
  });

  subscribeEvent("@@UI/UPSELL_SUGGESTIONS_VISIBILITY_CHANGE", ({ visible, marketUrns, refId }) => {
    marketUrns.forEach((marketUrn: string) => {
      runnerLiveDataResolver(visible, marketUrn, false, refId);
    });
  });

  subscribeEvent("@@UI/PENALTY_TAKERS_CARD_VISIBILITY_CHANGED", (payload) => {
    payload.marketUrns.forEach((marketUrn: string) => {
      runnerLiveDataResolver(payload.visible, marketUrn, false, payload.subscriberId);
    });
  });
};

export default register;
