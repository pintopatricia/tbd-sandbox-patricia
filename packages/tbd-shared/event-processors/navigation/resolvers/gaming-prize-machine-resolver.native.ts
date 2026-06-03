import { NativeViewLink, navigate } from "@ppb/tbd-router";
import { DisplayMode } from "@ppb/the-wall-common/types/ViewLink.types";

type ViewLink = {
  viewUrn: string;
  viewUrl: string;
  viewDisplayMode?: DisplayMode | null;
};

type PrizeMachineNavPayload = {
  urn: string;
  viewLink: ViewLink;
};

function convertViewLink(viewLink: ViewLink): NativeViewLink {
  const { viewUrn, viewUrl } = viewLink;
  const viewDisplayMode = viewLink.viewDisplayMode ?? null;

  return {
    viewUrn,
    viewUrl,
    viewDisplayMode,
  };
}

export function gamingPrizeMachineNavigateProcessor(payload: PrizeMachineNavPayload) {
  const viewLink = convertViewLink(payload.viewLink);

  navigate(viewLink);
}
