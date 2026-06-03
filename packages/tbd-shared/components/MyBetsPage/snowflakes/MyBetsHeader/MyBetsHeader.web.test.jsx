import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { AlertType, TabsGroupSize } from "@ppb/the-wall-common/types";
import { Alert, TabsGroup, SegmentedControl } from "@ppb/the-wall-web";
import { MyBetsHeader } from "./MyBetsHeader.web";
import { HEADER_BUTTON } from "./MyBetsHeader.web.selectors";
import { MyBetsHeaderAddOn } from "../MyBetsHeaderAddOn/MyBetsHeaderAddOn.web";
import { settlementLinkLabelMock } from "../../MyBetsPage.mocks";
import ConnectedCard from "../../../Card";

jest.mock("@ppb/the-wall-web", () => ({
  TabsGroup: jest.fn(({ props, children }) => <tabs-mock {...props}>{children}</tabs-mock>),
  SegmentedControl: jest.fn(() => <segmented-control-mock />),
  ActionLink: jest.fn((props) => <action-link-mock {...props} />),
  Alert: jest.fn((props) => <alert-mock {...props} />),
  PageHeader: jest.fn((props) => <page-header-mock {...props} />),
  StickyHeader: jest.fn(({ props, children }) => <sticky-header-mock {...props}>{children}</sticky-header-mock>),
}));

jest.mock("../MyBetsHeaderAddOn/MyBetsHeaderAddOn.web", () => ({
  MyBetsHeaderAddOn: jest.fn((props) => <my-bets-header-add-on-mock {...props} />),
}));

jest.mock("../../../Card", () => jest.fn((props) => <mock-connected-card {...props} />));

const orderTypeListMock = [
  {
    id: "OPEN",
    title: "Open",
  },
  {
    id: "SETTLED",
    title: "Settled",
  },
];

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

let myBetsHeaderContainer;

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

function renderMyBetsHeader(props = DEFAULT_PROPS) {
  ({ container: myBetsHeaderContainer } = render(
    <MyBetsHeader
      title={props.title}
      resetButtonText={props.resetButtonText}
      resetAlertText={props.resetAlertText}
      showResetButton={props.showResetButton}
      showResetAlert={props.showResetAlert}
      onResetButtonClick={props.onResetButtonClick}
      orderTypeList={props.orderTypeList}
      onOrderTypeTap={props.onOrderTypeTap}
      selectedOrderType={props.selectedOrderType}
      showOrderStatusFilter={props.showOrderStatusFilter}
      orderStatusList={props.orderStatusList}
      selectedOrderStatusType={props.selectedOrderStatusType}
      onOrderStatusTap={props.onOrderStatusTap}
      headerAction={props.headerAction}
      settlementLink={props.settlementLink}
      settlementLinkLabel={props.settlementLinkLabel}
      dispatchSettlementLinkPageNavigationAction={dispatchSettlementLinkPageNavigationActionMock}
      headerItems={props.headerItems}
    />,
  ));
}

describe("MyBetsPage component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing", () => {
    beforeEach(renderMyBetsHeader);

    it("should render my bets page Title in a ConnectedCard", () => {
      expect(ConnectedCard).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:card:genericswitcher:mybets",
          component: expect.any(Function),
          typename: "GenericSwitcherCard",
        },
        undefined,
      );
      expect(myBetsHeaderContainer.querySelector(HEADER_BUTTON)).toBeDefined();
    });

    it("should call Tabs with correct props", () => {
      expect(TabsGroup).toHaveBeenCalledWith(
        {
          label: "Tabs",
          onTabSwitch: onOrderTypeChangeMock,
          defaultTab: selectedOrderTypeMock,
          headers: orderTypeListMock,
          size: TabsGroupSize.Regular,
          background: false,
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
            onClick: expect.any(Function),
            options: ["matched", "unmatched"],
            selectedOption: "matched",
          },
          undefined,
        );
      });

      describe("when onOrderStatusTap is defined", () => {
        it("should call onOrderStatusTap with id onClick function call", () => {
          const onOrderStatusTapMock = jest.fn();
          renderMyBetsHeader({
            ...DEFAULT_PROPS,
            showOrderStatusFilter: true,
            orderStatusList: ["matched", "unmatched"],
            selectedOrderStatusType: "matched",
            onOrderStatusTap: onOrderStatusTapMock,
          });

          SegmentedControl.mock.calls[0][0].onClick("mockId");

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
          expect(onResetButtonClick).toHaveBeenCalled();
        });
      });
    });

    describe("when headerAction is set", () => {
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
