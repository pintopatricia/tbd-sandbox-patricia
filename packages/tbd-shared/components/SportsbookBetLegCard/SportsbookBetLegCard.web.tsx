import { Fragment, FunctionComponent, useCallback, MouseEvent, useMemo, useRef, useEffect } from "react";

import { RacingSport, Result } from "@ppb/tbd-store/state/constants";
import { BetSelectionDetails, Divider, SilkWrapper, TrapWrapper, useOnIntersect } from "@ppb/the-wall-web";
import { SportIcon } from "@ppb/the-wall-icons/SportIcon/SportIcon";

import { FallbackIconType, ViewLink } from "@ppb/the-wall-common/types";
import INTERSECTION_CONFIG from "../../config/cards-intersection";
import ConnectedEnhancedTracking from "../EnhancedTracking";
import ConnectedObbEnhancedTracking from "../ObbEnhancedTracking";
import ObbEnhancedTracking from "../ObbEnhancedTracking/ObbEnhancedTracking.web";
import EnhancedTracking from "../EnhancedTracking/EnhancedTracking.web";

import { ComponentProps } from "./props";
import styles from "./SportsbookBetLegCard.web.css";
import { getSilkFallbackType } from "../../helpers/race";
import { resolveTrapIconVM } from "../../helpers/greyhound-trap-icon-helper";

const getResultSportColor = (result: Result | undefined) => {
  switch (result) {
    case Result.WON:
    case Result.WINNING:
      return "var(--bet-selection-details-sports-icon-won-colour)";

    case Result.LOST:
    case Result.LOSING:
      return "var(--bet-selection-details-sports-icon-lost-colour)";

    default:
      return "var(--bet-selection-details-sports-icon-neutral-colour)";
  }
};

const SportsbookBetLegCard: FunctionComponent<ComponentProps> = ({
  legParts,
  cardUrn,
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
  dispatchNavigateToViewLinkAction,
  dispatchPushAction,
}) => {
  const isSubscribedToUpdates = useRef(false);
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, INTERSECTION_CONFIG.rootMargin);

  // For now, only in OBB will there be more than one leg part. And in that case these values are the same for all parts.
  const {
    fixtureURN,
    fixtureTypename,
    participantId,
    isSuperSub,
    result,
    sportId,
    silkUrl,
    trap,
    meetingCountry,
    showSilk,
    showSportsIcon,
  } = legParts[0];

  useEffect(() => {
    if (isSuperSub && fixtureURN && fixtureTypename && participantId) {
      if (isIntersecting && !isSubscribedToUpdates.current) {
        dispatchSubscribeFixtureUpdates(fixtureURN, fixtureTypename, participantId, isSuperSub);
        isSubscribedToUpdates.current = true;
      }

      return () => {
        if (isSubscribedToUpdates.current) {
          dispatchUnsubscribeFixtureUpdates(fixtureURN, fixtureTypename);
          isSubscribedToUpdates.current = false;
        }
      };
    }

    return () => {};
  }, [
    dispatchSubscribeFixtureUpdates,
    dispatchUnsubscribeFixtureUpdates,
    fixtureTypename,
    fixtureURN,
    isIntersecting,
    isSuperSub,
    participantId,
  ]);

  const silkFallbackType = sportId && getSilkFallbackType(Number(sportId));

  const IconComponent = useMemo(() => {
    if (!showSilk) {
      return undefined;
    }

    if (Number(sportId) === RacingSport.HORSE_RACING) {
      return <SilkWrapper silkUrl={silkUrl} silkFallbackType={silkFallbackType as FallbackIconType} />;
    }

    if (Number(sportId) === RacingSport.GREYHOUND_RACING && meetingCountry) {
      const trapVm = resolveTrapIconVM(meetingCountry, trap);

      return <TrapWrapper {...trapVm} />;
    }

    return undefined;
  }, [showSilk, silkFallbackType, silkUrl, sportId, trap, meetingCountry]);

  const sportIcon = useMemo(() => {
    if (!showSportsIcon || !sportId) return undefined;

    const sportIconColor = getResultSportColor(result);

    return (
      <div className={styles.sportsIconContainer}>
        <SportIcon sportId={sportId} color={sportIconColor} />
      </div>
    );
  }, [showSportsIcon, sportId, result]);

  const handleNavigationPress = useCallback(
    (e: MouseEvent, viewLink: ViewLink) => {
      e.preventDefault();

      dispatchNavigateToViewLinkAction(viewLink.viewUrl, "");
      dispatchPushAction(viewLink);
    },
    [dispatchNavigateToViewLinkAction, dispatchPushAction],
  );
  return (
    <div ref={ref} className={styles.betLegCardContainer}>
      {legParts.map((legPart, index) => (
        <Fragment key={`${legPart.betId}-${index}`}>
          <div className={styles.betLegCardContent}>
            <BetSelectionDetails
              previousTitle={legPart.previousTitle}
              title={legPart.title}
              subtitle={legPart.subtitle}
              tertiaryTitle={legPart.tertiaryTitle}
              statusLabel={legPart.statusLabel}
              racingLabel={legPart.racingLabel}
              odd={legPart.odd}
              previousOdd={legPart.previousOdd}
              navigationViewLink={legPart.navigationViewLink}
              onNavigationPress={handleNavigationPress}
              selectionTypeIcon={legPart.selectionTypeIcon}
              is90Min={legPart.is90Min}
              sportIcon={sportIcon}
              icon={IconComponent}
            />
            {legPart.eventUrn && legPart.outcomeDefinitionExp && !legPart.expressionComponents && (
              <ConnectedEnhancedTracking
                component={EnhancedTracking}
                eventUrn={legPart.eventUrn}
                includeSubstitutions={legPart.isSuperSub}
                outcomeDefinitionExp={legPart.outcomeDefinitionExp}
                result={legPart.result}
              />
            )}
            {legPart.eventUrn &&
              !legPart.outcomeDefinitionExp &&
              legPart.expressionComponents &&
              legPart.result !== Result.VOID && (
                <ConnectedObbEnhancedTracking
                  component={ObbEnhancedTracking}
                  eventUrn={legPart.eventUrn}
                  expressionComponents={legPart.expressionComponents}
                  expressionMetadata={legPart.expressionMetadata}
                  result={legPart.result}
                  cardUrn={cardUrn}
                  betLegPartType={legPart.betLegPartType}
                />
              )}
          </div>
          {index < legParts.length - 1 && (
            <div className={styles.dividerContainer}>
              <Divider />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default SportsbookBetLegCard;
