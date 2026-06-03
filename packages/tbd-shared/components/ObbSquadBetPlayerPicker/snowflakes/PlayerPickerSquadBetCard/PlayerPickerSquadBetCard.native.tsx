import { FunctionComponent, useMemo } from "react";
import { View } from "react-native";
import { Alert, Divider, PrimaryButton, SportsbookBetButton, Text } from "@ppb/the-wall-native";
import { AlertType } from "@ppb/the-wall-common/types";
import { PlayerPickerSquadBetCardProps } from "./props";
import styles from "./PlayerPickerSquadBetCard.native.styles";
import { BetButtonsCarousel } from "../../../ObbSquadBetCard/snowflakes/BetButtonsCarousel/BetButtonsCarousel.native";
import { MicroPlayersCarousel } from "../../../ObbSquadBetCard/snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.native";
import { ContextualStats } from "../../../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.native";

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
  onAddToBetslip,
  onClickBetButton,
  onRemovePlayerClick,
}) => {
  const isAddToBetslipEnabled = useMemo(() => defaultLegs.some((leg) => leg.status === "selected"), [defaultLegs]);

  const loadedPlayersCount = useMemo(
    () => squadParticipants.filter((p) => p.status === "loaded").length,
    [squadParticipants],
  );

  return (
    <View style={styles.cardContainer}>
      {squadParticipants.length > 0 && (
        <MicroPlayersCarousel players={squadParticipants} onRemovePlayerClick={onRemovePlayerClick} />
      )}

      {loadedPlayersCount < 2 ? (
        <View style={styles.spacingTop}>
          <Alert type={AlertType.Info} message={alertLabel} />
        </View>
      ) : (
        <>
          <View style={[styles.spacingBottom, styles.spacingTop, styles.contextualStatsContainer]}>
            <ContextualStats text={statsLabel} />
          </View>

          <Divider />

          {outcomesLabel && (
            <Text style={[styles.outcomesLabel, styles.spacingBottom, styles.spacingTop]}>{outcomesLabel}</Text>
          )}

          <BetButtonsCarousel
            pageSize={4}
            initialIndex={defaultOutcomeIndex}
            forceScrollToIndex={!isLoadingQuotes}
            onLeftArrowClick={() => onBetButtonsSwimlaneArrowClick("previous")}
            onRightArrowClick={() => onBetButtonsSwimlaneArrowClick("next")}
          >
            {defaultLegs.map((leg) => (
              <SportsbookBetButton
                disabled={isLoadingQuotes || !!leg.quote?.quoteError}
                label={isLoadingQuotes ? "-" : leg.quote?.odds ?? "-"}
                handicapLabel={leg.outcome}
                key={leg.id}
                onClick={() => onClickBetButton(leg)}
                animated={isAnimatedBetButton}
                status={leg.status}
              />
            ))}
          </BetButtonsCarousel>

          <View style={styles.spacingTop}>
            <PrimaryButton label={addToBetslipLabel} onTap={() => onAddToBetslip()} disabled={!isAddToBetslipEnabled} />
          </View>
        </>
      )}
    </View>
  );
};

export default PlayerPickerSquadBetCard;
