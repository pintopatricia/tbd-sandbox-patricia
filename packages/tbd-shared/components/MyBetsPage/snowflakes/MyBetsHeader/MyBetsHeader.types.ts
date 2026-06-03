import { ReactNode } from "react";

import { SegmentedControlOptions, TabsGroupHeaderProps } from "@ppb/the-wall-common/types";
import {
  DispatchSettlementLinkNavigation,
  DispatchSettlementLinkPageNavigationAction,
} from "../../map-to-props-factory";
import { MyBetsItem } from "@ppb/tbd-store/state/layout/cards/MyBets.types";

type MyBetsHeaderFilterPebbleTap = (url: string) => void;
type MyBetsOrderStatusFilterTap = (url: string) => void;
type MyBetsHeaderButtonClick = () => void;

export type MyBetsHeaderProps = {
  title: string;
  orderTypeList: TabsGroupHeaderProps[];
  selectedOrderType: string;
  showOrderStatusFilter: boolean;
  orderStatusList: SegmentedControlOptions[];
  selectedOrderStatusType: string;
  resetButtonText: string;
  resetAlertText: string;
  showResetButton: boolean;
  showResetAlert: boolean;
  headerAction?: ReactNode;
  settlementLink?: string | null;
  settlementLinkLabel?: string | null;
  headerItems: MyBetsItem[];
};

export type MyBetsHeaderViewModel = MyBetsHeaderProps & {
  onOrderTypeTap: MyBetsHeaderFilterPebbleTap;
  onResetButtonClick: MyBetsHeaderButtonClick;
  onOrderStatusTap?: MyBetsOrderStatusFilterTap;
  dispatchSettlementLinkAction?: DispatchSettlementLinkNavigation;
  dispatchSettlementLinkPageNavigationAction: DispatchSettlementLinkPageNavigationAction;
};
