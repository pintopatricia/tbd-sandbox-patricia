import { memo, FunctionComponent, useCallback, useState, useMemo, useRef, useEffect } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, View } from "react-native";
import { Alert, Drawer, Text } from "@ppb/the-wall-native";
import { ScoreboardViewMode, AlertType } from "@ppb/the-wall-common/types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { ComponentProps } from "./props";
import styles from "./FreezeSelectionBottomSheet.native.styles";
import { i18n } from "../../../helpers/i18n";
import { FreezeCardStates } from "../../Card/snowflakes/FreezeCard/shared";
import ConnectedFixtureHeader from "../../FixtureHeader";
import FixtureHeader from "../../FixtureHeader/FixtureHeader.native";
import ConnectedEventHeaderCard from "../../EventHeaderCard";
import EventHeaderCard from "../../EventHeaderCard/EventHeaderCard.native";
import { FreezeCard } from "../../Card/snowflakes/FreezeCard/FreezeCard.native";
import { FreezeConfirmButton } from "../FreezeConfirmButton/FreezeConfirmButton.native";

const isFreezeSelectionBottomSheetEqual = (prevProps: ComponentProps, nextProps: ComponentProps): boolean =>
  prevProps.betId === nextProps.betId &&
  JSON.stringify(prevProps.betLegFreezeInfos) === JSON.stringify(nextProps.betLegFreezeInfos);

const FreezeSelectionBottomSheet: FunctionComponent<ComponentProps> = ({
  betId,
  betLegFreezeInfos,
  onDismiss,
  dispatchOnFreezeLeg,
  dispatchOnSelectLeg,
  dispatchOnDeselectLeg,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const scrollPosition = useRef(0);
  const [selectedLegRef, setSelectedLegRef] = useState<number | null>(null);
  const selectedLeg = betLegFreezeInfos.find((blf) => blf.betLeg.legNumber === selectedLegRef);
  const hasMutationFailure = betLegFreezeInfos.some((blf) => blf.betLeg.mutations?.failure);

  const onScroll = useCallback(({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollPosition.current = nativeEvent.contentOffset.y;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: scrollPosition.current, animated: false });
    }
  });

  const onFreezeLegClick = useCallback(() => {
    if (selectedLeg) {
      dispatchOnFreezeLeg(betId, selectedLeg.betLeg);
    }
  }, [selectedLeg, betId, dispatchOnFreezeLeg]);

  const footerContent = useMemo(
    () => (
      <>
        {hasMutationFailure && (
          <Alert
            type={AlertType.Error}
            message={i18n({ key: "I18N.FREEZE_SELECTION.BOTTOM_SHEET.ERROR" })}
            showCloseIcon={false}
          />
        )}
        <FreezeConfirmButton
          selectedLeg={selectedLeg?.betLeg}
          oddsLabel={selectedLeg?.formattedOdds}
          onConfirm={onFreezeLegClick}
        />
      </>
    ),
    [hasMutationFailure, selectedLeg, onFreezeLegClick],
  );

  return (
    <Drawer onOutsideTap={onDismiss} customStyle={styles.drawer} disableAnimation={"all"}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{i18n({ key: "I18N.ACCA_FREEZE.TITLE" })}</Text>
        <Pressable onPress={onDismiss} style={styles.closeButtonIconContainer}>
          <View style={styles.closeButtonIcon}>
            <GenericIcon name={SystemIconName.CLOSE} color="#000000" />
          </View>
        </Pressable>
      </View>
      <ScrollView style={styles.container} ref={scrollRef} onScroll={onScroll} scrollEventThrottle={16}>
        {betLegFreezeInfos.map(
          ({
            betLeg,
            eventHeaderUrn,
            hasFixture,
            fixtureUrn,
            freezeEligibility,
            eventUrn,
            formattedOdds,
            freezeStatus,
            freezeCardText,
          }) => {
            const isActive = freezeEligibility === FreezeCardStates.ACTIVE;
            const isLegSelected = isActive && selectedLegRef === betLeg.legNumber;
            const state = isLegSelected ? FreezeCardStates.SELECTED : freezeEligibility;

            const onClick = () => {
              if (!isActive) {
                return;
              }

              if (selectedLegRef === betLeg.legNumber) {
                setSelectedLegRef(null);
                dispatchOnDeselectLeg();
              } else {
                if (selectedLegRef !== null) {
                  dispatchOnDeselectLeg();
                }
                setSelectedLegRef(betLeg.legNumber);
                dispatchOnSelectLeg(eventUrn);
              }
            };

            return (
              <FreezeCard
                status={freezeStatus}
                state={state}
                statusLabel={true}
                text={freezeCardText}
                contentText={`@ ${formattedOdds}`}
                key={betLeg.urn}
                onClick={onClick}
              >
                {hasFixture ? (
                  <ConnectedFixtureHeader
                    component={FixtureHeader}
                    fixture={fixtureUrn}
                    viewMode={ScoreboardViewMode.COUPON}
                    sporteventURN={eventUrn}
                  />
                ) : (
                  <ConnectedEventHeaderCard component={EventHeaderCard} urn={eventHeaderUrn} />
                )}
              </FreezeCard>
            );
          },
        )}
      </ScrollView>
      <View style={styles.footerContent}>{footerContent}</View>
    </Drawer>
  );
};

export default memo(FreezeSelectionBottomSheet, isFreezeSelectionBottomSheetEqual);
