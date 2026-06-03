import "jest-dom/extend-expect";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { MyBetsHeaderAddOn } from "./MyBetsHeaderAddOn.native";
import { Pressable } from "react-native";
import { navigate } from "@ppb/tbd-router";
import { render } from "@testing-library/react-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { settlementLinkLabelMock } from "../../MyBetsPage.mocks";
import { ActionLink } from "@ppb/the-wall-native";
import { ActionLinkColor, ActionLinkTypography } from "@ppb/the-wall-common/types";

jest.mock("@ppb/the-wall-native", () => ({
  ActionLink: jest.fn((props) => <action-link {...props} />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    MyBetsHeaderAddOnHighlightedIconColour: "color",
  },
}));

jest.mock("react-native", () => {
  const { StyleSheet, View, Text } = jest.requireActual("react-native");

  return {
    StyleSheet,
    View,
    Text,
    Pressable: jest.fn((props) => <pressable-mock {...props} />),
  };
});

jest.mock("@ppb/tbd-router", () => ({
  navigate: jest.fn(),
}));

const settlementLinkMock = "brand.com/help";
const selectedOrderTypeMock = "OPEN";
const dispatchSettlementLinkPageNavigationActionMock = jest.fn();

const DEFAULT_PROPS = {
  settlementLink: settlementLinkMock,
  selectedOrderType: selectedOrderTypeMock,
  settlementLinkLabel: settlementLinkLabelMock,
  dispatchSettlementLinkPageNavigationAction: dispatchSettlementLinkPageNavigationActionMock,
};

function renderMyBetsHeaderAddOn(props = DEFAULT_PROPS) {
  return render(<MyBetsHeaderAddOn {...props} />);
}

describe("MyBetsHeaderAddOn component", () => {
  beforeAll(jest.clearAllMocks);

  describe("when initializing", () => {
    beforeEach(renderMyBetsHeaderAddOn);

    it("should call GenericIcon with the correct props", () => {
      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: SystemIconName.NOTIFICATION_HELP,
          color: tokens.MyBetsHeaderAddOnHighlightedIconColour,
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

    describe("onPress", () => {
      beforeAll(() => Pressable.mock.calls[0][0].onPress());

      it("should call navigate with the correct props", () => {
        expect(navigate).toHaveBeenCalledWith({
          viewUrl: settlementLinkMock,
          viewUrn: "ppb:tbd:view:external",
          viewDisplayMode: "BLANK_WEBVIEW",
        });
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
