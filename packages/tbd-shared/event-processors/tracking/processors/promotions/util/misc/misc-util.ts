import { DisplayMode } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { ViewLink } from "@ppb/the-wall-common/types";

export function convertViewLink(viewLink: {
  viewUrn: string;
  viewUrl: string;
  viewDisplayMode?: string | null;
}): ViewLink {
  const { viewUrn, viewUrl } = viewLink;
  const viewDisplayMode = "viewDisplayMode" in viewLink ? (viewLink.viewDisplayMode as DisplayMode) : null;

  return {
    viewUrn,
    viewUrl,
    viewDisplayMode,
  };
}
