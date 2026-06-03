import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createObbOnboardingCardsCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/obb-onboarding-cards-cardgroups/obb-onboarding-cards-cardgroups-selectors";
import { ObbOnboardingCard } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { NormalizedObbLeg } from "@ppb/tbd-store/services/catalogue/normalizer/entities/obb-leg/ObbLeg.types";
import { FixtureStatus } from "@ppb/tbd-store/state/constants";
import { DELETE_VIEW_ITEMS, DeleteViewItems } from "@ppb/tbd-store";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import {
  ContainerProps,
  DispatchProps,
  ObbOnboardingCardParticipant,
  ObbOnboardingCard as OnboardingCard,
  StateProps,
} from "./ObbOnboardingCardsCardGroup.props";
import { getIncidentDataMapping } from "../../helpers/obb";
import { i18n } from "../../helpers/i18n";
import { Dispatch } from "redux";
import {
  OBB_CARD__EVENT_SELECTION,
  OBB_ONBOARDING_CARDS__CARD_GROUP_DISPLAYED,
  OBB_ONBOARDING_CARDS__CARD_GROUP_SWIPED,
  ObbEventSelectionAction,
  ObbOnboardingCardsCardGroupDisplayedAction,
  ObbOnboardingCardsCardGroupNavigationAction,
} from "@ppb/tbd-store/actions/obb";

const buildParticipant = (participant: ObbOnboardingCard["participants"][number]): ObbOnboardingCardParticipant => ({
  urn: participant.urn,
  name: participant.player?.name ?? "",
  jersey: participant.team?.jerseys?.[0]?.url ?? undefined,
});

const getOutcomeId = (leg: NormalizedObbLeg | undefined): string | undefined => {
  const params = leg?.templateParams;
  if (params && "outcomeIds" in params) return params.outcomeIds[0];
  if (params && "outcomeId" in params) return params.outcomeId;
  return undefined;
};

const getOutcomeIcon = (outcomeId: string | undefined): Icons | undefined =>
  outcomeId ? getIncidentDataMapping(outcomeId)?.icon : undefined;

const buildOutcomeLabel = (
  leg: NormalizedObbLeg | undefined,
  cardType: "SquadVsSquad" | "SquadBet",
): string | undefined => {
  const outcomeId = getOutcomeId(leg);
  const outcomeText = outcomeId ? getIncidentDataMapping(outcomeId)?.text : undefined;

  if (!outcomeText) return undefined;

  return i18n({
    key:
      cardType === "SquadBet"
        ? "I18N.OBB.ONBOARDINGCARDS.SQUADBET.TITLE"
        : "I18N.OBB.SQUAD_VS_SQUAD.DEFAULT_OUTCOMES.LABEL",
    interpolationValues: {
      outcome: outcomeText.toLowerCase(),
    },
  });
};

const buildOnboardingCard = (card: ObbOnboardingCard): OnboardingCard | null => {
  const leg = card.legs[0];
  const params = leg?.templateParams;
  const cardType: "SquadVsSquad" | "SquadBet" =
    params && "squadAParticipantIds" in params ? "SquadVsSquad" : "SquadBet";
  const outcomeLabel = buildOutcomeLabel(leg, cardType);

  if (!outcomeLabel) return null;

  const outcomeIcon = getOutcomeIcon(getOutcomeId(leg));
  const legIds = card.legs.map((leg) => leg.id);

  if (params && "squadAParticipantIds" in params) {
    const squadAUrns = new Set(params.squadAParticipantIds.map(({ urn }) => urn));
    const squadBUrns = new Set(params.squadBParticipantIds.map(({ urn }) => urn));
    const squadAParticipants = card.participants.filter((p) => squadAUrns.has(p.urn)).map(buildParticipant);
    const squadBParticipants = card.participants.filter((p) => squadBUrns.has(p.urn)).map(buildParticipant);

    return {
      type: "SquadVsSquad",
      legIds,
      outcomeLabel,
      outcomeIcon,
      jerseySize: squadAParticipants.length >= 2 || squadBParticipants.length >= 2 ? "small" : "large",
      squadAParticipants,
      squadBParticipants,
    };
  }

  return {
    type: "SquadBet",
    legIds,
    outcomeLabel,
    outcomeIcon,
    participants: card.participants.map(buildParticipant),
  };
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getObbOnboardingCardsCardGroupByURN = createObbOnboardingCardsCardGroupByURNSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const onboardingCardsCardGroup = getObbOnboardingCardsCardGroupByURN(state, urn);

    if (!onboardingCardsCardGroup) return {};

    const { title, badgeLabel, event, onboardingCards: prismicOnboardingCards, fixture } = onboardingCardsCardGroup;

    const onboardingCards = prismicOnboardingCards
      .map(buildOnboardingCard)
      .filter((card): card is OnboardingCard => card !== null);

    const openDateMs = new Date(event.openDate).getTime();
    const hasEventStarted =
      (!!fixture?.fixtureStatus && fixture.fixtureStatus !== FixtureStatus.PRE_MATCH) ||
      (!!fixture?.scheduledAt && fixture.scheduledAt.getTime() <= Date.now()) ||
      (!Number.isNaN(openDateMs) && openDateMs <= Date.now());

    const cardGroupDisplayConditions = onboardingCards.length !== 0;

    const clearCardGroupView = hasEventStarted || !cardGroupDisplayConditions;

    return {
      urn,
      title,
      badgeLabel,
      event,
      clearCardGroupView,
      onboardingCards,
    };
  };
};

export type DispatchActions =
  | ObbOnboardingCardsCardGroupDisplayedAction
  | ObbOnboardingCardsCardGroupNavigationAction
  | ObbEventSelectionAction
  | DeleteViewItems;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
  { urn }: ContainerProps,
) => ({
  dispatchOnboardingCardGroupDisplayed: (eventName, numberOfCards) =>
    dispatch<ObbOnboardingCardsCardGroupDisplayedAction>({
      type: OBB_ONBOARDING_CARDS__CARD_GROUP_DISPLAYED,
      payload: { eventName, urn, numberOfCards },
    }),
  dispatchOnboardingCardGroupScrollEvent: (eventName, direction) =>
    dispatch<ObbOnboardingCardsCardGroupNavigationAction>({
      type: OBB_ONBOARDING_CARDS__CARD_GROUP_SWIPED,
      payload: { eventName, urn, direction },
    }),
  dispatchObbEventSelection: (event, eventName) => {
    dispatch<ObbEventSelectionAction>({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event,
        urn,
        eventName,
      },
    });
  },
  dispatchDeleteObbOnboardingCardsCardGroup: () =>
    dispatch<DeleteViewItems>({
      type: DELETE_VIEW_ITEMS,
      payload: [urn],
    }),
});
