import { render } from "@testing-library/react-native";

import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AvBFixture, FootballScoreboard } from "@ppb/the-wall-native";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";

import FootballFixture from "./FootballFixture.native";
import ConnectedNotificationsSubscription from "../NotificationsSubscription";
import { NotificationsViewMode } from "../NotificationsSubscription/map-to-props-factory";
import NotificationsSubscription from "../NotificationsSubscription/NotificationsSubscription.native";

jest.mock("@ppb/the-wall-native", () => ({
  AvBFixture: jest.fn((props) => (
    <>
      {props.notificationsSubscription}
      <avb-fixture-component {...props} />
    </>
  )),
  FootballScoreboard: jest.fn((props) => <football-scoreboard {...props} />),
}));

jest.mock("../NotificationsSubscription/NotificationsSubscription.native", () =>
  jest.fn((props) => <notifications-subscription-mock {...props} />),
);

jest.mock("../NotificationsSubscription", () =>
  jest.fn((props) => <connected-notifications-subscription-mock {...props} />),
);

jest.mock("@ppb/the-wall-common/types", () => ({
  ScoreboardViewMode: { DEFAULT: "DEFAULT", COUPON: "COUPON", SMALL: "SMALL" },
}));

jest.mock("react-native-device-info", () => ({}));

function renderFootballFixture(footballFixtureProps) {
  return render(<FootballFixture {...footballFixtureProps} />);
}

describe("FootballFixture", () => {
  beforeEach(jest.clearAllMocks);

  const footballFixtureProps = {
    competition: "testCompetition",
    scoreboardProps: { fake: "score" },
    viewMode: ScoreboardViewMode.COUPON,
    showBottomSeparator: true,
    showEventDateBelow: true,
    showHorizontalDuration: false,
    availableToSubscribe: true,
    sporteventURN: "sport:event:urn",
    isHighlighted: false,
    iconsList: [IconsList.NINETY_MINUTE_PAYOUT, IconsList.LIVE_VIDEO],
  };

  describe("Scoreboard", () => {
    beforeEach(() => {
      renderFootballFixture(footballFixtureProps);
    });

    it("should render FootballScoreboard with correct props", () => {
      expect(FootballScoreboard).toHaveBeenCalledWith(
        {
          ...footballFixtureProps.scoreboardProps,
          viewMode: footballFixtureProps.viewMode,
          iconsList: footballFixtureProps.iconsList,
          showEventDateBelow: footballFixtureProps.showEventDateBelow,
          showHorizontalDuration: false,
          isHighlighted: footballFixtureProps.isHighlighted,
        },
        undefined,
      );
    });
  });

  describe("viewMode is undefined", () => {
    beforeEach(() => {
      renderFootballFixture({ ...footballFixtureProps, viewMode: undefined });
    });

    it("should render AvBFixture and FootballScoreboard with viewMode DEFAULT", () => {
      expect(FootballScoreboard).toHaveBeenCalledWith(
        expect.objectContaining({ viewMode: ScoreboardViewMode.DEFAULT }),
        undefined,
      );

      expect(AvBFixture).toHaveBeenCalledWith(
        expect.objectContaining({ viewMode: ScoreboardViewMode.DEFAULT }),
        undefined,
      );
    });
  });

  describe("Fixture", () => {
    describe("when viewMode is DEFAULT", () => {
      beforeEach(() => {
        renderFootballFixture({ ...footballFixtureProps, viewMode: ScoreboardViewMode.DEFAULT });
      });

      it("should call AvBFixture with the right props", () => {
        expect(AvBFixture).toHaveBeenCalledWith(
          expect.objectContaining({
            competitionLabel: footballFixtureProps.competition,
            showBottomSeparator: true,
            viewMode: ScoreboardViewMode.DEFAULT,
            notificationsSubscription: expect.anything(),
          }),
          undefined,
        );

        expect(ConnectedNotificationsSubscription).toHaveBeenCalledWith(
          {
            viewMode: NotificationsViewMode.EVENT_OR_RACE,
            component: NotificationsSubscription,
          },
          undefined,
        );
      });

      describe("when sporteventURN is false or not provided", () => {
        beforeEach(() => {
          renderFootballFixture({ ...footballFixtureProps, sporteventURN: undefined });
        });

        it("should call AvBFixture without the notification icon", () => {
          expect(AvBFixture).toHaveBeenCalledWith(
            expect.objectContaining({
              notificationsSubscription: undefined,
            }),
            undefined,
          );
        });
      });

      describe("when availableToSubscribe is false or not provided", () => {
        beforeEach(() => {
          renderFootballFixture({ ...footballFixtureProps, availableToSubscribe: undefined });
        });

        it("should call AvBFixture without the notification icon", () => {
          expect(AvBFixture).toHaveBeenCalledWith(
            expect.objectContaining({
              notificationsSubscription: undefined,
            }),
            undefined,
          );
        });
      });
    });

    describe("when viewMode is SMALL", () => {
      beforeEach(() => {
        renderFootballFixture({ ...footballFixtureProps, viewMode: ScoreboardViewMode.SMALL });
      });

      it("should call AvBFixture with the right props", () => {
        expect(AvBFixture).toHaveBeenCalledWith(
          expect.objectContaining({
            competitionLabel: undefined,
            showBottomSeparator: true,
            viewMode: ScoreboardViewMode.SMALL,
            notificationsSubscription: undefined,
          }),
          undefined,
        );
      });
    });

    describe("when viewMode is COUPON", () => {
      beforeEach(() => {
        renderFootballFixture({ ...footballFixtureProps, viewMode: ScoreboardViewMode.COUPON });
      });

      it("should call AvBFixture with the right props", () => {
        expect(AvBFixture).toHaveBeenCalledWith(
          expect.objectContaining({
            competitionLabel: undefined,
            viewMode: ScoreboardViewMode.COUPON,
            notificationsSubscription: undefined,
          }),
          undefined,
        );
      });
    });

    describe("when viewMode is invalid", () => {
      // Silly example for coverage... Istanbul doesn't seem to exhaust enums
      beforeEach(() => {
        renderFootballFixture({ ...footballFixtureProps, viewMode: "notvalid" });
      });

      it("should call AvBFixture with the right props", () => {
        expect(AvBFixture).toHaveBeenCalledWith(
          expect.objectContaining({
            competitionLabel: undefined,
            viewMode: "notvalid",
            notificationsSubscription: undefined,
          }),
          undefined,
        );
      });
    });
  });
});
