import { React, act } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import { Counter, ShowMore, TrackingBar, useOnIntersect } from "@ppb/the-wall-web";

import { EnhancedTrackingDataType } from "./ObbEnhancedTracking.types";
import ObbEnhancedTracking from "./ObbEnhancedTracking.web";

jest.mock("@ppb/the-wall-web", () => ({
  TrackingBar: jest.fn(() => <tracking-bar-mock />),
  Counter: jest.fn(() => <counter-mock />),
  ShowMore: jest.fn(() => <show-more-mock />),
  useOnIntersect: jest.fn(() => ({ isIntersecting: true })),
}));

const renderObbEnhancedTracking = (props) => render(<ObbEnhancedTracking {...props} />);

const BASE_PROPS = {
  dispatchSubscribeFixtureUpdates: jest.fn(),
  dispatchUnsubscribeFixtureUpdates: jest.fn(),
  dispatchObbEnhancedTrackingModalAction: jest.fn(),
};

const PROPS = {
  ...BASE_PROPS,
  urn: "urn",
  typename: "typename",
  enhancedTrackingData: [
    {
      enhancedTrackingType: EnhancedTrackingDataType.PROGRESS,
      goal: 5,
      status: TrackingBarStatus.ACTIVE,
      currentValue: 5,
      outcomeDefinitions: [
        {
          outcome: "SHOTS",
          periodStatus: "FULL",
          participantId: "6354321",
        },
        {
          outcome: "SHOTS",
          periodStatus: "FULL",
          participantId: "6354321",
        },
      ],
    },
    {
      enhancedTrackingType: EnhancedTrackingDataType.INDIVIDUAL_TRACKING,
      statsListTrackingData: [
        {
          outcome: "SHOTS",
          label: "Joao",
          stat: 3,
        },
        {
          outcome: "SHOTS",
          label: "Mota",
          stat: 2,
        },
      ],
    },
  ],
  footballPlayerIds: ["6354321", "6354322"],
  i18nLabels: {
    hidePlayerProgressLabel: "Hide Player Progress",
    playerProgressTitleLabel: "Player Progress",
    showPlayerProgressLabel: "Show Player Progress",
  },
  eventName: "Benfica vs Porto",
  cardUrn: "cardUrn",
  betLegPartType: "betLegPartType",
};

describe("ObbEnhancedTracking", () => {
  beforeEach(jest.clearAllMocks);

  describe("when urn and typename are undefined", () => {
    it("should not call dispatchSubscribeFixtureUpdates on mount", () => {
      renderObbEnhancedTracking(BASE_PROPS);

      expect(BASE_PROPS.dispatchSubscribeFixtureUpdates).not.toHaveBeenCalled();
    });

    it("should not call dispatchUnsubscribeFixtureUpdates on unmount", () => {
      const { unmount } = renderObbEnhancedTracking(BASE_PROPS);
      unmount();

      expect(BASE_PROPS.dispatchUnsubscribeFixtureUpdates).not.toHaveBeenCalled();
    });

    it("should not render the TrackingBar component", () => {
      renderObbEnhancedTracking(BASE_PROPS);

      expect(TrackingBar).not.toHaveBeenCalled();
    });

    it("should not render the Counter component", () => {
      renderObbEnhancedTracking(BASE_PROPS);

      expect(Counter).not.toHaveBeenCalled();
    });
  });

  describe("when urn and typename are defined", () => {
    it("should call dispatchSubscribeFixtureUpdates on mount", () => {
      renderObbEnhancedTracking(PROPS);

      expect(PROPS.dispatchSubscribeFixtureUpdates).toHaveBeenCalledTimes(1);
      expect(PROPS.dispatchSubscribeFixtureUpdates).toHaveBeenCalledWith(
        PROPS.urn,
        PROPS.typename,
        PROPS.footballPlayerIds,
      );
    });

    it("should call dispatchUnsubscribeFixtureUpdates on unmount", () => {
      const { unmount } = renderObbEnhancedTracking(PROPS);
      unmount();

      expect(PROPS.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledTimes(1);
      expect(PROPS.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledWith(PROPS.urn, PROPS.typename);
    });

    it("should render the TrackingBar component", () => {
      renderObbEnhancedTracking(PROPS);

      expect(TrackingBar).toHaveBeenCalledTimes(1);
      expect(TrackingBar).toHaveBeenNthCalledWith(
        1,
        {
          currentValue: 5,
          goalValue: 5,
          status: TrackingBarStatus.ACTIVE,
        },
        undefined,
      );
    });

    describe("when the enhancedTrackingData contains an outcome type of Individual Tracking", () => {
      it("should render and ShowMore component closed", () => {
        renderObbEnhancedTracking(PROPS);

        expect(ShowMore).toHaveBeenCalledTimes(1);
        expect(ShowMore).toHaveBeenCalledWith(expect.objectContaining({ opened: false }), undefined);
      });

      describe("when the ShowMore is opened", () => {
        let getAllByTestId;

        beforeEach(() => {
          const renderResult = renderObbEnhancedTracking(PROPS);
          getAllByTestId = renderResult.getAllByTestId;

          act(() => {
            const { onClick } = ShowMore.mock.calls[0][0];
            onClick();
          });
        });

        it("should render the Counter component for each Individual Tracking item", () => {
          expect(Counter).toHaveBeenCalledTimes(2);
          expect(Counter).toHaveBeenNthCalledWith(
            1,
            {
              color: "YELLOW",
              value: 3,
            },
            undefined,
          );
          expect(Counter).toHaveBeenNthCalledWith(
            2,
            {
              color: "YELLOW",
              value: 2,
            },
            undefined,
          );
        });

        it("should render the player name for each Individual Tracking item", () => {
          const playerName = getAllByTestId("player-name");

          expect(playerName).toHaveLength(2);
          expect(playerName[0]).toHaveTextContent("Joao");
          expect(playerName[1]).toHaveTextContent("Mota");
        });

        it("should call dispatchObbEnhancedTrackingModalAction", () => {
          renderObbEnhancedTracking(PROPS);

          expect(PROPS.dispatchObbEnhancedTrackingModalAction).toHaveBeenCalledTimes(1);
          expect(PROPS.dispatchObbEnhancedTrackingModalAction).toHaveBeenCalledWith(
            "opened",
            "Benfica vs Porto",
            "cardUrn",
            "betLegPartType",
          );
        });
      });
    });

    describe("when the enhancedTrackingData contains an outcome type of Squad Tracking", () => {
      it("should render and ShowMore component closed", () => {
        renderObbEnhancedTracking({
          ...PROPS,
          enhancedTrackingData: [
            PROPS.enhancedTrackingData[0],
            {
              enhancedTrackingType: EnhancedTrackingDataType.SQUAD_TRACKING,
              statsListTrackingData: [
                {
                  outcome: "SHOTS",
                  label: "Joao, Cristiano",
                  stat: 3,
                },
                {
                  outcome: "SHOTS",
                  label: "Mota",
                  stat: 2,
                },
              ],
            },
          ],
        });

        expect(ShowMore).toHaveBeenCalledTimes(1);
        expect(ShowMore).toHaveBeenCalledWith(expect.objectContaining({ opened: false }), undefined);
      });

      describe("when the ShowMore is opened", () => {
        let getAllByTestId;

        beforeEach(() => {
          const renderResult = renderObbEnhancedTracking({
            ...PROPS,
            enhancedTrackingData: [
              PROPS.enhancedTrackingData[0],
              {
                enhancedTrackingType: EnhancedTrackingDataType.SQUAD_TRACKING,
                statsListTrackingData: [
                  {
                    outcome: "SHOTS",
                    label: "Joao & Cristiano",
                    stat: 3,
                  },
                  {
                    outcome: "SHOTS",
                    label: "Mota",
                    stat: 2,
                  },
                ],
              },
            ],
          });
          getAllByTestId = renderResult.getAllByTestId;

          act(() => {
            const { onClick } = ShowMore.mock.calls[0][0];
            onClick();
          });
        });

        it("should render the Counter component for each Squad Tracking item", () => {
          expect(Counter).toHaveBeenCalledTimes(2);
          expect(Counter).toHaveBeenNthCalledWith(
            1,
            {
              color: "YELLOW",
              value: 3,
            },
            undefined,
          );
          expect(Counter).toHaveBeenNthCalledWith(
            2,
            {
              color: "YELLOW",
              value: 2,
            },
            undefined,
          );
        });

        it("should render the player name for each Squad Tracking item", () => {
          const playerName = getAllByTestId("player-name");

          expect(playerName).toHaveLength(2);
          expect(playerName[0]).toHaveTextContent("Joao & Cristiano");
          expect(playerName[1]).toHaveTextContent("Mota");
        });

        it("should call dispatchObbEnhancedTrackingModalAction", () => {
          renderObbEnhancedTracking(PROPS);

          expect(PROPS.dispatchObbEnhancedTrackingModalAction).toHaveBeenCalledTimes(1);
          expect(PROPS.dispatchObbEnhancedTrackingModalAction).toHaveBeenCalledWith(
            "opened",
            "Benfica vs Porto",
            "cardUrn",
            "betLegPartType",
          );
        });
      });
    });

    describe("when is not intersecting", () => {
      it("should call dispatchUnsubscribeFixtureUpdates", () => {
        const { rerender } = renderObbEnhancedTracking(PROPS);
        useOnIntersect.mockReturnValueOnce({ isIntersecting: false });

        rerender(<ObbEnhancedTracking {...PROPS} />);

        expect(PROPS.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledTimes(1);
        expect(PROPS.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledWith(PROPS.urn, PROPS.typename);
      });
    });
  });
});
