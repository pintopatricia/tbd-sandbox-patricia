import type { Context, Platform } from "@flutter-global/loop-client-javascript-sdk/src/context/types";
import { UserDetailsState, isOnlineUserDetails } from "@ppb/tbd-store";
import { Jurisdiction } from "@ppb/tbd-store/config/Jurisdiction";
import { getHttpClientsConfig } from "@ppb/tbd-store/services/client-factory";
import { getUserJurisdiction } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getLoopClientConfig } from "../config/endpoints";

function buildContextUser(userdetails: UserDetailsState, jurisdiction: Jurisdiction, vid: string): Context["user"] {
  const baseContext = {
    vid,
    countryCode: userdetails.countryCode,
    jurisdiction,
  };

  if (!isOnlineUserDetails(userdetails)) {
    return baseContext;
  }

  return {
    ...baseContext,
    accountId: userdetails.accountId,
  };
}

export function buildLoopContext(userdetails: UserDetailsState, platform: Platform, visitorId: string) {
  const { APP_KEY } = getHttpClientsConfig();
  const loopClientConfig = getLoopClientConfig();

  if (!visitorId) {
    console.warn("LoopClient initialisation: missing visitorId");
  }

  if (!loopClientConfig || !loopClientConfig.key || !loopClientConfig.brand) {
    console.warn("LoopClient initialisation: invalid loopClientConfig");
    return null;
  }

  const jurisdiction = getUserJurisdiction(userdetails);

  if (!jurisdiction) {
    console.warn("LoopClient initialisation: missing jurisdiction");
    return null;
  }

  return {
    product: loopClientConfig.key,
    platform,
    brand: loopClientConfig.brand as Context["brand"],
    appKey: APP_KEY,
    user: buildContextUser(userdetails, jurisdiction, visitorId),
  };
}
