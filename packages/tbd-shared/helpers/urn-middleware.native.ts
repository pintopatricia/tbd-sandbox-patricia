import { Middleware } from "redux";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "@ppb/tbd-store/actions/catalogue";
import { VIEW_REDIRECT, ViewRedirectAction } from "@ppb/tbd-store/actions/router";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { NativeEntityTypes, navigate } from "@ppb/tbd-router/native";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { getValidGameLaunchPatterns } from "./gaming.native";

type HandledAction = FetchCatalogueSuccessAction | ViewRedirectAction;

const isSameView = (routerUrn: string | null | undefined, requestedUrns: string[]): boolean =>
  !!routerUrn && requestedUrns.includes(routerUrn);

const isHomeView = (routerUrn: string | null | undefined, requestedUrns: string[]): boolean =>
  !!routerUrn && requestedUrns.includes(routerUrn) && routerUrn === NativeEntityTypes.Home;

const isMaintenanceView = (routerView: string | null | undefined): boolean => routerView === EntityType.MaintenanceView;

const isGameLaunchView = (routerUrl: string | null | undefined): boolean => {
  if (getValidGameLaunchPatterns().some((pattern) => routerUrl?.match(pattern))) return true;

  return false;
};

export const createUrnMiddleware =
  (popLastFromStack: () => void): Middleware<Record<string, never>, ApplicationState> =>
  ({ getState }) =>
  (next) =>
  (action: HandledAction) => {
    switch (action.type) {
      case VIEW_REDIRECT: {
        const { viewUrn, viewUrl } = action.payload;
        popLastFromStack();
        navigate({ viewUrn, viewUrl });
        break;
      }
      case FETCH_CATALOGUE_SUCCESS: {
        const requestedUrns = action.payload.requestedUrns || [];
        const { router } = action.payload;
        const { currentUrn: storeCurrentUrn } = getState().router;

        if (
          (!router?.currentUrn && !router?.currentUrl) ||
          isSameView(router?.currentUrn, requestedUrns) ||
          isHomeView(router?.currentUrn, requestedUrns) ||
          isMaintenanceView(router?.currentView) ||
          storeCurrentUrn === router?.currentUrn ||
          isGameLaunchView(router?.currentUrl)
        ) {
          break;
        }

        if (storeCurrentUrn !== router?.currentUrn && !isSameView(router?.currentUrn, requestedUrns)) {
          popLastFromStack();
          navigate({ viewUrn: router?.currentUrn, viewUrl: router?.currentUrl });
        }
        break;
      }
      default:
        break;
    }

    return next(action);
  };
