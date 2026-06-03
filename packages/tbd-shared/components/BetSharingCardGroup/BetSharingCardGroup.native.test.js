import { render, act } from "@testing-library/react-native";
import { Divider } from "@ppb/the-wall-native";
import { StatusLabelType } from "@ppb/the-wall-common/types";
import { SportsIconName } from "@ppb/the-wall-icons";

import { takeElementScreenshot } from "../../helpers/screenshot.native";
import { share } from "../../helpers/share.native";
import { Share } from "./snowflakes/Share/Share.native";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";
import BetSharingCardGroup from "./BetSharingCardGroup.native";
import { SportsbookBetPanel } from "../SportsbookBetPanel/SportsbookBetPanel.native";

const mockGetRef = jest.fn();

jest.mock("./snowflakes/Share/Share.native", () => ({
  Share: jest.fn(({ props, children }) => <share-mock {...props}>{children}</share-mock>),
}));
jest.mock("../CardGroup/", () => jest.fn(() => <connected-card-group-mock />));
jest.mock("../CardGroup/CardGroup.native", () => jest.fn(() => <card-group-mock />));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(() => mockGetRef()),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Divider: jest.fn(({ props }) => <divider-mock {...props} />),
}));

jest.mock("../SportsbookBetPanel/SportsbookBetPanel.native", () => ({
  SportsbookBetPanel: jest.fn(({ children, ...props }) => (
    <sportsbook-bet-panel-mock {...props}>{children}</sportsbook-bet-panel-mock>
  )),
}));

jest.mock("../../helpers/share.native", () => ({
  share: jest.fn(),
}));

const SCREENSHOT_REF = "some screenshot";

jest.mock("../../helpers/screenshot.native", () => ({
  takeElementScreenshot: jest.fn(),
}));

const dispatchDeleteViewItemsSpy = jest.fn();
const dispatchDismissTapSpy = jest.fn();
const dispatchShareBetTapSpy = jest.fn();
const dispatchShareImageTapSpy = jest.fn();

const BET_LEG_CARD_1 = {
  urn: "bet:leg:card:1",
  typename: "sportsbook:bet:leg:card",
};

const BET_LEG_CARD_2 = {
  urn: "bet:leg:card:2",
  typename: "sportsbook:bet:leg:card",
};

const DEFAULT_PROPS = {
  title: "Some title",
  description: "Some description",
  betTitle: "Some bet title",
  betSupportingText: "Some bet supporting text",
  betStatusLabel: {
    text: "Some label text",
    type: StatusLabelType.WON,
    icon: SportsIconName.AUSSIE_FOOTBALL,
  },
  items: [BET_LEG_CARD_1, BET_LEG_CARD_2],
  betShareButtonText: "Some bet share button text",
  imageShareButtonText: "Some image share button text",
  shareMessage: "Some share message",
  dispatchDeleteViewItems: dispatchDeleteViewItemsSpy,
  dispatchDismissTap: dispatchDismissTapSpy,
  dispatchShareBetTap: dispatchShareBetTapSpy,
  dispatchShareImageTap: dispatchShareImageTapSpy,
};

const renderBetSharingCardGroup = ({
  title,
  description,
  betTitle,
  betSupportingText,
  betStatusLabel,
  items,
  betShareButtonText,
  imageShareButtonText,
  shareMessage,
  dispatchDeleteViewItems,
  dispatchDismissTap,
  dispatchShareBetTap,
  dispatchShareImageTap,
} = DEFAULT_PROPS) =>
  render(
    <BetSharingCardGroup
      urn={"ppb:tbd:cardgroup:betsharing"}
      title={title}
      description={description}
      betTitle={betTitle}
      betSupportingText={betSupportingText}
      betStatusLabel={betStatusLabel}
      items={items}
      betShareButtonText={betShareButtonText}
      imageShareButtonText={imageShareButtonText}
      shareMessage={shareMessage}
      dispatchDeleteViewItems={dispatchDeleteViewItems}
      dispatchDismissTap={dispatchDismissTap}
      dispatchShareBetTap={dispatchShareBetTap}
      dispatchShareImageTap={dispatchShareImageTap}
    />,
  );

describe("BetSharingCardGroup component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when called", () => {
    it("should call Share component with the correct params", () => {
      takeElementScreenshot.mockReturnValueOnce({ current: SCREENSHOT_REF });
      mockGetRef.mockReturnValueOnce({ current: SCREENSHOT_REF });

      renderBetSharingCardGroup();

      expect(Share).toHaveBeenCalledTimes(1);
      expect(Share).toHaveBeenCalledWith(
        {
          title: DEFAULT_PROPS.title,
          description: DEFAULT_PROPS.description,
          screenshotRef: expect.any(Object),
          leftButtonText: DEFAULT_PROPS.betShareButtonText,
          rightButtonText: DEFAULT_PROPS.imageShareButtonText,
          onCloseTap: expect.any(Function),
          onLeftButtonTap: expect.any(Function),
          onRightButtonTap: expect.any(Function),
          children: expect.any(Object),
        },
        undefined,
      );
    });

    it("should call SportsbookBetPanel component with the correct params", () => {
      renderBetSharingCardGroup();

      expect(SportsbookBetPanel).toHaveBeenCalledTimes(1);
      expect(SportsbookBetPanel).toHaveBeenCalledWith(
        {
          title: DEFAULT_PROPS.betTitle,
          supportingText: DEFAULT_PROPS.betSupportingText,
          statusLabelIcon: DEFAULT_PROPS.betStatusLabel.icon,
          statusLabelText: DEFAULT_PROPS.betStatusLabel.text,
          statusLabelType: DEFAULT_PROPS.betStatusLabel.type,
        },
        undefined,
      );
    });

    it("should call Divider component", () => {
      renderBetSharingCardGroup();

      expect(Divider).toHaveBeenCalledTimes(1);
      expect(Divider).toHaveBeenCalled();
    });

    it("should call Card component", () => {
      renderBetSharingCardGroup();

      expect(ConnectedCardGroup).toHaveBeenCalledTimes(2);
      expect(ConnectedCardGroup).toHaveBeenNthCalledWith(
        1,
        {
          urn: BET_LEG_CARD_1.urn,
          typename: BET_LEG_CARD_1.typename,
          component: CardGroup,
        },
        undefined,
      );
      expect(ConnectedCardGroup).toHaveBeenNthCalledWith(
        2,
        {
          urn: BET_LEG_CARD_2.urn,
          typename: BET_LEG_CARD_2.typename,
          component: CardGroup,
        },
        undefined,
      );
    });
  });

  describe("when pressing the bet share button", () => {
    beforeEach(async () => {
      renderBetSharingCardGroup();

      await act(() => {
        Share.mock.calls[0][0].onLeftButtonTap();
      });
    });

    it("should call DELETE_VIEW action", async () => {
      expect(share).toHaveBeenCalledTimes(1);
      expect(share).toHaveBeenCalledWith({ message: DEFAULT_PROPS.shareMessage });

      expect(dispatchDeleteViewItemsSpy).toHaveBeenCalledTimes(1);
      expect(dispatchDeleteViewItemsSpy).toHaveBeenCalledWith("ppb:tbd:cardgroup:betsharing");
    });

    it("should call MyBetsBetSharingShareBetTapAction", () => {
      expect(dispatchShareBetTapSpy).toHaveBeenCalledTimes(1);
      expect(dispatchShareBetTapSpy).toHaveBeenCalledWith();
    });
  });

  describe("when pressing the image share button", () => {
    beforeEach(async () => {
      takeElementScreenshot.mockReturnValueOnce(SCREENSHOT_REF);
      mockGetRef.mockReturnValueOnce({ current: SCREENSHOT_REF });
      renderBetSharingCardGroup();

      await act(() => {
        Share.mock.calls[0][0].onRightButtonTap();
      });
    });

    it("should call DELETE_VIEW action", async () => {
      expect(takeElementScreenshot).toHaveBeenCalledTimes(1);
      expect(takeElementScreenshot).toHaveBeenCalledWith(SCREENSHOT_REF);

      expect(dispatchDeleteViewItemsSpy).toHaveBeenCalledTimes(1);
      expect(dispatchDeleteViewItemsSpy).toHaveBeenCalledWith("ppb:tbd:cardgroup:betsharing");
    });

    it("should call MyBetsBetSharingShareImageTapAction", () => {
      expect(dispatchShareImageTapSpy).toHaveBeenCalledTimes(1);
      expect(dispatchShareImageTapSpy).toHaveBeenCalledWith();
    });
  });

  describe("when takeElementScreenshot does not return a value after pressing the image share button", () => {
    it("should not call share function", async () => {
      takeElementScreenshot.mockReturnValue(null);
      mockGetRef.mockReturnValue({ current: null });
      renderBetSharingCardGroup();

      await act(() => {
        Share.mock.calls[0][0].onRightButtonTap();
      });

      expect(share).not.toHaveBeenCalled();
    });
  });

  describe("when takeElementScreenshot returns a value after pressing the image share button", () => {
    it("should call share function", async () => {
      takeElementScreenshot.mockReturnValue(SCREENSHOT_REF);
      mockGetRef.mockReturnValue({ current: SCREENSHOT_REF });

      renderBetSharingCardGroup();

      await act(() => {
        Share.mock.calls[0][0].onRightButtonTap();
      });

      expect(takeElementScreenshot).toHaveBeenCalledTimes(1);
      expect(takeElementScreenshot).toHaveBeenCalledWith(SCREENSHOT_REF);

      expect(share).toHaveBeenCalledTimes(1);
      expect(share).toHaveBeenCalledWith({ url: SCREENSHOT_REF });
    });
  });

  describe("when pressing the close button", () => {
    beforeEach(() => {
      renderBetSharingCardGroup();

      act(() => {
        Share.mock.calls[0][0].onCloseTap();
      });
    });

    it("should call DELETE_VIEW_ITEMS action", () => {
      expect(dispatchDeleteViewItemsSpy).toHaveBeenCalledTimes(1);
      expect(dispatchDeleteViewItemsSpy).toHaveBeenCalledWith("ppb:tbd:cardgroup:betsharing");

      expect(share).not.toHaveBeenCalled();
    });

    it("should call MyBetsBetSharingDismissTapAction", () => {
      expect(dispatchDismissTapSpy).toHaveBeenCalledTimes(1);
      expect(dispatchDismissTapSpy).toHaveBeenCalledWith();

      expect(share).not.toHaveBeenCalled();
    });
  });
});
