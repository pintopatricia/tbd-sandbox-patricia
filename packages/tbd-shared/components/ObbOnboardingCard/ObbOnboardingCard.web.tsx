import { FunctionComponent, useMemo } from "react";
import { splitName } from "../../helpers/obb";
import styles from "./ObbOnboardingCard.web.css";
import { ObbOnboardingCardProps } from "./ObbOnboardingCard.props";
import {
  ObbOnboardingCard as ObbOnboardingCardType,
  ObbSquadBetOnboardingCard,
  ObbSquadVsSquadOnboardingCard,
} from "../ObbOnboardingCardsCardGroup/ObbOnboardingCardsCardGroup.props";
import { ObbMicroPlayer } from "../ObbMicroPlayer/ObbMicroPlayer.web";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.web";
import { Card } from "@ppb/the-wall-web";
import { CardHeaderSize } from "@ppb/the-wall-common/types";
import { ObbModuleMetadataTemplate } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

const ObbOnboardingCard: FunctionComponent<ObbOnboardingCardProps> = ({ card, event, cardGroupUrn }) => {
  const renderSquadBetVariant = (squadBetCard: ObbSquadBetOnboardingCard) => (
    <div className={`${styles.microPlayerContainer} ${styles.microPlayerContainerSquadBet}`}>
      <ObbMicroPlayer
        variant="multi"
        jerseys={squadBetCard.participants.map((participant) => participant.jersey)}
        hasBackground={false}
        players={squadBetCard.participants.map((participant) => splitName(participant.name ?? ""))}
        jerseySize="large"
        isActionLinkEnabled={false}
      />
    </div>
  );

  const renderSquadVsSquadVariant = (squadVsSquadCard: ObbSquadVsSquadOnboardingCard) => (
    <>
      <div className={styles.microPlayerContainer}>
        <ObbMicroPlayer
          variant="multi"
          jerseySize={squadVsSquadCard.jerseySize}
          hasBackground={false}
          jerseys={squadVsSquadCard.squadAParticipants.map((participant) => participant.jersey)}
          players={squadVsSquadCard.squadAParticipants.map((participant) => splitName(participant.name ?? ""))}
        />
      </div>
      <div className={styles.vsContainer}>
        <h2 className={styles.vsText}>vs</h2>
      </div>
      <div className={styles.microPlayerContainer}>
        <ObbMicroPlayer
          variant="multi"
          jerseySize={squadVsSquadCard.jerseySize}
          hasBackground={false}
          jerseys={squadVsSquadCard.squadBParticipants.map((participant) => participant.jersey)}
          players={squadVsSquadCard.squadBParticipants.map((participant) => splitName(participant.name ?? ""))}
        />
      </div>
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
    <Card withBorder size={CardHeaderSize.MEDIUM}>
      <div>
        <div className={styles.headerWrapper}>
          <div className={styles.header}>
            {card.outcomeIcon && (
              <span className={styles.icon}>
                <GenericIcon name={card.outcomeIcon} />
              </span>
            )}
            <div className={styles.textContainer}>
              <h3 className={styles.title}>{card.outcomeLabel}</h3>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.squadsContainer}>{getSquadVariant(card)}</div>
          <div className={styles.betButtonsContainer}>
            {card.legIds.map((legId) => (
              <ConnectedObbBetButton
                key={legId}
                eventName={event.name}
                component={ObbBetButton}
                legId={legId}
                showSecondaryLabel={card.type === "SquadBet"}
                metadataOverride={getTaggingMetadataOverride}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ObbOnboardingCard;
