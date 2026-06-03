export type BetPart = {
  marketId: string;
  selectionId: number;
};

/**
 * Builds a deep link for Betslip based on bet parts
 *
 * @param betParts an array of betParts
 * @param basePath the base path string
 * @returns the deeplink string
 */
export function buildBetslipAddBetsDeepLink(betParts: BetPart[] = [], basePath = ""): string {
  if (!betParts.length) {
    return basePath;
  }

  const betsParam = betParts.reduce((acc, { marketId, selectionId }) => {
    const baseString = acc ? `${acc};` : acc;

    return `${baseString}${marketId}${encodeURIComponent("|")}${selectionId}`;
  }, "");

  return `${basePath}?bets=${betsParam}`;
}
