import { memo, FunctionComponent, useContext, useMemo, useCallback, useState } from "react";
import { ScoreboardViewMode, AlertType } from "@ppb/the-wall-common/types";
import { Drawer } from "@ppb/the-wall-web/components/walls/Drawer/Drawer";
import { Alert } from "@ppb/the-wall-web";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { FreezeCard } from "../../Card/snowflakes/FreezeCard/FreezeCard.web";
import { ComponentProps } from "./props";
import { i18n } from "../../../helpers/i18n";
import { FreezeCardStates } from "../../Card/snowflakes/FreezeCard/shared";
import FixtureHeader from "../../FixtureHeader/FixtureHeader.web";
import ConnectedFixtureHeader from "../../FixtureHeader";
import ConnectedEventHeaderCard from "../../EventHeaderCard";
import EventHeaderCard from "../../EventHeaderCard/EventHeaderCard.web";
import styles from "./FreezeSelectionBottomSheet.web.css";
import { FreezeConfirmButton } from "../FreezeConfirmButton/FreezeConfirmButton.web";
import { ConfigContext } from "../../Config/ConfigContext";

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
  const [selectedLegRef, setSelectedLegRef] = useState<number | null>(null);
  const selectedLeg = betLegFreezeInfos.find((blf) => blf.betLeg.legNumber === selectedLegRef);

  const { isDesktopLayout } = useContext(ConfigContext);

  const hasMutationFailure = betLegFreezeInfos.some((blf) => blf.betLeg.mutations?.failure);

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
          onConfirm={onFreezeLegClick}
          oddsLabel={selectedLeg?.formattedOdds}
        />
      </>
    ),
    [hasMutationFailure, selectedLeg, onFreezeLegClick],
  );

  return (
    <Drawer
      containerId="freeze-selection-bottom-sheet"
      onOutsideTap={onDismiss}
      isDesktop={isDesktopLayout}
      customStyle={styles.drawer}
    >
      <div className={styles.headerContainer}>
        <div className={styles.header}>{i18n({ key: "I18N.ACCA_FREEZE.TITLE" })}</div>
        <button onClick={onDismiss} className={styles.closeButtonIconContainer}>
          <GenericIcon name={SystemIconName.CLOSE} />
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.container}>
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
                      showBottomSeparator={false}
                    />
                  ) : (
                    <ConnectedEventHeaderCard component={EventHeaderCard} urn={eventHeaderUrn} />
                  )}
                </FreezeCard>
              );
            },
          )}
        </div>
      </div>
      <div className={styles.footerContent}>{footerContent}</div>
    </Drawer>
  );
};

export default memo(FreezeSelectionBottomSheet, isFreezeSelectionBottomSheetEqual);
