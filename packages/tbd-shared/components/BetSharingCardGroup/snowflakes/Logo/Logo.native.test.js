import { render } from "@testing-library/react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { NavigationIconName, AssetsIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { LogoProduct } from "./Logo.types";
import styles from "./Logo.native.styles";
import { Logo } from "./Logo.native";
import { LOGO_WRAPPER } from "./Logo.native.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => null),
}));

const renderLogo = ({ product = LogoProduct.NONE, color = tokens.BrandLogoShapeColour } = {}) => {
  const container = render(<Logo product={product} color={color} />);
  return {
    logoWrapper: container.queryByTestId(LOGO_WRAPPER),
  };
};

describe("Logo Component - native", () => {
  beforeEach(jest.clearAllMocks);

  it("should renders default logo (NONE product) with correct styles", () => {
    const { logoWrapper } = renderLogo();

    expect(logoWrapper).toHaveStyle(styles.brand);
    expect(GenericIcon).toHaveBeenCalledWith(
      {
        name: AssetsIconName.BRAND_LOGO,
        color: tokens.BrandLogoShapeColour,
      },
      undefined,
    );
  });

  it("should renders the BETFAIR_EXCHANGE logo with correct style", () => {
    const { logoWrapper } = renderLogo({ product: LogoProduct.BETFAIR_EXCHANGE });

    expect(logoWrapper).toHaveStyle(styles.exchange);
    expect(GenericIcon).toHaveBeenCalledWith(
      {
        name: NavigationIconName.BETFAIR_EXCHANGE,
        color: tokens.BrandLogoShapeColour,
      },
      undefined,
    );
  });

  it("should renders the GAMING logo with correct style", () => {
    const { logoWrapper } = renderLogo({ product: LogoProduct.GAMING });

    expect(logoWrapper).toHaveStyle(styles.games);
    expect(GenericIcon).toHaveBeenCalledWith(
      {
        name: AssetsIconName.BRAND_GAMES, // Correspondent pentru LogoProduct.NONE
        color: tokens.BrandLogoShapeColour,
      },
      undefined,
    );
  });
});
