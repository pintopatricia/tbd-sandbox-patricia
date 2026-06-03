import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";
import { PreferenceCard } from "./PreferenceCard.web";
import { TEST_ID, TITLE, INFO_BTN, HINT, OPTION, EXTRA_CONTENT } from "./PreferenceCard.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => (
    <generic-icon-mock>
      <svg></svg>
    </generic-icon-mock>
  )),
}));

function renderPreferenceCard({
  title = "",
  hint = "",
  content = "test content",
  onInfoButtonClick,
  extraContent = undefined,
} = {}) {
  const { container } = render(
    <PreferenceCard title={title} hint={hint} onInfoButtonClick={onInfoButtonClick} extraContent={extraContent}>
      {content}
    </PreferenceCard>,
  );
  return container.querySelector(TEST_ID);
}

beforeEach(jest.clearAllMocks);

describe("PreferenceCard", () => {
  it("should have title text", () => {
    const preferenceCard = renderPreferenceCard({ title: "Odds Display" });
    const titleElement = preferenceCard.querySelector(TITLE);

    expect(titleElement).toHaveTextContent("Odds Display");
  });

  it("should have hint text", () => {
    const preferenceCard = renderPreferenceCard({ hint: "Choose how you would like your odds to be displayed." });
    const hintElement = preferenceCard.querySelector(HINT);

    expect(hintElement).toHaveTextContent("Choose how you would like your odds to be displayed.");
  });

  it("should have info button", () => {
    const onInfoButtonClick = jest.fn();
    const preferenceCard = renderPreferenceCard({ onInfoButtonClick });

    const button = preferenceCard.querySelector(INFO_BTN);
    fireEvent.click(button);

    expect(onInfoButtonClick).toHaveBeenCalledTimes(1);
  });

  it("should have extraContent", () => {
    const preferenceCard = renderPreferenceCard({ extraContent: <div>EXTRA_CONTENT</div> });

    const extraContent = preferenceCard.querySelector(EXTRA_CONTENT);

    expect(extraContent).toHaveTextContent("EXTRA_CONTENT");
  });

  describe("children", () => {
    it("should have the content included", () => {
      const content = <div>test content</div>;
      const preferenceCard = renderPreferenceCard({ content });
      const cardElement = preferenceCard.querySelector(OPTION);

      expect(cardElement.children.length).toBe(1);
      expect(cardElement.children[0].tagName).toBe("DIV");
      expect(cardElement).toHaveTextContent("test content");
    });
  });

  describe("when hint is not provided", () => {
    it("should not have hint text", () => {
      const preferenceCard = renderPreferenceCard();
      const hintElement = preferenceCard.querySelector(HINT);

      expect(hintElement).toBeNull();
    });
  });

  describe("when onInfoButtonClick is not provided", () => {
    it("should not have info button", () => {
      const preferenceCard = renderPreferenceCard();
      const btn = preferenceCard.querySelector(INFO_BTN);

      expect(btn).toBeNull();
    });
  });
});
