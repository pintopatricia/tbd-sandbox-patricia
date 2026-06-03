import {
  BettingCardRunnersDisplayQuery,
  CardQuery,
  FilteredCouponQuery,
  FilteredSelectableItemsQuery,
  FullCardQuery,
  GameCardFragment,
  GamingSearchQuery,
  MainMarketsQuery,
} from "../../clients/catalogue/catalogue-response-types";
import { getApolloCacheFeeder } from "../../config/apollo-cache-feeder";
import { getApolloCacheObserver } from "../../config/apollo-cache-observer";
import { TransformedLayout } from "./catalogue-types";
import { normalizerEngine } from "./normalizer/normalizer-engine";

export function buildCardsLayout(cardsQuery: CardQuery): TransformedLayout {
  type CardFragments = Exclude<CardQuery["Cards"], null>;
  type CardFragment = Exclude<CardFragments[0], null | Record<string, never>>;

  const cardFragments = (cardsQuery.Cards || []).filter(
    (fragment): fragment is CardFragment => !!fragment && "urn" in fragment,
  );

  const normalizerResult = normalizerEngine(cardFragments);
  const apolloCacheFeeder = getApolloCacheFeeder();
  if (apolloCacheFeeder) {
    apolloCacheFeeder(normalizerResult);
  }

  const apolloCacheObserver = getApolloCacheObserver();
  if (apolloCacheObserver) {
    apolloCacheObserver(normalizerResult);
  }

  return {
    data: normalizerResult,
  };
}

export function buildGamingSearchCardsLayout(gamingSearchQuery: GamingSearchQuery): TransformedLayout {
  const gameCardFragments = gamingSearchQuery.GamingSearch.edges.map((item) => item?.node);

  const cardFragments = (gameCardFragments || []).filter(
    (fragment): fragment is GameCardFragment => !!fragment && "urn" in fragment,
  );

  const normalizerResult = normalizerEngine(cardFragments);

  return {
    data: normalizerResult,
  };
}

export function buildFullCardLayout(fullCardQuery: FullCardQuery): TransformedLayout {
  type FullCardFragments = Exclude<FullCardQuery["Cards"], null>;
  type FullCardFragment = Exclude<FullCardFragments[0], null | Record<string, never>>;

  const cardFragments = (fullCardQuery.Cards || []).filter(
    (fragment): fragment is FullCardFragment => !!fragment && "urn" in fragment,
  );

  const normalizerResult = normalizerEngine(cardFragments);

  return {
    data: normalizerResult,
  };
}

export function buildFilteredCouponLayout(filteredCouponQuery: FilteredCouponQuery): TransformedLayout {
  type FilteredCouponFragments = Exclude<FilteredCouponQuery["Cards"], null>;
  type FilteredCouponFragment = Exclude<FilteredCouponFragments[0], null | Record<string, never>>;

  const cardFragments = (filteredCouponQuery.Cards || []).filter(
    (fragment): fragment is FilteredCouponFragment => !!fragment && "urn" in fragment,
  );

  const normalizerResult = normalizerEngine(cardFragments);

  return {
    data: normalizerResult,
  };
}

export function buildFilteredSelectableItemsLayout(
  filteredSelectableItemsQuery: FilteredSelectableItemsQuery,
): TransformedLayout {
  type FilteredSelectableItemsFragments = Exclude<FilteredSelectableItemsQuery["Cards"], null>;
  type FilteredSelectableItemsFragment = Exclude<FilteredSelectableItemsFragments[0], null | Record<string, never>>;

  const cardFragments = (filteredSelectableItemsQuery.Cards || []).filter(
    (fragment): fragment is FilteredSelectableItemsFragment => !!fragment && "urn" in fragment,
  );

  const normalizerResult = normalizerEngine(cardFragments);

  return {
    data: normalizerResult,
  };
}

export function buildRunnersDisplayUpdatesPayload(updates: BettingCardRunnersDisplayQuery): TransformedLayout {
  type CardFragments = Exclude<BettingCardRunnersDisplayQuery["Cards"], null>;
  type CardFragment = Exclude<CardFragments[0], null | Record<string, never>>;

  if (!updates.Cards) {
    return {
      data: {},
    };
  }

  const cardFragments = (updates.Cards || []).filter(
    (fragment): fragment is CardFragment => !!fragment && "urn" in fragment,
  );

  const normalizerResult = normalizerEngine(cardFragments);

  return {
    data: normalizerResult,
  };
}
export function buildMainMarketsUpdatesPayload(updates: MainMarketsQuery): TransformedLayout {
  type CardFragments = Exclude<MainMarketsQuery["Cards"], null>;
  type CardFragment = Exclude<CardFragments[0], null | Record<string, never>>;

  if (!updates.Cards) {
    return {
      data: {},
    };
  }

  const cardFragments = (updates.Cards || []).filter(
    (fragment): fragment is CardFragment => !!fragment && "urn" in fragment,
  );

  const normalizerResult = normalizerEngine(cardFragments);

  return {
    data: normalizerResult,
  };
}
