import { SeoMetadataService } from "@flutter-global/uki-channels-http-clients";
import {
  PageData,
  PageIdentifier,
  UserData,
  SmdResponse,
} from "@flutter-global/uki-channels-http-clients/src/clients/SeoMetadataService/SeoMetadata";

import { createClientFactory } from "./client-factory";

const seoMetadataServiceClientFactory = createClientFactory(SeoMetadataService);

export const getMetadata = (
  metaElements: string[],
  pageIdentifier: PageIdentifier,
  pageData: PageData,
  userData: UserData,
): Promise<SmdResponse> => {
  const seoMetadataService = seoMetadataServiceClientFactory("SMD");

  return seoMetadataService.getMetadata(metaElements, pageData, pageIdentifier, { userData });
};
