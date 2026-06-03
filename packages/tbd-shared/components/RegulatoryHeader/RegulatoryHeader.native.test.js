import { useContext } from "react";
import { Platform } from "react-native";
import { render } from "@testing-library/react-native";
import { CetContext } from "@flutter-global/react-native-cet-framework";

import { RegulatoryHeader as RegulatoryHeaderComponent } from "./snowflakes/RegulatoryHeader/RegulatoryHeader.native";
import RegulatoryHeader from "./RegulatoryHeader.native";

jest.mock("./snowflakes/RegulatoryHeader/RegulatoryHeader.native", () => ({
  RegulatoryHeader: jest.fn(() => <></>),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    setSessionTime: jest.fn(),
  })),
}));

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  CetContext: {
    setSessionTime: jest.fn(),
  },
}));

function renderRegulatoryHeader({ regulatorySections, isDenmarkJurisdiction }) {
  return render(
    <RegulatoryHeader regulatorySections={regulatorySections} isDenmarkJurisdiction={isDenmarkJurisdiction} />,
  );
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
          {
            type: "SESSION",
            time: new Date(),
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
          isFixedHeight: false,
        },
        undefined,
      );
      expect(RegulatoryHeaderComponent).toHaveBeenCalledTimes(1);
    });

    it("should send sessionTime to CET", () => {
      useContext.mockReturnValue(CetContext);
      renderRegulatoryHeader({ regulatorySections });

      expect(CetContext.setSessionTime).toHaveBeenCalledTimes(1);
    });

    it("must not render regulatory header component", () => {
      renderRegulatoryHeader({
        regulatorySections: undefined,
      });

      expect(RegulatoryHeaderComponent).not.toHaveBeenCalled();
    });

    describe("when is Denmark jurisdiction", () => {
      const isDenmarkJurisdiction = true;

      describe("and platform is android", () => {
        it("should render the regulatory header component with isFixedHeight as true", () => {
          Platform.OS = "android";
          renderRegulatoryHeader({ regulatorySections, isDenmarkJurisdiction });

          expect(RegulatoryHeaderComponent).toHaveBeenCalledWith(
            expect.objectContaining({ isFixedHeight: true }),
            undefined,
          );
          expect(RegulatoryHeaderComponent).toHaveBeenCalledTimes(1);
        });
      });

      describe("and platform is ios", () => {
        it("should render the regulatory header component with isFixedHeight as false", () => {
          Platform.OS = "ios";
          renderRegulatoryHeader({ regulatorySections, isDenmarkJurisdiction });

          expect(RegulatoryHeaderComponent).toHaveBeenCalledWith(
            expect.objectContaining({ isFixedHeight: false }),
            undefined,
          );
          expect(RegulatoryHeaderComponent).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
