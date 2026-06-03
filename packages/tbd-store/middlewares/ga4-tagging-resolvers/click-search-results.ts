import { buildClickSearchResultsEvent, ClickSearchResultsEvent } from "tagging-library";
import { SearchLinkClickAction } from "../../actions/browse";
import { getCurrentUrlOrViewType, getModuleData } from "./helpers";
import { ApplicationState } from "../../state";

export const getSearchLinkClickEvent = (
  action: SearchLinkClickAction,
  state: ApplicationState,
): ClickSearchResultsEvent => {
  const { text, order, name, numberOfResults, url: destinationUrl } = action.payload;

  const currentView = getCurrentUrlOrViewType(state);

  return buildClickSearchResultsEvent({
    searchTerm: text,
    searchCount: `${numberOfResults}`,
    elementText: name,
    module: getModuleData("search results", currentView),
    searchIndex: `${order}`,
    eventContext: destinationUrl,
  });
};
