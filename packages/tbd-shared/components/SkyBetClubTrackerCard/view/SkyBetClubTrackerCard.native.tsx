import { FunctionComponent, useCallback } from "react";
import { navigate } from "@ppb/tbd-router";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { DisplayMode } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import useSkyBetClubTrackerVM from "../viewmodel/SkyBetClubTracker.viewmodel";
import { SkyBetClubTracker } from "./snowflakes/SkyBetClubTracker/SkyBetClubTracker.native";

const SkyBetClubTrackerCard: FunctionComponent = () => {
  const {
    vm: { data: vmData, events: vmEvents },
  } = useSkyBetClubTrackerVM();

  const onPrimaryButtonTap = useCallback(() => {
    vmEvents.onHomepageLinkTapEvent(vmData.homePageUrl);
    navigate({
      viewUrn: EntityType.ExternalView,
      viewUrl: vmData.homePageUrl,
      viewDisplayMode: DisplayMode.BlankWebview,
    });
  }, [vmData.homePageUrl, vmEvents]);

  return (
    <SkyBetClubTracker
      sbcStatus={vmData.sbcStatus}
      current={vmData.current}
      target={vmData.target}
      fulfilled={vmData.fulfilled}
      counterLabel={vmData.counterLabel}
      onPrimaryButtonTap={vmData.homePageUrl ? onPrimaryButtonTap : undefined}
      i18n={vmData?.i18n}
      logo={vmData.logo}
    />
  );
};

export default SkyBetClubTrackerCard;
