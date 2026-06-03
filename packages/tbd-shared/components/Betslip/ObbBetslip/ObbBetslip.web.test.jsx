import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ObbBetslip } from "./ObbBetslip.web";

import ConnectedObbPlace from "../ObbPlace";
import { ObbPlace } from "../ObbPlace/ObbPlace.web";

import ConnectedObbBetReceipt from "../ObbBetReceipt";
import { ObbBetReceipt } from "../ObbBetReceipt/ObbBetReceipt.web";

import { ConfigContextProvider } from "../../Config/ConfigContext";

jest.mock("../ObbPlace", () => jest.fn(({ props }) => <connected-obb-place-mock {...props} />));
jest.mock("../ObbPlace/ObbPlace.web", () => ({
  ObbPlace: jest.fn(() => <obb-place-mock />),
}));

jest.mock("../ObbBetReceipt", () => jest.fn(({ props }) => <connected-obb-bet-receipt-mock {...props} />));
jest.mock("../ObbBetReceipt/ObbBetReceipt.web", () => ({
  ObbBetReceipt: jest.fn(() => <obb-bet-receipt-mock />),
}));

const DEFAULT_PROPS = {
  step: "PLACE_POTENTIAL",
  hasSeveralLegs: false,
};

function renderObbBetslip(props, value = { isdesktopLayout: false }) {
  const componentProps = { ...DEFAULT_PROPS, ...props };

  return render(
    <ConfigContextProvider value={value}>
      <ObbBetslip {...componentProps} />
    </ConfigContextProvider>,
  );
}

describe("ObbBetslip", () => {
  afterEach(jest.clearAllMocks);

  describe("when in PLACE_POTENTIAL step", () => {
    it("should render Obb Place", () => {
      renderObbBetslip({ hasSeveralLegs: true });

      expect(ConnectedObbPlace).toHaveBeenCalledWith(
        {
          component: ObbPlace,
        },
        undefined,
      );
    });
  });
  describe("when in REPORT step", () => {
    it("should render Bet Receipt", () => {
      renderObbBetslip({ step: "REPORT" });

      expect(ConnectedObbBetReceipt).toHaveBeenCalledWith(
        {
          component: ObbBetReceipt,
        },
        undefined,
      );
    });
  });
});
