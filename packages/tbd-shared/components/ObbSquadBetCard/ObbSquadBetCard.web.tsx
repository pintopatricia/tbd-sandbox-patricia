import { FunctionComponent, useState, useCallback } from "react";
import { ActionLink, Alert, Card, Divider } from "@ppb/the-wall-web";
import { ActionLinkTypography, AlertType } from "@ppb/the-wall-common/types";
import { i18n } from "../../helpers/i18n";
import { openEditSquadTaggingElement } from "../../helpers/obb";
import { ContextualStats } from "../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.web";
import ConnectedObbSquadBetPlayerPicker from "../ObbSquadBetPlayerPicker";
import ObbSquadBetPlayerPicker from "../ObbSquadBetPlayerPicker/ObbSquadBetPlayerPicker.web";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.web";
import { MicroPlayersCarousel } from "./snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.web";
import { BetButtonsCarousel } from "./snowflakes/BetButtonsCarousel/BetButtonsCarousel.web";

import { ComponentProps } from "./map-to-props-factory";
import styles from "./ObbSquadBetCard.web.css";

const ObbSquadBetCard: FunctionComponent<ComponentProps> = ({
  urn,
  eventName,
  title,
  outcomesLabel,
  squadParticipants,
  statsLabel,
  defaultOutcomeIndex,
  showModalEntryPoint,
  entryPointLabel,
  defaultLegs,
  position,
  removeObbStatsLabel,
  isPlayerCarouselClickable,
  withPlusButtonInPlayerCarousel,
  showSimplifiedBetButtons,
  dispatchTaggingInteractionClick,
  dispatchOnSquadbetModalOpen,
  dispatchResetSquadbetModal,
  dispatchPlayerPickerModalOpen,
}) => {
  const [showPlayerPicker, setShowPlayerPicker] = useState(false);

  const onSquadBetActionLinkClick = useCallback(
    (element?: string) => {
      dispatchOnSquadbetModalOpen(urn);
      setShowPlayerPicker(true);
      dispatchPlayerPickerModalOpen(urn, element);
    },
    [dispatchOnSquadbetModalOpen, dispatchPlayerPickerModalOpen, urn],
  );

  const onPlusIconClick = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      e?.stopPropagation();
      onSquadBetActionLinkClick(openEditSquadTaggingElement.PLUS_ICON);
    },
    [onSquadBetActionLinkClick],
  );

  const onSquadBetPlayerPickerDismiss = useCallback(() => {
    setShowPlayerPicker(false);
    dispatchResetSquadbetModal(urn);
  }, [dispatchResetSquadbetModal, urn]);

  const handleCarouselLeftArrowClick = useCallback(() => {
    dispatchTaggingInteractionClick("bet button", "previous", urn, eventName);
  }, [dispatchTaggingInteractionClick, urn, eventName]);

  const handleCarouselRightArrowClick = useCallback(() => {
    dispatchTaggingInteractionClick("bet button", "next", urn, eventName);
  }, [dispatchTaggingInteractionClick, urn, eventName]);

  const handleMicroPlayersScrollArrowClick = useCallback(
    (direction: "next" | "previous") => {
      dispatchTaggingInteractionClick("player", direction, urn, eventName);
    },
    [dispatchTaggingInteractionClick, urn, eventName],
  );

  return (
    <>
      {showPlayerPicker && showModalEntryPoint && (
        <ConnectedObbSquadBetPlayerPicker
          urn={urn}
          position={position}
          component={ObbSquadBetPlayerPicker}
          onDismiss={onSquadBetPlayerPickerDismiss}
        />
      )}
      <Card withBorder>
        <div className={styles.titleContainer}>
          <div className={styles.title}>{title}</div>
          {showModalEntryPoint && (
            <ActionLink
              onClick={() => onSquadBetActionLinkClick()}
              text={entryPointLabel}
              typography={ActionLinkTypography.Regular}
              noPadding={true}
            />
          )}
        </div>

        {squadParticipants.length > 0 && (
          <MicroPlayersCarousel
            players={squadParticipants}
            onScrollArrowClick={(direction) => handleMicroPlayersScrollArrowClick(direction)}
            {...(isPlayerCarouselClickable && {
              onClick: () => onSquadBetActionLinkClick(openEditSquadTaggingElement.JERSEY),
            })}
            {...(withPlusButtonInPlayerCarousel && {
              onEditSquadButtonClick: onPlusIconClick,
            })}
          />
        )}
        {squadParticipants.length < 2 ? (
          <Alert type={AlertType.Info} message={i18n({ key: "I18N.OBB.SQUADBET.MODAL_MIN_PLAYERS" })} />
        ) : (
          <>
            {!removeObbStatsLabel && <ContextualStats text={statsLabel} />}

            <Divider />

            {outcomesLabel && <span className={styles.outcomeLabel}>{outcomesLabel}</span>}

            <BetButtonsCarousel
              pageSize={showSimplifiedBetButtons ? 2 : 4}
              initialIndex={defaultOutcomeIndex}
              onLeftArrowClick={handleCarouselLeftArrowClick}
              onRightArrowClick={handleCarouselRightArrowClick}
            >
              {defaultLegs.map((leg) => (
                <ConnectedObbBetButton
                  key={leg}
                  cardUrn={urn}
                  eventName={eventName}
                  position={position}
                  legId={leg}
                  component={ObbBetButton}
                />
              ))}
            </BetButtonsCarousel>
          </>
        )}
      </Card>
    </>
  );
};

export default ObbSquadBetCard;
