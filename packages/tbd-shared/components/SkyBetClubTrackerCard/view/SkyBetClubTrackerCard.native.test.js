import React from "react-native";
import { render } from "@testing-library/react-native";
import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import { navigate } from "@ppb/tbd-router";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { DisplayMode } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { SkyBetClubTracker } from "./snowflakes/SkyBetClubTracker/SkyBetClubTracker.native";
import SkyBetClubTrackerCard from "./SkyBetClubTrackerCard.native";
import useSkyBetClubTrackerVMMockFn from "../viewmodel/SkyBetClubTracker.viewmodel";

const translations = {
  firstLine: "Checking your Sky Bet Club Status...",
  infoLabelDays: " 3 days",
  primaryButtonLabel: "Go to Sky Bet Club",
  secondLine: " left to qualify for your reward",
  supportingText:
    " Free bet stakes are not returned. Free bet is non-withdrawable. No free bet expiry. Eligibility restrictions apply. Further T&Cs apply.",
};

const onHomepageLinkTapEvent = jest.fn();

const useSkyBetClubTrackerVMMock = {
  request: {
    called: true,
    loading: false,
    call: jest.fn(),
  },
  vm: {
    __typename: "SkyBetClubTrackerCard",
    urn: "urn",
    data: {
      sbcStatus: TrackingBarStatus.PLACEHOLDER,
      current: 0,
      target: 30,
      fulfilled: false,
      counterLabel: "£0/£30",
      i18n: translations,
      homePageUrl: "skybetClubURL",
      logo: AssetsIconName.BRAND_CLUB_LOGO,
    },
    events: {
      onHomepageLinkTapEvent,
    },
  },
};

jest.mock("@ppb/tbd-router/native", () => ({ navigate: jest.fn() }));

jest.mock("./snowflakes/SkyBetClubTracker/SkyBetClubTracker.native", () => ({
  SkyBetClubTracker: jest.fn(() => <connected-sky-bet-club-tracker />),
}));

jest.mock("../viewmodel/SkyBetClubTracker.viewmodel", () => ({
  ...jest.requireActual("../viewmodel/SkyBetClubTracker.viewmodel"),
  __esModule: true,
  default: jest.fn(),
}));

function renderComponent(params = {}) {
  useSkyBetClubTrackerVMMockFn.mockReturnValue({
    ...useSkyBetClubTrackerVMMock,
    ...params,
  });

  return render(<SkyBetClubTrackerCard />);
}

describe("SkyBetClubTrackerCard component", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should initialize SkyBetClubTracker with the correct props", () => {
    renderComponent();

    expect(SkyBetClubTracker).toHaveBeenCalledWith(
      {
        sbcStatus: TrackingBarStatus.PLACEHOLDER,
        current: 0,
        target: 30,
        fulfilled: false,
        counterLabel: "£0/£30",
        onPrimaryButtonTap: expect.any(Function),
        i18n: translations,
        logo: AssetsIconName.BRAND_CLUB_LOGO,
      },
      undefined,
    );
    expect(SkyBetClubTracker).toHaveBeenCalledTimes(1);
  });

  describe("when homePageUrl is not defined", () => {
    it("should not pass the onPrimaryButtonTap prop to the SkyBetClubTracker component", () => {
      renderComponent({ vm: { data: { homePageUrl: "" } } });

      expect(SkyBetClubTracker).toHaveBeenCalledWith(
        expect.objectContaining({
          onPrimaryButtonTap: undefined,
        }),
        undefined,
      );

      expect(SkyBetClubTracker).toHaveBeenCalledTimes(1);
    });
  });

  describe("when homePageUrl is defined and the primary button is tapped", () => {
    it("should call the event onHomepageLinkTapEvent with homePageUrl", () => {
      renderComponent();

      SkyBetClubTracker.mock.calls[0][0].onPrimaryButtonTap();

      expect(onHomepageLinkTapEvent).toHaveBeenCalledTimes(1);
      expect(onHomepageLinkTapEvent).toHaveBeenCalledWith(useSkyBetClubTrackerVMMock.vm.data.homePageUrl);
    });

    it("should call navigate action with the correct parameters", () => {
      renderComponent();

      SkyBetClubTracker.mock.calls[0][0].onPrimaryButtonTap();

      expect(navigate).toHaveBeenCalledWith({
        viewUrn: EntityType.ExternalView,
        viewUrl: useSkyBetClubTrackerVMMock.vm.data.homePageUrl,
        viewDisplayMode: DisplayMode.BlankWebview,
      });
    });
  });
});
