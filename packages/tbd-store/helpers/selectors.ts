import { shallowEqual } from "react-redux";
import { defaultMemoize, createSelectorCreator, createSelector } from "reselect";

/**
 * Note: make sure this applies to your use case
 * we only need this when there is a poller associated with the respective entity
 */
// see https://github.com/reduxjs/reselect/issues/384
const createShallowEqualSelector: typeof createSelector = createSelectorCreator(defaultMemoize, shallowEqual);

export { createShallowEqualSelector };
