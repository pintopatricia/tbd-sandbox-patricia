import type { FunctionComponent } from "react";
import { Alert, Card, Divider, PrimaryButton, SportsbookBetButton } from "@ppb/the-wall-web";
import { AlertType } from "@ppb/the-wall-common/types";
import styles from "./PlayerPickerSquadBetCard.web.css";
import { PlayerPickerSquadBetCardProps } from "./props";
import { MicroPlayersCarousel } from "../../../ObbSquadBetCard/snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.web";
import { BetButtonsCarousel } from "../../../ObbSquadBetCard/snowflakes/BetButtonsCarousel/BetButtonsCarousel.web";
import { ContextualStats } from "../../../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.web";

export const PlayerPickerSquadBetCard: FunctionComponent<PlayerPickerSquadBetCardProps> = ({
  squadParticipants,
  statsLabel,
  outcomesLabel,
  defaultLegs,
  defaultOutcomeIndex,
  alertLabel,
  addToBetslipLabel,
  isLoadingQuotes,
  isAnimatedBetButton,
  onBetButtonsSwimlaneArrowClick,
  onPlayersArrowClick,
  onAddToBetslip,
  onClickBetButton,
  onRemovePlayerClick,
}) => {
  const isAddToBetslipEnabled = defaultLegs.some((leg) => leg.status === "selected");

  return (
    <Card showShadow={true}>
      {squadParticipants.length > 0 && (
        <MicroPlayersCarousel
          players={squadParticipants}
          onScrollArrowClick={onPlayersArrowClick}
          onRemovePlayerClick={onRemovePlayerClick}
        />
      )}
      {squadParticipants.length < 2 ? (
        <Alert type={AlertType.Info} message={alertLabel} />
      ) : (
        <>
          <ContextualStats text={statsLabel} />

          <Divider />

          {outcomesLabel && <span className={styles.outcomeLabel}>{outcomesLabel}</span>}

          <BetButtonsCarousel
            pageSize={4}
            initialIndex={defaultOutcomeIndex}
            forceScrollToIndex={!isLoadingQuotes}
            onLeftArrowClick={() => onBetButtonsSwimlaneArrowClick("previous")}
            onRightArrowClick={() => onBetButtonsSwimlaneArrowClick("next")}
          >
            {defaultLegs.map((leg, index) => (
              <SportsbookBetButton
                status={leg.status}
                disabled={isLoadingQuotes || !!leg.quote?.quoteError}
                label={isLoadingQuotes ? "-" : leg.quote?.odds ?? "-"}
                handicapLabel={leg.outcome}
                key={index}
                onClick={() => onClickBetButton(leg)}
                animated={isAnimatedBetButton}
              />
            ))}
          </BetButtonsCarousel>

          <PrimaryButton label={addToBetslipLabel} onTap={() => onAddToBetslip()} disabled={!isAddToBetslipEnabled} />
        </>
      )}
    </Card>
  );
};

export default PlayerPickerSquadBetCard;
