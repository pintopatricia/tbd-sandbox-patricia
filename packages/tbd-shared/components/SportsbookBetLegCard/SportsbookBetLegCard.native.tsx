import { FunctionComponent, useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";

import { BetSelectionDetails, Divider, SilkWrapper, TrapWrapper } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router/native";
import { SportIcon } from "@ppb/the-wall-icons/SportIcon/SportIcon";

import { RacingSport, Result } from "@ppb/tbd-store/state/constants";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { FallbackIconType, RoundButtonSize, RoundButtonState } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import LottoSelections from "@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/LottoSelections/LottoSelections.native";
import ConnectedEnhancedTracking from "../EnhancedTracking";
import EnhancedTracking from "../EnhancedTracking/EnhancedTracking.native";
import ConnectedObbEnhancedTracking from "../ObbEnhancedTracking";
import ObbEnhancedTracking from "../ObbEnhancedTracking/ObbEnhancedTracking.native";
import { ComponentProps } from "./props";
import styles from "./SportsbookBetLegCard.native.styles";
import { getSilkFallbackType } from "../../helpers/race";
import { SBK_BET_LEG_CARD, SBK_BET_LEG_CARD_CONTENT } from "./SportsbookBetLegCard.native.selectors";
import { resolveTrapIconVM } from "../../helpers/greyhound-trap-icon-helper";

const getResultSportColor = (result: Result | undefined) => {
  switch (result) {
    case Result.WON:
    case Result.WINNING:
      return tokens.BetSelectionDetailsSportsIconWonColour;

    case Result.LOST:
    case Result.LOSING:
      return tokens.BetSelectionDetailsSportsIconLostColour;

    default:
      return tokens.BetSelectionDetailsSportsIconNeutralColour;
  }
};

const SportsbookBetLegCard: FunctionComponent<ComponentProps> = ({
  legParts,
  cardUrn,
  dispatchNavigateToViewLinkAction,
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
}) => {
  const {
    fixtureURN,
    fixtureTypename,
    participantId,
    isSuperSub,
    result,
    sportId,
    silkUrl,
    showSilk,
    meetingCountry,
    trap,
    showSportsIcon,
    navigationViewLink,
  } = legParts[0];

  useEffect(() => {
    if (isSuperSub && fixtureURN && fixtureTypename && participantId) {
      dispatchSubscribeFixtureUpdates(fixtureURN, fixtureTypename, participantId, isSuperSub);

      return () => {
        dispatchUnsubscribeFixtureUpdates(fixtureURN, fixtureTypename);
      };
    }

    return () => {};
  }, [
    dispatchSubscribeFixtureUpdates,
    dispatchUnsubscribeFixtureUpdates,
    fixtureTypename,
    fixtureURN,
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
      <View style={styles.sportsIconContainer}>
        <SportIcon sportId={sportId} color={sportIconColor} />
      </View>
    );
  }, [showSportsIcon, sportId, result]);

  const handleNavigationPress = useCallback(() => {
    if (navigationViewLink) {
      navigate(navigationViewLink);
      dispatchNavigateToViewLinkAction(navigationViewLink.viewUrl, "");
    }
  }, [dispatchNavigateToViewLinkAction, navigationViewLink]);

  return (
    <View style={styles.betLegCardContainer} {...getTestProps(SBK_BET_LEG_CARD, false)}>
      {legParts.map((legPart, index) => (
        <View key={`${legPart.betId}-${index}`}>
          <View style={index > 0 ? styles.betLegCardContent : null} {...getTestProps(SBK_BET_LEG_CARD_CONTENT, false)}>
            {legPart.isLotteries ? (
              <BetSelectionDetails
                title={
                  !!legPart.runners && (
                    <LottoSelections
                      runners={legPart.runners}
                      size={RoundButtonSize.SMALL}
                      state={RoundButtonState.READ_ONLY}
                    />
                  )
                }
                statusLabel={legPart.statusLabel}
                racingLabel={legPart.racingLabel}
                navigationViewLink={legPart.navigationViewLink}
                onNavigationPress={handleNavigationPress}
              />
            ) : (
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
                is90Min={legPart.is90Min}
                selectionTypeIcon={legPart.selectionTypeIcon}
                sportIcon={sportIcon}
                icon={IconComponent}
              />
            )}
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
          </View>

          {index < legParts.length - 1 && (
            <View style={styles.dividerContainer}>
              <Divider />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default SportsbookBetLegCard;
