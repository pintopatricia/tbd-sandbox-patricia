import {
  DispatchSettlementLinkNavigation,
  DispatchSettlementLinkPageNavigationAction,
} from "../../map-to-props-factory";

export type MyBetsHeaderAddOnProps = {
  settlementLink: string;
  settlementLinkLabel: string;
  selectedOrderType: string;
  isHighlighted?: boolean;
};

export type MyBetsHeaderAddOnViewModel = MyBetsHeaderAddOnProps & {
  dispatchSettlementLinkAction?: DispatchSettlementLinkNavigation;
  dispatchSettlementLinkPageNavigationAction: DispatchSettlementLinkPageNavigationAction;
};
