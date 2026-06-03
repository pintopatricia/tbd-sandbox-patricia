import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { createGetRegulatoryDataSectionsSelector } from "@ppb/tbd-store/state/entities/regulatory-data/regulatory-data-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

import { makeMapStateToProps } from "./map-to-props-factory";

jest.spyOn(global.console, "error").mockImplementation();

const getRegulatorySections = jest.fn();
const getUserDetailsSelector = jest.fn(() => ({
  loggedIn: true,
  jurisdiction: {
    jurisdiction: Jurisdiction.INTERNATIONAL,
  },
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetailsSelector),
}));

jest.mock("@ppb/tbd-store/state/entities/regulatory-data/regulatory-data-selectors", () => ({
  createGetRegulatoryDataSectionsSelector: jest.fn(() => getRegulatorySections),
}));

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should be a factory function", () => {
    expect(makeMapStateToProps()).toEqual(expect.any(Function));
  });

  it("should call createGetRegulatoryDataSectionsSelector only 1 time", () => {
    makeMapStateToProps();
    expect(createGetRegulatoryDataSectionsSelector).toHaveBeenCalledTimes(1);
  });

  it("should call createGetCountryLocalCurrencyCodeSelector only 1 time", () => {
    makeMapStateToProps();
    expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    describe("when `getUserDetailsSelector` throws", () => {
      const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

      it("should return an empty object", () => {
        getUserDetailsSelector.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });

        makeMapStateToProps()({ entities: {} });

        expect(global.console.error).toHaveBeenCalledTimes(1);
        expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
      });
    });

    describe("when state contains the regulatory data with sections", () => {
      const regulatorySections = [
        {
          sectionType: "GENERIC",
          items: [
            {
              type: "TEXT",
              text: "Il gioco è riservato ai maggiorenni e può creare dipendenza.",
              alignment: "center",
            },
          ],
        },
        {
          sectionType: "GENERIC",
          items: [
            {
              type: "LINK",
              alignment: "center",
              text: "Consulta le probabilità di vincita",
              viewLink: {
                viewUrl: "https://www.nxt.it.betfair/aboutUs/Probabilita_di_vincita.html",
                viewDisplayMode: null,
              },
              target: "BLANK",
            },
          ],
        },
      ];

      it("should return regulatorySections correctly when there are regulatory sections", () => {
        getRegulatorySections.mockReturnValue(regulatorySections);
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps({ entities: {} });

        expect(props.regulatorySections).toEqual(regulatorySections);
      });

      it("shouldn't return a regulatorySections when there aren't regulatory sections", () => {
        getRegulatorySections.mockReturnValue(null);
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps({ entities: {} });

        expect(props.regulatorySections).toBeNull();
      });
    });

    describe("when jurisdiction is Denmark", () => {
      it("should return isDenmarkJurisdiction as true", () => {
        getUserDetailsSelector.mockReturnValueOnce({
          jurisdiction: {
            jurisdiction: Jurisdiction.DENMARK,
          },
        });
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps({ entities: {} });

        expect(props.isDenmarkJurisdiction).toEqual(true);
      });
    });
  });
});
