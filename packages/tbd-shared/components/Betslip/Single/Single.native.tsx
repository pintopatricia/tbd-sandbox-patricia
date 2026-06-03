import { BetDetailsAction, BetDetailsColor, StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { BetDetails, SilkWrapper, StatusLabel, TrapWrapper } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FunctionComponent, useCallback, useContext, useMemo } from "react";
import { View } from "react-native";

import { RacingSport } from "@ppb/tbd-store";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";
import { ComponentProps } from "./props";
import { SINGLE, SINGLE_CONTROLS } from "./Single.native.selectors";
import styles from "./Single.native.styles";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";
import { i18n } from "../../../helpers/i18n";

export const Single: FunctionComponent<ComponentProps> = ({
  runnerUrn,
  id,
  legId,
  title,
  subtitle,
  handicap,
  icon,
  meetingCountry,
  trap,
  silkFallbackIconType,
  racingSport,
  guaranteedPriceLabel,
  shouldFocusStakeField,
  isPlacing,
  is90Min,
  selectionTypeIcon,
  isPriceBoosted,
  boostedInfo,
  isGuaranteedPriceSelected,
  hasAvailabilityHints,
  hasBoostSignposting,
  dispatchRemoveSelectionAction,
}) => {
  const handleOnRemove = useCallback(() => {
    dispatchRemoveSelectionAction({ legId, runnerUrn });
  }, [dispatchRemoveSelectionAction, legId, runnerUrn]);
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
    <View {...getTestProps(SINGLE, false)} style={styles.single}>
      {!!isPriceBoosted && hasBoostSignposting && (
        <View style={styles.signposting}>
          <StatusLabel
            text={boostedInfo?.label ?? ""}
            iconName={boostedInfo?.iconName}
            statusLabelSize={StatusLabelSizeType.MEDIUM}
            statusLabelType={StatusLabelType.ALTERNATIVE_BRANDED}
          />
        </View>
      )}
      <View style={styles.betDetails}>
        <BetDetails
          title={title}
          subtitle={subtitle}
          highlightedValueLabel={handicap}
          action={!isBetConfirmationStep ? BetDetailsAction.Remove : BetDetailsAction.None}
          color={isPriceBoosted ? BetDetailsColor.Black : BetDetailsColor.Teal}
          onAction={!isBetConfirmationStep ? handleOnRemove : undefined}
          icon={IconComponent}
          is90Min={is90Min}
          selectionTypeIcon={selectionTypeIcon}
          isPlacing={isPlacing}
          guaranteedPriceLabel={guaranteedPriceLabel}
          isGuaranteedPriceSelected={isGuaranteedPriceSelected}
          i18n={{
            Remove: i18n({
              key: "I18N.ACCESSIBILITY.REMOVE_BET_SELECTION",
            }),
            Edit: i18n({
              key: "I18N.ACCESSIBILITY.EDIT_BET",
            }),
            None: i18n({
              key: "I18N.ACCESSIBILITY.NO_ACTION_AVAILABLE",
            }),
          }}
        />
      </View>
      <View {...getTestProps(SINGLE_CONTROLS, false)} style={styles.controls}>
        <ConnectedBetControls
          component={BetControls}
          combinationId={id}
          shouldFocusStakeField={shouldFocusStakeField}
          hasAvailabilityHints={hasAvailabilityHints}
        />
      </View>
    </View>
  );
};
