import reducer from "./obb-cardgroups-reducer";
import {
  OBB_CARD_GROUP__SET_FILTER,
  OBB_CARD_GROUP__LAYOUT_SELECTION,
  OBB_CARD_GROUP__SECTION_TOGGLED,
} from "../../../../actions/obb";

import { DELETE_LAYOUT, FETCH_CATALOGUE_SUCCESS } from "../../../../actions";

describe("obb-cardgroups-reducer", () => {
  it("should return the initial state when action type is not met by the reducer", () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  describe("DELETE_VIEW_ITEMS", () => {
    it("should delete the given urn's from all card group sections", () => {
      const initialState = {
        cardGroupURN1: {
          urn: "cardGroupURN1",
          sections: [{ urn: "sectionURN1" }, { urn: "sectionURN2" }, { urn: "sectionURN3" }],
        },
        cardGroupURN2: {
          urn: "cardGroupURN2",
          sections: [{ urn: "sectionURN1" }, { urn: "sectionURN2" }, { urn: "sectionURN3" }],
        },
        cardGroupURN3: {
          urn: "cardGroupURN3",
          sections: [{ urn: "sectionURN1" }, { urn: "sectionURN2" }, { urn: "sectionURN3" }],
        },
      };
      const action = {
        type: "DELETE_VIEW_ITEMS",
        payload: ["sectionURN1", "sectionURN3"],
      };
      expect(reducer(initialState, action)).toEqual({
        cardGroupURN1: {
          urn: "cardGroupURN1",
          sections: [{ urn: "sectionURN2" }],
        },
        cardGroupURN2: {
          urn: "cardGroupURN2",
          sections: [{ urn: "sectionURN2" }],
        },
        cardGroupURN3: {
          urn: "cardGroupURN3",
          sections: [{ urn: "sectionURN2" }],
        },
      });
    });
  });

  describe("OBB_CARD_GROUP__SET_FILTER", () => {
    it("should update selectedFilter for the specified card group", () => {
      const initialState = {
        urn1: {
          urn: "urn1",
          selectedFilter: "ALL",
          items: [],
        },
      };
      const action = {
        type: OBB_CARD_GROUP__SET_FILTER,
        payload: { urn: "urn1", selectedFilter: "TAG" },
      };
      expect(reducer(initialState, action)).toEqual({
        urn1: {
          urn: "urn1",
          selectedFilter: "TAG",
          items: [],
        },
      });
    });

    it("should return current state if specified card group does not exist", () => {
      const initialState = {
        urn1: {
          urn: "urn1",
          selectedFilter: "ALL",
          items: [],
        },
      };
      const action = {
        type: OBB_CARD_GROUP__SET_FILTER,
        payload: { urn: "unknownGroup", selectedFilter: "TAG" },
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });

    it("should return current state for unknown action", () => {
      const initialState = {
        urn1: {
          urn: "urn1",
          selectedFilter: "ALL",
          items: [],
        },
      };
      expect(reducer(initialState, { type: "UNKNOWN_ACTION" })).toEqual(initialState);
    });
  });

  describe("FETCH_CATALOGUE_SUCCESS", () => {
    it("should merge card groups", () => {
      const initialState = {
        urn1: {
          urn: "urn1",
          selectedFilter: "ALL",
          items: [],
        },
      };
      const action = {
        type: FETCH_CATALOGUE_SUCCESS,
        payload: {
          data: {
            ObbCardGroup: [
              {
                urn: "urn1",
                title: "Group 1",
                items: [{ urn: "item1", typename: "ObbStackedLayout" }],
                selectedFilter: "TAG",
                filterTags: [{ type: "TAG", label: "Goals" }],
              },
              {
                urn: "urn2",
                title: "Group 2",
                items: [{ urn: "item2", typename: "ObbStackedLayout" }],
                selectedFilter: "ALL",
                filterTags: [{ type: "CATCH_ALL", label: "" }],
              },
            ],
          },
        },
      };
      expect(reducer(initialState, action)).toEqual({
        urn1: {
          urn: "urn1",
          title: "Group 1",
          items: [{ urn: "item1", typename: "ObbStackedLayout" }],
          selectedFilter: "TAG",
          filterTags: [{ type: "TAG", label: "Goals" }],
        },
        urn2: {
          urn: "urn2",
          title: "Group 2",
          items: [{ urn: "item2", typename: "ObbStackedLayout" }],
          selectedFilter: "ALL",
          filterTags: [{ type: "CATCH_ALL", label: "" }],
        },
      });
    });

    it("should return the initial state when ObbCardGroup is undefined", () => {
      const initialState = {
        urn1: {
          urn: "urn1",
          selectedFilter: "ALL",
          items: [],
        },
      };
      const action = {
        type: FETCH_CATALOGUE_SUCCESS,
        payload: {
          data: {},
        },
      };
      expect(reducer(initialState, action)).toEqual(initialState);
    });
  });

  describe("DELETE_LAYOUT", () => {
    it("should reset state", () => {
      const initialState = {
        urn1: {
          urn: "urn1",
          selectedFilter: "ALL",
          items: [],
        },
      };
      const action = {
        type: DELETE_LAYOUT,
      };
      expect(reducer(initialState, action)).toEqual({});
    });
  });

  describe("OBB_CARD_GROUP__LAYOUT_SELECTION", () => {
    it("should update the selected layout", () => {
      const initialState = {
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          sections: [
            {
              urn: "sectionUrn1",
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: true,
                },
                {
                  urn: "layoutUrn2",
                  isSelected: false,
                },
              ],
            },
          ],
        },
      };

      const action = {
        type: OBB_CARD_GROUP__LAYOUT_SELECTION,
        payload: {
          urn: "cardGroupUrn1",
          sectionUrn: "sectionUrn1",
          layoutUrn: "layoutUrn2",
        },
      };

      expect(reducer(initialState, action)).toEqual({
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          sections: [
            {
              urn: "sectionUrn1",
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: false,
                },
                {
                  urn: "layoutUrn2",
                  isSelected: true,
                },
              ],
            },
          ],
        },
      });
    });

    it("should return current state if card group does not exist", () => {
      const initialState = {
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          sections: [
            {
              urn: "sectionUrn1",
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: true,
                },
              ],
            },
          ],
        },
      };

      const action = {
        type: OBB_CARD_GROUP__LAYOUT_SELECTION,
        payload: {
          urn: "nonExistentCardGroup",
          sectionUrn: "sectionUrn1",
          layoutUrn: "layoutUrn1",
        },
      };

      expect(reducer(initialState, action)).toBe(initialState);
    });

    it("should not modify sections that do not match sectionUrn", () => {
      const initialState = {
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          sections: [
            {
              urn: "sectionUrn1",
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: true,
                },
              ],
            },
            {
              urn: "sectionUrn2",
              layouts: [
                {
                  urn: "layoutUrn2",
                  isSelected: false,
                },
                {
                  urn: "layoutUrn3",
                  isSelected: true,
                },
              ],
            },
          ],
        },
      };

      const action = {
        type: OBB_CARD_GROUP__LAYOUT_SELECTION,
        payload: {
          urn: "cardGroupUrn1",
          sectionUrn: "sectionUrn1",
          layoutUrn: "layoutUrn1",
        },
      };

      const result = reducer(initialState, action);

      expect(result.cardGroupUrn1.sections[0].layouts[0].isSelected).toBe(true);
      expect(result.cardGroupUrn1.sections[1]).toBe(initialState.cardGroupUrn1.sections[1]);
    });
  });

  describe("OBB_CARD_GROUP__SECTION_TOGGLED", () => {
    it("should toggle section expansion when selectedFilter is ALL", () => {
      const initialState = {
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          selectedFilter: "ALL",
          sections: [
            {
              urn: "sectionUrn1",
              isExpanded: true,
            },
            {
              urn: "sectionUrn2",
              isExpanded: false,
            },
          ],
          sectionExpansionOverrideByFilter: {},
        },
      };

      const action = {
        type: OBB_CARD_GROUP__SECTION_TOGGLED,
        payload: {
          cardGroupUrn: "cardGroupUrn1",
          sectionUrn: "sectionUrn1",
          isOpen: false,
        },
      };

      const result = reducer(initialState, action);

      expect(result.cardGroupUrn1.sections[0].isExpanded).toBe(false);
      expect(result.cardGroupUrn1.sections[1].isExpanded).toBe(false);
    });

    it("should not modify sections that do not match sectionUrn when selectedFilter is ALL", () => {
      const initialState = {
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          selectedFilter: "ALL",
          sections: [
            {
              urn: "sectionUrn1",
              isExpanded: true,
            },
            {
              urn: "sectionUrn2",
              isExpanded: false,
            },
          ],
          sectionExpansionOverrideByFilter: {},
        },
      };

      const action = {
        type: OBB_CARD_GROUP__SECTION_TOGGLED,
        payload: {
          cardGroupUrn: "cardGroupUrn1",
          sectionUrn: "sectionUrn1",
          isOpen: false,
        },
      };

      const result = reducer(initialState, action);

      expect(result.cardGroupUrn1.sections[1]).toBe(initialState.cardGroupUrn1.sections[1]);
    });

    it("should use override when selectedFilter is not ALL", () => {
      const initialState = {
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          selectedFilter: "TAG",
          sections: [
            {
              urn: "sectionUrn1",
              isExpanded: true,
            },
          ],
          sectionExpansionOverrideByFilter: {},
        },
      };

      const action = {
        type: OBB_CARD_GROUP__SECTION_TOGGLED,
        payload: {
          cardGroupUrn: "cardGroupUrn1",
          sectionUrn: "sectionUrn1",
          isOpen: false,
        },
      };

      const result = reducer(initialState, action);

      expect(result.cardGroupUrn1.sectionExpansionOverrideByFilter.TAG.sectionUrn1).toBe(false);
      expect(result.cardGroupUrn1.sections[0].isExpanded).toBe(true);
    });

    it("should preserve existing overrides when adding new override", () => {
      const initialState = {
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          selectedFilter: "TAG",
          sections: [
            {
              urn: "sectionUrn1",
              isExpanded: true,
            },
            {
              urn: "sectionUrn2",
              isExpanded: false,
            },
          ],
          sectionExpansionOverrideByFilter: {
            TAG: {
              sectionUrn2: true,
            },
          },
        },
      };

      const action = {
        type: OBB_CARD_GROUP__SECTION_TOGGLED,
        payload: {
          cardGroupUrn: "cardGroupUrn1",
          sectionUrn: "sectionUrn1",
          isOpen: false,
        },
      };

      const result = reducer(initialState, action);

      expect(result.cardGroupUrn1.sectionExpansionOverrideByFilter.TAG.sectionUrn1).toBe(false);
      expect(result.cardGroupUrn1.sectionExpansionOverrideByFilter.TAG.sectionUrn2).toBe(true);
    });

    it("should default to ALL when selectedFilter is undefined", () => {
      const initialState = {
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          sections: [
            {
              urn: "sectionUrn1",
              isExpanded: true,
            },
          ],
          sectionExpansionOverrideByFilter: {},
        },
      };

      const action = {
        type: OBB_CARD_GROUP__SECTION_TOGGLED,
        payload: {
          cardGroupUrn: "cardGroupUrn1",
          sectionUrn: "sectionUrn1",
          isOpen: false,
        },
      };

      const result = reducer(initialState, action);

      expect(result.cardGroupUrn1.sections[0].isExpanded).toBe(false);
    });
  });

  describe("OBB_CARD_GROUP__SECTION_TOGGLED", () => {
    it("should update the expanded/collapsed state of the section directly when selectedFilter = ALL", () => {
      const initialState = {
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          sections: [
            {
              urn: "sectionUrn1",
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: true,
                },
                {
                  urn: "layoutUrn2",
                  isSelected: false,
                },
              ],
            },
            {
              urn: "sectionUrn2",
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: true,
                },
                {
                  urn: "layoutUrn2",
                  isSelected: false,
                },
              ],
            },
          ],
          selectedFilter: "ALL",
          sectionExpansionOverrideByFilter: {},
        },
      };

      const action = {
        type: OBB_CARD_GROUP__SECTION_TOGGLED,
        payload: {
          cardGroupUrn: "cardGroupUrn1",
          sectionUrn: "sectionUrn2",
          isOpen: true,
          eventName: "eventName",
        },
      };

      expect(reducer(initialState, action)).toEqual({
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          sections: [
            {
              urn: "sectionUrn1",
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: true,
                },
                {
                  urn: "layoutUrn2",
                  isSelected: false,
                },
              ],
            },
            {
              urn: "sectionUrn2",
              isExpanded: true,
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: true,
                },
                {
                  urn: "layoutUrn2",
                  isSelected: false,
                },
              ],
            },
          ],
          selectedFilter: "ALL",
          sectionExpansionOverrideByFilter: {},
        },
      });
    });

    it("should update the expanded/collapsed state of the section for each filter tag", () => {
      const initialState = {
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          sections: [
            {
              urn: "sectionUrn1",
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: true,
                },
                {
                  urn: "layoutUrn2",
                  isSelected: false,
                },
              ],
            },
            {
              urn: "sectionUrn2",
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: true,
                },
                {
                  urn: "layoutUrn2",
                  isSelected: false,
                },
              ],
            },
          ],
          selectedFilter: "Goals",
          sectionExpansionOverrideByFilter: {},
        },
      };

      const action = {
        type: OBB_CARD_GROUP__SECTION_TOGGLED,
        payload: {
          cardGroupUrn: "cardGroupUrn1",
          sectionUrn: "sectionUrn2",
          isOpen: true,
          eventName: "eventName",
        },
      };

      expect(reducer(initialState, action)).toEqual({
        cardGroupUrn1: {
          urn: "cardGroupUrn1",
          sections: [
            {
              urn: "sectionUrn1",
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: true,
                },
                {
                  urn: "layoutUrn2",
                  isSelected: false,
                },
              ],
            },
            {
              urn: "sectionUrn2",
              layouts: [
                {
                  urn: "layoutUrn1",
                  isSelected: true,
                },
                {
                  urn: "layoutUrn2",
                  isSelected: false,
                },
              ],
            },
          ],
          selectedFilter: "Goals",
          sectionExpansionOverrideByFilter: {
            Goals: {
              sectionUrn2: true,
            },
          },
        },
      });
    });
  });
});
