import { FunctionComponent, useMemo } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { AlertType } from "@ppb/the-wall-common/types";
import { Alert, BetSegments, FreeBets } from "@ppb/the-wall-native";

import { PlacedBetCardViewModel } from "./PlacedBetCard.types";
import { FREE_BETS, PLACED_BET_CARD, RESULTS, HEADER } from "./PlacedBetCard.native.selectors";

import styles from "./PlacedBetCard.native.styles";

const typeMap: Record<string, AlertType> = {
  MATCHED: AlertType.Success,
  UNMATCHED: AlertType.Error,
};

export const PlacedBetCard: FunctionComponent<PlacedBetCardViewModel> = ({
  price,
  stake,
  liability,
  profit,
  type,
  bonus,
  hasFreeBets,
  labels,
  children,
}) => {
  const resultsStyles = useMemo(
    () => [styles.results, (hasFreeBets || !!children) && styles.notLastElement],
    [children, hasFreeBets],
  );

  const freeBetsStyles = useMemo(() => [styles.freeBets, !!children && styles.notLastElement], [children]);

  return (
    <View {...getTestProps(PLACED_BET_CARD, false)}>
      {!!labels.name && (
        <View style={styles.header} {...getTestProps(HEADER, false)}>
          <Alert type={typeMap[type]} message={labels.name} />
        </View>
      )}
      <View style={resultsStyles} {...getTestProps(RESULTS, false)}>
        <BetSegments
          leftLabel={labels.price}
          leftValue={price}
          midLabel={labels.stake}
          midValue={stake}
          midRightLabel={labels.liability}
          midRightValue={liability}
          rightLabel={labels.profit}
          rightValue={profit}
        />
      </View>
      {hasFreeBets && (
        <View style={freeBetsStyles} {...getTestProps(FREE_BETS, false)}>
          <FreeBets label={bonus} isReadOnly />
        </View>
      )}
      {children}
    </View>
  );
};
