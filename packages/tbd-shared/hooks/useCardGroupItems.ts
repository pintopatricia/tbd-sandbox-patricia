import { useMemo } from "react";

type CardPartial = {
  typename: string;
};

/**
 * This hook is used so we can filter cards from lists (e.g. CardGroup, PebbleCardGroup) for cards that we already
 * have implemented.
 *
 * This is extremely important since some teams deliver web/native in different US/MR. With this hook we avoid
 * showing empty swimlanes while development is still in progress.
 *
 * @param partials The full list of partials (typename and urn) to be render by CardGroups
 * @param isCardImplemented A function that checks if a given typename is valid
 * @returns The filtered list
 */
function useCardGroupItems<T extends CardPartial>(
  partials: T[],
  isCardImplemented: (typename: string) => boolean,
): T[] {
  const items = useMemo(
    () => partials.filter((item) => isCardImplemented(item.typename)),
    [partials, isCardImplemented],
  );

  return items;
}

export default useCardGroupItems;
