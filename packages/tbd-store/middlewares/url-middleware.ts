import { Dispatch, Middleware } from "redux";
import { EntityType } from "@ppb/tbd-urn-codecs";

import {
  EXTERNAL_PUSH,
  EXTERNAL_PUSH_BLANK,
  ExternalPushAction,
  ExternalPushBlankAction,
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueSuccessAction,
  GENERIC_PUSH,
  GenericPushAction,
  PUSH,
  PushAction,
  TAB_ROUTE_UPDATE,
  TabRouteUpdateAction,
  VIEW_REDIRECT,
  ViewRedirectAction,
} from "../actions";
import { renderRedirectMetaElements } from "./seo/seo-common-renderer";
import { ViewLink } from "../state/layout/cards/ViewLink.types";
import { History } from "./router/history.types";

const FOLDER_SEPARATOR = "/";
const BLACKLISTED_ENCODED_CHARACTERS = [
  "%2F", // slash ("/")
  "%25", // percent ("%")
];

const baseHref = document.getElementsByTagName("base")[0]?.getAttribute("href") || "";

type ExpectedActions =
  | PushAction
  | ExternalPushAction
  | GenericPushAction
  | ExternalPushBlankAction
  | FetchCatalogueSuccessAction
  | TabRouteUpdateAction
  | ViewRedirectAction;

const hasBlacklistedEncodedCharacters = (str: string): boolean =>
  BLACKLISTED_ENCODED_CHARACTERS.some((blacklisted) => str.includes(blacklisted));

/**
 * Decodes a given URL through `decodeURIComponent` but escapes blacklisted encoded characters
 *
 * @param {String} viewUrl View URL
 * @returns Decoded URL with escaped encoded slashes
 */
const decodeViewUrl = (viewUrl: string): string =>
  viewUrl
    .split(FOLDER_SEPARATOR)
    .map((str) => (hasBlacklistedEncodedCharacters(str) ? str : decodeURIComponent(str)))
    .join(FOLDER_SEPARATOR);

type HistoryUpdater<S> = (viewUrl: string, state: S, replace?: boolean) => void;

function getHistoryUpdater<HistoryState extends ViewLink, H extends History<HistoryState>>(
  history: H,
): HistoryUpdater<HistoryState> {
  return (viewUrl: string, state: HistoryState, replace = false): void => {
    const url = `${baseHref}${viewUrl}`.replace("//", "/");
    const { pathname, search, hash } = window.location;

    const decodedStateViewUrl = decodeViewUrl(state.viewUrl);
    const decodedHistoryViewUrl = history.location.state ? decodeViewUrl(history.location.state.viewUrl) : "";
    // Comparing decoded URLs in order to avoid false redirects
    if (replace && decodedHistoryViewUrl !== decodedStateViewUrl) {
      history.replace(url, { ...state });

      // TODO: Remove this and apply a proper fix
      // Currently the homepage url is being handled in 2 different ways ("" and "/") and
      // that causes unnecessary redirects to the prerender bot
      if (state.viewUrn !== "ppb:tbd:view:generic:home") {
        // viewUrl may have been encoded through encodeURI,
        // which doesn't encode some special characters, hence this cleanup
        renderRedirectMetaElements(baseHref, viewUrl);
      }
    } else if (decodeURIComponent(url) !== decodeURIComponent(pathname + search + hash)) {
      history.push(url, state);
    }

    // TODO: This is a temporary fix for, when navigating to a new page,
    // the scroll preserves his position.
    // So we need to manually go to the top of the page
    window.scrollTo(0, 0);

    /*
     * Global scrollable is not available on the desktop template.
     * So we need to scroll the middle section to the top instead of the window.
     * To do that, we add an identifier to the middle element.
     * */
    document.getElementById("scrollable-desktop-container")?.scrollTo(0, 0);

    // TODO: Safari IOS is not rendering the content because of repaint issues
    // This solution is temporary to let safari render the content properly
    const isSafari = navigator.vendor.match(/apple/i);
    const element = document.querySelector(".scrollable") as HTMLElement;

    if (isSafari && element) {
      setTimeout(() => {
        element.style.display = "none";

        element.offsetHeight;
        element.style.display = "";
      }, 1000);
    }
  };
}

function shouldUpdateHistory(action: FetchCatalogueSuccessAction): boolean {
  const { withPagination } = action.payload;
  const { category, currentUrn } = action.payload.router || {};

  return !(withPagination || category === "MODAL" || currentUrn === "ppb:tbd:view:settings:settings");
}

export const urlMiddleware: <HistoryState extends ViewLink, H extends History<HistoryState>>(
  history: H,
) => Middleware =
  (history) =>
  ({ dispatch }) =>
  (next: Dispatch<ExpectedActions>) =>
  (action: ExpectedActions) => {
    const update = getHistoryUpdater(history);

    switch (action.type) {
      case PUSH: {
        if (action.payload.viewUrn.includes(EntityType.ExternalView)) {
          dispatch<ExternalPushAction>({
            type: EXTERNAL_PUSH,
            payload: action.payload,
          });
          return;
        }

        update(action.payload.viewUrl, action.payload);
        break;
      }
      case VIEW_REDIRECT: {
        dispatch<PushAction>({
          type: PUSH,
          payload: action.payload,
        });
        break;
      }
      case FETCH_CATALOGUE_SUCCESS: {
        const { currentUrl, currentUrn } = action.payload.router || {};

        // currentUrl can be falsy when navigating to homepage
        if (currentUrl !== undefined && currentUrn && shouldUpdateHistory(action)) {
          update(currentUrl, { viewUrn: currentUrn, viewUrl: currentUrl }, true);
        }

        break;
      }
      case GENERIC_PUSH:
        if (action.payload.viewUrn.includes(EntityType.ExternalView)) {
          dispatch<ExternalPushAction>({
            type: EXTERNAL_PUSH,
            payload: action.payload,
          });

          return;
        }

        dispatch<PushAction>({
          type: PUSH,
          payload: action.payload,
        });

        break;
      case EXTERNAL_PUSH:
        window.location.assign(action.payload.viewUrl);
        break;
      case EXTERNAL_PUSH_BLANK:
        window.open(action.payload.viewUrl, "_blank");
        break;
      case TAB_ROUTE_UPDATE: {
        if (action.payload.viewLink) {
          const { viewUrl, viewUrn } = action.payload.viewLink;
          update(viewUrl, { viewUrn, viewUrl }, true);
          break;
        }

        break;
      }
      default:
        break;
    }

    next(action);
  };
