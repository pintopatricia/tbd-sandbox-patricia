import { useContext } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";

import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";
import { ConnectedBetLegs } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.web";
import { ConnectedSelection } from "../Selection";
import { Selection } from "../Selection/Selection.web";
import { withJurisdiction } from "../withJurisdiction/withJurisdiction";
import ConnectedPreview from "../Preview";
import { Preview } from "../Preview/Preview.web";
import { MultiLinesMultiples } from "./MultiLinesMultiples.web";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({ isBetConfirmationStep: false })),
}));

jest.mock("../BetControls", () => jest.fn().mockReturnValue(<connected-bet-legs-mock />));
jest.mock("../BetControls/BetControls.web", () => ({
  BetControls: jest.fn().mockReturnValue(<bet-legs-mock />),
}));
jest.mock("../BetLegs", () => ({ ConnectedBetLegs: jest.fn().mockReturnValue(<connected-bet-legs-mock />) }));
jest.mock("../BetLegs/BetLegs.web", () => ({ BetLegs: jest.fn().mockReturnValue(<bet-legs-mock />) }));
jest.mock("../Selection", () => ({
  ConnectedSelection: jest.fn().mockReturnValue(<connected-selection-mock />),
}));
jest.mock("../Selection/Selection.web", () => ({ Selection: jest.fn().mockReturnValue(<selection-mock />) }));
jest.mock("../Preview", () => jest.fn().mockReturnValue(<connected-preview-mock />));
jest.mock("../Preview/Preview.web", () => ({ Preview: jest.fn().mockReturnValue(<preview-mock />) }));
jest.mock("../withJurisdiction/withJurisdiction", () => ({
  withJurisdiction: jest.fn((component) => component),
}));

const MULTIPLES_MOCK = [{ id: "MULT:1" }, { id: "MULT:2" }];

const renderMultiLinesMultiples = ({
  multiples = MULTIPLES_MOCK,
  shouldFocusStakeField = true,
  shouldRenderBetLegs = false,
} = {}) =>
  render(
    <MultiLinesMultiples
      multiples={multiples}
      shouldFocusStakeField={shouldFocusStakeField}
      shouldRenderBetLegs={shouldRenderBetLegs}
    />,
  );

describe("MultiLinesMultiples", () => {
  afterEach(jest.clearAllMocks);

  describe("Preview", () => {
    it("should restrain ConnectedPreview to ITALY jurisdiction", () => {
      renderMultiLinesMultiples();

      expect(withJurisdiction).toHaveBeenCalledWith(ConnectedPreview, { jurisdictions: [Jurisdiction.ITALY] });
    });

    it("should call ConnectedPreview with the multiple id", () => {
      renderMultiLinesMultiples();

      expect(ConnectedPreview).toHaveBeenCalledTimes(2);
      expect(ConnectedPreview).toHaveBeenCalledWith({ component: Preview, id: "MULT:1" }, undefined);
      expect(ConnectedPreview).toHaveBeenCalledWith({ component: Preview, id: "MULT:2" }, undefined);
    });
  });

  describe("when bet legs should be rendered", () => {
    it("should call ConnectedBetLegs with proper values", () => {
      renderMultiLinesMultiples({ shouldRenderBetLegs: true });

      expect(ConnectedBetLegs).toHaveBeenCalledWith(
        {
          component: BetLegs,
          hasIcon: true,
          renderLeg: expect.any(Function),
        },
        undefined,
      );
      expect(ConnectedBetLegs).toHaveBeenCalledTimes(1);
    });

    it("should render ConnectedSelection", () => {
      renderMultiLinesMultiples({ shouldRenderBetLegs: true });
      render(ConnectedBetLegs.mock.calls[0][0].renderLeg("leg:1"));

      expect(ConnectedSelection).toHaveBeenCalledWith(
        {
          component: Selection,
          id: "leg:1",
          isReadOnly: false,
        },
        undefined,
      );
      expect(ConnectedSelection).toHaveBeenCalledTimes(1);
    });

    describe("and step is confirm potential", () => {
      it("should render ConnectedSelection with isReadOnly settled as true", () => {
        useContext.mockReturnValueOnce({ isBetConfirmationStep: true });
        renderMultiLinesMultiples({ shouldRenderBetLegs: true });
        render(ConnectedBetLegs.mock.calls[0][0].renderLeg("leg:1"));

        expect(ConnectedSelection).toHaveBeenCalledWith(
          {
            component: Selection,
            id: "leg:1",
            isReadOnly: true,
          },
          undefined,
        );
        expect(ConnectedSelection).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("BetControls", () => {
    it("should instantiate BetControls with proper values", () => {
      renderMultiLinesMultiples();

      expect(ConnectedBetControls).toHaveBeenCalledTimes(2);
      expect(ConnectedBetControls).toHaveBeenCalledWith(
        {
          component: BetControls,
          combinationId: "MULT:1",
          shouldFocusStakeField: true,
        },
        undefined,
      );
      expect(ConnectedBetControls).toHaveBeenCalledWith(
        {
          component: BetControls,
          combinationId: "MULT:2",
          shouldFocusStakeField: false,
        },
        undefined,
      );
    });
  });
});
