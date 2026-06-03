import { Dispatch } from "redux";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../actions/catalogue";
import { PushAction, PUSH } from "../../actions/router";
import { RouterState } from "../../state/router/RouterState.types";
import { CatalogueServiceLayout } from "../../services/catalogue/catalogue-service";

type ActionTypes = PushAction | FetchCatalogueSuccessAction;

export const bootstrapApp = (
  dispatch: Dispatch<ActionTypes>,
  routerState: RouterState,
  preloadedCatalog: CatalogueServiceLayout | null,
): void => {
  const viewLink = {
    viewUrn: routerState.currentUrn || "",
    viewUrl: routerState.currentUrl || "",
  };

  if (preloadedCatalog) {
    // Loads data from preloaded catalog
    dispatch<FetchCatalogueSuccessAction>({
      type: FETCH_CATALOGUE_SUCCESS,
      payload: {
        ...preloadedCatalog,
        requestedUrns: [viewLink.viewUrn],
      },
    });
  } else {
    // triggers request to catalog
    dispatch<PushAction>({ type: PUSH, payload: viewLink });
  }
};
