import { FunctionComponent, useCallback, useContext, useMemo } from "react";
import { BetDetailsAction, BetDetailsColor, StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { BetDetails, SilkWrapper, StatusLabel, TrapWrapper } from "@ppb/the-wall-web";

import { RacingSport } from "@ppb/tbd-store";
import { ConfigContext } from "../../Config/ConfigContext";

import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";
import { ComponentProps } from "./props";
import styles from "./Single.web.css";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";

export const Single: FunctionComponent<ComponentProps> = ({
  runnerUrn,
  id,
  legId,
  title,
  handicap,
  subtitle,
  icon,
  silkFallbackIconType,
  racingSport,
  meetingCountry,
  trap,
  guaranteedPriceLabel,
  shouldFocusStakeField,
  isPriceBoosted,
  boostedInfo,
  isPlacing,
  is90Min,
  selectionTypeIcon,
  isGuaranteedPriceSelected,
  hasBoostSignposting,
  hasAvailabilityHints,
  dispatchRemoveSelectionAction,
}) => {
  const handleOnAction = useCallback(
    () => dispatchRemoveSelectionAction({ legId, runnerUrn }),
    [dispatchRemoveSelectionAction, legId, runnerUrn],
  );
  const { isDesktopLayout } = useContext(ConfigContext);
  const { isBetConfirmationStep } = useContext(RootBetslipContext);

  const IconComponent = useMemo(() => {
    if (racingSport === RacingSport.HORSE_RACING) {
      return <SilkWrapper silkUrl={icon} silkFallbackType={silkFallbackIconType} />;
    }

    if (racingSport === RacingSport.GREYHOUND_RACING && trap) {
      return <TrapWrapper region={meetingCountry ?? "AGNOSTIC"} trap={trap} size="medium" />;
    }

    return undefined;
  }, [racingSport, icon, silkFallbackIconType, meetingCountry, trap]);

  return (
    <article className={styles.single}>
      {!!isPriceBoosted && hasBoostSignposting && (
        <div className={styles.signposting}>
          <StatusLabel
            text={boostedInfo?.label ?? ""}
            iconName={boostedInfo?.iconName}
            statusLabelSize={StatusLabelSizeType.MEDIUM}
            statusLabelType={StatusLabelType.ALTERNATIVE_BRANDED}
          />
        </div>
      )}
      <BetDetails
        displayAllSubtitleText={isDesktopLayout}
        title={title}
        subtitle={subtitle}
        highlightedValueLabel={handicap}
        action={!isBetConfirmationStep ? BetDetailsAction.Remove : BetDetailsAction.None}
        color={isPriceBoosted ? BetDetailsColor.Black : BetDetailsColor.Teal}
        icon={IconComponent}
        is90Min={is90Min}
        selectionTypeIcon={selectionTypeIcon}
        onAction={!isBetConfirmationStep ? handleOnAction : undefined}
        isPlacing={isPlacing}
        guaranteedPriceLabel={guaranteedPriceLabel}
        isGuaranteedPriceSelected={isGuaranteedPriceSelected}
      />
      <ConnectedBetControls
        component={BetControls}
        combinationId={id}
        shouldFocusStakeField={shouldFocusStakeField}
        hasAvailabilityHints={hasAvailabilityHints}
      />
    </article>
  );
};
