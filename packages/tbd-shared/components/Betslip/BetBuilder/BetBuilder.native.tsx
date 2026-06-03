import type { FunctionComponent } from "react";
import { useCallback, useContext, useMemo } from "react";
import { View } from "react-native";
import { Alerts, BetControls as BetslipBetControls, InfoLabel, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ValueIconName, OthersIconName } from "@ppb/the-wall-icons";
import { InfoLabelType } from "@ppb/the-wall-common/types";
import { colors } from "@ppb/the-wall-common/base-theme";

import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";
import { ConnectedBetLegsBetBuilder } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.native";
import { ConnectedSelectionBetBuilders } from "../Selection";
import { Selection } from "../Selection/Selection.native";
import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";

import {
  BET_BUILDER,
  TITLE,
  SUBTITLE,
  TITLE_CONTAINER,
  POPULAR_BADGE,
  POPULAR_ICON,
  POPULAR_LABEL,
} from "./BetBuilder.native.selectors";
import type { ComponentProps } from "./props";
import styles from "./BetBuilder.native.styles";

const PopularSignposting = ({ label }: { label: string }) => (
  <View {...getTestProps(POPULAR_BADGE, false)} style={styles.popularBadge}>
    <View {...getTestProps(POPULAR_ICON, false)} style={styles.popularIcon}>
      <GenericIcon name={ValueIconName.POPULAR_BET_BUILDER} color={colors.SignpostingGenerosityIconDefault} />
    </View>
    <Text {...getTestProps(POPULAR_LABEL, true)} style={styles.popularLabel}>
      {label}
    </Text>
  </View>
);

const PackagedCreatedBetsSignposting = ({ label }: { label: string }) => (
  <InfoLabel label={label} iconName={OthersIconName.ODDS_ON_THAT} infoLabelType={InfoLabelType.BRANDED} />
);

export const BetBuilder: FunctionComponent<ComponentProps> = ({
  id,
  title,
  subtitle,
  isPopular,
  isPackagedCreatedBets,
  shouldFocusStakeField,
  betControlsExperimentVariant,
  notifications,
  odds,
  legIds,
  failedLegIds,
  i18n,
}) => {
  const { isBetConfirmationStep } = useContext(RootBetslipContext);
  const betControlsOnTop = betControlsExperimentVariant === "betslip-bet-controls-on-top";

  const renderLeg = useCallback(
    (legId: string) => (
      <ConnectedSelectionBetBuilders component={Selection} id={legId} isReadOnly={isBetConfirmationStep} />
    ),
    [isBetConfirmationStep],
  );

  const renderBetControls = useMemo(() => {
    if (id) {
      return (
        <ConnectedBetControls
          component={BetControls}
          combinationId={id}
          shouldFocusStakeField={shouldFocusStakeField}
        />
      );
    }

    return (
      <BetslipBetControls
        id={id}
        odds={odds}
        oddsLabel={i18n.odds}
        stakeLabel={i18n.stake}
        hasEachWay={false}
        hasAccaInsurance={false}
        isStakeValid
        isPanelDisabled
        returnsLabel=""
        displayReturns={false}
        isAccaInsuranceSelected={false}
        isAccaInsuranceDisabled={isBetConfirmationStep}
        isStartingPriceDisabled={isBetConfirmationStep}
        isEachWayDisabled={isBetConfirmationStep}
        isStakeReadonly={isBetConfirmationStep}
      />
    );
  }, [id, odds, i18n, shouldFocusStakeField, isBetConfirmationStep]);

  return (
    <View {...getTestProps(BET_BUILDER, false)} style={styles.container}>
      <View>
        {title && (
          <View {...getTestProps(TITLE_CONTAINER, false)} style={styles.titleContainer}>
            <Text style={styles.title} {...getTestProps(TITLE)}>
              {title}
            </Text>
            {isPopular && <PopularSignposting label={i18n.popular} />}
            {isPackagedCreatedBets && <PackagedCreatedBetsSignposting label={i18n.createdBets} />}
          </View>
        )}
        <Text style={styles.subtitle} {...getTestProps(SUBTITLE)}>
          {subtitle}
        </Text>
      </View>
      {betControlsOnTop && renderBetControls}
      {notifications?.length ? <Alerts alerts={notifications} /> : null}
      <ConnectedBetLegsBetBuilder component={BetLegs} legIds={failedLegIds} renderLeg={renderLeg} isWarning hasIcon />
      <ConnectedBetLegsBetBuilder component={BetLegs} legIds={legIds} renderLeg={renderLeg} />
      {!betControlsOnTop && renderBetControls}
    </View>
  );
};
