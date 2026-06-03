import * as React from "react";
import "jest-dom/extend-expect";
import { act, render } from "@testing-library/react";

import { EventHeader as EventHeaderComponent, StickyHeader, useOnIntersect } from "@ppb/the-wall-web";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import FixtureHeader from "./FixtureHeader.web";
import ConnectedFootballFixture from "../FootballFixture";
import FootballFixture from "../FootballFixture/FootballFixture.web";
import ConnectedTennisFixture from "../TennisFixture";
import TennisFixture from "../TennisFixture/TennisFixture.web";
import ConnectedEventHeader from "../EventHeader";
import EventHeader from "../EventHeader/EventHeader.web";
import ConnectedBasketballFixture from "../BasketballFixture";
import BasketballFixture from "../BasketballFixture/BasketballFixture.web";
import ConnectedCricketFixture from "../CricketFixture";
import CricketFixture from "../CricketFixture/CricketFixture.web";
import ConnectedTableTennisFixture from "../TableTennisFixture";
import TableTennisFixture from "../TableTennisFixture/TableTennisFixture.web";
import ConnectedIceHockeyFixture from "../IceHockeyFixture";
import IceHockeyFixture from "../IceHockeyFixture/IceHockeyFixture.web";
import ConnectedRugbyUnionFixture from "../RugbyUnionFixture";
import RugbyUnionFixture from "../RugbyUnionFixture/RugbyUnionFixture.web";
import ConnectedRugbyLeagueFixture from "../RugbyLeagueFixture";
import RugbyLeagueFixture from "../RugbyLeagueFixture/RugbyLeagueFixture.web";
import ConnectedSnookerFixture from "../SnookerFixture";
import SnookerFixture from "../SnookerFixture/SnookerFixture.web";
import ConnectedBaseballFixture from "../BaseballFixture";
import BaseballFixture from "../BaseballFixture/BaseballFixture.web";
import ConnectedAustralianRulesFixture from "../AustralianRulesFixture";
import AustralianRulesFixture from "../AustralianRulesFixture/AustralianRulesFixture.web";
import ConnectedDartsFixture from "../DartsFixture";
import DartsFixture from "../DartsFixture/DartsFixture.web";

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("../../hooks/useDebounce", () => jest.fn().mockImplementation(() => true));

jest.mock("@ppb/the-wall-web/hooks/useOnIntersect");
useOnIntersect.mockReturnValue({ isIntersecting: true });

jest.spyOn(React, "useRef").mockReturnValue({
  current: 10,
});

jest.mock("@ppb/the-wall-web", () => ({
  EventHeader: jest.fn((props) => <event-header-component {...props} />),
  StickyHeader: jest.fn((props) => <sticky-header-mock {...props}>{props.children}</sticky-header-mock>),
  useOnIntersect: jest.fn(),
}));

jest.mock("../FootballFixture/FootballFixture.web", () => jest.fn(() => <football-fixture-mock />));

jest.mock("../FootballFixture", () => jest.fn(() => <connected-football-fixture-mock />));

jest.mock("../TennisFixture/TennisFixture.web", () => jest.fn(() => <tennis-fixture-mock />));

jest.mock("../TennisFixture", () => jest.fn(() => <connected-tennis-fixture-mock />));

jest.mock("../EventHeader/EventHeader.web", () => jest.fn(() => <event-header-mock />));

jest.mock("../EventHeader", () => jest.fn(() => <connected-event-header-mock />));

jest.mock("../BasketballFixture/BasketballFixture.web", () => jest.fn(() => <basketball-fixture-mock />));

jest.mock("../BasketballFixture", () => jest.fn(() => <connected-basketball-fixture-mock />));

jest.mock("../CricketFixture/CricketFixture.web", () => jest.fn(() => <cricket-fixture-mock />));

jest.mock("../CricketFixture", () => jest.fn(() => <connected-cricket-fixture-mock />));

jest.mock("../TableTennisFixture/TableTennisFixture.web", () => jest.fn(() => <table-tennis-fixture-mock />));

jest.mock("../TableTennisFixture", () => jest.fn(() => <connected-table-tennis-fixture-mock />));

jest.mock("../IceHockeyFixture/IceHockeyFixture.web", () => jest.fn(() => <ice-hockey-fixture-mock />));

jest.mock("../IceHockeyFixture", () => jest.fn(() => <connected-ice-hockey-fixture-mock />));

jest.mock("../RugbyUnionFixture/RugbyUnionFixture.web", () => jest.fn(() => <rugby-union-fixture-mock />));

jest.mock("../RugbyUnionFixture", () => jest.fn(() => <connected-rugby-union-fixture-mock />));

jest.mock("../RugbyLeagueFixture/RugbyLeagueFixture.web", () => jest.fn(() => <rugby-league-fixture-mock />));

jest.mock("../RugbyLeagueFixture", () => jest.fn(() => <connected-rugby-league-fixture-mock />));

jest.mock("../SnookerFixture/SnookerFixture.web", () => jest.fn(() => <snooker-fixture-mock />));

jest.mock("../SnookerFixture", () => jest.fn(() => <connected-snooker-fixture-mock />));

jest.mock("../BaseballFixture/BaseballFixture.web", () => jest.fn(() => <baseball-fixture-mock />));

jest.mock("../BaseballFixture", () => jest.fn(() => <connected-baseball-fixture-mock />));

jest.mock("../AustralianRulesFixture/AustralianRulesFixture.web", () =>
  jest.fn(() => <australian-rules-fixture-mock />),
);

jest.mock("../AustralianRulesFixture", () => jest.fn(() => <connected-australian-rules-fixture-mock />));

jest.mock("../DartsFixture/DartsFixture.web", () => jest.fn(() => <darts-fixture-mock />));

jest.mock("../DartsFixture", () => jest.fn(() => <connected-darts-fixture-mock />));

const PROPS = {
  viewMode: ScoreboardViewMode.DEFAULT,
  stickyOnScroll: false,
  showBottomSeparator: true,
  showEventDateBelow: true,
  dispatchSubscribeFixtureUpdates: jest.fn(),
  dispatchUnsubscribeFixtureUpdates: jest.fn(),
  videoAvailable: true,
  iconsList: [IconsList.LIVE_VIDEO],
  activeProduct: Product.Exchange,
  marketURN: "market:urn",
};

const BASE_PROPS = {
  fixtureURN: "BaseFixtureURN",
  exchangeURN: "exchangeURN",
  sporteventURN: "sporteventURN",
  sportsbookURN: "sportsbookURN",
  ...PROPS,
};

const FOOTBALL_PROPS = {
  fixtureURN: "FootballFixtureURN",
  typename: "FootballFixture",
  ...PROPS,
};

const TENNIS_PROPS = {
  fixtureURN: "TennisFixtureURN",
  typename: "TennisMatch",
  ...PROPS,
};

const BASEBALL_PROPS = {
  fixtureURN: "BaseballFixtureURN",
  typename: "BaseballFixture",
  ...PROPS,
};

const BASKETBALL_PROPS = {
  fixtureURN: "BasketballFixtureURN",
  typename: "BasketballFixture",
  ...PROPS,
};

const CRICKET_PROPS = {
  fixtureURN: "CricketFixtureURN",
  typename: "CricketFixture",
  ...PROPS,
};

const TABLE_TENNIS_PROPS = {
  fixtureURN: "TableTennisFixtureURN",
  typename: "TableTennisFixture",
  ...PROPS,
};

const ICE_HOCKEY_PROPS = {
  fixtureURN: "IceHockeyFixtureURN",
  typename: "IceHockeyFixture",
  ...PROPS,
};

const RUGBY_UNION_PROPS = {
  fixtureURN: "RugbyUnionFixtureURN",
  typename: "RugbyUnionFixture",
  ...PROPS,
};

const RUGBY_LEAGUE_PROPS = {
  fixtureURN: "RugbyLeagueFixtureURN",
  typename: "RugbyLeagueFixture",
  ...PROPS,
};

const SNOOKER_PROPS = {
  fixtureURN: "SnookerFixtureURN",
  typename: "SnookerFixture",
  ...PROPS,
};

const AUSTRALIAN_RULES_PROPS = {
  fixtureURN: "AustralianRulesFixtureURN",
  typename: "AustralianRulesFixture",
  ...PROPS,
};

const DARTS_PROPS = {
  fixtureURN: "DartsFixtureURN",
  typename: "DartsFixture",
  ...PROPS,
};

const EXPECTED_BASE_PROPS = {
  component: EventHeader,
  exchangeURN: BASE_PROPS.exchangeURN,
  sporteventURN: BASE_PROPS.sporteventURN,
  sportsbookURN: BASE_PROPS.sportsbookURN,
  viewMode: PROPS.viewMode,
  showTertiaryTitle: true,
  showBottomSeparator: true,
  iconsList: BASE_PROPS.iconsList,
  isSticky: false,
};

const EXPECTED_FOOTBALL_PROPS = {
  urn: FOOTBALL_PROPS.fixtureURN,
  component: FootballFixture,
  viewMode: FOOTBALL_PROPS.viewMode,
  showBottomSeparator: true,
  showEventDateBelow: true,
  iconsList: FOOTBALL_PROPS.iconsList,
  activeProduct: Product.Exchange,
  marketURN: "market:urn",
};

const EXPECTED_TENNIS_PROPS = {
  urn: TENNIS_PROPS.fixtureURN,
  component: TennisFixture,
  viewMode: TENNIS_PROPS.viewMode,
  showBottomSeparator: true,
  showEventDateBelow: true,
  videoAvailable: true,
};

const EXPECTED_BASEBALL_PROPS = {
  urn: BASEBALL_PROPS.fixtureURN,
  component: BaseballFixture,
  viewMode: BASEBALL_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_BASKETBALL_PROPS = {
  urn: BASKETBALL_PROPS.fixtureURN,
  component: BasketballFixture,
  viewMode: BASKETBALL_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_CRICKET_PROPS = {
  urn: CRICKET_PROPS.fixtureURN,
  component: CricketFixture,
  viewMode: CRICKET_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_TABLE_TENNIS_PROPS = {
  urn: TABLE_TENNIS_PROPS.fixtureURN,
  component: TableTennisFixture,
  viewMode: TABLE_TENNIS_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_ICE_HOCKEY_PROPS = {
  urn: ICE_HOCKEY_PROPS.fixtureURN,
  component: IceHockeyFixture,
  viewMode: ICE_HOCKEY_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_RUGBY_UNION_PROPS = {
  urn: RUGBY_UNION_PROPS.fixtureURN,
  component: RugbyUnionFixture,
  viewMode: RUGBY_UNION_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_RUGBY_LEAGUE_PROPS = {
  urn: RUGBY_LEAGUE_PROPS.fixtureURN,
  component: RugbyLeagueFixture,
  viewMode: RUGBY_LEAGUE_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_SNOOKER_PROPS = {
  urn: SNOOKER_PROPS.fixtureURN,
  component: SnookerFixture,
  viewMode: SNOOKER_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_AUSTRALIAN_RULES_PROPS = {
  urn: AUSTRALIAN_RULES_PROPS.fixtureURN,
  component: AustralianRulesFixture,
  viewMode: AUSTRALIAN_RULES_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

const EXPECTED_DARTS_PROPS = {
  urn: DARTS_PROPS.fixtureURN,
  component: DartsFixture,
  viewMode: DARTS_PROPS.viewMode,
  showEventDateBelow: true,
  showBottomSeparator: true,
  videoAvailable: true,
};

function renderFixtureHeader(props = BASE_PROPS) {
  return render(<FixtureHeader {...props}>{props.children}</FixtureHeader>);
}

describe("FixtureHeader", () => {
  beforeEach(jest.clearAllMocks);

  describe("when stickyOnScroll", () => {
    describe("is set to true", () => {
      it("should call StickyHeader", () => {
        renderFixtureHeader({ ...PROPS, stickyOnScroll: true, fixtureURN: "BasketballFixtureURN" });

        expect(StickyHeader).toHaveBeenCalledTimes(1);
        expect(StickyHeader).toHaveBeenCalledWith(
          {
            attachContainerId: "header",
            attachSpaceId: "sticky-space",
            stickyView: expect.anything(),
            children: expect.anything(),
          },
          undefined,
        );
      });

      it("should have a sticky version in stickyView", () => {
        renderFixtureHeader({ ...PROPS, stickyOnScroll: true, fixtureURN: "BasketballFixtureURN" });

        const { stickyView } = StickyHeader.mock.calls[0][0];

        render(stickyView);

        expect(ConnectedEventHeader).toHaveBeenCalledWith(
          expect.objectContaining({ viewMode: "SMALL", isSticky: true }),
          undefined,
        );
      });

      it("should have a base version in children", () => {
        renderFixtureHeader({ ...PROPS, stickyOnScroll: true, fixtureURN: "BasketballFixtureURN" });

        const { children } = StickyHeader.mock.calls[0][0];

        render(children);

        expect(ConnectedEventHeader).toHaveBeenCalledWith(
          expect.objectContaining({ viewMode: "DEFAULT", isSticky: false }),
          undefined,
        );
      });
    });

    describe("is set to false", () => {
      it("must render with showTertiaryTitle at true", () => {
        renderFixtureHeader({ ...PROPS, stickyOnScroll: false, fixtureURN: "BasketballFixtureURN" });

        expect(ConnectedEventHeader.mock.calls.length).toEqual(1);
        expect(ConnectedEventHeader.mock.calls[0][0].showTertiaryTitle).toEqual(true);
      });

      it("should not call StickyHeader", () => {
        renderFixtureHeader({ ...PROPS, stickyOnScroll: false });

        expect(StickyHeader).not.toHaveBeenCalled();
      });
    });
  });

  describe("when fixtureURN is undefined", () => {
    it("should not call dispatchSubscribeFixtureUpdates on mount", () => {
      renderFixtureHeader(PROPS);

      expect(PROPS.dispatchSubscribeFixtureUpdates).not.toHaveBeenCalled();
    });

    it("should not call dispatchUnsubscribeFixtureUpdates on unmount", () => {
      const { unmount } = renderFixtureHeader(PROPS);
      unmount();

      expect(PROPS.dispatchUnsubscribeFixtureUpdates).not.toHaveBeenCalled();
    });

    describe("and the view mode is DEFAULT", () => {
      it("must render with an EventHeader component with the expected props", () => {
        renderFixtureHeader();

        expect(ConnectedFootballFixture).not.toHaveBeenCalled();
        expect(ConnectedTennisFixture).not.toHaveBeenCalled();
        expect(EventHeaderComponent).not.toHaveBeenCalled();

        expect(ConnectedEventHeader.mock.calls.length).toEqual(1);
        expect(ConnectedEventHeader).toHaveBeenCalledWith(EXPECTED_BASE_PROPS, undefined);
      });
    });

    describe("and the viewMode is COUPON", () => {
      it("must render with an EventHeader component with the expected props", () => {
        renderFixtureHeader({ ...BASE_PROPS, viewMode: ScoreboardViewMode.COUPON });

        expect(ConnectedFootballFixture).not.toHaveBeenCalled();
        expect(ConnectedTennisFixture).not.toHaveBeenCalled();
        expect(EventHeaderComponent).not.toHaveBeenCalled();

        expect(ConnectedEventHeader.mock.calls.length).toEqual(1);
        expect(ConnectedEventHeader).toHaveBeenCalledWith(
          {
            ...EXPECTED_BASE_PROPS,
            viewMode: ScoreboardViewMode.COUPON,
          },
          undefined,
        );
      });
    });
  });

  describe("when fixtureURN and typename are defined", () => {
    describe("when fixtureURN is not subscribed", () => {
      it("should call dispatchSubscribeFixtureUpdates", () => {
        renderFixtureHeader(FOOTBALL_PROPS);

        expect(FOOTBALL_PROPS.dispatchSubscribeFixtureUpdates).toHaveBeenCalledTimes(1);
        expect(FOOTBALL_PROPS.dispatchSubscribeFixtureUpdates).toHaveBeenCalledWith(
          FOOTBALL_PROPS.fixtureURN,
          FOOTBALL_PROPS.typename,
          FOOTBALL_PROPS.viewMode,
        );
      });
    });

    describe("when fixtureURN is subscribed", () => {
      describe("when is not intersecting scrollable and sticky", () => {
        it("should call dispatchUnsubscribeFixtureUpdates", () => {
          const { rerender } = renderFixtureHeader(FOOTBALL_PROPS);
          useOnIntersect.mockReturnValueOnce({ isIntersecting: false });

          rerender(<FixtureHeader {...FOOTBALL_PROPS}>{FOOTBALL_PROPS.children}</FixtureHeader>);

          expect(FOOTBALL_PROPS.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledTimes(1);
          expect(FOOTBALL_PROPS.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledWith(
            FOOTBALL_PROPS.fixtureURN,
            FOOTBALL_PROPS.typename,
          );
        });
      });
    });
  });

  describe("when typename is", () => {
    describe("not supported", () => {
      it("must render with an ConnectedEventHeader component", () => {
        renderFixtureHeader({ ...BASE_PROPS, fixtureURN: "BaseFixtureURN" });

        expect(ConnectedFootballFixture).not.toHaveBeenCalled();
        expect(ConnectedTennisFixture).not.toHaveBeenCalled();

        expect(ConnectedEventHeader).toHaveBeenCalledWith(EXPECTED_BASE_PROPS, undefined);
      });
    });

    describe.each([
      ["FootballFixture", ConnectedFootballFixture, FOOTBALL_PROPS, EXPECTED_FOOTBALL_PROPS],
      ["TennisMatch", ConnectedTennisFixture, TENNIS_PROPS, EXPECTED_TENNIS_PROPS],
      ["BaseballFixture", ConnectedBaseballFixture, BASEBALL_PROPS, EXPECTED_BASEBALL_PROPS],
      ["BasketballFixture", ConnectedBasketballFixture, BASKETBALL_PROPS, EXPECTED_BASKETBALL_PROPS],
      ["CricketFixture", ConnectedCricketFixture, CRICKET_PROPS, EXPECTED_CRICKET_PROPS],
      ["TableTennisFixture", ConnectedTableTennisFixture, TABLE_TENNIS_PROPS, EXPECTED_TABLE_TENNIS_PROPS],
      ["IceHockeyFixture", ConnectedIceHockeyFixture, ICE_HOCKEY_PROPS, EXPECTED_ICE_HOCKEY_PROPS],
      ["RugbyUnionFixture", ConnectedRugbyUnionFixture, RUGBY_UNION_PROPS, EXPECTED_RUGBY_UNION_PROPS],
      ["RugbyLeagueFixture", ConnectedRugbyLeagueFixture, RUGBY_LEAGUE_PROPS, EXPECTED_RUGBY_LEAGUE_PROPS],
      ["SnookerFixture", ConnectedSnookerFixture, SNOOKER_PROPS, EXPECTED_SNOOKER_PROPS],
      [
        "AustralianRulesFixture",
        ConnectedAustralianRulesFixture,
        AUSTRALIAN_RULES_PROPS,
        EXPECTED_AUSTRALIAN_RULES_PROPS,
      ],
      ["DartsFixture", ConnectedDartsFixture, DARTS_PROPS, EXPECTED_DARTS_PROPS],
    ])("%s", (typename, connectedComponent, props, expectedProps) => {
      it(`must render with a ${typename} component`, () => {
        renderFixtureHeader(props);

        expect(ConnectedEventHeader).not.toHaveBeenCalled();
        expect(connectedComponent).toHaveBeenCalledWith(expectedProps, undefined);
      });

      describe("when is visible", () => {
        it("should call dispatchSubscribeFixtureUpdates on mount", () => {
          renderFixtureHeader(props);

          expect(props.dispatchSubscribeFixtureUpdates).toHaveBeenCalledWith(
            props.fixtureURN,
            typename,
            props.viewMode,
          );
        });

        it("should call dispatchUnsubscribeFixtureUpdates on unmount", () => {
          const { unmount } = renderFixtureHeader(props);

          act(() => {
            unmount();
          });

          expect(props.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledWith(props.fixtureURN, typename);
        });
      });

      describe("when is not visible", () => {
        it("should not call dispatchSubscribeFixtureUpdates on mount", () => {
          useOnIntersect.mockReturnValueOnce({ isIntersecting: false });
          renderFixtureHeader(props);

          expect(props.dispatchSubscribeFixtureUpdates).not.toHaveBeenCalled();
        });

        it("should not call dispatchUnsubscribeFixtureUpdates on unmount", () => {
          useOnIntersect.mockReturnValueOnce({ isIntersecting: false });
          const { unmount } = renderFixtureHeader(props);

          act(() => {
            unmount();
          });

          expect(props.dispatchUnsubscribeFixtureUpdates).not.toHaveBeenCalled();
        });
      });

      describe("when videoAvailable is false", () => {
        it(`must render with a ${typename} component`, () => {
          renderFixtureHeader({ ...props, videoAvailable: false });

          expect(ConnectedEventHeader).not.toHaveBeenCalled();

          expect(connectedComponent).toHaveBeenCalledWith(
            { ...expectedProps, ...(typename !== "FootballFixture" && { videoAvailable: false }) },
            undefined,
          );
        });
      });

      describe("when is intersecting", () => {
        it(`must render ${typename} with SMALL view mode`, () => {
          renderFixtureHeader({ ...props, stickyOnScroll: true });
          expect(connectedComponent.mock.calls.length).toEqual(1);
          expect(connectedComponent.mock.calls[0][0].viewMode).toEqual(props.viewMode);

          const { stickyView } = StickyHeader.mock.calls[0][0];

          render(stickyView);

          expect(connectedComponent.mock.calls.length).toEqual(2);
          expect(connectedComponent.mock.calls[1][0].viewMode).toEqual(ScoreboardViewMode.SMALL);
        });
      });
    });
  });
});
