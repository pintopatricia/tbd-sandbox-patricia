import type { FunctionComponent } from "react";
import { useCallback, useMemo } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ValueIconName } from "@ppb/the-wall-icons";
import { Alerts, BetControls as BetslipBetControls } from "@ppb/the-wall-native";

import { AlertType } from "@ppb/the-wall-common/types";
import type { ComponentProps } from "./props";
import styles from "./PriceBoostMultipleFailure.native.styles";
import { PRICE_BOOST_MULTIPLE_FAILURE } from "./PriceBoostMultipleFailure.native.selectors";
import { BetLegs } from "../BetLegs/BetLegs.native";
import { ConnectedBetLegs } from "../BetLegs";
import { Selection } from "../Selection/Selection.native";
import { ConnectedSelection } from "../Selection";
import { i18n } from "../../../helpers/i18n";

export const PriceBoostMultipleFailure: FunctionComponent<ComponentProps> = ({
  id,
  legIds,
  odds,
  labels,
  dispatchRemove,
}) => {
  const selection = useCallback(
    (legId: string) => <ConnectedSelection component={Selection} id={legId} isReadOnly />,
    [],
  );

  const onRemove = useCallback(() => {
    dispatchRemove(legIds);
  }, [legIds, dispatchRemove]);

  const alerts = useMemo(
    () => [{ type: AlertType.Error, message: i18n({ key: "I18N.BETSLIP.PRICE_BOOST_NOT_AVAILABLE" }) }],
    [],
  );

  return (
    <View {...getTestProps(PRICE_BOOST_MULTIPLE_FAILURE, false)} style={styles.container}>
      <Alerts alerts={alerts} />
      <View style={styles.icon}>
        <GenericIcon name={ValueIconName.ODDBOOST} preserveAspectRatio="preserveAspectRatio" />
      </View>
      <ConnectedBetLegs
        component={BetLegs}
        legIds={legIds}
        isWarning={true}
        renderLeg={selection}
        onRemove={onRemove}
      />
      <View style={styles.controls}>
        <BetslipBetControls
          id={id}
          odds={odds}
          oddsLabel={labels.odds}
          stakeLabel={labels.stake}
          hasEachWay={false}
          hasAccaInsurance={false}
          isStakeValid
          isPanelDisabled
          returnsLabel=""
          displayReturns={false}
          isAccaInsuranceSelected={false}
          isStakeReadonly
        />
      </View>
    </View>
  );
};
