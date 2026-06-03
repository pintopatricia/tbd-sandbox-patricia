import { memo, FunctionComponent, useId, useRef, useState } from "react";
import { View } from "react-native";

import { ActionLink, Divider, Alert, Text } from "@ppb/the-wall-native";
import { ActionLinkTypography, AlertType } from "@ppb/the-wall-common/types";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { i18n } from "../../helpers/i18n";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.native";
import ConnectedObbSquadVsSquadPlayerPicker from "../ObbSquadVsSquadPlayerPicker";
import ObbSquadVsSquadPlayerPicker from "../ObbSquadVsSquadPlayerPicker/ObbSquadVsSquadPlayerPicker.native";
import { ComponentProps } from "./map-to-props-factory";
import styles from "./ObbSquadVsSquadCard.native.styles";
import { ContextualStatsComparison } from "./snowflakes/ContextualStatsComparison/ContextualStatsComparison.native";
import { useTooltip } from "./snowflakes/PlayersTooltip/TooltipContext";
import { PlayerNames, SquadId } from "../../helpers/obb";
import { ObbMicroPlayer } from "../ObbMicroPlayer/ObbMicroPlayer.native";

const isEqualSquadVsSquadCard = (prev: ComponentProps, next: ComponentProps): boolean =>
  prev.urn === next.urn &&
  prev.eventName === next.eventName &&
  prev.title === next.title &&
  prev.showModalEntryPoint === next.showModalEntryPoint &&
  prev.firstSquadJerseys.length === next.firstSquadJerseys.length &&
  prev.firstSquadJerseys.every((jersey, i) => jersey === next.firstSquadJerseys[i]) &&
  prev.secondSquadJerseys.length === next.secondSquadJerseys.length &&
  prev.secondSquadJerseys.every((jersey, i) => jersey === next.secondSquadJerseys[i]) &&
  prev.firstSquadParticipantsNames.length === next.firstSquadParticipantsNames.length &&
  prev.firstSquadParticipantsNames.every((name, i) => name === next.firstSquadParticipantsNames[i]) &&
  prev.secondSquadParticipantsNames.length === next.secondSquadParticipantsNames.length &&
  prev.secondSquadParticipantsNames.every((name, i) => name === next.secondSquadParticipantsNames[i]) &&
  prev.outcomeLabel === next.outcomeLabel &&
  prev.contextualStatsText === next.contextualStatsText &&
  prev.firstSquadStatValue === next.firstSquadStatValue &&
  prev.secondSquadStatValue === next.secondSquadStatValue &&
  prev.defaultLegs.length === next.defaultLegs.length &&
  prev.defaultLegs.every((leg, i) => leg === next.defaultLegs[i]) &&
  prev.position === next.position;

const ObbSquadVsSquadCard: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  showModalEntryPoint,
  firstSquadParticipantsNames,
  firstSquadJerseys,
  secondSquadParticipantsNames,
  secondSquadJerseys,
  firstSquadStatValue,
  secondSquadStatValue,
  contextualStatsText,
  outcomeLabel,
  defaultLegs,
  eventName,
  position,
  removeObbStatsLabel,
  dispatchOnSquadVsSquadModalOpen,
  dispatchPlayerPickerModalOpen,
  dispatchTogglePlayersTooltip,
  dispatchTaggingInteractionClick,
}) => {
  const [showPlayerPicker, setShowPlayerPicker] = useState(false);
  const [selectedSquadId, setSelectedSquadId] = useState<SquadId>("1");

  const { openTooltip, containerRef } = useTooltip();
  const viewRef = useRef<View>(null);
  const tooltipId = useId();

  const handlePress = (players: PlayerNames[]) => {
    if (!viewRef.current || !containerRef?.current) return;

    viewRef.current.measureLayout(containerRef.current, (left, top, width, height) => {
      openTooltip(
        tooltipId,
        players.map(({ firstName, lastName }) => (firstName ? `${firstName} ${lastName}`.trim() : lastName)).join(", "),
        dispatchTogglePlayersTooltip,
        urn,
        { pageY: top + height },
      );
      dispatchTogglePlayersTooltip(urn, TaggingAction.OPENED);
    });
  };

  const onSquadVsSquadActionLinkClick = (squadId: SquadId) => {
    dispatchOnSquadVsSquadModalOpen(urn);
    setSelectedSquadId(squadId);
    setShowPlayerPicker(true);
    dispatchPlayerPickerModalOpen(urn);
    dispatchTaggingInteractionClick(squadId, urn, eventName);
  };

  return (
    <>
      {showPlayerPicker && showModalEntryPoint && (
        <ConnectedObbSquadVsSquadPlayerPicker
          urn={urn}
          selectedSquadId={selectedSquadId}
          component={ObbSquadVsSquadPlayerPicker}
          onDismiss={() => setShowPlayerPicker(false)}
          handleSquadChange={(squadId: SquadId) => {
            setSelectedSquadId(squadId);
          }}
        />
      )}

      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.squadsContainer} ref={viewRef}>
          <View style={styles.microPlayerContainer}>
            {showModalEntryPoint && (
              <ActionLink
                onClick={() => onSquadVsSquadActionLinkClick("1")}
                text={`${
                  firstSquadParticipantsNames.length
                    ? i18n({ key: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_ENTRY_POINT" })
                    : i18n({ key: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_BUILD_SQUAD_ENTRY_POINT" })
                } 1`}
                typography={ActionLinkTypography.Regular}
                noPadding={true}
              />
            )}
            <ObbMicroPlayer
              variant="multi"
              players={firstSquadParticipantsNames}
              jerseys={firstSquadJerseys}
              isActionLinkEnabled
              onActionLinkClick={() => handlePress(firstSquadParticipantsNames)}
            />
          </View>
          <Text style={[styles.vsText, showModalEntryPoint ? styles.entryPointGap : styles.defaultGap]}>VS</Text>
          <View style={styles.microPlayerContainer}>
            {showModalEntryPoint && (
              <ActionLink
                onClick={() => onSquadVsSquadActionLinkClick("2")}
                text={`${
                  secondSquadParticipantsNames.length
                    ? i18n({ key: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_ENTRY_POINT" })
                    : i18n({ key: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_BUILD_SQUAD_ENTRY_POINT" })
                } 2`}
                typography={ActionLinkTypography.Regular}
                noPadding={true}
              />
            )}
            <ObbMicroPlayer
              variant="multi"
              players={secondSquadParticipantsNames}
              jerseys={secondSquadJerseys}
              isActionLinkEnabled
              onActionLinkClick={() => handlePress(secondSquadParticipantsNames)}
            />
          </View>
        </View>

        {(!!firstSquadParticipantsNames.length || !!secondSquadParticipantsNames.length) && !removeObbStatsLabel && (
          <ContextualStatsComparison
            leftValue={firstSquadStatValue}
            text={contextualStatsText}
            rightValue={secondSquadStatValue}
          />
        )}

        {(!firstSquadParticipantsNames.length || !secondSquadParticipantsNames.length) && (
          <Alert type={AlertType.Info} message={i18n({ key: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_MIN_PLAYERS" })} />
        )}

        {!!firstSquadParticipantsNames.length && !!secondSquadParticipantsNames.length && (
          <>
            <Divider />

            <Text style={styles.outcomeLabel}>{outcomeLabel}</Text>

            <View style={styles.betButtonsContainer}>
              {defaultLegs.map((leg) => (
                <View style={styles.betButton} key={leg}>
                  <ConnectedObbBetButton
                    key={leg}
                    cardUrn={urn}
                    eventName={eventName}
                    component={ObbBetButton}
                    position={position}
                    legId={leg}
                  />
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default memo(ObbSquadVsSquadCard, isEqualSquadVsSquadCard);
