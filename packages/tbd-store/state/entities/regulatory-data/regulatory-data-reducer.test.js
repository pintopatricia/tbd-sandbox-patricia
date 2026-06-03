import { Alignment } from "../../constants";
import regulatoryDataReducer from "./regulatory-data-reducer";

const INITIAL_STATE = {
  typename: "RegulatoryData",
  sections: [],
};

describe('"regulatoryData" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const reducerResult = regulatoryDataReducer(undefined, {});

      expect(reducerResult).toEqual(INITIAL_STATE);
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the payload with "regulatoryData"', () => {
      const regulatoryData = {
        typename: "RegulatoryData",
        sections: [
          {
            sectionType: "GENERIC",
            items: [
              {
                type: "TEXT",
                text: "Some textItem text",
                alignment: Alignment.Center,
              },
            ],
          },
          {
            sectionType: "GENERIC",
            items: [
              {
                type: "LINK",
                alignment: Alignment.Center,
                text: "Some linkItem text",
                viewLink: {
                  viewUrl: "www.betfair.com",
                  viewDisplayMode: null,
                },
                target: "Some target",
              },
            ],
          },
        ],
      };
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            RegulatoryData: [regulatoryData],
          },
        },
      };

      const reducerResult = regulatoryDataReducer(undefined, action);

      expect(reducerResult).toEqual(regulatoryData);
    });
  });
});
