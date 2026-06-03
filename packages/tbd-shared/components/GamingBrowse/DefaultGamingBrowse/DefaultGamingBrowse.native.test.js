import { render } from "@testing-library/react-native";
import { QuickLink } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router/native";
import ConnectedCard from "../../Card";
import DefaultGamingBrowse from "./DefaultGamingBrowse.native";
import selectors from "./DefaultGamingBrowse.native.selectors";
import styles from "./DefaultGamingBrowse.native.styles";

jest.mock("@ppb/the-wall-native", () => ({
  QuickLink: jest.fn((props) => <quick-link-mock {...props} />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("../../Card", () => jest.fn((props) => <connected-card-mock {...props} />));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("../../Card/Card.native", () => jest.fn(() => <card-mock />));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  gutters: {},
  tokens: {},
}));

const i18nMock = {
  i18n: {
    subtitle: "I18N.CATEGORY.MORE_CASINO_GAMES",
  },
};

const mockCategoryLinks = [
  {
    text: "I18N.CATEGORY.SLOTS",
    viewLink: {
      viewUrl: "casino/c/gaming-slots/gc-gaming-slots",
      viewUrn: "ppb:tbd:view:gamingCategory:gaming-slots",
    },
    target: "_self",
  },
];

function renderDefaultGamingBrowse({
  urn = "fake-urn",
  defaultGamingi18n = i18nMock,
  typename = "ViewZone",
  categoryLinks = mockCategoryLinks,
}) {
  return render(
    <DefaultGamingBrowse
      urn={urn}
      defaultGamingi18n={defaultGamingi18n}
      typename={typename}
      categoryLinks={categoryLinks}
    />,
  );
}

describe("DefaultGamingBrowse component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should render ConnectedCard component", () => {
      renderDefaultGamingBrowse({});
      expect(ConnectedCard).toHaveBeenCalledTimes(1);
    });

    it("should render subtitle", () => {
      const { queryByTestId } = renderDefaultGamingBrowse({});
      const subtitleLabel = queryByTestId(selectors.QUICK_LINKS_SUBTITLE);

      expect(subtitleLabel).toHaveTextContent("I18N.CATEGORY.MORE_CASINO_GAMES");
    });

    it("should initialize QuickLink component with the correct props", () => {
      renderDefaultGamingBrowse({});
      expect(QuickLink).toHaveBeenCalledTimes(1);
      expect(QuickLink).toHaveBeenCalledWith(
        {
          style: styles.quickLink,
          item: mockCategoryLinks[0],
          onPress: expect.any(Function),
          roundCorners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
        },
        undefined,
      );
    });
  });

  describe("when clicking quick link", () => {
    it("should navigate to correct location", () => {
      renderDefaultGamingBrowse({});
      const { onPress } = QuickLink.mock.calls[0][0];

      onPress("linkUrl");

      expect(navigate).toHaveBeenCalledWith(mockCategoryLinks[0].viewLink);
    });
  });
});
