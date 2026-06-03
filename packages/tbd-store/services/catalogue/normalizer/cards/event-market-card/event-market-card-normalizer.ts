import URN from "../../../../../state/layout/URN";
import { BaseFixture } from "../../../../../state/entities";
import { EventMarketCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { EventMarketCard } from "../../../../../state/layout/cards/Card.types";

const normalizeEventMarketCardFragmentIntoEventMarketCard = (
  eventMarketCard: EventMarketCardFragment,
): TransformedFragment<EventMarketCard | null> => {
  const {
    urn,
    eventViewLink,
    runnerViewLinks,
    title,
    sportevent,
    statsPebble,
    fixture,
    displayRunners,
    __typename,
    videoAvailable,
    isSuperSubEligible,
    marketPromo,
    tabLink,
  } = eventMarketCard;

  let fixtureInfo: URN | BaseFixture;

  if (!("__typename" in fixture)) {
    // Type guard to ensure fixture is not null or undefined
    return {
      data: null,
    };
  }

  if (fixture.__typename === "BaseFixture") {
    fixtureInfo = {
      urn: fixture.urn,
      typename: fixture.__typename,
      sportevent: fixture.sportevent.urn,
      mainMarket: {
        exchange: fixture.mainMarket.exchange?.urn,
        sportsbook: fixture.mainMarket.sportsbook?.urn,
      },
    };
  } else {
    fixtureInfo = fixture.urn;
  }

  const tabLinkNormalized = tabLink
    ? {
        label: tabLink.label,
        icon: tabLink.icon ? { category: tabLink.icon.category, id: tabLink.icon.id } : undefined,
        tabViewLink: {
          viewUrl: tabLink.tabViewLink.viewUrl,
          viewUrn: tabLink.tabViewLink.viewUrn,
        },
      }
    : undefined;

  return {
    data: {
      urn,
      typename: __typename,
      eventViewLink,
      sportevent: sportevent.urn,
      statsPebbleURN: statsPebble?.urn,
      tabLink: tabLinkNormalized,
      competition: sportevent.competition?.urn,
      displayRunners: {
        ...(!!displayRunners.exchange &&
          "urn" in displayRunners.exchange.market && {
            exchange: {
              market: displayRunners.exchange.market.urn,
              runners: displayRunners.exchange.runners.map((runner) => ({ urn: runner.runnerURN })),
            },
          }),
        ...(!!displayRunners.sportsbook &&
          "urn" in displayRunners.sportsbook.market && {
            sportsbook: {
              market: displayRunners.sportsbook.market.urn,
              runners: displayRunners.sportsbook.runners.map((runner) => ({ urn: runner.runnerURN })),
            },
          }),
      },
      runnerViewLinks: runnerViewLinks?.reduce(
        (acc, value) => ({
          ...acc,
          [value.runnerUrn]: {
            ...value,
          },
        }),
        {},
      ),
      title,
      fixture: fixtureInfo,
      videoAvailable,
      isSuperSubEligible: !!isSuperSubEligible,
      marketPromo: marketPromo || undefined,
    },
  };
};

export default normalizeEventMarketCardFragmentIntoEventMarketCard;
