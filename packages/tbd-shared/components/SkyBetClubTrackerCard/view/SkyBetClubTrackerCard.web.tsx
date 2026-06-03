import { FunctionComponent, useCallback } from "react";
import useSkyBetClubTrackerVM from "../viewmodel/SkyBetClubTracker.viewmodel";
import { SkyBetClubTracker } from "./snowflakes/SkyBetClubTracker/SkyBetClubTracker.web";

const SkyBetClubTrackerCard: FunctionComponent = () => {
  const {
    vm: { data: vmData, events: vmEvents },
  } = useSkyBetClubTrackerVM();

  const onPrimaryButtonTap = useCallback(() => {
    vmEvents.onHomepageLinkTapEvent(vmData.homePageUrl);
    window.location.href = vmData.homePageUrl;
  }, [vmData.homePageUrl, vmEvents]);

  return (
    <SkyBetClubTracker
      logo={vmData.logo}
      sbcStatus={vmData.sbcStatus}
      current={vmData.current}
      target={vmData.target}
      fulfilled={vmData.fulfilled}
      counterLabel={vmData.counterLabel}
      onPrimaryButtonTap={vmData.homePageUrl ? onPrimaryButtonTap : undefined}
      i18n={vmData?.i18n}
    />
  );
};

export default SkyBetClubTrackerCard;
