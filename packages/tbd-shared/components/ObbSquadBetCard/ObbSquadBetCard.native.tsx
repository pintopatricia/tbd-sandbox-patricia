import { memo, FunctionComponent, useState, useCallback, useMemo } from "react";
import { View } from "react-native";
import { ActionLinkTypography, AlertType } from "@ppb/the-wall-common/types";
import { ActionLink, Alert, Divider, Text } from "@ppb/the-wall-native";
import { i18n } from "../../helpers/i18n";
import { openEditSquadTaggingElement } from "../../helpers/obb";
import { ContextualStats } from "../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.native";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.native";
import ConnectedObbSquadBetPlayerPicker from "../ObbSquadBetPlayerPicker";
import ObbSquadBetPlayerPicker from "../ObbSquadBetPlayerPicker/ObbSquadBetPlayerPicker.native";
import { BetButtonsCarousel } from "./snowflakes/BetButtonsCarousel/BetButtonsCarousel.native";
import { MicroPlayersCarousel } from "./snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.native";

import { ComponentProps } from "./map-to-props-factory";
import styles from "./ObbSquadBetCard.native.styles";

const isEqualSquadBetCard = (prev: ComponentProps, next: ComponentProps): boolean =>
  prev.urn === next.urn &&
  prev.eventName === next.eventName &&
  prev.title === next.title &&
  prev.outcomesLabel === next.outcomesLabel &&
  prev.statsLabel === next.statsLabel &&
  prev.defaultOutcomeIndex === next.defaultOutcomeIndex &&
  prev.showModalEntryPoint === next.showModalEntryPoint &&
  prev.entryPointLabel === next.entryPointLabel &&
  prev.position === next.position &&
  prev.defaultLegs.length === next.defaultLegs.length &&
  prev.defaultLegs.every((leg, i) => leg === next.defaultLegs[i]) &&
  prev.squadParticipants.length === next.squadParticipants.length &&
  JSON.stringify(prev.squadParticipants) === JSON.stringify(next.squadParticipants) &&
  prev.dispatchTaggingInteractionClick === next.dispatchTaggingInteractionClick &&
  prev.dispatchOnSquadbetModalOpen === next.dispatchOnSquadbetModalOpen &&
  prev.dispatchResetSquadbetModal === next.dispatchResetSquadbetModal &&
  prev.dispatchPlayerPickerModalOpen === next.dispatchPlayerPickerModalOpen &&
  prev.isPlayerCarouselClickable === next.isPlayerCarouselClickable &&
  prev.withPlusButtonInPlayerCarousel === next.withPlusButtonInPlayerCarousel;

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
  position,
  defaultLegs,
  removeObbStatsLabel,
  isPlayerCarouselClickable,
  withPlusButtonInPlayerCarousel,
  showSimplifiedBetButtons,
  dispatchOnSquadbetModalOpen,
  dispatchResetSquadbetModal,
  dispatchPlayerPickerModalOpen,
  dispatchTaggingInteractionClick,
}) => {
  const [showPlayerPicker, setShowPlayerPicker] = useState(false);

  const onSquadBetActionLinkClick = useCallback(
    (element?: string) => {
      dispatchOnSquadbetModalOpen(urn);
      setShowPlayerPicker(true);
      dispatchPlayerPickerModalOpen(urn, element);
    },
    [urn, dispatchOnSquadbetModalOpen, dispatchPlayerPickerModalOpen],
  );

  const onSquadBetPlayerPickerDismiss = useCallback(() => {
    setShowPlayerPicker(false);
    dispatchResetSquadbetModal(urn);
  }, [urn, dispatchResetSquadbetModal]);

  const handleCarouselLeftArrowClick = useCallback(() => {
    dispatchTaggingInteractionClick("bet button", "previous", urn, eventName);
  }, [dispatchTaggingInteractionClick, urn, eventName]);

  const handleCarouselRightArrowClick = useCallback(() => {
    dispatchTaggingInteractionClick("bet button", "next", urn, eventName);
  }, [dispatchTaggingInteractionClick, urn, eventName]);

  const memoizedDefaultLegs = useMemo(
    () =>
      defaultLegs.map((leg) => (
        <ConnectedObbBetButton
          key={leg}
          cardUrn={urn}
          component={ObbBetButton}
          position={position}
          legId={leg}
          eventName={eventName}
        />
      )),
    [position, defaultLegs, urn, eventName],
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
      <View style={styles.cardContainer}>
        <View style={[styles.cardTitleContainer, styles.spacingBottom]}>
          <Text style={styles.cardTitle}>{title}</Text>
          {showModalEntryPoint && (
            <ActionLink
              onClick={() => onSquadBetActionLinkClick()}
              text={entryPointLabel}
              typography={ActionLinkTypography.Regular}
              noPadding={true}
            />
          )}
        </View>

        {squadParticipants.length > 0 && (
          <MicroPlayersCarousel
            players={squadParticipants}
            {...(isPlayerCarouselClickable && {
              onClick: () => onSquadBetActionLinkClick(openEditSquadTaggingElement.JERSEY),
            })}
            {...(withPlusButtonInPlayerCarousel && {
              onEditSquadButtonClick: () => onSquadBetActionLinkClick(openEditSquadTaggingElement.PLUS_ICON),
            })}
          />
        )}

        {squadParticipants.length < 2 ? (
          <Alert type={AlertType.Info} message={i18n({ key: "I18N.OBB.SQUADBET.MODAL_MIN_PLAYERS" })} />
        ) : (
          <>
            <View style={[styles.spacingBottom, styles.spacingTop]}>
              {!removeObbStatsLabel && <ContextualStats text={statsLabel} />}
            </View>

            <Divider />

            {outcomesLabel && (
              <Text style={[styles.outcomesLabel, styles.spacingBottom, styles.spacingTop]}>{outcomesLabel}</Text>
            )}

            <BetButtonsCarousel
              pageSize={showSimplifiedBetButtons ? 2 : 4}
              initialIndex={defaultOutcomeIndex}
              onLeftArrowClick={handleCarouselLeftArrowClick}
              onRightArrowClick={handleCarouselRightArrowClick}
            >
              {memoizedDefaultLegs}
            </BetButtonsCarousel>
          </>
        )}
      </View>
    </>
  );
};

export default memo(ObbSquadBetCard, isEqualSquadBetCard);
