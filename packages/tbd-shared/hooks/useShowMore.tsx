import { useState, useCallback, useMemo } from "react";

type Props<T> = {
  /** A list of any type to be used on show more and sorting functionalities */
  items: T[];

  /** The minimum number of rows or items that should be displayed */
  numberOfItemsToDisplay?: number;
};

type ReturnProps<T> = {
  /** A list of items to display based on the items provided as an input */
  itemsToDisplay: T[];

  /**
   * It specifies if the "Show More" feature is available.
   * Can be used to avoid repeating logic, such as `items.length > numberOfItemsToDisplay`.
   * Don't use this to infer visibility. The "ShowMore" component does that validation internally.
   */
  isShowMoreAvailable: boolean;

  /**
   * It specifies if the "Show More" is hiding items or not.
   * Don't use this to infer visibility. The "ShowMore" component does that validation internally.
   */
  isItemsListCollapsed: boolean;

  /**
   * A callback that controls the items "hiding" state.
   * Should be passed down to the visual component, so it can react to click events
   */
  onShowMoreChange: (newState: boolean) => void;
};

/**
 * A hook that isolates the necessary logic to use the "show more" toggle,
 * so it doesn't need to be repeated in every component that uses that feature and can be more easily maintained.
 */
function useShowMore<T>({ items, numberOfItemsToDisplay }: Props<T>): ReturnProps<T> {
  const isShowMoreAvailable = !!numberOfItemsToDisplay && items.length > numberOfItemsToDisplay;

  const [isItemsListCollapsed, setItemsListCollapsed] = useState(isShowMoreAvailable);

  const onShowMoreChange = useCallback(
    (newState: boolean) => {
      if (isShowMoreAvailable) {
        setItemsListCollapsed(newState);
      }
    },
    [isShowMoreAvailable],
  );

  const itemsToDisplay = useMemo(
    () => (isItemsListCollapsed ? items.slice(0, numberOfItemsToDisplay) : items),
    [isItemsListCollapsed, numberOfItemsToDisplay, items],
  );

  return {
    itemsToDisplay,
    isShowMoreAvailable,
    isItemsListCollapsed,
    onShowMoreChange,
  };
}

export default useShowMore;
