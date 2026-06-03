import { render } from "@testing-library/react";

import { MarketPromoSignposting } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { RaceLinkIcon } from "./snowflakes/RaceLink/RaceLink.types";

import { RaceLink } from "./snowflakes/RaceLink/RaceLink.web";

import RaceByTimeRangeCard from "./RaceByTimeRangeCard.web";

jest.mock("./snowflakes/RaceLink/RaceLink.web", () => ({
  RaceLink: jest.fn(({ props, children }) => <race-link-mock {...props}>{children}</race-link-mock>),
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
          onLinkClick: expect.any(Function),
          iconStates: [],
          isDetailed: false,
        },
        undefined,
      );
    });

    it("should call the racelink component with the correct iconState if isRaceClosed is true", () => {
      renderComponent({ isRaceClosed: true, promotion: MarketPromoSignposting.ExtraPlaces });

      expect(RaceLink).toHaveBeenCalledWith(
        {
          item: { viewLink: VIEW_LINK_MOCK, title: "17:15" },
          onLinkClick: expect.any(Function),
          iconStates: [RaceLinkIcon.RaceClosed],
          isDetailed: false,
        },
        undefined,
      );
    });

    describe("when race is not closed", () => {
      it("should call the racelink component with the extra places promotion iconState", () => {
        renderComponent({ promotion: MarketPromoSignposting.ExtraPlaces });

        expect(RaceLink).toHaveBeenCalledWith(
          {
            item: { viewLink: VIEW_LINK_MOCK, title: "17:15" },
            onLinkClick: expect.any(Function),
            iconStates: [RaceLinkIcon.ExtraPlaces],
            isDetailed: false,
          },
          undefined,
        );
      });

      it("should call the racelink component with the Promotion iconState", () => {
        renderComponent({ promotion: MarketPromoSignposting.MoneyBack });

        expect(RaceLink).toHaveBeenCalledWith(
          {
            item: { viewLink: VIEW_LINK_MOCK, title: "17:15" },
            onLinkClick: expect.any(Function),
            iconStates: [RaceLinkIcon.Promotion],
            isDetailed: false,
          },
          undefined,
        );
      });
    });

    describe("when sport is horse racing", () => {
      it("should call the racelink component with truthy isDetailed", () => {
        renderComponent({ isHorseRacing: true });

        expect(RaceLink).toHaveBeenCalledWith(
          {
            item: { viewLink: VIEW_LINK_MOCK, title: "17:15" },
            onLinkClick: expect.any(Function),
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
            onLinkClick: expect.any(Function),
            iconStates: [],
            isDetailed: true,
          },
          undefined,
        );
      });
    });
  });

  describe("when the handleLinkClick callback is called", () => {
    describe("with a correct viewlink", () => {
      it("should call dispatchPush with the viewlink", () => {
        const dispatchPush = jest.fn();
        const preventDefault = jest.fn();

        renderComponent({ dispatchPush });
        RaceLink.mock.calls[0][0].onLinkClick({ preventDefault });

        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(dispatchPush).toHaveBeenCalledWith(VIEW_LINK_MOCK);
      });

      it("should call dispatchClickAction with the viewlink", () => {
        const dispatchClickAction = jest.fn();
        const preventDefault = jest.fn();

        renderComponent({ dispatchClickAction });
        RaceLink.mock.calls[0][0].onLinkClick({ preventDefault });

        expect(preventDefault).toHaveBeenCalledTimes(1);
        expect(dispatchClickAction).toHaveBeenCalledWith(
          "urn",
          "horse-racing/delaware-park-(us)-7th-jun/r-7%7C30595392.1715",
          "17:15",
          false,
        );
      });
    });
  });
});
