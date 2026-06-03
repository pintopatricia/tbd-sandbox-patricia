import { render } from "@testing-library/react";
import { NavigationIconName, AssetsIconName } from "@ppb/the-wall-icons";
import "jest-dom/extend-expect";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { LogoProduct } from "./Logo.types";
import { Logo } from "./Logo.web";
import styles from "./Logo.web.css";
import { LOGO_CONTAINER, LOGO_WRAPPER } from "./Logo.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

function renderLogo({ product = LogoProduct.NONE, color } = {}) {
  const { container } = render(<Logo product={product} color={color} />);
  return {
    logoContainer: container.querySelector(LOGO_CONTAINER),
    wrapperLogo: container.querySelector(LOGO_WRAPPER),
  };
}

describe("Logo Component - web", () => {
  beforeEach(jest.clearAllMocks);

  it("should renders default logo (NONE product) with correct styles", () => {
    const { logoContainer, wrapperLogo } = renderLogo();
    expect(logoContainer).toHaveClass(styles.logoContainer);
    expect(wrapperLogo).toHaveClass(styles.brand);
    expect(GenericIcon).toHaveBeenCalledWith(
      {
        name: AssetsIconName.BRAND_LOGO,
      },
      undefined,
    );
  });

  it("should renders the BETFAIR_EXCHANGE logo with correct style", () => {
    const { logoContainer, wrapperLogo } = renderLogo({ product: LogoProduct.BETFAIR_EXCHANGE });
    expect(logoContainer).toHaveClass(styles.logoContainer);
    expect(wrapperLogo).toHaveClass(styles.exchange);
    expect(GenericIcon).toHaveBeenCalledWith(
      {
        name: NavigationIconName.BETFAIR_EXCHANGE,
      },
      undefined,
    );
  });

  it("should renders GAMING logo with correct styles", () => {
    const { logoContainer, wrapperLogo } = renderLogo({ product: LogoProduct.GAMING });
    expect(logoContainer).toHaveClass(styles.logoContainer);
    expect(wrapperLogo).toHaveClass(styles.games);
    expect(GenericIcon).toHaveBeenCalledWith(
      {
        name: AssetsIconName.BRAND_GAMES,
      },
      undefined,
    );
  });
});
