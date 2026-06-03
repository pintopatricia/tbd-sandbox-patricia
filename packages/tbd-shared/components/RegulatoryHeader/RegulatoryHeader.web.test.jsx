import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { RegulatoryHeader as RegulatoryHeaderComponent } from "./snowflakes/RegulatoryHeader/RegulatoryHeader.web";
import RegulatoryHeader from "./RegulatoryHeader.web";

jest.mock("./snowflakes/RegulatoryHeader/RegulatoryHeader.web", () => ({
  RegulatoryHeader: jest.fn(() => <></>),
}));

function renderRegulatoryHeader({ regulatorySections = undefined }) {
  return render(<RegulatoryHeader regulatorySections={regulatorySections} />);
}

describe("RegulatoryHeader component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when regulatorySections is defined", () => {
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

    it("must render the regulatory header component with the correct props", () => {
      renderRegulatoryHeader({ regulatorySections });

      expect(RegulatoryHeaderComponent).toHaveBeenCalledWith(
        {
          regulatorySections,
        },
        undefined,
      );
      expect(RegulatoryHeaderComponent).toHaveBeenCalledTimes(1);
    });

    it("must not render regulatory header component", () => {
      renderRegulatoryHeader({
        regulatorySections: undefined,
      });

      expect(RegulatoryHeaderComponent).not.toHaveBeenCalled();
    });
  });
});
