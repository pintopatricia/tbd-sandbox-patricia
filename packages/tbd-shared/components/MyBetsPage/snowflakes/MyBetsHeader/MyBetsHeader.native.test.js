import { render } from "@testing-library/react-native";
import { AlertType, TabsGroupSize } from "@ppb/the-wall-common/types";
import { TabsGroup, Alert, SegmentedControl, PageHeader, ActionLink } from "@ppb/the-wall-native";

import { MyBetsHeader } from "./MyBetsHeader.native";
import styles from "./MyBetsHeader.native.styles";
import { MyBetsHeaderAddOn } from "../MyBetsHeaderAddOn/MyBetsHeaderAddOn.native";
import { settlementLinkLabelMock } from "../../MyBetsPage.mocks";
import ConnectedCard from "../../../Card";

jest.mock("@ppb/the-wall-native", () => ({
  TabsGroup: jest.fn(({ props }) => <tabs-mock {...props} />),
  ActionLink: jest.fn((props) => <action-link-mock {...props} />),
  Alert: jest.fn((props) => <alert-mock {...props} />),
  SegmentedControl: jest.fn(() => <segmented-control-mock />),
  PageHeader: jest.fn(() => <page-header-mock />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("../MyBetsHeaderAddOn/MyBetsHeaderAddOn.native", () => ({
  MyBetsHeaderAddOn: jest.fn((props) => <my-bets-header-add-on-mock {...props} />),
}));

jest.mock("../../../Card", () => jest.fn((props) => <mock-connected-card {...props} />));

jest.mock("../../../Card/Card.native", () => jest.fn(() => <mock-card-native />));

const orderTypeListMock = [
  {
    id: "OPEN",
    text: "Open",
  },
  {
    id: "SETTLED",
    text: "Settled",
  },
];

const onOrderStatusTapMock = jest.fn();
const onOrderTypeChangeMock = jest.fn();
const dispatchSettlementLinkPageNavigationActionMock = jest.fn();
const selectedOrderTypeMock = "OPEN";
const customTitle = "I18N.MY_BETS.TITLE";
const resetButtonText = "I18N.MY_BETS.SHOW_ALL";
const resetAlertText = "I18N.MY_BETS.FILTERED_VIEW";
const settlementLinkMock = "brand.com/help";
const headerItemsMock = [
  {
    typename: "GenericSwitcherCard",
    urn: "ppb:tbd:card:genericswitcher:mybets",
  },
];

const DEFAULT_PROPS = {
  title: customTitle,
  resetButtonText,
  resetAlertText,
  orderTypeList: orderTypeListMock,
  onOrderTypeTap: onOrderTypeChangeMock,
  selectedOrderType: selectedOrderTypeMock,
  settlementLink: settlementLinkMock,
  settlementLinkLabel: settlementLinkLabelMock,
  dispatchSettlementLinkPageNavigationAction: dispatchSettlementLinkPageNavigationActionMock,
  headerItems: headerItemsMock,
};

function renderMyBetsHeader({
  title,
  resetButtonText,
  resetAlertText,
  orderTypeList,
  selectedOrderType,
  showResetButton,
  showResetAlert,
  showOrderStatusFilter,
  orderStatusList,
  selectedOrderStatusType,
  onResetButtonClick,
  onOrderTypeTap,
  onOrderStatusTap,
  headerAction,
  settlementLink,
  dispatchSettlementLinkPageNavigationAction,
  settlementLinkLabel,
  headerItems,
}) {
  return render(
    <MyBetsHeader
      title={title}
      resetButtonText={resetButtonText}
      resetAlertText={resetAlertText}
      showResetButton={showResetButton}
      showResetAlert={showResetAlert}
      onResetButtonClick={onResetButtonClick}
      orderTypeList={orderTypeList}
      onOrderTypeTap={onOrderTypeTap}
      selectedOrderType={selectedOrderType}
      showOrderStatusFilter={showOrderStatusFilter}
      orderStatusList={orderStatusList}
      selectedOrderStatusType={selectedOrderStatusType}
      onOrderStatusTap={onOrderStatusTap}
      headerAction={headerAction}
      settlementLink={settlementLink}
      dispatchSettlementLinkPageNavigationAction={dispatchSettlementLinkPageNavigationAction}
      settlementLinkLabel={settlementLinkLabel}
      headerItems={headerItems}
    />,
  );
}

describe("MyBetsHeader", () => {
  beforeEach(jest.clearAllMocks);

  describe("when component is rendered", () => {
    beforeEach(() => {
      renderMyBetsHeader(DEFAULT_PROPS);
    });

    it("should call page header", () => {
      expect(ConnectedCard).toHaveBeenCalled();
    });

    it("should call tabs with correct props", () => {
      expect(TabsGroup).toHaveBeenCalledWith(
        {
          background: false,
          defaultTab: selectedOrderTypeMock,
          label: customTitle,
          onTabSwitch: onOrderTypeChangeMock,
          headers: orderTypeListMock,
          size: TabsGroupSize.Regular,
          style: styles.orderTypesList,
        },
        undefined,
      );
    });

    it("should call MyBetsHeaderAddOn", () => {
      expect(MyBetsHeaderAddOn).toHaveBeenCalledWith(
        {
          settlementLink: settlementLinkMock,
          settlementLinkLabel: settlementLinkLabelMock,
          selectedOrderType: selectedOrderTypeMock,
          dispatchSettlementLinkPageNavigationAction: dispatchSettlementLinkPageNavigationActionMock,
        },
        undefined,
      );
    });

    it("shouldn't call Alert", () => {
      expect(Alert).not.toHaveBeenCalled();
    });

    describe("when showOrderStatusFilter and orderStatusList have values", () => {
      it("should call SegmentedControl with correct props", () => {
        renderMyBetsHeader({
          ...DEFAULT_PROPS,
          showOrderStatusFilter: true,
          orderStatusList: ["matched", "unmatched"],
          selectedOrderStatusType: "matched",
        });

        expect(SegmentedControl).toHaveBeenCalledWith(
          {
            onPress: expect.any(Function),
            options: ["matched", "unmatched"],
            selectedOption: "matched",
          },
          undefined,
        );
      });

      describe("when SegmentedControl is pressed without onOrderStatusTap defined", () => {
        it("shouldn't call onOrderStatusTap", () => {
          renderMyBetsHeader({
            ...DEFAULT_PROPS,
            showOrderStatusFilter: true,
            orderStatusList: ["matched", "unmatched"],
            selectedOrderStatusType: "matched",
          });

          SegmentedControl.mock.calls[0][0].onPress("mockId");

          expect(onOrderStatusTapMock).not.toHaveBeenCalledWith();
        });
      });

      describe("when onOrderStatusTap is defined", () => {
        it("should call onOrderStatusTap with id onPress function call", () => {
          renderMyBetsHeader({
            ...DEFAULT_PROPS,
            showOrderStatusFilter: true,
            orderStatusList: ["matched", "unmatched"],
            selectedOrderStatusType: "matched",
            onOrderStatusTap: onOrderStatusTapMock,
          });

          SegmentedControl.mock.calls[0][0].onPress("mockId");

          expect(onOrderStatusTapMock).toHaveBeenCalledWith("mockId");
        });
      });
    });

    describe("when showResetAlert is true", () => {
      const onResetButtonClick = jest.fn();

      it("should render Alert with correct props", () => {
        renderMyBetsHeader({
          ...DEFAULT_PROPS,
          showResetAlert: true,
          onResetButtonClick: onResetButtonClick,
        });

        expect(Alert).toHaveBeenCalledWith(
          {
            type: AlertType.Info,
            message: "I18N.MY_BETS.FILTERED_VIEW",
            dismissLabel: "I18N.MY_BETS.SHOW_ALL",
            onClose: expect.any(Function),
          },
          undefined,
        );
      });

      describe("and when onResetButtonClick is defined", () => {
        it("should call onResetButtonClick when alert is closed", () => {
          renderMyBetsHeader({
            ...DEFAULT_PROPS,
            showResetAlert: true,
            onResetButtonClick: onResetButtonClick,
          });

          Alert.mock.calls[0][0].onClose();
          expect(onResetButtonClick).toHaveBeenCalledWith();
        });
      });
    });

    describe("when headerAction exists", () => {
      it("should render the headerAction", () => {
        renderMyBetsHeader({
          ...DEFAULT_PROPS,
          headerAction: <SegmentedControl />,
        });

        expect(SegmentedControl).toHaveBeenCalled();
      });
    });
  });

  describe("when initializing without settlementLink", () => {
    renderMyBetsHeader({ ...DEFAULT_PROPS, settlementLink: null });

    it("shouldn't call MyBetsHeaderAddOn", () => {
      expect(MyBetsHeaderAddOn).not.toHaveBeenCalled();
    });
  });
});
