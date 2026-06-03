import { fireEvent, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { MyBetsHeaderAddOn } from "./MyBetsHeaderAddOn.web";
import { BUTTON } from "./MyBetsHeaderAddOn.web.selectors";
import { settlementLinkLabelMock } from "../../MyBetsPage.mocks";
import { ActionLink } from "@ppb/the-wall-web";
import { ActionLinkColor, ActionLinkTypography } from "@ppb/the-wall-common/types";

jest.mock("@ppb/the-wall-web", () => ({
  Link: jest.fn((props) => <link-mock {...props} />),
  ActionLink: jest.fn((props) => <action-link {...props} />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

const settlementLinkMock = "brand.com/help";
const selectedOrderTypeMock = "OPEN";
const dispatchSettlementLinkActionMock = jest.fn();
const dispatchSettlementLinkPageNavigationActionMock = jest.fn();

const DEFAULT_PROPS = {
  settlementLink: settlementLinkMock,
  settlementLinkLabel: settlementLinkLabelMock,
  selectedOrderType: selectedOrderTypeMock,
  dispatchSettlementLinkAction: dispatchSettlementLinkActionMock,
  dispatchSettlementLinkPageNavigationAction: dispatchSettlementLinkPageNavigationActionMock,
};

function renderMyBetsHeaderAddOn(props = DEFAULT_PROPS) {
  return render(<MyBetsHeaderAddOn {...props} />);
}

describe("MyBetsHeaderAddOn component", () => {
  beforeAll(jest.clearAllMocks);

  describe("when initializing", () => {
    it("should call GenericIcon with the correct props", () => {
      renderMyBetsHeaderAddOn();
      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: SystemIconName.NOTIFICATION_HELP,
          color: "var(--my-bets-header-add-on-highlighted-icon-colour)",
        },
        undefined,
      );
    });

    it("should display the settlement link label", () => {
      expect(ActionLink).toHaveBeenCalledWith(
        {
          capitalize: false,
          color: ActionLinkColor.Highlighted,
          text: settlementLinkLabelMock,
          typography: ActionLinkTypography.Regular,
          noPadding: true,
          onClick: expect.any(Function),
        },
        undefined,
      );
    });

    describe("when button is clicked", () => {
      beforeAll(() => {
        const { container } = renderMyBetsHeaderAddOn();
        const button = container.querySelector(BUTTON);
        fireEvent.click(button);
      });

      it("should call dispatchSettlementLinkAction with the correct props", () => {
        expect(dispatchSettlementLinkActionMock).toHaveBeenCalledWith(settlementLinkMock);

        expect(dispatchSettlementLinkActionMock).toHaveBeenCalledTimes(1);
      });

      it("should call dispatchSettlementLinkPageNavigationAction with the correct props", () => {
        expect(dispatchSettlementLinkPageNavigationActionMock).toHaveBeenCalledWith(
          settlementLinkMock,
          selectedOrderTypeMock,
        );

        expect(dispatchSettlementLinkPageNavigationActionMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
