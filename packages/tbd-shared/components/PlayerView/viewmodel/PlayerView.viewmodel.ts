import emitEvent from "../../../event-broker/event-emitter";
import { usePlayerViewQuery } from "../model/PlayerView.graphql";
import { PlayerViewHeader } from "../view/PlayerView.types";
import { isPlayerViewItemPartial, isPlayerView, PlayerViewItemPartial } from "./utils/PlayerView.utils";

const fetchCards = (itemUrns: string[]) => {
  emitEvent("@@UI/FETCH_CARDS", {
    itemUrns,
  });
};

const fetchBars = (viewUrn: string) => {
  emitEvent("@@UI/FETCH_BARS", {
    bottomBar: true,
    leftSidebar: true,
    viewUrn,
  });
};

const events = {
  fetchCards,
  fetchBars,
};

export default function usePlayerViewVM(urn: string) {
  const { loading, data } = usePlayerViewQuery(urn);

  if (!data?.View || !isPlayerView(data.View)) {
    return {
      loading,
      vm: {
        data: null,
        events,
      },
    };
  }

  const viewHeader: PlayerViewHeader | undefined = data.View.context.player
    ? {
        name: data.View.context.player.name,
        position: data.View.context.player.position || undefined,
        shirtNumber: data.View.context.player.shirtNumber || undefined,
      }
    : undefined;

  /* At this point, we only need urns and typenames so we cast to PlayerViewItemPartial[] */
  const items = (data.View.items?.edges.map((edge) => edge?.node).filter(isPlayerViewItemPartial) ||
    undefined) as unknown as PlayerViewItemPartial[] | undefined;

  return {
    loading,
    vm: {
      data: {
        viewHeader,
        items,
      },
      events,
    },
  };
}
