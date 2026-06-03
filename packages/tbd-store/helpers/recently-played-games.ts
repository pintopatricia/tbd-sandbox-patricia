const RECENTLY_PLAYED = "recently_played";
const MULTIFUNCTIONAL_RECENTLY_PLAYED = "recentlyPlayed";

export const isRecentlyPlayedGroup = (urn: string): boolean =>
  urn.includes(RECENTLY_PLAYED) || urn.includes(MULTIFUNCTIONAL_RECENTLY_PLAYED);
