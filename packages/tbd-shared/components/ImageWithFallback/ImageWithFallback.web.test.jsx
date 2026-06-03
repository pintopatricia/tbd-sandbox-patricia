import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ImageWithFallback } from "./ImageWithFallback.web";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => null),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  AssetsIconName: { FALLBACK_JERSEY: "FALLBACK_JERSEY" },
}));

describe("ImageWithFallback Web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the image with the given url", () => {
    render(<ImageWithFallback url="https://example.com/img.png" alt="test image" fallbackIconName="FALLBACK_JERSEY" />);

    const img = screen.getByAltText("test image");
    expect(img.getAttribute("src")).toBe("https://example.com/img.png");
  });

  it("should render the image with the given alt text", () => {
    render(<ImageWithFallback url="https://example.com/img.png" alt="test image" fallbackIconName="FALLBACK_JERSEY" />);

    expect(screen.getByAltText("test image")).toBeTruthy();
  });

  it("should not render the fallback icon when there is no image error", () => {
    render(<ImageWithFallback url="https://example.com/img.png" alt="test image" fallbackIconName="FALLBACK_JERSEY" />);

    expect(GenericIcon).not.toHaveBeenCalled();
  });

  it("should render the fallback icon and remove the image when an error occurs", () => {
    render(<ImageWithFallback url="https://example.com/img.png" alt="test image" fallbackIconName="FALLBACK_JERSEY" />);

    fireEvent.error(screen.getByAltText("test image"));

    expect(screen.queryByAltText("test image")).toBeNull();
    expect(GenericIcon).toHaveBeenCalledWith(expect.objectContaining({ name: "FALLBACK_JERSEY" }), undefined);
  });

  it("should pass the fallback icon name to GenericIcon", () => {
    render(<ImageWithFallback url="https://example.com/img.png" alt="test image" fallbackIconName="FALLBACK_JERSEY" />);

    fireEvent.error(screen.getByAltText("test image"));

    expect(GenericIcon).toHaveBeenCalledWith(expect.objectContaining({ name: "FALLBACK_JERSEY" }), undefined);
  });
});
