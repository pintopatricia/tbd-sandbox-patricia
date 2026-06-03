import { render } from "@testing-library/react";

import { ForecastTricastSelection } from "@ppb/the-wall-web";

import { CastRunner } from "./CastRunner.web";

jest.mock("@ppb/the-wall-web", () => ({
  ForecastTricastSelection: jest.fn(() => <fc-tc-mock />),
}));

function renderCastRunner({
  horse = "horseName",
  icon,
  silkFallbackType = "silkFallbackType",
  position = 3,
  positionOrdinal = "rd",
  racingSport = 7,
} = {}) {
  return render(
    <CastRunner
      horse={horse}
      icon={icon}
      silkFallbackType={silkFallbackType}
      position={position}
      positionOrdinal={positionOrdinal}
      racingSport={racingSport}
    />,
  );
}

describe("ConnectedCastRunner", () => {
  beforeEach(jest.clearAllMocks);

  describe("when all the props are passed", () => {
    it("should call ForecastTricastSelection with correct props", () => {
      renderCastRunner({ icon: "silkUrl" });

      expect(ForecastTricastSelection).toHaveBeenCalledWith(
        expect.objectContaining({
          horse: "horseName",
          icon: expect.any(Object),
          position: 3,
          positionOrdinal: "rd",
        }),
        undefined,
      );
    });

    it("should call ForecastTricastSelection with undefined icon when unmapped racingSport", () => {
      renderCastRunner({ racingSport: 1111 });

      expect(ForecastTricastSelection).toHaveBeenCalledWith(
        expect.objectContaining({
          horse: "horseName",
          icon: undefined,
          position: 3,
          positionOrdinal: "rd",
        }),
        undefined,
      );
    });
  });
});
