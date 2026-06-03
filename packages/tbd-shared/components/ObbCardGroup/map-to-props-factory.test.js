import { codecs } from "@ppb/tbd-urn-codecs";
import { EXTERNAL_PUSH } from "@ppb/tbd-store";
import {
  OBB_CARD__EVENT_SELECTION,
  OBB_CARD_GROUP__SET_FILTER,
  OBB_CARD_GROUP__LAYOUT_SELECTION,
  OBB_CARD_GROUP__SECTION_TOGGLED,
  OBB_CARD_GROUP__SHOW_MORE_CLICKED,
} from "@ppb/tbd-store/actions/obb";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getObbCardGroupByURN = jest.fn();

jest.mock("@ppb/tbd-store", () => ({
  productConfiguration: jest.fn(),
}));

jest.mock("@ppb/tbd-urn-codecs");

codecs.fixture.encode = jest.fn().mockImplementation((value) => ({
  uid: value,
}));

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(() => getObbCardGroupByURN),
}));

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

const stateMock = {
  layouts: {
    cardgroups: {
      obbcardgroups: {
        obbcardgroupUrn: {
          urn: "obbcardgroupUrn",
        },
      },
    },
  },
  entities: {
    sportevents: {
      testEvent: {
        name: "testEvent",
      },
    },
    footballfixtures: {
      urn123: {
        foo: "bar",
      },
      1: {
        foo: "bar",
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    describe("getObbCardGroupByURN", () => {
      it("should call getObbCardGroupByURN with the correct arguments", () => {
        const mapStateToProps = makeMapStateToProps();

        getObbCardGroupByURN.mockReturnValue({
          event: { eventId: "testEvent" },
          items: [{ urn: "1.1" }, { urn: "924.1" }],
        });

        mapStateToProps(stateMock, { urn: "obbcardgroupUrn" });

        expect(getObbCardGroupByURN).toHaveBeenCalledWith(
          stateMock.layouts.cardgroups.obbcardgroups,
          "obbcardgroupUrn",
        );
      });
    });

    describe("when the urn doesn't exist", () => {
      it("should return an empty object", () => {
        const mapStateToProps = makeMapStateToProps();
        getObbCardGroupByURN.mockReturnValue(undefined);
        const result = mapStateToProps(stateMock, "nonexistentURN");

        expect(result).toEqual({});
      });
    });

    describe("when there is an obbcardgroup", () => {
      it("should return it from store", () => {
        const mapStateToProps = makeMapStateToProps();
        getObbCardGroupByURN.mockReturnValue({
          urn: "obbcardgroupUrn",
          typename: "ObbCardGroup",
          title: "title",
          bettingWindowOffset: 24,
          moreInfoLabel: "More Info",
          moreInfoDetails: [
            {
              type: "heading1",
              text: "some heading",
            },
          ],
          sections: [
            {
              layouts: [
                {
                  urn: "cardLayoutUrn1",
                  title: "Card Layout 1",
                  items: [{ urn: "1.1" }, { urn: "924.1" }],
                },
              ],
            },
          ],
          event: {
            openDate: "2024-11-11T19:00:00.000Z",
            urn: "urn123",
            name: "testEvent",
            eventId: 1,
          },
          showFilterTags: true,
          selectedFilter: "ALL",
          filterTags: [
            {
              type: "CATCH_ALL",
            },
            {
              type: "TAG",
              label: "Goals",
            },
          ],
        });
        const result = mapStateToProps(stateMock, { urn: "obbcardgroupUrn" });

        expect(result).toEqual({
          urn: "obbcardgroupUrn",
          title: "title",
          sections: [
            {
              layouts: [
                {
                  items: [
                    {
                      urn: "1.1",
                    },
                    {
                      urn: "924.1",
                    },
                  ],
                  title: "Card Layout 1",
                  urn: "cardLayoutUrn1",
                },
              ],
            },
          ],
          event: {
            openDate: "2024-11-11T19:00:00.000Z",
            urn: "urn123",
            name: "testEvent",
            eventId: 1,
          },
          bettingWindowOffset: 24,
          obbBettingStartTime: expect.any(Date),
          eventDate: expect.any(Date),
          footballFixture: {
            foo: "bar",
          },
          moreInfoLabel: "More Info",
          sectionExpansionOverrideByFilter: undefined,
          moreInfoDetails: [
            {
              type: "heading1",
              text: "some heading",
            },
          ],
          showFilterTags: true,
          selectedFilter: "ALL",
          filterTags: [
            {
              type: "CATCH_ALL",
            },
            {
              type: "TAG",
              label: "Goals",
            },
          ],
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchObbEventSelection", () => {
    it("should dispatch a ObbEventSelection action", () => {
      const dispatch = jest.fn();
      const { dispatchObbEventSelection } = mapDispatchToProps(dispatch);
      const mockEvent = { module: "string", elementText: "string" };
      dispatchObbEventSelection(mockEvent);

      expect(dispatch).toHaveBeenCalledWith({
        type: OBB_CARD__EVENT_SELECTION,
        payload: {
          event: {
            elementText: mockEvent.elementText,
            module: expect.any(String),
          },
        },
      });
    });
  });

  describe("dispatchNavigateToTermsAndConditionsPage", () => {
    it("should dispatch a NavigateToTermsAndConditionsPage action", () => {
      const dispatch = jest.fn();
      const { dispatchNavigateToTermsAndConditionsPage } = mapDispatchToProps(dispatch);
      const mockViewLink = { viewUrn: "urn:1", viewUrl: "url:1", viewDisplayMode: null };
      dispatchNavigateToTermsAndConditionsPage(mockViewLink);

      expect(dispatch).toHaveBeenCalledWith({
        type: EXTERNAL_PUSH,
        payload: mockViewLink,
      });
    });
  });

  describe("dispatchSetFilter", () => {
    it("should dispatch an setFilter action", () => {
      const dispatch = jest.fn();
      const { dispatchSetFilter } = mapDispatchToProps(dispatch);
      const mockFilter = { urn: "urn:1", selectedFilter: "ALL" };
      dispatchSetFilter("ALL", "urn:1");

      expect(dispatch).toHaveBeenCalledWith({
        type: OBB_CARD_GROUP__SET_FILTER,
        payload: mockFilter,
      });
    });
  });

  describe("dispatchLayoutSelection", () => {
    it("should dispatch a LayoutSelection action", () => {
      const dispatch = jest.fn();
      const { dispatchLayoutSelection } = mapDispatchToProps(dispatch);
      dispatchLayoutSelection("obbCardGroupUrn", "sectionUrn", "cardLayoutUrn");

      expect(dispatch).toHaveBeenCalledWith({
        type: OBB_CARD_GROUP__LAYOUT_SELECTION,
        payload: {
          urn: "obbCardGroupUrn",
          sectionUrn: "sectionUrn",
          layoutUrn: "cardLayoutUrn",
        },
      });
    });
  });

  describe("dispatchSectionToggle", () => {
    it("should dispatch a SectionToggled action", () => {
      const dispatch = jest.fn();
      const { dispatchSectionToggle } = mapDispatchToProps(dispatch);
      dispatchSectionToggle("cardGroupUrn", "sectionUrn", true, "eventName");

      expect(dispatch).toHaveBeenCalledWith({
        type: OBB_CARD_GROUP__SECTION_TOGGLED,
        payload: {
          cardGroupUrn: "cardGroupUrn",
          sectionUrn: "sectionUrn",
          isOpen: true,
          eventName: "eventName",
        },
      });
    });
  });

  describe("dispatchShowMoreClicked", () => {
    it("should dispatch a ShowMoreClicked action", () => {
      const dispatch = jest.fn();
      const { dispatchShowMoreClicked } = mapDispatchToProps(dispatch);
      dispatchShowMoreClicked("cardGroupUrn", "sectionUrn", "layoutUrn", false, "eventName");

      expect(dispatch).toHaveBeenCalledWith({
        type: OBB_CARD_GROUP__SHOW_MORE_CLICKED,
        payload: {
          cardGroupUrn: "cardGroupUrn",
          sectionUrn: "sectionUrn",
          layoutUrn: "layoutUrn",
          isOpen: false,
          eventName: "eventName",
        },
      });
    });
  });
});
