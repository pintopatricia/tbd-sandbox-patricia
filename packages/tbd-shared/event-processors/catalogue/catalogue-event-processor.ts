import { getStore } from "@ppb/tbd-store/create-store";
import { FETCH_CARDS, FETCH_CATALOGUE } from "@ppb/tbd-store";
import subscribeEvent from "../../event-broker/event-subscriber";

const register = () => {
  const store = getStore();

  const fetchCardsEvents = ["@@UI/FETCH_CARDS"] as const;

  fetchCardsEvents.forEach((event) => {
    subscribeEvent(event, (payload) => {
      store.dispatch({
        type: FETCH_CARDS,
        payload: {
          urns: payload.itemUrns,
        },
      });
    });
  });

  const viewLoadedEvents = ["@@UI/FETCH_BARS"] as const;

  viewLoadedEvents.forEach((event) => {
    subscribeEvent(event, (payload) => {
      store.dispatch({
        type: FETCH_CATALOGUE,
        payload: {
          urn: payload.viewUrn,
          withBottomBar: payload.bottomBar,
          withLeftSidebar: payload.leftSidebar,
          decorationsOnly: true,
        },
      });
    });
  });
};

export default register;
