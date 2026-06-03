import { FunctionComponent, useMemo } from "react";
import { View } from "react-native";
import { Card, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { splitName } from "../../helpers/obb";
import styles from "./ObbOnboardingCard.native.styles";
import { CARD_CONTAINER, LEG_ODDS } from "./ObbOnboardingCard.native.selectors";
import { ObbOnboardingCardProps } from "./ObbOnboardingCard.props";
import {
  ObbOnboardingCard as ObbOnboardingCardType,
  ObbSquadBetOnboardingCard,
  ObbSquadVsSquadOnboardingCard,
} from "../ObbOnboardingCardsCardGroup/ObbOnboardingCardsCardGroup.props";
import { ObbMicroPlayer } from "../ObbMicroPlayer/ObbMicroPlayer.native";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.native";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { ObbModuleMetadataTemplate } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers";

const ObbOnboardingCard: FunctionComponent<ObbOnboardingCardProps> = ({ card, event, cardGroupUrn }) => {
  const renderSquadBetVariant = (squadBetCard: ObbSquadBetOnboardingCard) => (
    <View style={[styles.microPlayerContainer, styles.microPlayerContainerSquadBet]}>
      <ObbMicroPlayer
        variant="multi"
        jerseys={squadBetCard.participants.map((participant) => participant.jersey)}
        hasBackground={false}
        players={squadBetCard.participants.map((participant) => splitName(participant.name ?? ""))}
        jerseySize="large"
        isActionLinkEnabled={false}
      />
    </View>
  );

  const renderSquadVsSquadVariant = (squadVsSquadCard: ObbSquadVsSquadOnboardingCard) => (
    <>
      <View style={styles.microPlayerContainer}>
        <ObbMicroPlayer
          variant="multi"
          jerseySize={squadVsSquadCard.jerseySize}
          hasBackground={false}
          jerseys={squadVsSquadCard.squadAParticipants.map((participant) => participant.jersey)}
          players={squadVsSquadCard.squadAParticipants.map((participant) => splitName(participant.name ?? ""))}
        />
      </View>
      <View style={styles.vsContainer}>
        <Text style={styles.vsText}>vs</Text>
      </View>
      <View style={styles.microPlayerContainer}>
        <ObbMicroPlayer
          variant="multi"
          jerseySize={squadVsSquadCard.jerseySize}
          hasBackground={false}
          jerseys={squadVsSquadCard.squadBParticipants.map((participant) => participant.jersey)}
          players={squadVsSquadCard.squadBParticipants.map((participant) => splitName(participant.name ?? ""))}
        />
      </View>
    </>
  );

  const getSquadVariant = (currentCard: ObbOnboardingCardType) => {
    if (currentCard.type === "SquadBet") {
      return renderSquadBetVariant(currentCard);
    } else if (currentCard.type === "SquadVsSquad") {
      return renderSquadVsSquadVariant(currentCard);
    }
    return null;
  };

  const getTaggingMetadataOverride: ObbModuleMetadataTemplate = useMemo(() => {
    // Should be overridden because Onboarding Cards don't have a CardUrn.
    // The default layoutSnapshot relies on CardUrn to fetch the module (card) data,
    // so without it, we need a custom implementation to set that data.
    const { tabName, cardGroupTitle } = getLayoutMetadata(cardGroupUrn);

    return { card: "onboarding card", tab: tabName, group: cardGroupTitle };
  }, [cardGroupUrn]);

  return (
    <Card withBorder title={card.outcomeLabel} icon={card.outcomeIcon}>
      <View style={styles.container} {...getTestProps(CARD_CONTAINER, false)}>
        <View style={styles.squadsContainer}>{getSquadVariant(card)}</View>
        <View style={styles.betButtonsContainer}>
          {card.legIds.map((legId) => (
            <View key={legId} style={styles.betButton} {...getTestProps(LEG_ODDS, false)}>
              <ConnectedObbBetButton
                eventName={event.name}
                component={ObbBetButton}
                legId={legId}
                showSecondaryLabel={card.type === "SquadBet"}
                metadataOverride={getTaggingMetadataOverride}
              />
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
};

export default ObbOnboardingCard;
