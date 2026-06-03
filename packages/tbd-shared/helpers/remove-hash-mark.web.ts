/**
 * Use cases:
 *  - #/?bets=... -> ?bets=...
 *  - #/betslip?bets=... -> ?bets=...
 */
export const removeHashMark = (basePath: string, hash: string): void => {
  const queryParams = hash.indexOf("?") !== -1 ? hash.slice(hash.indexOf("?")) : "";

  if (queryParams) {
    window.location.replace(`${basePath}${queryParams}`);
  }
};
