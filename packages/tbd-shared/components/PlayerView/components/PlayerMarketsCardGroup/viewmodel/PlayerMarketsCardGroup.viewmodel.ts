import { usePlayerMarketsCardGroupQuery } from "../model/PlayerMarketsCardGroup.graphql";
import emitEvent from "../../../../../event-broker/event-emitter";

const fetchCards = (itemUrns: string[]) => {
  emitEvent("@@UI/FETCH_CARDS", {
    itemUrns,
  });
};

const events = {
  fetchCards,
};

export default function usePlayerMarketsCardGroupVM(cardURN: string, visible: boolean) {
  const { called, loading, data } = usePlayerMarketsCardGroupQuery({ cardURN }, { visible });

  if (!data?.cardGroup) {
    return {
      loading,
      vm: {
        data: null,
        events,
      },
    };
  }

  const items =
    data.cardGroup.items?.edges?.map((edge) => edge?.node).filter((node): node is NonNullable<typeof node> => !!node) ??
    [];

  const titles = {
    fixture: "Next Match",
    markets: "Betting Markets",
  };

  return {
    loading,
    called,
    vm: {
      data: {
        urn: data.cardGroup.urn,
        fixtureCard: data.cardGroup.fixtureCard,
        items,
        titles,
      },
      events,
    },
  };
}
