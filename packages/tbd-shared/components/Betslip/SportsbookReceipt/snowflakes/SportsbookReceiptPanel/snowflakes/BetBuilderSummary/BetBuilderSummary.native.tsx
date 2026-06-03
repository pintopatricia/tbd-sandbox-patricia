import type { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { BetSummary, Text } from "@ppb/the-wall-native";

import { BetBuilderSummaryViewModel } from "./BetBuilderSummary.types";
import styles from "./BetBuilderSummary.native.styles";
import { BET_BUILDER_SUMMARY, TITLE, SELECTIONS, SUMMARY } from "./BetBuilderSummary.native.selectors";
import { BetSelections } from "../BetSelections/BetSelections.native";
import { SettlementConditionCard } from "../../../../../ObbMultiple/snowflakes/SettlementConditionCard/SettlementConditionCard.native";

export const BetBuilderSummary: FunctionComponent<BetBuilderSummaryViewModel> = ({
  bet,
  labels,
  hasShownReceiptIds,
}) => (
  <View style={styles.bet} {...getTestProps(BET_BUILDER_SUMMARY, false)}>
    <View style={styles.description}>
      <Text style={styles.title} {...getTestProps(TITLE, false)}>
        {bet.title}
      </Text>
    </View>
    <View {...getTestProps(SELECTIONS, false)}>
      <BetSelections title={bet.selectionsLabel} selections={bet.selections} />
    </View>
    {/* TODO: change to SettlementConditionsCard */}
    {bet.selectionsToWin && (
      <SettlementConditionCard
        readOnlyProps={{
          selectionsToWin: bet.selectionsToWin,
          totalSelections: bet.selections.length,
        }}
      />
    )}
    <View {...getTestProps(SUMMARY, false)}>
      <BetSummary
        title={bet.type}
        odds={bet.odds}
        previousOdds={bet.previousOdds}
        stake={bet.stake}
        returns={bet.returns}
        hasAccaInsurance={false}
        hasBonusUsed={bet.hasBonusUsed}
        previousValue={bet.previousValue}
        freeBetsLabel={bet.freeBetsLabel}
        generosityAlertMessage={bet.generosityAlertMessage}
        generosityIconName={bet.generosityIconName}
        i18n={{
          oddsLabel: labels.odds,
          returnsLabel: labels.returns,
          stakeLabel: labels.stake,
          eachWayLabel: "",
          linesLabel: "",
          accaInsuranceLabel: "",
        }}
        hasShownReceiptIds={hasShownReceiptIds}
        isPushNotificationsUnavailable={bet.isPushNotificationsUnavailable}
        hasMyOddsBoost={bet.hasMyOddsBoost}
      />
    </View>
  </View>
);
