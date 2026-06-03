import { FunctionComponent, useId, useRef, useState } from "react";
import classnames from "classnames";

import { Card, ActionLink, Divider, Alert } from "@ppb/the-wall-web";
import { ActionLinkTypography, AlertType } from "@ppb/the-wall-common/types";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";

import { i18n } from "../../helpers/i18n";

import { ContextualStatsComparison } from "./snowflakes/ContextualStatsComparison/ContextualStatsComparison.web";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.web";
import ConnectedObbSquadVsSquadPlayerPicker from "../ObbSquadVsSquadPlayerPicker";
import ObbSquadVsSquadPlayerPicker from "../ObbSquadVsSquadPlayerPicker/ObbSquadVsSquadPlayerPicker.web";

import { ComponentProps } from "./map-to-props-factory";
import styles from "./ObbSquadVsSquadCard.web.css";
import { useTooltip } from "./snowflakes/PlayersTooltip/TooltipContext";
import { TooltipPosition } from "./snowflakes/PlayersTooltip/props";
import { PlayersTooltip } from "./snowflakes/PlayersTooltip/PlayersTooltip.web";
import { PlayerNames, SquadId } from "../../helpers/obb";
import { ObbMicroPlayer } from "../ObbMicroPlayer/ObbMicroPlayer.web";

const ObbSquadVsSquadCard: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  eventName,
  showModalEntryPoint,
  firstSquadJerseys,
  secondSquadJerseys,
  firstSquadParticipantsNames,
  secondSquadParticipantsNames,
  firstSquadStatValue,
  secondSquadStatValue,
  contextualStatsText,
  outcomeLabel,
  position,
  defaultLegs,
  removeObbStatsLabel,
  dispatchOnSquadVsSquadModalOpen,
  dispatchPlayerPickerModalOpen,
  dispatchTaggingInteractionClick,
  dispatchTogglePlayersTooltip,
}) => {
  const [showPlayerPicker, setShowPlayerPicker] = useState(false);
  const [selectedSquadId, setSelectedSquadId] = useState<SquadId>("1");
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>();
  const { visibleTooltipId, openTooltip } = useTooltip();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const tooltipId = useId();

  const onOpenTooltip = (players: PlayerNames[], newTooltipPosition: TooltipPosition) => {
    openTooltip(
      tooltipId,
      players.map(({ firstName, lastName }) => (firstName ? `${firstName} ${lastName}`.trim() : lastName)).join(", "),
      dispatchTogglePlayersTooltip,
      urn,
    );
    setTooltipPosition(newTooltipPosition);
    dispatchTogglePlayersTooltip(urn, TaggingAction.OPENED);
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
      <Card withBorder>
        <div className={styles.title}>{title}</div>
        <div className={styles.squadsContainer} ref={targetRef}>
          <div className={styles.microPlayerContainer}>
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
              onActionLinkClick={() => onOpenTooltip(firstSquadParticipantsNames, TooltipPosition.LEFT)}
            />
          </div>
          <h2
            className={classnames(styles.vsText, {
              [styles.entryPointGap]: showModalEntryPoint,
              [styles.defaultGap]: !showModalEntryPoint,
            })}
          >
            VS
          </h2>
          <div className={styles.microPlayerContainer}>
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
              onActionLinkClick={() => onOpenTooltip(secondSquadParticipantsNames, TooltipPosition.RIGHT)}
            />
          </div>
        </div>

        {visibleTooltipId === tooltipId && <PlayersTooltip targetRef={targetRef} position={tooltipPosition} />}

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

            <span className={styles.outcomeLabel}>{outcomeLabel}</span>
            <div className={styles.betButtonsContainer}>
              {defaultLegs.map((leg) => (
                <ConnectedObbBetButton
                  key={leg}
                  cardUrn={urn}
                  eventName={eventName}
                  component={ObbBetButton}
                  position={position}
                  legId={leg}
                />
              ))}
            </div>
          </>
        )}
      </Card>
    </>
  );
};

export default ObbSquadVsSquadCard;
