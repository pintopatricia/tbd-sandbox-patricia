import { render, screen, fireEvent } from "@testing-library/react-native";
import React from "react";
import { ImageWithFallback } from "./ImageWithFallback.native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => null),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  AssetsIconName: { FALLBACK_JERSEY: "FALLBACK_JERSEY" },
}));

describe("ImageWithFallback Native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the image with the given source url", () => {
    render(<ImageWithFallback url="https://example.com/img.png" alt="test image" fallbackIconName="FALLBACK_JERSEY" />);

    const image = screen.getByLabelText("test image");
    expect(image.props.source.uri).toBe("https://example.com/img.png");
  });

  it("should render the image with the given accessibility label", () => {
    render(<ImageWithFallback url="https://example.com/img.png" alt="test image" fallbackIconName="FALLBACK_JERSEY" />);

    expect(screen.getByLabelText("test image")).toBeTruthy();
  });

  it("should apply the style prop to the image", () => {
    const style = { width: 32, height: 32 };
    render(
      <ImageWithFallback
        url="https://example.com/img.png"
        alt="test image"
        fallbackIconName="FALLBACK_JERSEY"
        style={style}
      />,
    );

    const image = screen.getByLabelText("test image");
    expect(image.props.style).toEqual(style);
  });

  it("should not render the fallback icon when there is no image error", () => {
    render(<ImageWithFallback url="https://example.com/img.png" alt="test image" fallbackIconName="FALLBACK_JERSEY" />);

    expect(GenericIcon).not.toHaveBeenCalled();
  });

  it("should render the fallback icon and remove the image when an error occurs", () => {
    render(<ImageWithFallback url="https://example.com/img.png" alt="test image" fallbackIconName="FALLBACK_JERSEY" />);

    fireEvent(screen.getByLabelText("test image"), "error");

    expect(screen.queryByLabelText("test image")).toBeNull();
    expect(GenericIcon).toHaveBeenCalledWith(expect.objectContaining({ name: "FALLBACK_JERSEY" }), undefined);
  });

  it("should pass the fallback icon name to GenericIcon", () => {
    render(<ImageWithFallback url="https://example.com/img.png" alt="test image" fallbackIconName="FALLBACK_JERSEY" />);

    fireEvent(screen.getByLabelText("test image"), "error");

    expect(GenericIcon).toHaveBeenCalledWith(expect.objectContaining({ name: "FALLBACK_JERSEY" }), undefined);
  });
});
