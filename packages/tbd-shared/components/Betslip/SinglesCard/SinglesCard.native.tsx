import { FunctionComponent } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import ConnectedOneLineBet from "../OneLineBet";
import { OneLineBet } from "../OneLineBet/OneLineBet.native";
import ConnectedSingle from "../Single";
import { Single } from "../Single/Single.native";

import { ComponentProps } from "./props";
import styles from "./SinglesCard.native.styles";
import { SINGLES_CARD, SINGLES_CARD_ITEM } from "./SinglesCard.native.selectors";

export const SinglesCard: FunctionComponent<ComponentProps> = ({
  combinations,
  hasAvailabilityHints,
  shouldFocusStakeField = true,
}) => {
  if (!combinations.length) {
    return null;
  }

  return (
    <View {...getTestProps(SINGLES_CARD, false)} style={styles.singlesContainer}>
      {combinations.map(({ combinationId, isOneLineBet }, index) => (
        <View {...getTestProps(SINGLES_CARD_ITEM, false)} style={styles.singlesCard} key={combinationId}>
          {isOneLineBet ? (
            <ConnectedOneLineBet
              component={OneLineBet}
              id={combinationId}
              shouldFocusStakeField={shouldFocusStakeField && !index}
              hasAvailabilityHints={hasAvailabilityHints}
            />
          ) : (
            <ConnectedSingle
              component={Single}
              id={combinationId}
              shouldFocusStakeField={shouldFocusStakeField && !index}
              hasAvailabilityHints={hasAvailabilityHints}
            />
          )}
        </View>
      ))}
    </View>
  );
};
