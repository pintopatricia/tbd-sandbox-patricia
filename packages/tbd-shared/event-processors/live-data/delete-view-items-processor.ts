/**
 * STOP!
 *
 * This is a temporary file to handle empty component within a swimlane.
 */
import { DELETE_VIEW_ITEMS, DeleteViewItems } from "@ppb/tbd-store/actions/catalogue";
import { getStore } from "@ppb/tbd-store/create-store";
import subscribeEvent from "../../event-broker/event-subscriber";

const events = [
  "@@UI/SELECTION_PROMO_CARD_EMPTY",
  "@@UI/BET_OPPORTUNITY_PROMO_CARD_EMPTY",
  "@@UI/EDITORIAL_PROMO_CARD_EMPTY",
  "@@UI/LOYALTY_PROMO_CARD_EMPTY",
] as const;

const register = () => {
  const store = getStore();

  events.forEach((event) => {
    subscribeEvent(event, (payload) => {
      store.dispatch<DeleteViewItems>({
        type: DELETE_VIEW_ITEMS,
        payload: [payload.urn],
        force: true,
      });
    });
  });
};

export default register;
