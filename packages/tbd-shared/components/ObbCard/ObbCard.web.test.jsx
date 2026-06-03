import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import ObbCard from "./ObbCard.web";

import ConnectedObbPvPCard from "../ObbPvPCard";
import ConnectedObbSquadBetCard from "../ObbSquadBetCard";
import ConnectedObbSquadVsSquadCard from "../ObbSquadVsSquadCard";

// Connected mocks
jest.mock("../ObbPvPCard", () => jest.fn(() => <connected-obb-pvp-card data-testid="obb-pvp-card" />));
jest.mock("../ObbSquadBetCard", () => jest.fn(() => <connected-obb-squadbet-card data-testid="obb-squadbet-card" />));
jest.mock("../ObbSquadVsSquadCard", () =>
  jest.fn(() => <connected-obb-squad-vs-squad-card data-testid="obb-squad-vs-squad-card" />),
);

// Web components mocks
jest.mock("../ObbPvPCard/ObbPvPCard.web", () => jest.fn(() => <obb-pvp-card-mock />));
jest.mock("../ObbSquadBetCard/ObbSquadBetCard.web", () => jest.fn(() => <obb-squadbet-card-mock />));
jest.mock("../ObbSquadVsSquadCard/ObbSquadVsSquadCard.web", () => jest.fn(() => <obb-squad-vs-squad-card-mock />));

jest.spyOn(global.console, "warn").mockReturnValue("warning");

jest.mock("../ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));

describe("Obb Card Web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render any card when card when typename is unknown", () => {
    render(<ObbCard urn={"urn"} typename="unknown" />);
    expect(ConnectedObbPvPCard).not.toHaveBeenCalled();
    expect(ConnectedObbSquadBetCard).not.toHaveBeenCalled();
    expect(ConnectedObbSquadVsSquadCard).not.toHaveBeenCalled();
  });

  it("should render the component placeholder when the card is not loaded yet", () => {
    render(<ObbCard urn={"urn"} typename={"ObbPvpCard"} isCardLoaded={false} layoutUrn="layoutUrn" itemIndex={1} />);
    expect(ConnectedObbPvPCard).not.toHaveBeenCalled();
  });
});
