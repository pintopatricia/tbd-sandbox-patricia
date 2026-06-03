import { useState, useCallback, useMemo } from "react";
import { i18n } from "../helpers/i18n";

type Props<T> = {
  /** The show more state. Should be provided by the "useShowMore" hook. */
  isItemsListCollapsed: boolean;
  /** A list of any type to be used on sorting functionality */
  items: T[];
  /** The minimum number of rows or items that should be displayed */
  numberOfItemsToDisplay?: number;
  /** Key of the property to sort items by. Examples: "label", "name", "title" */
  sortKey: keyof T;
  /** A dispatch function used for GTM */
  dispatchAzSwitchClick: (label: string, isToggleOn: boolean) => void;
};

type ReturnProps<T> = {
  /** The items list sorted state */
  isSorted: boolean;
  /** The A-Z Switch translation */
  azSwitcherLabel: string;
  /** A list of items to display based on the items provided as an input */
  itemsToDisplay: T[];
  /** A callback that controls the A-Z switch toggled state. Should be passed down to the visual component */
  onSwitch: (isChecked: boolean) => void;
};

/**
 * A hook that isolates the necessary logic to use the alphabetical sort switcher (A-Z Switch)
 * so it doesn't need to be repeated in every component that uses that feature and can be more easily maintained
 * Since that feature depends on the "Show More" feature some props related to that are required.
 * This hook should be used with and after the "useShowMore" hook.
 */
function useAlphabeticalSort<T>({
  items,
  numberOfItemsToDisplay,
  sortKey,
  isItemsListCollapsed,
  dispatchAzSwitchClick,
}: Props<T>): ReturnProps<T> {
  const [isSorted, setIsSorted] = useState(false);

  const azSwitcherLabel = i18n({ key: "I18N.ALPHABETICAL_SORTING_SWITCHER" });

  type Item<I> = I & { [key: string]: string };

  const localSortItems = useCallback(
    (unsortedItems: Item<T>[]) => [...unsortedItems].sort((a, b): number => a[sortKey].localeCompare(b[sortKey])),
    [sortKey],
  );

  const itemsToDisplay = useMemo(() => {
    const sorted = isSorted ? localSortItems(items as Item<T>[]) : items;

    if (isItemsListCollapsed) {
      return sorted.slice(0, numberOfItemsToDisplay || sorted.length);
    }
    return sorted;
  }, [isSorted, isItemsListCollapsed, items, numberOfItemsToDisplay, localSortItems]);

  const onSwitch = useCallback(
    (isChecked: boolean) => {
      setIsSorted(isChecked);
      dispatchAzSwitchClick(azSwitcherLabel, isChecked);
    },
    [azSwitcherLabel, dispatchAzSwitchClick],
  );

  return {
    azSwitcherLabel,
    isSorted,
    itemsToDisplay,
    onSwitch,
  };
}

export default useAlphabeticalSort;
