import { render } from "@testing-library/react-native";
import { HeadToHeadDetailed } from "./snowflakes/HeadToHeadDetailed/HeadToHeadDetailed.native";
import HeadToHeadCard from "./HeadToHeadCard.native";

jest.mock("./snowflakes/HeadToHeadDetailed/HeadToHeadDetailed.native", () => ({
  HeadToHeadDetailed: jest.fn(() => <head-to-head-detailed-mock />),
}));

const renderHeadToHeadCard = (props) => render(<HeadToHeadCard {...props} />);

describe("HeadToHeadCard - Native", () => {
  afterEach(jest.clearAllMocks);

  const FIRST_HEAD_TO_HEAD = "FIRST_HEAD_TO_HEAD";
  const SECOND_HEAD_TO_HEAD = "SECOND_HEAD_TO_HEAD";
  const THIRD_HEAD_TO_HEAD = "THIRD_HEAD_TO_HEAD";
  const HEAD_TO_HEAD_PROPS = [FIRST_HEAD_TO_HEAD, SECOND_HEAD_TO_HEAD, THIRD_HEAD_TO_HEAD];
  const CAPTION_TRANSLATIONS = "CAPTION_TRANSLATIONS";
  const COMPONENT_PROPS = {
    headToHeadProps: HEAD_TO_HEAD_PROPS,
    captionTranslations: CAPTION_TRANSLATIONS,
  };

  describe("when the headToHeadProps are not defined", () => {
    it("should not call HeadToHeadDetailed component", () => {
      renderHeadToHeadCard({ ...COMPONENT_PROPS, headToHeadProps: null });

      expect(HeadToHeadDetailed).not.toHaveBeenCalled();
    });
  });

  describe("when the headToHeadProps are defined", () => {
    it("should render HeadToHeadDetailed component with the correct parameters", () => {
      renderHeadToHeadCard(COMPONENT_PROPS);

      expect(HeadToHeadDetailed).toHaveBeenCalledWith(
        {
          headToHeadDetailedProps: HEAD_TO_HEAD_PROPS,
          captionI18n: CAPTION_TRANSLATIONS,
        },
        undefined,
      );
    });
  });
});
