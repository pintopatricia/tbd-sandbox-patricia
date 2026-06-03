import { render } from "@testing-library/react-native";
import ObbCard from "./ObbCard.native";
import ConnectedObbPvPCard from "../ObbPvPCard";
import ConnectedObbSquadBetCard from "../ObbSquadBetCard";
import ConnectedObbSquadVsSquadCard from "../ObbSquadVsSquadCard";

// Connected mocks
jest.mock("../ObbPvPCard", () => jest.fn(() => <mock testID="connected-obb-pvp-card" />));
jest.mock("../ObbSquadBetCard", () => jest.fn(() => <mock testID="connected-obb-squadbet-card" />));
jest.mock("../ObbSquadVsSquadCard", () => jest.fn(() => <mock testID="connected-obb-squad-vs-squad-card" />));

// Native components mocks
jest.mock("../ObbPvPCard/ObbPvPCard.native", () => jest.fn(() => <mock testID="obb-pvp-card-mock" />));
jest.mock("../ObbSquadBetCard/ObbSquadBetCard.native", () => jest.fn(() => <mock testID="obb-squadbet-card-mock" />));
jest.mock("../ObbSquadVsSquadCard/ObbSquadVsSquadCard.native", () =>
  jest.fn(() => <mock testID="obb-squad-vs-squad-card-mock" />),
);

jest.mock("../ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock("./ObbCardPlaceholder.native", () => jest.fn(() => <obb-card-placeholder />));

describe("Obb Card Native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render any card when typename is not found", () => {
    render(<ObbCard urn="urn" typename="unknown" />);

    expect(ConnectedObbPvPCard).not.toHaveBeenCalled();
    expect(ConnectedObbSquadBetCard).not.toHaveBeenCalled();
  });

  it("should render the component placeholder when the card is not loaded yet", () => {
    render(<ObbCard urn="urn" typename="ObbPvpCard" isCardLoaded={false} />);
    expect(ConnectedObbPvPCard).not.toHaveBeenCalled();
  });

  it("should render the correct connected PvP component when card is loaded", () => {
    render(<ObbCard urn="urn" typename="ObbPvpCard" isCardLoaded={true} />);
    expect(ConnectedObbPvPCard).toHaveBeenCalledWith(
      expect.objectContaining({
        urn: "urn",
        component: expect.anything(),
        visible: undefined,
      }),
      undefined,
    );
  });

  it("should render the correct connected SquadBet component when card is loaded", () => {
    render(<ObbCard urn="urn" typename="ObbSquadBetCard" isCardLoaded={true} />);
    expect(ConnectedObbSquadBetCard).toHaveBeenCalledWith(
      expect.objectContaining({
        urn: "urn",
        component: expect.anything(),
        visible: undefined,
      }),
      undefined,
    );
  });

  it("should render the correct connected SquadVsSquad component when card is loaded", () => {
    render(<ObbCard urn="urn" typename="ObbSquadVsSquadCard" isCardLoaded={true} />);
    expect(ConnectedObbSquadVsSquadCard).toHaveBeenCalledWith(
      expect.objectContaining({
        urn: "urn",
        component: expect.anything(),
        visible: undefined,
      }),
      undefined,
    );
  });
});
