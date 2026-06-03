import { EntityType } from "@ppb/tbd-urn-codecs";
import { getEndpoint } from "../../config/endpoints";
import { base64EncodeUrl } from "../../helpers/navigation";

type DepositRedirectPayload = { viewUrn: string; viewUrl: string };

export const buildDepositRedirectPayload = (
  urlComponent: string | number | boolean,
  amount?: number,
): DepositRedirectPayload => {
  const depositEndpoint = getEndpoint("DEPOSIT");

  const url = new URL(depositEndpoint);
  url.searchParams.set("returnURL", urlComponent.toString());

  if (amount) {
    url.searchParams.set("amount", amount.toString());
  }

  const encodedUrl = base64EncodeUrl(url.toString());
  const viewUrn = `${EntityType.MyAccountView}:${encodedUrl}`;
  const viewUrl = `/navigation/a-${encodedUrl}`;

  return { viewUrn, viewUrl };
};
