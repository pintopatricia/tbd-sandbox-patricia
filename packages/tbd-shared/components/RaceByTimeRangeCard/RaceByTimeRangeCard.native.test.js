import { render } from "@testing-library/react-native";
import { MarketPromoSignposting } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { navigate } from "@ppb/tbd-router/native";
import { RaceLinkIcon } from "./snowflakes/RaceLink/RaceLink.types";
import { RaceLink } from "./snowflakes/RaceLink/RaceLink.native";
import RaceByTimeRangeCard from "./RaceByTimeRangeCard.native";

jest.mock("./snowflakes/RaceLink/RaceLink.native", () => ({
  RaceLink: jest.fn(({ props, children }) => <race-link-mock {...props}>{children}</race-link-mock>),
}));

jest.mock("./snowflakes/RaceLink/RaceLink.types", () => ({
  RaceLinkIcon: {
    RaceClosed: "RACE_CLOSED",
  },
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <race-link-mock />),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(() => {}),
}));

const VIEW_LINK_MOCK = {
  viewUrn: "ppb:tbd:view:race:7|30595392.1715",
  viewUrl: "horse-racing/delaware-park-(us)-7th-jun/r-7%7C30595392.1715",
};

function renderComponent({
  title = "17:15",
  viewLink = VIEW_LINK_MOCK,
  isRaceClosed = false,
  promotion = undefined,
  subtitle,
  isHorseRacing = false,
  dispatchPush = () => {},
  dispatchClickAction = () => {},
}) {
  return render(
    <RaceByTimeRangeCard
      urn={"urn"}
      title={title}
      viewLink={viewLink}
      isRaceClosed={isRaceClosed}
      promotion={promotion}
      subtitle={subtitle}
      isHorseRacing={isHorseRacing}
      dispatchPush={dispatchPush}
      dispatchClickAction={dispatchClickAction}
    />,
  );
}

describe("RaceByTimeRangeCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("when render a race by title range card", () => {
    it("should call the racelink component with the right props", () => {
      renderComponent({});

      expect(RaceLink).toHaveBeenCalledWith(
        {
          item: { viewLink: VIEW_LINK_MOCK, title: "17:15" },
          onPress: expect.any(Function),
          iconStates: [],
          isDetailed: false,
        },
        undefined,
      );
    });
  });

  it("should call the RaceLink component with the correct iconState if isRaceClosed is true", () => {
    renderComponent({ isRaceClosed: true });

    expect(RaceLink).toHaveBeenCalledWith(
      {
        item: { viewLink: VIEW_LINK_MOCK, title: "17:15" },
        onPress: expect.any(Function),
        iconStates: [RaceLinkIcon.RaceClosed],
        isDetailed: false,
      },
      undefined,
    );
  });

  describe("when race is not closed", () => {
    it("should call GenericIcon with EXTRA_PLACES when promotion is extra places", () => {
      renderComponent({ promotion: MarketPromoSignposting.ExtraPlaces });

      expect(RaceLink).toHaveBeenCalledWith(
        {
          item: { viewLink: VIEW_LINK_MOCK, title: "17:15" },
          onPress: expect.any(Function),
          iconStates: [RaceLinkIcon.ExtraPlaces],
          isDetailed: false,
        },
        undefined,
      );
    });

    it("should call GenericIcon with SPORTS_PROMOTION when promotion is money back", () => {
      renderComponent({ promotion: MarketPromoSignposting.MoneyBack });

      expect(RaceLink).toHaveBeenCalledWith(
        {
          item: { viewLink: VIEW_LINK_MOCK, title: "17:15" },
          onPress: expect.any(Function),
          iconStates: [RaceLinkIcon.Promotion],
          isDetailed: false,
        },
        undefined,
      );
    });

    describe("when sport is horse racing", () => {
      it("should call the racelink component with truthy isDetailed", () => {
        renderComponent({ isHorseRacing: true });

        expect(RaceLink).toHaveBeenCalledWith(
          {
            item: { viewLink: VIEW_LINK_MOCK, title: "17:15" },
            onPress: expect.any(Function),
            iconStates: [],
            isDetailed: true,
          },
          undefined,
        );
      });
    });

    describe("when subtitle is provided", () => {
      it("should call the racelink component with the correct subtitle", () => {
        renderComponent({ subtitle: "subtitle", isHorseRacing: true });

        expect(RaceLink).toHaveBeenCalledWith(
          {
            item: { viewLink: VIEW_LINK_MOCK, title: "17:15", subtitle: "subtitle" },
            onPress: expect.any(Function),
            iconStates: [],
            isDetailed: true,
          },
          undefined,
        );
      });
    });
  });

  describe("when the handleLinkClick callback is called", () => {
    it("should call navigate with the viewlink", () => {
      const dispatchPush = jest.fn();
      const dispatchClickAction = jest.fn();

      renderComponent({ dispatchPush, dispatchClickAction });
      RaceLink.mock.calls[0][0].onPress(VIEW_LINK_MOCK, "17:15");

      expect(navigate).toHaveBeenCalledWith(VIEW_LINK_MOCK);
      expect(dispatchClickAction).toHaveBeenCalledWith(
        "urn",
        "horse-racing/delaware-park-(us)-7th-jun/r-7%7C30595392.1715",
        "17:15",
        false,
      );
    });
  });
});
