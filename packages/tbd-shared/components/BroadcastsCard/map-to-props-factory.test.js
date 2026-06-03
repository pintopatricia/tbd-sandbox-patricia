import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { UI__BROADCASTS_CARD_TOGGLE, UI__MEDIA_PLAYER_LOADED } from "@ppb/tbd-store/actions/media";
import { codecs } from "@ppb/tbd-urn-codecs";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  codecs: {
    card: {
      raceBroadcasts: {
        isValid: jest.fn(),
      },
    },
    parse: jest.fn(() => "URN"),
  },
}));

const stateMock = {
  layouts: {
    cards: {
      broadcasts: {
        "ppb:tbd:broadcasts:1": {
          urn: "ppb:tbd:broadcasts:1",
        },
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create the selectors", () => {
    makeMapStateToProps();
    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
    expect(createCardByURNSelector).toHaveBeenCalledWith();
  });

  it("should return the mapStateToProps function", () => {
    const mapStateToProps = makeMapStateToProps();
    expect(mapStateToProps).toEqual(expect.any(Function));
  });

  describe("mapStateToProps", () => {
    it("should get the broadcast card by its URN", () => {
      const getBroadcastsCard = jest.fn();
      createCardByURNSelector.mockReturnValue(getBroadcastsCard);
      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(stateMock, { urn: "ppb:tbd:broadcasts:1" });
      expect(getBroadcastsCard).toHaveBeenCalledTimes(1);
      expect(getBroadcastsCard).toHaveBeenCalledWith(
        {
          "ppb:tbd:broadcasts:1": {
            urn: "ppb:tbd:broadcasts:1",
          },
        },
        "ppb:tbd:broadcasts:1",
      );
    });

    describe("when broadcasts card is undefined", () => {
      it("should return empty object", () => {
        createCardByURNSelector.mockReturnValue(() => undefined);

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:broadcasts:1" });

        expect(props).toEqual({});
      });
    });

    describe("when broadcast card is defined", () => {
      it("should return props correctly", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: "ppb:tbd:broadcasts:1",
          broadcasts: {
            liveVideoUrl: "liveVideoUrl",
            dataVizUrl: "dataVizUrl",
          },
          isCollapsed: true,
        }));

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:broadcasts:1" });

        expect(props).toEqual({
          urn: "ppb:tbd:broadcasts:1",
          liveVideoUrl: "liveVideoUrl",
          dataVizUrl: "dataVizUrl",
          statusTitle: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
          isCollapsed: true,
        });
      });

      it("should return statusTitle correctly when only dataVizUrl available", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: "ppb:tbd:broadcasts:1",
          broadcasts: {
            liveVideoUrl: null,
            dataVizUrl: "dataVizUrl",
          },
          isCollapsed: true,
        }));

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:broadcasts:1" });

        expect(props).toEqual({
          urn: "ppb:tbd:broadcasts:1",
          liveVideoUrl: null,
          dataVizUrl: "dataVizUrl",
          statusTitle: "I18N.LIVE_VIDEO_STATUS.MATCH_VIEW",
          isCollapsed: true,
        });
      });

      describe("when is a racing BroadcastsCard", () => {
        it("should return the correct aspect ratio", () => {
          codecs.card.raceBroadcasts.isValid.mockReturnValue(true);

          createCardByURNSelector.mockReturnValue(() => ({
            urn: "ppb:tbd:broadcasts:1",
            broadcasts: {
              liveVideoUrl: "liveVideoUrl",
              dataVizUrl: "dataVizUrl",
            },
          }));

          const mapStateToProps = makeMapStateToProps();

          const props = mapStateToProps(stateMock, { urn: "ppb:tbd:broadcasts:1" });

          expect(props).toMatchObject({
            aspectRatio: 0.73,
          });
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchBroadcastsCardToggle", () => {
      it("should dispatch broadcasts card toggle", () => {
        const { dispatchBroadcastsCardToggle } = mapDispatchToProps;
        const isExpanded = true;
        const cardUrn = "URN";

        expect(dispatchBroadcastsCardToggle(isExpanded, cardUrn)).toEqual({
          type: UI__BROADCASTS_CARD_TOGGLE,
          payload: { isExpanded, cardUrn },
        });
      });
    });

    describe("dispatchMediaPlayerLoaded", () => {
      it("should dispatch media player loaded event", () => {
        const { dispatchMediaPlayerLoaded } = mapDispatchToProps;
        const label = "label";
        const cardUrn = "URN";

        expect(dispatchMediaPlayerLoaded(label, cardUrn)).toEqual({
          type: UI__MEDIA_PLAYER_LOADED,
          payload: {
            label,
            cardUrn,
          },
        });
      });
    });
  });
});
