import { render, act } from "@testing-library/react-native";

import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import { TrackingBar, Counter, ShowMore } from "@ppb/the-wall-native";

import ObbEnhancedTracking from "./ObbEnhancedTracking.native";
import { EnhancedTrackingDataType } from "./ObbEnhancedTracking.types";
import { PLAYER_NAME } from "./ObbEnhancedTracking.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  TrackingBar: jest.fn(() => <tracking-bar-mock />),
  Counter: jest.fn(() => <counter-mock />),
  ShowMore: jest.fn((props) => <show-more-mock {...props} />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useVisibilityStatus: jest.fn(() => true),
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
    hideSquadsProgressLabel: "Hide Squads Progress",
    squadsProgressTitleLabel: "Squads Progress",
    showSquadsProgressLabel: "Show Squads Progress",
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
      act(() => {
        unmount();
      });

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

    describe("when the enhancedTrackingData contains individualTrackingData", () => {
      it("should render the ShowMore component closed", () => {
        renderObbEnhancedTracking(PROPS);

        expect(ShowMore).toHaveBeenCalledTimes(1);
        expect(ShowMore).toHaveBeenCalledWith(
          {
            hasBorderTop: false,
            onClick: expect.any(Function),
            opened: false,
            text: "Show Player Progress",
          },
          undefined,
        );
      });

      describe("when the ShowMore is opened", () => {
        let obbEnhancedTracking;

        beforeEach(() => {
          obbEnhancedTracking = renderObbEnhancedTracking(PROPS);

          act(() => {
            ShowMore.mock.calls[0][0].onClick();
          });
        });

        it("should render the Counter component for each individualTrackingData item", () => {
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

        it("should render the player name for each individualTrackingData item", () => {
          const playerNames = obbEnhancedTracking.getAllByTestId(PLAYER_NAME);

          expect(playerNames).toHaveLength(2);
          expect(playerNames[0].children[0]).toBe("Joao");
          expect(playerNames[1].children[0]).toBe("Mota");
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

    describe("when the enhancedTrackingData contains squadTrackingData", () => {
      it("should render the ShowMore component closed", () => {
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
        expect(ShowMore).toHaveBeenCalledWith(
          {
            hasBorderTop: false,
            onClick: expect.any(Function),
            opened: false,
            text: "Show Squads Progress",
          },
          undefined,
        );
      });

      describe("when the ShowMore is opened", () => {
        let obbEnhancedTracking;

        beforeEach(() => {
          obbEnhancedTracking = renderObbEnhancedTracking({
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

          act(() => {
            ShowMore.mock.calls[0][0].onClick();
          });
        });

        it("should render the Counter component for each individualTrackingData item", () => {
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

        it("should render the player name for each individualTrackingData item", () => {
          const playerNames = obbEnhancedTracking.getAllByTestId(PLAYER_NAME);

          expect(playerNames).toHaveLength(2);
          expect(playerNames[0].children[0]).toBe("Joao, Cristiano");
          expect(playerNames[1].children[0]).toBe("Mota");
        });

        it("should call dispatchObbEnhancedTrackingModalAction", () => {
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
  });
});
