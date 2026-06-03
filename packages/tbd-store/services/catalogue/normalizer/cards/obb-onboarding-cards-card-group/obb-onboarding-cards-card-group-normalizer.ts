import { ObbOnboardingCardsCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { ObbOnboardingCard, ObbOnboardingCardsCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import normalizeObbLegFragmentIntoObbLeg from "../../entities/obb-leg/obb-leg-normalizer";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";

const normalizeObbOnboardingCardsCardGroupFragment = (
  fragment: ObbOnboardingCardsCardGroupFragment,
): TransformedFragment<ObbOnboardingCardsCardGroup> => {
  const {
    __typename,
    urn,
    obbOnboardingCardsCardGroupTitle,
    obbOnboardingCardsCardGroupBadgeLabel,
    event,
    onboardingCards,
  } = fragment;

  return {
    data: {
      typename: __typename,
      urn,
      items: [],
      title: obbOnboardingCardsCardGroupTitle
        ? normalizeDisplayNameFragmentIntoDisplayName(obbOnboardingCardsCardGroupTitle)
        : "",
      badgeLabel: obbOnboardingCardsCardGroupBadgeLabel
        ? normalizeDisplayNameFragmentIntoDisplayName(obbOnboardingCardsCardGroupBadgeLabel)
        : undefined,
      event,
      onboardingCards: (onboardingCards ?? []).reduce<ObbOnboardingCard[]>((acc, card) => {
        if (card) {
          acc.push({
            participants: card.participants.map((p) => ({
              typename: p.__typename,
              urn: p.urn,
              player: p.player,
              team: {
                ...p.team,
                jerseys: p.team.jerseys?.filter((j): j is NonNullable<typeof j> => j !== null) ?? null,
              },
            })),
            legs: card.legs.map((leg) => normalizeObbLegFragmentIntoObbLeg(leg).data),
          });
        }
        return acc;
      }, []),
    },
  };
};

export default normalizeObbOnboardingCardsCardGroupFragment;
