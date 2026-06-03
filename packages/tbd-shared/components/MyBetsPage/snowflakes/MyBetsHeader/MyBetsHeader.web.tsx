import { AlertType, TabsGroupSize } from "@ppb/the-wall-common/types";
import { FunctionComponent, useCallback } from "react";
import { SegmentedControl, StickyHeader, TabsGroup, Alert } from "@ppb/the-wall-web";

import { MyBetsHeaderViewModel } from "./MyBetsHeader.types";
import styles from "./MyBetsHeader.web.css";
import { MyBetsHeaderAddOn } from "../MyBetsHeaderAddOn/MyBetsHeaderAddOn.web";
import ConnectedCard from "../../../Card";
import Card from "../../../Card/Card.web";

export const MyBetsHeader: FunctionComponent<MyBetsHeaderViewModel> = ({
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
  dispatchSettlementLinkAction,
  dispatchSettlementLinkPageNavigationAction,
  headerItems,
}) => {
  const handleOrderStatusOnClick = useCallback(
    (id: string) => {
      if (onOrderStatusTap) {
        onOrderStatusTap(id);
      }
    },
    [onOrderStatusTap],
  );

  return (
    <section className={styles.myBetsHeader}>
      <div className={styles.header}>
        {headerItems?.map((item) => (
          <ConnectedCard key={item.urn} urn={item.urn} component={Card} typename={item.typename} />
        ))}
      </div>
      {headerAction}
      <div className={styles.content}>
        {showResetAlert && (
          <div className={styles.sectionContainer}>
            <Alert
              type={AlertType.Info}
              message={resetAlertText}
              dismissLabel={resetButtonText}
              onClose={onResetButtonClick}
            />
          </div>
        )}
        {orderTypeList.length > 0 && (
          <StickyHeader>
            <div className={styles.myBetsHeaderAddOn}>
              <TabsGroup
                label="Tabs"
                key={selectedOrderType}
                onTabSwitch={onOrderTypeTap}
                defaultTab={selectedOrderType}
                headers={orderTypeList}
                size={TabsGroupSize.Regular}
                background={false}
              />
              {!!settlementLink && !!settlementLinkLabel && (
                <MyBetsHeaderAddOn
                  settlementLink={settlementLink}
                  settlementLinkLabel={settlementLinkLabel}
                  selectedOrderType={selectedOrderType}
                  dispatchSettlementLinkAction={dispatchSettlementLinkAction}
                  dispatchSettlementLinkPageNavigationAction={dispatchSettlementLinkPageNavigationAction}
                />
              )}
            </div>
          </StickyHeader>
        )}
        {showOrderStatusFilter && orderStatusList.length > 0 && (
          <div className={styles.sectionContainer}>
            <SegmentedControl
              options={orderStatusList}
              selectedOption={selectedOrderStatusType}
              onClick={handleOrderStatusOnClick}
            />
          </div>
        )}
      </div>
    </section>
  );
};
