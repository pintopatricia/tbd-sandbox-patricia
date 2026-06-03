import { FunctionComponent, useCallback, useEffect, useRef, MouseEvent } from "react";
import { Divider, RaceDetails } from "@ppb/the-wall-web";
import useOnIntersect from "@ppb/the-wall-web/hooks/useOnIntersect";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import INTERSECTION_CONFIG from "../../config/cards-intersection";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.web";
import { ComponentProps } from "./props";
import styles from "./RaceMarketCard.web.css";

const RaceMarketCard: FunctionComponent<ComponentProps> = ({
  dispatchPush,
  dispatchSubscribeRaceUpdates,
  dispatchUnsubscribeRaceUpdates,
  dispatchNavigateToRaceFromRaceDetails,
  countryFlag,
  meetingName,
  meetingEntityName,
  numberOfRunners,
  displayRunners,
  raceName,
  raceStatusLabel,
  raceTime,
  raceURN,
  raceViewLink,
  runnerViewLinks,
  runnersLabel,
  title,
  trackGoing,
  urn,
  showMeetingInfo,
  isRunnerExpandable,
  marketPromo,
  isRaceRunningStatus,
  infoBlurbs,
  onLinkClick,
  onMarketPromoClick,
}) => {
  const isRaceSubscribedToUpdates = useRef(false);
  const onRaceDetailsClick = useCallback(
    (e: MouseEvent): void => {
      e.preventDefault();
      dispatchNavigateToRaceFromRaceDetails(raceViewLink.viewUrl, urn, meetingEntityName);
      dispatchPush(raceViewLink);
    },
    [dispatchNavigateToRaceFromRaceDetails, dispatchPush, meetingEntityName, raceViewLink, urn],
  );

  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, INTERSECTION_CONFIG.rootMargin);

  useEffect(() => {
    if (isIntersecting && !isRaceSubscribedToUpdates.current) {
      dispatchSubscribeRaceUpdates(raceURN);
      isRaceSubscribedToUpdates.current = true;
    } else if (!isIntersecting && isRaceSubscribedToUpdates.current) {
      dispatchUnsubscribeRaceUpdates(raceURN);
      isRaceSubscribedToUpdates.current = false;
    }
  }, [isIntersecting, dispatchSubscribeRaceUpdates, raceURN, dispatchUnsubscribeRaceUpdates]);

  return (
    <div className={styles.raceMarketCardContainer} ref={ref}>
      <a href={raceViewLink.viewUrl} onClick={onRaceDetailsClick}>
        <RaceDetails
          raceName={raceName}
          numberOfRunners={numberOfRunners}
          runnersLabel={runnersLabel}
          trackGoing={trackGoing}
          raceStatusLabel={raceStatusLabel}
          isRaceRunningStatus={isRaceRunningStatus}
          countryFlag={countryFlag}
          meetingName={meetingName}
          raceTime={raceTime}
          showMeetingInfo={showMeetingInfo}
          isHighlighted
        />
      </a>
      <Divider />
      <ConnectedMarket
        cardUrn={urn}
        title={title}
        runnerViewLinks={runnerViewLinks}
        displayRunners={displayRunners}
        component={Market}
        eventViewLink={raceViewLink}
        isRunnerExpandable={isRunnerExpandable}
        marketPromo={marketPromo}
        infoBlurbs={infoBlurbs}
        onLinkClick={onLinkClick}
        onMarketPromoClick={onMarketPromoClick}
        template={MarketTemplate.Default}
      />
    </div>
  );
};

export default RaceMarketCard;
