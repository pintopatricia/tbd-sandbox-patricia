import { Runner } from "@ppb/the-wall-native";
import { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import ConnectedBettingOpportunityBetButton from "../BettingOpportunityBetButton";
import BettingOpportunityBetButton from "../BettingOpportunityBetButton/BettingOpportunityBetButton.native";
import { ComponentProps } from "./props";
import { TEST_ID } from "./BettingOpportunity.native.selectors";
import styles from "./BettingOpportunity.native.styles";

const BettingOpportunity: FunctionComponent<ComponentProps> = ({
  cardUrn,
  name,
  opportunityUrn,
  showWasPrice,
  visible,
}) => (
  <View {...getTestProps(TEST_ID, false)}>
    <Runner name={name}>
      <View style={styles.betButtonContainer}>
        <ConnectedBettingOpportunityBetButton
          component={BettingOpportunityBetButton}
          cardUrn={cardUrn}
          bettingOpportunityUrn={opportunityUrn}
          showWasPrice={showWasPrice}
          visible={visible}
          short
        />
      </View>
    </Runner>
  </View>
);

export default BettingOpportunity;
