import subscribeEvent from "../../event-broker/event-subscriber";
import {
  bettingOpportunityLiveDataResolver,
  subscribeBettingOpportunityLiveData,
} from "./resolvers/betting-opportunity-live-data";

const register = () => {
  // Subscribe to betting opportunities live data updates
  subscribeBettingOpportunityLiveData();

  subscribeEvent(
    "@@UI/PRICE_BOOST_MULTIPLE_PROMO_CARD_VISIBILITY_CHANGED",
    ({ visible, bettingOpportunityUrn, bettingOpportunityType, bettingOpportunityId, selections, refId }) => {
      bettingOpportunityLiveDataResolver(
        visible,
        bettingOpportunityUrn,
        bettingOpportunityType,
        bettingOpportunityId,
        selections,
        refId,
      );
    },
  );
};

export default register;
