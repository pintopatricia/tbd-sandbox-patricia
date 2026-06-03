import { createClientFactory } from "./client-factory";
import Catalogue from "../clients/catalogue/catalogue-client";
import appContextQuery from "../clients/catalogue/app_context_query.graphql";
import appVersionQuery from "../clients/catalogue/app_version_query.graphql";
import { AppContextQuery, AppVersionQuery } from "../clients/catalogue/catalogue-response-types";
import { ThrottleOverrides } from "../state";

const bffAppContextClientFactory = (defaultBasePath: string) => createClientFactory(Catalogue, defaultBasePath);

export function getAppContextFromBFF(
  defaultBffEndpoint?: string,
  token?: string | null,
  throttleOverrides?: ThrottleOverrides,
): Promise<AppContextQuery> {
  const catalogueClient = bffAppContextClientFactory(defaultBffEndpoint || "")("CATALOGUE");
  return catalogueClient.getAppContext(appContextQuery, token, throttleOverrides);
}

export function getAppVersion(
  latestBffEndpoint?: string,
  throttleOverrides?: ThrottleOverrides,
): Promise<AppVersionQuery> {
  const catalogueClient = bffAppContextClientFactory(latestBffEndpoint || "")("CATALOGUE_LATEST");

  return catalogueClient.getAppVersion(appVersionQuery, throttleOverrides);
}
