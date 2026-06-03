import { UI__CLICK_PEBBLE_ITEM } from "@ppb/tbd-store/actions/interface";
import { PebbleCardGroupIcon } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import {
  createGetHydratedPebbleCardGroupByURNSelector,
  createGetSelectedPebbleSportsbookMarketsSelector,
  createPartialPebbleCardGroupByURNSelector,
} from "@ppb/tbd-store/state/layout/cardgroups/pebble-cardgroups/pebble-cardgroups-selectors";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { ValueIconName } from "@ppb/the-wall-icons";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getHydratedPebbleCardGroupByURN = jest.fn();
const getPartialPebbleCardGroupByURN = jest.fn();

const getSelectedPebbleSportsbookMarkets = jest.fn().mockReturnValue([]);

jest.mock("@ppb/tbd-store/state/layout/cardgroups/pebble-cardgroups/pebble-cardgroups-selectors", () => ({
  createGetSelectedPebbleSportsbookMarketsSelector: jest.fn(() => getSelectedPebbleSportsbookMarkets),
  createGetHydratedPebbleCardGroupByURNSelector: jest.fn(() => getHydratedPebbleCardGroupByURN),
  createPartialPebbleCardGroupByURNSelector: jest.fn(() => getPartialPebbleCardGroupByURN),
}));

const getViewTypeSelector = jest.fn(() => "sport");

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(() => getViewTypeSelector),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => ({ tabName: "Tab name" })),
}));

jest.mock("../../helpers/translatable-text", () => ({
  buildTranslatableText: jest.fn((value) => value),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  ValueIconName: {
    PRICE_BOOST: "PRICE_BOOST",
    SUPER_BOOST: "SUPER_BOOST",
  },
}));

const DEFAULT_STATE = {
  entities: {},
  layouts: {
    cards: {},
    cardgroups: {},
  },
};

const CARDGROUP_URN = "urn:ppb:cardgroup:1";

const setup = () => makeMapStateToProps()(DEFAULT_STATE, { urn: CARDGROUP_URN });

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create all selectors", () => {
    makeMapStateToProps();

    expect(createGetHydratedPebbleCardGroupByURNSelector).toHaveBeenCalledTimes(1);
    expect(createViewTypeSelector).toHaveBeenCalledTimes(1);
    expect(createGetSelectedPebbleSportsbookMarketsSelector).toHaveBeenCalledTimes(1);
    expect(createPartialPebbleCardGroupByURNSelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    describe("when pebble cardgroup exists in the store", () => {
      it("should return store items, title, icon and urns", () => {
        getHydratedPebbleCardGroupByURN.mockReturnValueOnce({
          items: [{ urn: "ppb:tbd:market:1", name: "0.5" }],
          title: "Cardgroup Title",
          icon: PebbleCardGroupIcon.PriceBoost,
          outerTitle: "Cardgroup Outer Title",
          viewAll: {
            label: "View All Label",
            viewLink: { viewUrn: "viewUrn" },
          },
          selectedItemUrn: "ppb:tbd:market:1",
          pebbleExpanded: true,
          favouriteMarketsStateURN: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107",
        });

        const props = setup();

        expect(getHydratedPebbleCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.pebblecardgroups,
          CARDGROUP_URN,
        );
        expect(props).toEqual({
          isShell: false,
          title: "Cardgroup Title",
          icon: ValueIconName.PRICE_BOOST,
          outerTitle: "Cardgroup Outer Title",
          viewLink: { viewUrn: "viewUrn" },
          viewAllLabel: "View All Label",
          favouriteMarketsStateURN: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107",
          items: [
            {
              id: "ppb:tbd:market:1",
              text: "0.5",
            },
          ],
          pebbleList: [
            {
              id: "ppb:tbd:market:1",
              text: "0.5",
            },
          ],
          selectedCardURN: "ppb:tbd:market:1",
          cardGroupURN: CARDGROUP_URN,
          pebbleExpanded: true,
          pageType: "sport",
          gaTitle: "Cardgroup Title",
          tabName: "Tab name",
        });
      });
    });

    describe("when pebble cardgroup does not exist in the store", () => {
      it("should return empty state", () => {
        getHydratedPebbleCardGroupByURN.mockReturnValueOnce(undefined);

        const props = setup();

        expect(getHydratedPebbleCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.pebblecardgroups,
          CARDGROUP_URN,
        );
        expect(props).toEqual({});
      });

      describe("but partial pebble cardgroup exists", () => {
        it("should return partial pebble cardgroup state", () => {
          getPartialPebbleCardGroupByURN.mockReturnValueOnce({
            title: "Partial Cardgroup Title",
            favouriteMarketsStateURN: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107",
          });

          const props = setup();

          expect(getPartialPebbleCardGroupByURN).toHaveBeenCalledWith(
            DEFAULT_STATE.layouts.cardgroups.pebblecardgroups,
            CARDGROUP_URN,
          );
          expect(props).toEqual({
            isShell: true,
            title: "Partial Cardgroup Title",
            favouriteMarketsStateURN: "ppb:tbd:favouriteMarkets:state:YaC9ThIAACAAN6LQ/e/34773107",
            cardGroupURN: CARDGROUP_URN,
          });
        });
      });
    });

    describe("when pebble cardgroup title is undefined", () => {
      it("should return undefined title", () => {
        getHydratedPebbleCardGroupByURN.mockReturnValueOnce({
          items: [{ urn: "ppb:tbd:market:1", name: "0.5" }],
          title: undefined,
          selectedItemUrn: "ppb:tbd:market:1",
          pebbleExpanded: true,
        });

        const { title } = setup();

        expect(getHydratedPebbleCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.pebblecardgroups,
          CARDGROUP_URN,
        );
        expect(title).toBeUndefined();
      });
    });

    describe("when pebble cardgroup outerTitle is undefined", () => {
      it("should return undefined outerTitle", () => {
        getHydratedPebbleCardGroupByURN.mockReturnValueOnce({
          items: [{ urn: "ppb:tbd:market:1", name: "0.5" }],
          outerTitle: undefined,
          title: undefined,
          selectedItemUrn: "ppb:tbd:market:1",
          pebbleExpanded: true,
        });

        const { outerTitle } = setup();

        expect(getHydratedPebbleCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.pebblecardgroups,
          CARDGROUP_URN,
        );
        expect(outerTitle).toBeUndefined();
      });
    });

    describe("when pebble cardgroup viewAll is undefined", () => {
      it("should return undefined viewAllLabel and viewLink", () => {
        getHydratedPebbleCardGroupByURN.mockReturnValueOnce({
          items: [{ urn: "ppb:tbd:market:1", name: "0.5" }],
          viewAll: undefined,
          title: undefined,
          selectedItemUrn: "ppb:tbd:market:1",
          pebbleExpanded: true,
        });

        const { viewAllLabel, viewLink } = setup();

        expect(getHydratedPebbleCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.pebblecardgroups,
          CARDGROUP_URN,
        );
        expect(viewAllLabel).toBeUndefined();
        expect(viewLink).toBeUndefined();
      });
    });

    describe("when pebble cardgroup items are empty", () => {
      it("should return empty state", () => {
        getHydratedPebbleCardGroupByURN.mockReturnValueOnce({
          items: [],
          title: "Cardgroup Title",
          selectedItemUrn: "ppb:tbd:market:1",
          pebbleExpanded: true,
        });

        const props = setup();

        expect(getHydratedPebbleCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.pebblecardgroups,
          CARDGROUP_URN,
        );
        expect(props).toEqual({});
      });
    });

    describe("when pebble cardgroup selected item has a super sub market", () => {
      it("should return super sub suffix in gaTitle", () => {
        getHydratedPebbleCardGroupByURN.mockReturnValueOnce({
          items: [{}],
          title: "Cardgroup Title",
          selectedItemUrn: "ppb:tbd:market:1",
        });
        getSelectedPebbleSportsbookMarkets.mockReturnValueOnce([{ isSuperSub: false }, { isSuperSub: true }]);

        const { gaTitle } = setup();

        expect(getHydratedPebbleCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.pebblecardgroups,
          CARDGROUP_URN,
        );
        expect(getSelectedPebbleSportsbookMarkets).toHaveBeenCalledWith(DEFAULT_STATE, "ppb:tbd:market:1");
        expect(gaTitle).toEqual("Cardgroup Title safesub");
      });
    });

    describe("when having a single pebble and equal to the title", () => {
      it("should return a empty pebble list", () => {
        getHydratedPebbleCardGroupByURN.mockReturnValueOnce({
          items: [{ urn: "ppb:tbd:market:1", name: "Awesome Title" }],
          title: "Awesome Title",
          selectedItemUrn: "ppb:tbd:market:1",
          pebbleExpanded: true,
        });

        const { pebbleList } = setup();

        expect(pebbleList).toEqual([]);
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchPebbleItemSelection", () => {
    it("should dispatch market template pebble selection", () => {
      const { dispatchPebbleItemSelection } = mapDispatchToProps;
      const pebbleURN = "urn:pebble:1";
      const cardGroupURN = "urn:cardgroup:1";
      const pebbleTypename = "PebbleTypename";

      expect(dispatchPebbleItemSelection(pebbleURN, pebbleTypename, cardGroupURN)).toEqual({
        type: UI__CLICK_PEBBLE_ITEM,
        payload: {
          cardGroupURN,
          pebbleURN,
          pebbleTypename,
        },
      });
    });
  });
});
