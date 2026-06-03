import type { JSX } from "react";
import { lazy, FunctionComponent, Suspense, useCallback, useMemo, useState } from "react";
import { ValueIconName } from "@ppb/the-wall-icons";
import { SecondaryButton } from "@ppb/the-wall-web";
import { ComponentProps } from "./props";
import { i18n } from "../../helpers/i18n";

const ConnectedFreezeSelectionBottomSheet = lazy(
  () => import(/* webpackChunkName: "FreezeSelectionBottomSheet" */ "./FreezeSelectionBottomSheet"),
);

const FreezeSelectionBottomSheet = lazy(
  () =>
    import(
      /* webpackChunkName: "FreezeSelectionBottomSheet" */ "./FreezeSelectionBottomSheet/FreezeSelectionBottomSheet.web"
    ),
);

const FreezeSelection: FunctionComponent<ComponentProps> = ({
  numberOfEligibleLegs,
  numberOfBetLegs,
  dispatchAccaFreezeOpenedAction,
  dispatchAccaFreezeClosedAction,
  urn,
  shouldShowFreezeSelectionButton,
}): JSX.Element | null => {
  const [showFreezeSelectionBottomSheet, setShowFreezeSelectionBottomSheet] = useState(false);
  const isDisabled = useMemo(() => numberOfEligibleLegs === 0, [numberOfEligibleLegs]);

  const buttonLabel = useMemo(
    () =>
      isDisabled
        ? i18n({ key: "I18N.FREEZE_SELECTION.BUTTON_DISABLED_LABEL" })
        : i18n({ key: "I18N.FREEZE_SELECTION.BUTTON_LABEL" }),
    [isDisabled],
  );

  const buttonSecondaryLabel = useMemo(
    () =>
      isDisabled
        ? undefined
        : `${i18n({
            key: "I18N.FREEZE_SELECTION.BUTTON_SECONDARY_LABEL",
          })}: ${numberOfEligibleLegs}/${numberOfBetLegs}`,
    [numberOfEligibleLegs, numberOfBetLegs, isDisabled],
  );

  const handleShowBottomSheet = useCallback(() => {
    dispatchAccaFreezeOpenedAction();
    setShowFreezeSelectionBottomSheet(true);
  }, [dispatchAccaFreezeOpenedAction]);

  const handleCloseBottomSheet = useCallback(() => {
    dispatchAccaFreezeClosedAction();
    setShowFreezeSelectionBottomSheet(false);
  }, [dispatchAccaFreezeClosedAction]);

  if (shouldShowFreezeSelectionButton) {
    return (
      <>
        <SecondaryButton
          label={buttonLabel}
          secondaryLabel={buttonSecondaryLabel}
          disabled={isDisabled}
          onTap={handleShowBottomSheet}
          stopAnimation={showFreezeSelectionBottomSheet}
          icon={ValueIconName.ACCA_FREEZE}
        />
        {showFreezeSelectionBottomSheet ? (
          <Suspense fallback={<></>}>
            <ConnectedFreezeSelectionBottomSheet
              component={FreezeSelectionBottomSheet}
              urn={urn}
              onDismiss={handleCloseBottomSheet}
            />
          </Suspense>
        ) : null}
      </>
    );
  }

  return null;
};

export default FreezeSelection;
