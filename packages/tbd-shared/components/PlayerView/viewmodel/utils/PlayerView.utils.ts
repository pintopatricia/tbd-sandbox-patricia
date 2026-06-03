import { PlayerView } from "../../../../types/__generated__/graphql";

const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object";

const hasStringProp = (obj: Record<string, unknown>, prop: string): boolean => typeof obj[prop] === "string";

const isPartial = (item: unknown): item is { __typename: string; urn: string } => {
  return isObject(item) && "__typename" in item && "urn" in item;
};

export const isPlayerView = (view: unknown): view is PlayerView => {
  // PlayerView identification
  if (!isPartial(view)) return false;
  if (!hasStringProp(view, "urn")) return false;
  if (!hasStringProp(view, "url")) return false;

  // Items connection presence
  const items = (view as Record<string, unknown>).items as unknown;

  if (!isObject(items)) return false;

  const edges = (items as Record<string, unknown>).edges as unknown;

  if (!Array.isArray(edges)) return false;

  // Context shape and typename
  const ctx = (view as Record<string, unknown>).context as unknown;

  if (!isObject(ctx)) return false;
  if ((ctx as Record<string, unknown>).__typename !== "FootballPlayerFixtureContext") return false;

  // Context must have a player with an id
  const player = (ctx as Record<string, unknown>).player as unknown;
  if (!isObject(player)) return false;
  if (!hasStringProp(player as Record<string, unknown>, "id")) return false;

  return true;
};

export type PlayerViewItemPartial = {
  __typename: "PlayerMarketsCardGroup" | "FootballPlayerCompetitionStatsCard" | "RegulatoryCard";
  urn: string;
};

export const isPlayerViewItemPartial = (item: unknown): item is PlayerViewItemPartial => {
  if (!isPartial(item)) return false;

  return (
    item.__typename === "PlayerMarketsCardGroup" ||
    item.__typename === "FootballPlayerCompetitionStatsCard" ||
    item.__typename === "RegulatoryCard"
  );
};
