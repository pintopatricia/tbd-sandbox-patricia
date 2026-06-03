import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { FETCH_CARDS, FETCH_FILTERED_SELECTABLE_ITEMS } from "@ppb/tbd-store/actions/catalogue";
import {
  UI__NEXT_RACES_RACE_CLICK,
  UI__NEXT_RACES_RACE_FILTER_CLICK,
  UI__STATISTICS_ITEM_CLICK,
} from "@ppb/tbd-store/actions/interface";
import { SelectableItemsFilterOptions } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getSelectableItemsCardGroupByURN = jest.fn();
const getUserDetails = jest.fn();
const getSelectableItems = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(() => getSelectableItemsCardGroupByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("../../view-model-factories/selectableitems-cardgroup", () => ({
  createSelectableItems: jest.fn(() => getSelectableItems),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  const DEFAULT_STATE = {
    layouts: {
      views: {
        sport: {},
      },
      cards: ["ppb:card"],
      cardgroups: {
        selectableitemscardgroups: {},
      },
    },
    router: { theRouter: "router" },
  };

  const CARDGROUP_URN = "urn:ppb:cardgroup:1";

  it("should create all selectors", () => {
    makeMapStateToProps();
    expect(createCardGroupByURNSelector).toHaveBeenCalled();
  });

  describe("mapStateToProps", () => {
    describe("when a selectableItems cardgroup exists in the store", () => {
      it("should return the props accordingly", () => {
        getSelectableItemsCardGroupByURN.mockReturnValue({
          items: [
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Cheltenham",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            },
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Ruby",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
            },
          ],
          title: "Title",
          isHighlighted: true,
          filter: {
            countries: [SelectableItemsFilterOptions.UK_AND_IRE, SelectableItemsFilterOptions.ALL_COUNTRIES],
            defaultCountry: SelectableItemsFilterOptions.UK_AND_IRE,
          },
        });
        getSelectableItems.mockReturnValue([
          {
            raceTime: "12:00",
            meetingName: "Cheltenham",
          },
          {
            raceTime: "12:00",
            meetingName: "Cheltenham",
          },
        ]);

        const mapStateToProps = makeMapStateToProps();
        const state = mapStateToProps(DEFAULT_STATE, { urn: CARDGROUP_URN });

        expect(getSelectableItemsCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.selectableitemscardgroups,
          CARDGROUP_URN,
        );

        expect(state).toEqual({
          title: "Title",
          isHighlighted: true,
          cardGroupItems: [
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Cheltenham",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            },
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Ruby",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
            },
          ],
          selectableItems: [
            {
              raceTime: "12:00",
              meetingName: "Cheltenham",
            },
            {
              raceTime: "12:00",
              meetingName: "Cheltenham",
            },
          ],
          filterProps: {
            options: [
              {
                key: SelectableItemsFilterOptions.UK_AND_IRE,
                value: "I18N.UK_AND_IRE",
              },
              {
                key: SelectableItemsFilterOptions.ALL_COUNTRIES,
                value: "I18N.ALL_COUNTRIES",
              },
            ],
            selectedOption: SelectableItemsFilterOptions.UK_AND_IRE,
          },
          hasItemRotation: false,
        });
      });
    });

    describe("when a selectableItems cardgroup doesn't exist in the store", () => {
      it("should return the props accordingly", () => {
        getSelectableItemsCardGroupByURN.mockReturnValue(undefined);

        const mapStateToProps = makeMapStateToProps();
        const state = mapStateToProps(DEFAULT_STATE, { urn: CARDGROUP_URN });

        expect(getSelectableItemsCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.selectableitemscardgroups,
          CARDGROUP_URN,
        );
        expect(state).toEqual({});
      });
    });

    describe("when a selectableItems cardgroup doesn't have items", () => {
      it("should return the props accordingly", () => {
        getSelectableItemsCardGroupByURN.mockReturnValue({
          items: [],
          title: "Title",
        });

        const mapStateToProps = makeMapStateToProps();
        const state = mapStateToProps(DEFAULT_STATE, { urn: CARDGROUP_URN });

        expect(getSelectableItemsCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.selectableitemscardgroups,
          CARDGROUP_URN,
        );
        expect(state).toEqual({});
      });
    });

    describe("when a selectableItems cardgroup doesn't have filter", () => {
      it("should return the props accordingly", () => {
        getSelectableItemsCardGroupByURN.mockReturnValue({
          items: [
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Cheltenham",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            },
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Ruby",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
            },
          ],
          title: "Title",
        });
        getSelectableItems.mockReturnValue([
          {
            raceTime: "12:00",
            meetingName: "Cheltenham",
          },
          {
            raceTime: "12:00",
            meetingName: "Cheltenham",
          },
        ]);

        const mapStateToProps = makeMapStateToProps();
        const state = mapStateToProps(DEFAULT_STATE, { urn: CARDGROUP_URN });

        expect(getSelectableItemsCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.selectableitemscardgroups,
          CARDGROUP_URN,
        );

        expect(state).toEqual({
          title: "Title",
          cardGroupItems: [
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Cheltenham",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            },
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Ruby",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
            },
          ],
          selectableItems: [
            {
              raceTime: "12:00",
              meetingName: "Cheltenham",
            },
            {
              raceTime: "12:00",
              meetingName: "Cheltenham",
            },
          ],
          hasItemRotation: false,
        });
      });
    });

    describe("when there are VirtualCardGroup items", () => {
      it("should enable item rotation", () => {
        getSelectableItemsCardGroupByURN.mockReturnValue({
          items: [
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Cheltenham",
              typename: "VirtualCardGroup",
              urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            },
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Ruby",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
            },
          ],
          title: "Title",
        });
        getSelectableItems.mockReturnValue([
          {
            raceTime: "12:00",
            meetingName: "Cheltenham",
          },
          {
            raceTime: "12:00",
            meetingName: "Cheltenham",
          },
        ]);

        const mapStateToProps = makeMapStateToProps();
        const state = mapStateToProps(DEFAULT_STATE, { urn: CARDGROUP_URN });

        expect(getSelectableItemsCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.selectableitemscardgroups,
          CARDGROUP_URN,
        );

        expect(state.hasItemRotation).toEqual(true);
      });
    });

    describe("when a selectableItems cardgroup have a selectedOption", () => {
      it("should return the props accordingly", () => {
        getSelectableItemsCardGroupByURN.mockReturnValue({
          items: [
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Cheltenham",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            },
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Ruby",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
            },
          ],
          title: "Title",
          filter: {
            countries: [SelectableItemsFilterOptions.UK_AND_IRE, SelectableItemsFilterOptions.ALL_COUNTRIES],
            defaultCountry: SelectableItemsFilterOptions.UK_AND_IRE,
            selectedOption: SelectableItemsFilterOptions.ALL_COUNTRIES,
          },
        });
        getSelectableItems.mockReturnValue([
          {
            raceTime: "12:00",
            meetingName: "Cheltenham",
          },
          {
            raceTime: "12:00",
            meetingName: "Cheltenham",
          },
        ]);

        const mapStateToProps = makeMapStateToProps();
        const state = mapStateToProps(DEFAULT_STATE, { urn: CARDGROUP_URN });

        expect(getSelectableItemsCardGroupByURN).toHaveBeenCalledWith(
          DEFAULT_STATE.layouts.cardgroups.selectableitemscardgroups,
          CARDGROUP_URN,
        );

        expect(state).toEqual({
          title: "Title",
          cardGroupItems: [
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Cheltenham",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
            },
            {
              startTime: "2020-11-12T17:00:00.000Z",
              venue: "Ruby",
              typename: "RaceMarketCard",
              urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
            },
          ],
          selectableItems: [
            {
              raceTime: "12:00",
              meetingName: "Cheltenham",
            },
            {
              raceTime: "12:00",
              meetingName: "Cheltenham",
            },
          ],
          filterProps: {
            options: [
              {
                key: SelectableItemsFilterOptions.UK_AND_IRE,
                value: "I18N.UK_AND_IRE",
              },
              {
                key: SelectableItemsFilterOptions.ALL_COUNTRIES,
                value: "I18N.ALL_COUNTRIES",
              },
            ],
            selectedOption: SelectableItemsFilterOptions.ALL_COUNTRIES,
          },
          hasItemRotation: false,
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("FetchCardsFromListAction", () => {
    it("should dispatch fetch cards from list action", () => {
      const { dispatchFetchCardsAction } = mapDispatchToProps;

      const urn = "urn:fake";

      expect(dispatchFetchCardsAction([urn])).toEqual({
        payload: { urns: ["urn:fake"] },
        type: FETCH_CARDS,
      });
    });
  });

  describe("dispatchRaceClick", () => {
    it("should dispatch Race click", () => {
      const { dispatchRaceClick } = mapDispatchToProps;

      const urn = "urn:fake";

      expect(dispatchRaceClick(urn)).toEqual({
        payload: { cardUrn: "urn:fake" },
        type: UI__NEXT_RACES_RACE_CLICK,
      });
    });
  });

  describe("dispatchStatisticsItemClick", () => {
    it("should dispatch statistics item click", () => {
      const { dispatchStatisticsItemClick } = mapDispatchToProps;

      expect(dispatchStatisticsItemClick("form")).toEqual({
        payload: { label: "form" },
        type: UI__STATISTICS_ITEM_CLICK,
      });
    });
  });

  describe("dispatchFetchFilteredSelectableItems", () => {
    it("should dispatch fetch filtered selectable items", () => {
      const { dispatchFetchFilteredSelectableItems } = mapDispatchToProps;

      expect(dispatchFetchFilteredSelectableItems("urn", SelectableItemsFilterOptions.UK_AND_IRE)).toEqual({
        payload: {
          urn: "urn",
          filterBy: {
            country: SelectableItemsFilterOptions.UK_AND_IRE,
          },
        },
        type: FETCH_FILTERED_SELECTABLE_ITEMS,
      });
    });
  });

  describe("dispatchNextRacesFilterClick", () => {
    it("should dispatch next races filter click", () => {
      const { dispatchNextRacesFilterClick } = mapDispatchToProps;

      expect(dispatchNextRacesFilterClick("ALL COUNTRIES")).toEqual({
        payload: { label: "ALL COUNTRIES" },
        type: UI__NEXT_RACES_RACE_FILTER_CLICK,
      });
    });
  });
});
