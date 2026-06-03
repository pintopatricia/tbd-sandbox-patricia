import { type FunctionComponent, memo, useCallback } from "react";
import { View } from "react-native";

import { AlertType, TabsGroupSize } from "@ppb/the-wall-common/types";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { TabsGroup, SegmentedControl, Alert } from "@ppb/the-wall-native";
import LinearView from "@ppb/the-wall-native/helpers/LinearView";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { MyBetsHeaderViewModel } from "./MyBetsHeader.types";
import {
  MY_BETS_HEADER,
  MY_BETS_HEADER_ORDER_STATUS_FILTER,
  MY_BETS_HEADER_ORDER_TYPE_FILTER,
} from "./MyBetsHeader.native.selectors";
import styles from "./MyBetsHeader.native.styles";
import { MyBetsHeaderAddOn } from "../MyBetsHeaderAddOn/MyBetsHeaderAddOn.native";
import ConnectedCard from "../../../Card";
import Card from "../../../Card/Card.native";

const MyBetsHeaderComponent: FunctionComponent<MyBetsHeaderViewModel> = ({
  title,
  resetButtonText,
  resetAlertText,
  orderTypeList,
  selectedOrderType,
  showResetAlert,
  showOrderStatusFilter,
  orderStatusList,
  selectedOrderStatusType,
  onResetButtonClick,
  onOrderTypeTap,
  onOrderStatusTap,
  headerAction,
  settlementLink,
  settlementLinkLabel,
  dispatchSettlementLinkPageNavigationAction,
  headerItems,
}) => {
  const handleOnPress = useCallback(
    (id: string) => {
      if (onOrderStatusTap) {
        onOrderStatusTap(id);
      }
    },
    [onOrderStatusTap],
  );

  return (
    <View style={styles.myBetsHeader} {...getTestProps(MY_BETS_HEADER, false)}>
      {headerItems?.map((item) => (
        <ConnectedCard key={item.urn} urn={item.urn} component={Card} typename={item.typename} />
      ))}
      {headerAction}
      <View style={styles.content}>
        {showResetAlert && (
          <View style={styles.sectionContainer}>
            <Alert
              type={AlertType.Info}
              message={resetAlertText}
              dismissLabel={resetButtonText}
              onClose={onResetButtonClick}
            />
          </View>
        )}
        {orderTypeList.length > 0 && (
          <LinearView
            style={styles.myBetsHeaderAddOn}
            background={tokens.TabsGroupRegularBackgroundColour}
            {...getTestProps(MY_BETS_HEADER_ORDER_TYPE_FILTER, false)}
          >
            <View style={styles.myBetsHeaderTabs}>
              <TabsGroup
                key={selectedOrderType}
                label={title}
                background={false}
                defaultTab={selectedOrderType}
                headers={orderTypeList}
                onTabSwitch={onOrderTypeTap}
                size={TabsGroupSize.Regular}
              />
            </View>
            {!!settlementLink && !!settlementLinkLabel && (
              <MyBetsHeaderAddOn
                settlementLink={settlementLink}
                settlementLinkLabel={settlementLinkLabel}
                selectedOrderType={selectedOrderType}
                dispatchSettlementLinkPageNavigationAction={dispatchSettlementLinkPageNavigationAction}
              />
            )}
          </LinearView>
        )}
        {showOrderStatusFilter && orderStatusList.length > 0 && (
          <View {...getTestProps(MY_BETS_HEADER_ORDER_STATUS_FILTER, false)} style={styles.sectionContainer}>
            <SegmentedControl
              options={orderStatusList}
              selectedOption={selectedOrderStatusType}
              onPress={handleOnPress}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export const MyBetsHeader = memo(MyBetsHeaderComponent);
